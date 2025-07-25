// app/api/Advocate/deleteAdvocate/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import AdvocateSchema from '@/app/model/AdvocateSchema';

// Connect to MongoDB using mongoose
const MONGODB_URI = process.env.MONGODB_URI;

async function connectMongo() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

export async function PUT(req) {
  await connectMongo();

  const { id } = await req.json();

  try {
    const result = await AdvocateSchema.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json({ success: false, message: 'Advocate not found' });
    }

    return NextResponse.json({ success: true, message: 'Advocate deleted successfully' });
  } catch (error) {
    console.error('Error deleting advocate:', error);
    return NextResponse.json({ success: false, message: 'Error deleting advocate', error: error.message });
  }
}
