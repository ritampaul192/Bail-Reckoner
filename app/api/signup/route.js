// /app/api/signup/route.js
import connectDB from '../../../utils/mongoose';
import Login from '../../../model/schema';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      userId,
      username,
      anonymousUser,
      emailAddress,
      pinNumber,
      phoneNumber,
      address,
      password,
    } = body;

    await connectDB();

    const existingUser = await Login.findOne({ emailAddress });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    const newUser = new Login({
      userId,
      username,
      anonymousUser,
      emailAddress,
      pinNumber,
      phoneNumber,
      address,
      password,
    });

    await newUser.save();

    return NextResponse.json(
      { message: 'User created successfully', newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Server error while creating user.' },
      { status: 500 }
    );
  }
}
