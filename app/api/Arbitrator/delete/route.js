import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'BailSETU';

async function connectDB() {
  if (!client.topology?.isConnected()) await client.connect();
  return client.db(dbName);
}

export async function PUT(req) {
  try {
    const db = await connectDB();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: 'Arbitrator ID is required for deletion' });
    }

    const result = await db.collection('arbitrators').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: 'Arbitrator not found' });
    }

    return NextResponse.json({ success: true, message: 'Arbitrator deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error deleting arbitrator', error: error.message });
  }
}
