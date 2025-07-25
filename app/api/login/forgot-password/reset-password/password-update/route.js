'use server';

import { NextResponse } from "next/server";
import connectDB from "@/app/api/login/mongoose";
import Login from "../../../../../model/schema";

export async function POST(req) {
  try {
    await connectDB();
    const { emailAddress, password } = await req.json();

    const user = await Login.findOne({ emailAddress });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.password = password; // 🔒 Consider hashing in real apps!
    await user.save();

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
