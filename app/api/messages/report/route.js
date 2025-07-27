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

export async function PUT(req) {
  try {
    await connectDB();
    const db = await getDb();
    const { id, userId, username, reason } = await req.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid message ID' }, { status: 400 });
    }

    if (!userId || !username) {
      return NextResponse.json(
        { error: 'User information is required' }, 
        { status: 400 }
      );
    }

    // Check if user already reported this message
    const existingReport = await db.collection('messages').findOne({
      _id: new ObjectId(id),
      "reports.userId": userId
    });

    if (existingReport) {
      return NextResponse.json(
        { error: 'You have already reported this message' },
        { status: 409 } // 409 Conflict is more appropriate for duplicate actions
      );
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
      return NextResponse.json(
        { error: 'Message not found or report failed' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Report submitted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in report API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
