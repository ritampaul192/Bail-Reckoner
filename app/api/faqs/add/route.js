// File: /app/api/faqs/route.js

import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'BailSETU';

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

// POST: Add a new FAQ
export async function POST(req) {
  const db = await getDb();
  const { question_en, question_hi } = await req.json();

  if (!question_en || !question_hi) {
    return NextResponse.json({ error: 'Both English and Hindi questions are required' }, { status: 400 });
  }

  const newFaq = {
    question: {
      en: question_en,
      hi: question_hi,
    },
    answer: {
      en: '',
      hi: '',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await db.collection('faqs').insertOne(newFaq);
  return NextResponse.json({ ...newFaq, _id: result.insertedId });
}

// DELETE: Remove an FAQ by ID
export async function DELETE(req) {
  const db = await getDb();
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'FAQ ID is required' }, { status: 400 });
  }

  const result = await db.collection('faqs').deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'FAQ deleted successfully', id });
}
