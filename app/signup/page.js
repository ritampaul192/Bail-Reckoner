'use client';

import React, { useState } from 'react';
import './style.css';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaUserTag,
  FaMapMarkerAlt,
  FaMapPin,
  FaPhone,
  FaBalanceScale,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Spinner from '../components/Spinner';
import { motion, AnimatePresence } from 'framer-motion';


const Page = () => {
  const router = useRouter();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [condSatisfied, setCondSatisfied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const fullname = watch('fullname') || '';
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const username = fullname.trim().replace(/\s+/g, '_');

  const handleSendOtp = async () => {
    setVerifyEmail(true);
    const emailAddress = watch('emailAddress');
    if (!emailAddress) {
      alert('Please enter a valid email address.');
      setVerifyEmail(false);
      return;
    }

    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generated);

    try {
      await fetch('/api/verifyEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: emailAddress, otp: generated }),
      });
      alert(`OTP sent to ${emailAddress}`);
      setOtpSent(true);
      setShowOtpModal(true); // Open modal

      setVerifyEmail(false);
    } catch (error) {
      console.error('Failed to send OTP:', error);
      alert(`Failed to send OTP to ${emailAddress}`);
    }
  };

  const verifyOtp = () => {
    if (enteredOtp === otp) {
      setOtpVerified(true);
      setShowOtpModal(false);
      alert('Email verified successfully!');
    } else {
      alert('Incorrect OTP. Please try again.');
    }
  };

  const onSubmit = async (data) => {
    setCondSatisfied(true);
    if (!otpVerified) {
      alert('Please verify your email before signing up.');
      setCondSatisfied(false);
      return;
    }

    const payload = {
      username,
      ...data,
    };

    try {
      const signup = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await signup.json();

      if (!signup.ok) {
        throw new Error(result.error || 'Signup failed');
      }

      try {
        const userRes = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailAddress: payload.emailAddress }),
        });
        const userInfo = await userRes.json();
        localStorage.setItem('user', JSON.stringify(userInfo));
      } catch (err) {
        console.error('Failed to fetch user data', err);
      }

      alert(`${result.message}`);
      setOtpSent(false);
      setOtpVerified(false);
      router.replace('/Home');
    } catch (err) {
      console.error('Signup error:', err);
      alert(`Signup error: ${err.message}`);
      setCondSatisfied(false);
    }
  };

  return (!condSatisfied ?
    (<div className='body w-100vw h-100vh'>
      <div className='container mx-auto flex flex-col items-center'>
        <header className='site-header'>
          <h1 className='font-extrabold'>
            <FaBalanceScale className='invert-0' />
            BAIL <span className='text-[#c55c44]'>सेतु</span>
          </h1>
          <p className='intro-text'>Your Guide to Bail Laws & Rights in India</p>
        </header>

        <div className='login-container'>
          <form id='login-form' onSubmit={handleSubmit(onSubmit)}>
            <div className='form-group'>
              <label htmlFor='fullname'>Full Name</label>
              <div className='input-with-icon relative flex items-center'>
                <FaUser className='absolute left-4 invert-75' />
                <input
                  type='text'
                  id='fullname'
                  placeholder='Enter your full name'
                  {...register('fullname', { required: 'Full name is required' })}
                />
              </div>
              {errors.fullname && <p className='error text-red-500'>{errors.fullname.message}</p>}
            </div>

            <div className='form-group flex flex-col gap-2'>
              <label htmlFor='emailAddress'>Email</label>
              <div className='input-with-icon relative flex items-center'>
                <FaEnvelope className='absolute left-4 invert-75' />
                <input
                  type='email'
                  id='emailAddress'
                  placeholder='Enter your email'
                  {...register('emailAddress', { required: 'Email is required' })}
                />
              </div>
              {!otpVerified && (
                <button type='button' onClick={handleSendOtp} className='cursor-pointer bg-[#2c3e50] hover:bg-[#1a252f] p-[12px] w-1/3 text-white border-none rounded-[5px] font-[1rem] disabled:bg-gray-400 disabled:text-black' disabled={verifyEmail}>
                  Verify Email
                </button>
              )}
            </div>

            <AnimatePresence>
              {showOtpModal && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    key="backdrop"
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />

                  {/* Modal */}
                  <motion.div
                    key="modal"
                    className="fixed z-50 inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm">
                      <h2 className="text-xl font-semibold mb-4 text-center">Enter OTP</h2>
                      <input
                        type="text"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        maxLength={6}
                        placeholder="6-digit OTP"
                        className="w-full border border-gray-300 p-2 rounded mb-4 text-center"
                      />
                      <div className="flex justify-between">
                        <button
                          onClick={() => setShowOtpModal(false)}
                          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={verifyOtp}
                          className="bg-[#2c3e50] hover:bg-[#1a252f] text-white px-4 py-2 rounded"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>


            <div className='form-group'>
              <label>Username</label>
              <div className='input-with-icon relative flex items-center'>
                <FaUserTag className='absolute left-4 invert-75' />
                <input type='text' value={username} readOnly disabled />
              </div>
            </div>

            <div className='form-group'>
              <label>Address</label>
              <div className='input-with-icon relative flex items-center'>
                <FaMapMarkerAlt className='absolute left-4 invert-75' />
                <input type='text' {...register('address')} placeholder='Optional' />
              </div>
            </div>

            <div className='form-group'>
              <label>PIN Code</label>
              <div className='input-with-icon relative flex items-center'>
                <FaMapPin className='absolute left-4 invert-75' />
                <input type='text' maxLength={6} {...register('pinNumber')} placeholder='Optional' />
              </div>
            </div>

            <div className='form-group'>
              <label>Phone Number</label>
              <div className='input-with-icon relative flex items-center'>
                <FaPhone className='absolute left-4 invert-75' />
                <input type='tel' inputMode='numeric' maxLength={10} placeholder='Enter your number' {...register('phoneNumber', { required: 'Phone is required' })} />
              </div>
              {errors.phone && <p className='error text-red-500'>{errors.phone.message}</p>}
            </div>

            <div className='form-group'>
              <label>Password</label>
              <div className='input-with-icon relative flex items-center'>
                <FaLock className='absolute left-4 invert-75' />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    pattern: {
                      value: /^(?=.[a-z])(?=.[A-Z])(?=.*\W).{8,}$/,
                      message: 'Must be 8+ chars, with upper, lower, special char',
                    },
                  })}
                  placeholder='Enter a strong password'
                />
                <button type='button' onClick={togglePassword} className='absolute right-3 text-gray-400'>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className='error text-red-500'>{errors.password.message}</p>}
            </div>

            <div className='form-group'>
              <label>Confirm Password*</label>
              <div className='relative'>
                <div className='relative flex items-center'>
                  <FaLock className='absolute left-4 invert-75' />
                  <input
                    type={showPassword2 ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === password || 'Passwords do not match',
                    })}
                    className='w-full border border-[#ddd] pl-12 py-3 rounded-md text-base focus:outline-none focus:border-[#2c3e50] transition-colors'
                    placeholder='Re-enter password'
                  />
                  <button type='button' onClick={() => setShowPassword2(!showPassword2)} className='absolute right-3 text-gray-400 my-2.5'>
                    {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className='text-red-500 text-sm'>{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className='block my-2'>
              <label className='remember-me'>
                <input type='checkbox' {...register('agree', { required: true })} />
                I agree to the <a href='/TermsAndConditions' className='text-blue-600 underline'>Terms of Service</a>
              </label>
              {errors.agree && <p className='error text-red-500'>You must agree to continue</p>}
            </div>

            <button type='submit' className='cursor-pointer bg-[#2c3e50] hover:bg-[#1a252f] p-[12px] w-full text-white border-none rounded-[5px] font-[1rem] transition-colors duration-100'>Sign Up</button>
            <div className='signup-link'>Already have an account? <Link onClick={() => setCondSatisfied(true)} href='/signin' >Log in</Link></div>
          </form>
        </div>

        <footer className='site-footer'>
          <p className='outro-text'>Thank you for trusting us</p>
        </footer>
      </div>
    </div>) : <Spinner />
  );
};

export default Page;
