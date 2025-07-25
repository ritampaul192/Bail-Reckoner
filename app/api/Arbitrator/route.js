import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'BailSETU';

async function connectDB() {
  if (!client.topology?.isConnected()) await client.connect();
  return client.db(dbName);
}

// GET: Fetch all arbitrators
export async function GET() {
  try {
    const db = await connectDB();
    const arbitrators = await db.collection('arbitrators').find({}).toArray();
    return NextResponse.json({
      success: true,
      arbitrators: arbitrators.map((a) => ({
        ...a,
        _id: a._id.toString(),
      })),
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Add new arbitrator
export async function POST(req) {
  try {
    const db = await connectDB();
    const body = await req.json();

    const arbitrator = {
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
      caseResolved: body.caseResolved || '',
      createdAt: new Date(),
    };

    const result = await db.collection('arbitrators').insertOne(arbitrator);
    arbitrator._id = result.insertedId.toString();

    return NextResponse.json({ success: true, message: 'Arbitrator added successfully', data: arbitrator });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT: Update arbitrator by ID
export async function PUT(req) {
  try {
    const db = await connectDB();
    const data = await req.json();

    if (!data._id) {
      return NextResponse.json({ success: false, message: 'Arbitrator ID is required for update' });
    }

    const { _id, ...updateData } = data;
    const result = await db.collection('arbitrators').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: 'Arbitrator not found' });
    }

    return NextResponse.json({ success: true, message: 'Arbitrator updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error updating arbitrator', error: error.message });
  }
}
