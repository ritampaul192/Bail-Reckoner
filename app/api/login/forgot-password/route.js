import connectDB from '../mongoose.js'; // ✅ Ensure spelling is correct
import Login from '../../../model/schema';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectDB();

  const { emailAddress } = await req.json();

  if (!emailAddress) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const user = await Login.findOne({ emailAddress });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // ✅ Generate a 6-digit numeric OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // ⏳ Expiry in milliseconds (15 minutes)
  const expiryDuration = 1000 * 60 * 15; // 900000 ms
  const expiryTime = Date.now() + expiryDuration;

  user.resetToken = otp;
  user.resetTokenExpiry = expiryTime;
  await user.save();

  // 🚫 In production, avoid returning OTP in response
  return NextResponse.json({ otp, expiry: expiryDuration });
}
