import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import connectDB from '../../login/mongoose';

const uri = process.env.MONGODB_URI_2;
const client = new MongoClient(uri);
const dbName = 'chatProject';

async function getDb() {
  if (!client.topology?.isConnected()) await client.connect();
  return client.db(dbName);
}

// PUT: Add a report to a message
export async function PUT(req) {
  await connectDB();
  const db = await getDb();
  const { id, userId, username, reason } = await req.json();

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid message ID' }, { status: 400 });
  }

  const result = await db.collection('messages').updateOne(
    { _id: new ObjectId(id) },
    {
      $push: {
        reports: {
          userId,
          username,
          reason: reason || 'Inappropriate content',
          createdAt: new Date(),
        },
      },
    }
  );

  if (result.modifiedCount === 0) {
    return NextResponse.json({ error: 'Report failed' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
