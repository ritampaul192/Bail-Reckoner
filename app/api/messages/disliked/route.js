import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import connectDB from '../../login/mongoose'; // your custom DB connector

const uri = process.env.MONGODB_URI_2;
const client = new MongoClient(uri);
const dbName = 'chatProject';
let db;

async function getDb() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
  }
  return db;
}

// GET: Fetch messages with more than 50 dislikes
export async function GET() {
  await connectDB();
  const db = await getDb();

  const messages = await db
    .collection('messages')
    .find({
      'reactions': {
        $elemMatch: { disliked: true },
      }
    })
    .toArray();

  const filteredMessages = messages.filter(
    (msg) => (msg.reactions?.filter(r => r.disliked).length || 0) > 50
  );

  return NextResponse.json(filteredMessages);
}

// PUT: Delete message by admin
export async function PUT(req) {
  const db = await getDb();
  const { id } = await req.json();

  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid message ID' }, { status: 400 });
  }

  const result = await db.collection('messages').deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, deletedId: id });
}
