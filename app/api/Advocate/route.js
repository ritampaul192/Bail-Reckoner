import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'BailSETU';

async function connectDB() {
  if (!client.topology?.isConnected()) await client.connect();
  return client.db(dbName);
}

// GET: Fetch all advocates
export async function GET() {
  try {
    const db = await connectDB();
    const advocates = await db.collection('advocates').find({}).toArray();
    return NextResponse.json({ success: true, advocates: advocates.map(a => ({ ...a, _id: a._id.toString() })) });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Add a new advocate
export async function POST(req) {
  try {
    const db = await connectDB();
    const body = await req.json();

    const advocate = {
      name: body.name,
      city: body.city,
      court: body.court,
      rating: Number(body.rating),
      experience: Number(body.experience),
      specialization: body.specialization,
      photo: body.photo,
      languages: body.languages || [],
      barId: body.barId,
      email: body.email,
      whatsapp: body.whatsapp,
      verified: !!body.verified,
      practiceAreas: body.practiceAreas || [],
      bio: body.bio,
      createdAt: new Date(),
    };

    const result = await db.collection('advocates').insertOne(advocate);
    advocate._id = result.insertedId.toString();

    return NextResponse.json({ success: true, message: 'Advocate added successfully', data: advocate });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT: Delete an advocate by ID
export async function PUT(req) {
  await connectMongo();
  const data = await req.json();

  if (!data._id) {
    return NextResponse.json({ success: false, message: 'Advocate ID is required for update' });
  }

  try {
    const updated = await Advocate.findByIdAndUpdate(data._id, data, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Advocate not found' });
    }
    return NextResponse.json({ success: true, message: 'Advocate updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error updating advocate', error: error.message });
  }
}