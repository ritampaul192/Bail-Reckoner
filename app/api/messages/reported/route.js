import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import connectDB from '../../login/mongoose';

const uri = process.env.MONGODB_URI_2;
const client = new MongoClient(uri);
const dbName = 'chatProject';

async function getDb() {
  if (!client.topology?.isConnected()) await client.connect();
  return client.db(dbName);
}

// GET: Only reported messages
export async function GET() {
  await connectDB();
  const db = await getDb();

  const reported = await db
    .collection('messages')
    .find({ reports: { $exists: true, $not: { $size: 0 } } })
    .sort({ 'reports.createdAt': -1 })
    .toArray();

  return NextResponse.json(reported);
}