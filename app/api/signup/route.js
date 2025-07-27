import connectDB from '../../api/login/mongoose';
import Login from '../../model/schema.js';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator'; // 👈 Add this

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      username, // Optional: still collected
      emailAddress,
      pinNumber,
      phoneNumber,
      address,
      password,
    } = body;

    const existingUser = await Login.findOne({ emailAddress });
    if (existingUser) {
      return NextResponse.json(
        { message: 'The email address is already registered.' },
        { status: 500 }
      );
    }

    // Generate anonymous name
    const anonymousName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: '-',
      style: 'lowerCase',
    });

    const userId = uuidv4();

    const newUser = new Login({
      userId,
      username, // 👈 Use given or fallback to anonymous
      anonymousUser: anonymousName,
      emailAddress,
      pinNumber,
      phoneNumber,
      address,
      password, // ⚠ Consider hashing this before saving
    });

    await newUser.save();

    return NextResponse.json({
      message: 'User created successfully.',
      userId,
      username: newUser.username,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Server error while creating user.' },
      { status: 500 }
    );
  }
}