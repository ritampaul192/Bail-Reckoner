import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

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

// GET: Fetch all messages
export async function GET() {
  const db = await getDb();
  const messages = await db
    .collection('messages')
    .find({})
    .sort({ createdAt: 1 })
    .toArray();
  return NextResponse.json(messages);
}

// POST: Create a new message
export async function POST(req) {
  const db = await getDb();
  const body = await req.json();

  if (!body.text || !body.userId || body.text.trim() === '') {
    console.log('Text and userId required');
    return NextResponse.json({ error: 'Text and userId required' }, { status: 400 });
  }

  const message = {
    text: body.text.trim(),
    userId: body.userId,
    messageSender: body.username,
    createdAt: new Date(),
    likedUserIds: [],
    dislikedUserIds: [],
    comments: [],
    reports: [],
  };

  const result = await db.collection('messages').insertOne(message);
  message._id = result.insertedId;

  return NextResponse.json(message);
}

// PUT: Delete a message (admin)
export async function PUT(req) {
  const db = await getDb();
  const body = await req.json();

  if (!body || !ObjectId.isValid(body.id)) {
    return NextResponse.json({ error: 'Valid _id required' }, { status: 400 });
  }

  const result = await db
    .collection('messages')
    .deleteOne({ _id: new ObjectId(body.id) });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, deletedId: body.id });
}
