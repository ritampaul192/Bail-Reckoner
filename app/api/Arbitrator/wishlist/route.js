import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = 'BailSETU';
const client = new MongoClient(uri);

// Helper to get DB connection
async function connectDB() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db(dbName);
}

// POST: Add user to arbitrator's wishlist
export async function POST(req) {
  try {
    const db = await connectDB();
    const body = await req.json();
    const { arbitratorId, userId } = body;

    if (!arbitratorId || !userId) {
      return NextResponse.json({ success: false, message: 'Missing arbitratorId or userId' }, { status: 400 });
    }

    const arbitrator = await db.collection('arbitrators').findOne({ _id: new ObjectId(arbitratorId) });

    if (!arbitrator) {
      return NextResponse.json({ success: false, message: 'Arbitrator not found' }, { status: 404 });
    }

    if (!arbitrator.wishlist?.includes(userId)) {
      await db.collection('arbitrators').updateOne(
        { _id: new ObjectId(arbitratorId) },
        { $push: { wishlist: userId } }
      );
    }

    return NextResponse.json({ success: true, message: 'Added to wishlist' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
  }
}

// PUT: Get all wishlisted arbitrators for a user
export async function PUT(req) {
  try {
    const db = await connectDB();
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Missing userId' }, { status: 400 });
    }

    const wishlisted = await db.collection('arbitrators').find({ wishlist: userId }).toArray();

    return NextResponse.json({
      success: true,
      arbitrators: wishlisted.map(item => ({ ...item, _id: item._id.toString() })),
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
  }
}

// DELETE: Remove user from arbitrator's wishlist
export async function DELETE(req) {
  try {
    const db = await connectDB();
    const body = await req.json();
    const { arbitratorId, userId } = body;

    if (!arbitratorId || !userId) {
      return NextResponse.json({ success: false, message: 'Missing arbitratorId or userId' }, { status: 400 });
    }

    await db.collection('arbitrators').updateOne(
      { _id: new ObjectId(arbitratorId) },
      { $pull: { wishlist: userId } }
    );

    return NextResponse.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 });
  }
}
