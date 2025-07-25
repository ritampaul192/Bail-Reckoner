import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'BailSETU'; // use your actual DB name

async function getDb() {
  if (!client.topology?.isConnected()) {
    await client.connect();
  }
  return client.db(dbName);
}

// GET: Fetch all FAQs
export async function GET() {
  const db = await getDb();
  const faqs = await db.collection('faqs').find({}).toArray();
  return NextResponse.json(faqs);
}

// PUT: Update answers
export async function PUT(req) {
  const db = await getDb();
  const { faqs } = await req.json();

  for (const faq of faqs) {
    await db.collection('faqs').updateOne(
      { _id: new ObjectId(faq._id) },
      {
        $set: {
          'answer.en': faq.answer_en || '',
          'answer.hi': faq.answer_hi || '',
          updatedAt: new Date(),
        },
      }
    );
  }

  return NextResponse.json({ message: 'FAQs updated successfully' });
}

