// app/api/get-user/route.js
import connectDB from '../login/mongoose';
import Login from '../../model/schema';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectDB();

    const { emailAddress } = await req.json();

    if (!emailAddress) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    const user = await Login.findOne({ emailAddress });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Are you not signed up yet? Sign up first.' },
        { status: 404 }
      );
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}