import connectDB from '../login/mongoose.js';
import Login from '../../model/schema.js';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { username, emailAddress, pinNumber, phoneNumber, address, password } = body;

    if (!emailAddress) {
      return new NextResponse(JSON.stringify({ message: 'Email is required' }), { status: 400 });
    }

    const user = await Login.findOne({ emailAddress });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    user.username = username || user.username;
    user.pinNumber = pinNumber || user.pinNumber;
    user.address = address || user.address;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.password = password || user.password; // consider hashing!

    await user.save();

    return new NextResponse(
      JSON.stringify({ message: 'User updated successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('POST /updateProfile error:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}
