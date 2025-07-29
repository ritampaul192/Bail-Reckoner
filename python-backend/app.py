import os
import logging
import json
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from googletrans import Translator
from langdetect import detect
from sentence_transformers import SentenceTransformer, util
import google.generativeai as genai

# --- Setup ---
load_dotenv()
logging.basicConfig(level=logging.INFO)
app = FastAPI()

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Configuration & Model Loading ---
try:
    json_path = os.path.join(os.path.dirname(__file__), "ipc_label_map.json")
    with open(json_path, "r", encoding="utf-8") as file:
        ipc_categories = json.load(file)
    ipc_categories_reverse_map = {v: k for k, v in ipc_categories.items()}
    long_descriptions = list(ipc_categories.keys())
    logging.info("Successfully loaded ipc_label_map.json")
except FileNotFoundError:
    logging.error("ipc_label_map.json not found!")
    ipc_categories, ipc_categories_reverse_map, long_descriptions = {}, {}, []

# --- Primary Model & Pre-computation ---
# Load the primary model for semantic similarity
model = SentenceTransformer("all-mpnet-base-v2")

# PERFORMANCE BOOST: Pre-compute embeddings on startup
logging.info("Pre-computing IPC description embeddings...")
if long_descriptions:
    DESCRIPTION_EMBEDDINGS = model.encode(long_descriptions, convert_to_tensor=True)
    logging.info(f"Embeddings computed for {len(long_descriptions)} descriptions.")
else:
    DESCRIPTION_EMBEDDINGS = None

# --- Database & Service Connections ---
# MongoDB Connection
try:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://rupayandey134:Cd0pPzvDey0MemLG@cluster0.mwbajxb.mongodb.net")
    client = MongoClient(MONGO_URI)
    db = client["BailSETU"]
    collection = db["ipc_sections"]
    logging.info("MongoDB connection successful.")
except Exception as e:
    logging.error(f"Failed to connect to MongoDB: {e}")
    collection = None

# Translator
translator = Translator()

# --- Gemini Fallback Configuration ---
try:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY environment variable not set.")
    genai.configure(api_key=GEMINI_API_KEY)
    # CRITICAL FIX: Use a valid and current model name
    gemini_model = genai.GenerativeModel('gemini-1.5-flash-latest')
    logging.info("Gemini model configured successfully.")
except Exception as e:
    logging.error(f"Failed to configure Gemini: {e}")
    gemini_model = None


# --- Pydantic Models & Helper Functions ---
class InputData(BaseModel):
    message: str

def translate_doc_to_hindi(doc):
    """Translates specific fields of a document to Hindi."""
    fields = ["title", "description", "punishment", "bail_type", "bail_time_limit"]
    for field in fields:
        if field in doc and isinstance(doc[field], str):
            try:
                doc[field] = translator.translate(doc[field], src="en", dest="hi").text
            except Exception:
                pass  # Ignore translation errors
    return doc

# --- Fallback & Classification Logic ---
async def invoke_gemini_fallback(message: str) -> list:
    """
    Calls the Gemini API to classify the message, returning an empty list for non-criminal text.
    """
    if not gemini_model:
        logging.warning("Gemini model not available. Fallback skipped.")
        return []

    category_list_for_prompt = "\n".join([f'- "{label}": {desc}' for label, desc in ipc_categories_reverse_map.items()])
    
    prompt = f"""
   You are an expert legal AI assistant for Indian law. Your task is to analyze the user's message and identify the most relevant legal sections from the provided list.

   **Instructions:**
   1.  Read the user's message carefully. The user might be describing a criminal offense they witnessed, OR they might be describing a legal problem they are facing, such as being falsely accused.
   2.  Compare the message against the following list of legal sections (from the IPC and CrPC) and their descriptions.
   3.  Identify the top 3-5 most relevant sections.
   4.  Return your answer ONLY as a valid JSON array of objects. Each object must have "category" and "score" keys.
   5.  **Crucial Instruction:** If the user's message is completely irrelevant to any legal matter (e.g., "hello," "what is the weather?"), return an empty JSON array `[]`.

   **Legal Sections:**
   {category_list_for_prompt}

   **User's Message:**
   "{message}"

   **Your JSON Output:**
   """

    try:
        response = await gemini_model.generate_content_async(prompt)
        if not response.parts:
            logging.warning(f"Gemini response was blocked. Feedback: {response.prompt_feedback}")
            return []
        
        cleaned_text = response.text.strip().replace("```json", "").replace("```", "").strip()
        result = json.loads(cleaned_text)

        if isinstance(result, list) and all("category" in item and "score" in item for item in result):
            logging.info(f"Gemini fallback successful. Found {len(result)} categories.")
            return result
        else:
            # This can happen if Gemini returns an empty list as instructed
            if isinstance(result, list):
                return []
            logging.error(f"Gemini response was not in the expected format: {cleaned_text}")
            return []
    except Exception as e:
        logging.error(f"An error occurred during Gemini fallback: {e}")
        return []


