// /api/messages/react/route.js
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

export async function PUT(req) {
  const db = await getDb();
  const { id, action, userId } = await req.json();

  if (!id || !action || !userId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const collection = db.collection('messages');
  const _id = new ObjectId(id);
  const message = await collection.findOne({ _id });

  if (!message) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  }

  const userReaction = message.reactions?.find((r) => r.userId === userId) || { liked: false, disliked: false };

  let updatedReactions = message.reactions || [];

  if (action === 'like') {
    const newReaction = {
      userId,
      liked: !userReaction.liked,
      disliked: false,
    };
    updatedReactions = updatedReactions.filter((r) => r.userId !== userId).concat(newReaction);
  }

  if (action === 'dislike') {
    const newReaction = {
      userId,
      liked: false,
      disliked: !userReaction.disliked,
    };
    updatedReactions = updatedReactions.filter((r) => r.userId !== userId).concat(newReaction);
  }

  await collection.updateOne({ _id }, { $set: { reactions: updatedReactions } });

  const updated = await collection.findOne({ _id });
  return NextResponse.json(updated);
}
