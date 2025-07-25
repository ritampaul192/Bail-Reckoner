// app/api/get-user/route.js
import connectDB from '../login/mongoose';
import Login from '../model/schema';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectDB();

  const { userId } = await req.json();

  const user = await Login.findOne({ userId });

  if (!user) {
    return NextResponse.json({ error: 'User not found...Are you not signed up yet? Sign up first..' }, { status: 404 });
  }

  return NextResponse.json({ user });
}