# --- Main API Endpoint ---
# --- Main API Endpoint ---
@app.post("/api")
async def classify(data: InputData):
    message = data.message.strip()
    if not message or len(message.split()) < 2:
        return {"error": "Message is too short."}

    # Language Detection and Translation
    try:
        lang = detect(message)
    except Exception:
        lang = "en"
    is_hindi = lang == "hi"
    translated = translator.translate(message, src="hi", dest="en").text if is_hindi else message

    # Primary Model Classification
    message_embedding = model.encode(translated, convert_to_tensor=True)
    if DESCRIPTION_EMBEDDINGS is None:
        return {"error": "Server is not ready, embeddings not loaded."}
    
    similarities = util.cos_sim(message_embedding, DESCRIPTION_EMBEDDINGS)[0]
    
    top_scores = sorted(
        [(long_descriptions[i], float(similarities[i])) for i in range(len(similarities))],
        key=lambda x: x[1], reverse=True
    )
    
    top_categories = [
        {"category": ipc_categories[desc], "score": round(score, 4)}
        for desc, score in top_scores[:7]
    ]

    # --- Relevance Gate & Fallback Logic ---
    used_fallback = False
    CONFIDENCE_THRESHOLD = 0.45  # General threshold for using fallback
    RELEVANCE_THRESHOLD = 0.30   # Stricter threshold to reject irrelevant inputs
    
    is_likely_irrelevant = not top_categories or top_categories[0]["score"] < RELEVANCE_THRESHOLD
    is_ambiguous_or_long = not top_categories or top_categories[0]["score"] < CONFIDENCE_THRESHOLD or len(translated.split()) > 150

    if is_ambiguous_or_long or is_likely_irrelevant:
        logging.info(f"Query is ambiguous, long, or likely irrelevant. Triggering Gemini for validation.")
        gemini_results = await invoke_gemini_fallback(translated)
        used_fallback = True

        if gemini_results:
            # Gemini found relevant sections, so we trust its results.
            top_categories = gemini_results
        else:
            # Gemini returned an empty list, confirming the input is irrelevant.
            logging.info("Gemini confirmed the message is not relevant to IPC sections.")
            return {
                "original_language": lang,
                "used_fallback": True,
                "matched_categories": [],
                "sections": [],
                "message": "The provided text does not appear to describe a criminal offense."
            }

    # --- Database Retrieval and Final Processing ---
    mongo_results = []
    category_set = set()
    
    # THIS IS THE CORRECTED LINE:
    if collection is None:
        return {"error": "Database connection not available."}

    for cat in top_categories:
        category_name = cat["category"]
        if category_name in category_set:
            continue
        
        docs = list(collection.find({"category": category_name}, {"_id": 0}))
        for doc in docs:
            doc["match_score"] = cat.get("score", 0.0)
            mongo_results.append(doc)
            category_set.add(category_name)

    mongo_results.sort(key=lambda d: d.get("match_score", 0), reverse=True)
    final_results = mongo_results[:7]

    if is_hindi:
        final_results = [translate_doc_to_hindi(doc.copy()) for doc in final_results]

    # Remove internal score before sending to client
    for doc in final_results:
        doc.pop("match_score", None)

    return {
        "original_language": lang,
        "used_fallback": used_fallback,
        "matched_categories": top_categories,
        "sections": final_results
    }