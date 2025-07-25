// /app/api/send-otp/route.js or route.ts
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { to, otp } = body;

    if (!to || !otp) {
      return NextResponse.json(
        { error: 'Missing required fields: `to` and `otp` are required' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlBody = `
  <body style="margin: 0; padding: 0; background-color: #f0f4f8;">
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 30px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h2 style="color: #2c3e50;">🔐 Password Reset Request</h2>
    
      <p style="font-size: 16px; color: #333;">
        Hi <strong style="color: #2c3e50;"></strong>,
      </p>

      <p style="font-size: 15px; color: #555;">
        We received a request to verify your Email. Use the OTP below to proceed.
      </p>

      <div style="margin: 20px 0; padding: 15px; background-color: #eef2f7; border-left: 5px solid #2c3e50;">
        <h3 style="margin: 0; font-size: 26px; color: #2c3e50;">🔢 ${otp}</h3>
      </div>

      <p style="font-size: 14px; color: #777;">
        This OTP is valid for <strong>15 minutes</strong>. Please do not share it with anyone.
      </p>

      <p style="font-size: 14px; color: #999;">
        If you did not request a password reset, you should contact us in this email ignore this email.
      </p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;" />

      <p style="font-size: 12px; color: #aaa; text-align: center;">
        © 2025 Suvidhan. All rights reserved.
      </p>
    </div>
  </body>
    `;

    const mailOptions = {
      from: `"Bail सेतु" <${process.env.EMAIL_USER}>`,
      to,
      subject: '🔑 Your OTP for Bail सेतु Verification',
      html: htmlBody,
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, info });
  } catch (err) {
    console.error('[SEND-OTP-ERROR]', err);
    return NextResponse.json(
      { error: 'Failed to send email', details: err.message },
      { status: 500 }
    );
  }
}
