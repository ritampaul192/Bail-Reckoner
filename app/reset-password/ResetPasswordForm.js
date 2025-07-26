'use client';

import React, { useState, useEffect } from 'react';
import './style.css';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaQrcode, FaBalanceScale } from 'react-icons/fa';

const ResetPasswordForm = () => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [resendTime, setResendTime] = useState(null);
  const [expiryTime, setExpiryTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  // Save email to localStorage only in browser
  useEffect(() => {
    if (typeof window !== 'undefined' && email) {
      localStorage.setItem('email', JSON.stringify(email));
    }
  }, [email]);

  // Fetch reset token expiry time
  useEffect(() => {
    if (!email) return;

    async function fetchUserExpiry() {
      try {
        const res = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailAddress: email }),
        });

        if (!res.ok) throw new Error('Failed to fetch user data');

        const { user } = await res.json();
        const date = new Date(user.resetTokenExpiry);
        setExpiryTime(date);
      } catch (error) {
        console.error('❌ Error:', error);
      }
    }

    fetchUserExpiry();
  }, [email]);

  // Timer Countdown
  useEffect(() => {
    if (!expiryTime) return;

    const intervalId = setInterval(() => {
      const remaining = expiryTime - Date.now();
      const resendAvailable = remaining - (14 * 60 * 1000 + 30 * 1000);

      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(intervalId);
      } else {
        setTimeLeft(remaining);
        setResendTime(resendAvailable);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [expiryTime]);

  const otpChange = (e) => setOtp(e.target.value);

  const formatTime = (ms) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins < 10 ? '0' + mins : mins} : ${secs < 10 ? '0' + secs : secs}`;
  };

  const resendOTP = async () => {
    try {
      setResendLoading(true);

      const res = await fetch('/api/login/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailAddress: email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error generating OTP');
      }

      const userRes = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailAddress: email }),
      });

      const { user } = await userRes.json();

      await fetch('/api/login/forgot-password/reset-password/reset-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user.emailAddress,
          otp: user.resetToken,
          username: user.username,
        }),
      });

      alert('✅ OTP sent to your email.');
      setExpiryTime(new Date(user.resetTokenExpiry));
    } catch (error) {
      console.error('❌ Resend OTP error:', error);
      alert('❌ ' + error.message);
    } finally {
      setResendLoading(false);
    }
  };

  const checkOTP = async () => {
    try {
      setLoading(true);

      if (otp.length !== 6) {
        alert('❌ Please enter a 6-digit OTP');
        return;
      }

      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailAddress: email }),
      });

      if (!res.ok) throw new Error('Failed to verify user');

      const { user } = await res.json();

      if (user.resetToken !== otp) {
        alert('❌ Incorrect OTP');
      } else if (Date.now() > new Date(user.resetTokenExpiry)) {
        alert('⏰ OTP expired. Please resend the OTP.');
      } else {
        alert('✅ OTP verified! Redirecting...');
        router.replace(`/reset-password/new-password?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      console.error('❌ OTP Check error:', error);
      alert('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-screen w-screen flex justify-center items-center text-[#333] bg-[#2c3e50]'>
      <div className='page-container flex flex-col items-center'>
        <header className="site-header">
          <h1 className='font-extrabold text-white text-2xl flex items-center gap-2'>
            <FaBalanceScale />
            BAIL<span className='text-[#c55c44]'>सेतु</span>
          </h1>
          <p className="intro-text text-sm text-white">Your Guide to Bail Laws & Rights in India</p>
        </header>

        <div className="bg-white rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.2)] w-[90%] max-w-[450px] p-10 my-8">
          {timeLeft > 0 && (
            <p className="text-red-500 mb-4 text-sm text-center">
              OTP expires in: {formatTime(timeLeft)}
            </p>
          )}

          <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="otp" className="block mb-2 font-semibold text-[#2c3e50]">
              Enter OTP:
            </label>
            <div className="relative mb-6">
              <FaQrcode className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
              <input
                type="text"
                id="otp"
                inputMode="numeric"
                value={otp}
                onChange={otpChange}
                placeholder="Enter your OTP"
                required
                className="w-full py-3 pl-12 pr-4 border border-[#ddd] rounded-md text-base focus:outline-none focus:border-[#2c3e50]"
              />
            </div>

            <button
              type="button"
              onClick={checkOTP}
              disabled={loading}
              className="w-full py-3 mb-2 bg-[#2c3e50] text-white rounded-md text-base font-semibold hover:bg-[#1a252f] transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={resendOTP}
              disabled={resendLoading || resendTime > 0}
              className="w-full py-3 bg-[#2c3e50] text-white rounded-md text-base font-semibold hover:bg-[#1a252f] transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {resendLoading
                ? 'Resending OTP...'
                : resendTime > 0
                ? `Resend available in ${Math.floor((resendTime / 1000) % 60)}s`
                : 'Resend OTP'}
            </button>
          </form>
        </div>

        <footer className="site-footer">
          <p className="text-sm text-white">Thank you for trusting us</p>
        </footer>
      </div>
    </div>
  );
};


export default ResetPasswordForm;

