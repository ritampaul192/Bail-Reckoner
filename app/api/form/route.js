import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'BailSETU';

async function connectDB() {
  if (!client.topology?.isConnected?.()) await client.connect();
  return client.db(dbName);
}

export async function POST(req) {
  try {
    const db = await connectDB();
    const body = await req.json();

    const application = {
      applicant: body.applicant,
      arbitratorId: body.arbitratorId,
      arbitratorName: body.arbitratorName,
      caseTitle: body.caseTitle,
      caseDesc: body.caseDesc,
      demand: body.demand,
      hearingDate: body.hearingDate,
      status: 'Pending',
      createdAt: new Date(),
    };

    const result = await db.collection('applications').insertOne(application);

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      id: result.insertedId.toString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const db = await connectDB();
    const body = await req.json();
    const applicant = body.applicant;

    if (!applicant) {
      return NextResponse.json(
        { success: false, message: 'Applicant is required' },
        { status: 400 }
      );
    }

    const applications = await db
      .collection('applications')
      .find({ applicant })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}