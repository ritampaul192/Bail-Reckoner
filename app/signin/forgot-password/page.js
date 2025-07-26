'use client';

import React, { useState } from 'react';
import '../login.css';
import { useRouter } from 'next/navigation';
import { FaEnvelope } from "react-icons/fa6";
import { FaBalanceScale } from "react-icons/fa";
import UpdatedMessage from '../../components/updatedMessage';
import ErrorMessage from '../../components/errorMessage';

const Page = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();

    const emailChange = (e) => {
        setEmail(e.target.value);
    };

    const getOTPViaEmail = async (e) => {
  e.preventDefault();
  setLoading(true);
  setSuccessMsg('');
  setErrorMsg('');

  try {
    const res = await fetch('/api/login/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailAddress: email }),
    });

    let data;
    try {
      data = await res.json();
      console.log("OTP response:", data);
    } catch (err) {
      console.error("❌ Failed to parse OTP JSON:", err);
      setErrorMsg("⚠️ Server error: OTP response was invalid.");
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setErrorMsg('❌ ' + (data.error || 'Error generating OTP'));
      setLoading(false);
      return;
    }

    const { otp } = data;
    setSuccessMsg('✅ OTP sent to your email.');

    // Fetch user
    const userRes = await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailAddress: email }),
    });

    let userData;
    try {
      userData = await userRes.json();
      console.log("User response:", userData);
    } catch (err) {
      console.error("❌ Failed to parse user JSON:", err);
      setErrorMsg("⚠️ Server error: User response was invalid.");
      setLoading(false);
      return;
    }

    if (!userRes.ok) {
      setErrorMsg('❌ User not found. Please sign up first.');
      setLoading(false);
      return;
    }

    const username = userData.user.username.replace(/_/g, ' ');

    const sendingOtp = await fetch('/api/login/forgot-password/reset-password/reset-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: email, otp, username }),
    });

    if (sendingOtp.ok) {
      router.replace(`/reset-password?email=${encodeURIComponent(email)}`);
    } else {
      console.error("❌ Email send failed:", await sendingOtp.text());
      setErrorMsg('❌ Failed to send OTP email.');
      setLoading(false);
    }

  } catch (error) {
    console.error('Main error:', error);
    setErrorMsg('⚠️ Something went wrong.');
    setLoading(false);
  }
};


    return (
        <>
            <div className='body h-[100vh] w-[100vw]'>
                {/* ✅ Show toasts if needed */}
                {successMsg && <UpdatedMessage message={successMsg} />}
                {errorMsg && <ErrorMessage message={errorMsg} />}

                <div className='page-container flex flex-col items-center'>
                    <header className="site-header">
                        <h1 className='font-extrabold'>
                            <FaBalanceScale className='invert-0' />
                            BAIL <span className='text-[#c55c44]'>सेतु</span>
                        </h1>
                        <p className="intro-text">Your Guide to Bail Laws & Rights in India</p>
                    </header>

                    <div className="bg-white rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.2)] w-[90%] max-w-[450px] p-10 my-8">
                        {/* Form */}
                        <form id="login-form" onSubmit={(e) => e.preventDefault()}>
                            {/* Email Input */}
                            <div className="mb-6">
                                <label htmlFor="email" className="block mb-2 font-semibold text-[#2c3e50]">Email</label>
                                <div className="relative flex items-center">
                                    <FaEnvelope className='absolute left-4 invert-75' />
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={emailChange}
                                        placeholder="Enter your email"
                                        required
                                        className="w-full py-3 pl-12 pr-4 border border-[#ddd] rounded-md text-base focus:outline-none focus:border-[#2c3e50]"
                                    />
                                </div>
                            </div>

                            {/* Button */}
                            <div className="my-6">
                                <button
                                    className="w-full py-3 bg-[#2c3e50] text-white rounded-md text-base font-semibold hover:bg-[#1a252f] transition-colors my-1 disabled:bg-gray-500 disabled:cursor-not-allowed"
                                    onClick={getOTPViaEmail}
                                    disabled={loading}
                                >
                                    {loading ? 'Sending OTP...' : 'Get OTP by Email'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <footer className="site-footer">
                        <p className="outro-text">Thank you for trusting us</p>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default Page;
