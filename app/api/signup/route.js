import connectDB from '../login/mongoose';
import Login from '../../model/schema.js';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // Optional: only if using UUID
// npm install uuid

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { username, emailAddress, pinNumber, phoneNumber, address, password } = body;

    const existingUser = await Login.findOne({ emailAddress });
    if (existingUser) {
      return NextResponse.json(
        { message: 'The email address is already registered.' },
        {status: 500}
      );
    }

    // You can generate your own userId if you don’t want to rely on _id
    // const userId = `user_${Date.now()}`; OR:
    const userId = uuidv4();

    const newUser = new Login({
      userId,
      username,
      emailAddress,
      pinNumber,
      phoneNumber,
      address,
      password, // Consider hashing
    });

    await newUser.save();

    return NextResponse.json(
      { message: 'User created successfully.'}
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Server error while creating user.' }
    );
  }
}
