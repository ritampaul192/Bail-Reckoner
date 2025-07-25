'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaEnvelope, FaLock, FaUser, FaUserTag,
  FaMapMarkerAlt, FaMapPin, FaPhone,
  FaEye, FaEyeSlash,
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import UpdatedMessage from '../components/updatedMessage';


const SlidingPanel = ({ onClose }) => {
  const panelRef = useRef(null);
  const [updated, setUpdated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [user, setUser] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const fullname = watch('fullname') || '';
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const username = fullname.trim().replace(/\s+/g, '_');

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;
      const USER = JSON.parse(storedUser);
      setEmailAddress(USER.emailAddress || '');
      setUser(USER.username || '');
      setValue('fullname', USER.fullname || '');
      setValue('address', USER.address || '');
      setValue('pinNumber', USER.pinNumber || '');
      setValue('phoneNumber', USER.phoneNumber || '');
    } catch (err) {
      console.error('Invalid localStorage user data', err);
    }
  }, [setValue]);

  const handleProfileUpdate = () => {
    setUpdated(true);
    setTimeout(() => setUpdated(false), 3000);
  };

  const onSubmit = async (data) => {
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const payload = { username, ...data, emailAddress };

    try {
      const signup = await fetch('/api/updateProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await signup.json();

      if (!signup.ok) {
        throw new Error(result.message || result.error || 'Signup failed');
      }

      localStorage.setItem('user', JSON.stringify(payload));
      handleProfileUpdate();
      router.replace('/Home');
    } catch (err) {
      console.error('Signup error:', err);
      alert(`❌ ${err.message}`);
    }
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-30 z-[999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        ref={panelRef}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="fixed bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-3xl shadow-xl p-6 overflow-auto max-h-[90vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-2xl text-gray-500 hover:text-red-500"
        >
          &times;
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 container lg:w-3/4 mx-auto">
          <div className='form-group flex flex-col sm:flex-row gap-1.5 sm:gap-3'>
            <label htmlFor='fullname' className='text-nowrap'>Full Name :</label>
            <div className='input-with-icon-update relative flex items-center gap-2'>
              <FaUser className='absolute left-4 invert-75' />
              <input
                type='text'
                id='fullname'
                className='w-full md:w-1/2'
                placeholder='Enter your full name'
                {...register('fullname', { required: 'Full name is required' })}
              />
            </div>
            {errors.fullname && <p className='error'>{errors.fullname.message}</p>}
          </div>

          {/* Email Address */}
          <div className='form-group flex flex-col sm:flex-row gap-1.5 sm:gap-3'>
            <label htmlFor='emailAddress' className='text-nowrap'>Email :</label>
            <div className='input-with-icon-update relative flex items-center'>
              <FaEnvelope className='absolute left-4 invert-75' />
              <input
                type='email'
                id='emailAddress'
                value={emailAddress}
                readOnly
                className='w-full md:w-1/2'
                onClick={() => alert(`You can't change the email address`)}
              />
            </div>
          </div>

          {/* Username */}
          <div className='form-group flex flex-col sm:flex-row gap-1.5 sm:gap-3'>
            <label className='text-nowrap'>Username :</label>
            <div className='input-with-icon-update relative flex items-center'>
              <FaUserTag className='absolute left-4 invert-75' />
              <input type='text' value={username} readOnly disabled className='w-full md:w-1/2' />
            </div>
          </div>

          {/* Address */}
          <div className='form-group flex flex-col sm:flex-row gap-1.5 sm:gap-3'>
            <label className='text-nowrap'>Address :</label>
            <div className='input-with-icon-update relative flex items-center'>
              <FaMapMarkerAlt className='absolute left-4 invert-75' />
              <input type='text' placeholder='Optional' className='w-full md:w-1/2' {...register('address')} />
            </div>
          </div>

          {/* PIN Code */}
          <div className='form-group flex flex-col sm:flex-row gap-1.5 sm:gap-3'>
            <label className='text-nowrap'>PIN Code :</label>
            <div className='input-with-icon-update relative flex items-center'>
              <FaMapPin className='absolute left-4 invert-75' />
              <input type='text' maxLength={6} placeholder='Optional' className='w-full md:w-1/2' {...register('pinNumber')} />
            </div>
          </div>

          {/* Phone */}
          <div className='form-group flex flex-col sm:flex-row gap-1.5 sm:gap-3'>
            <label className='text-nowrap'>Phone Number :</label>
            <div className='input-with-icon-update relative flex items-center'>
              <FaPhone className='absolute left-4 invert-75' />
              <input
                type='tel'
                maxLength={10}
                placeholder='Enter your number'
                className='w-full md:w-1/2'
                {...register('phoneNumber', { required: 'Phone is required' })}
              />
            </div>
            {errors.phone && <p className='error'>{errors.phone.message}</p>}
          </div>

          {/* Password */}
          <div className='form-group flex flex-col sm:flex-row gap-1.5 sm:gap-3'>
            <label className='text-nowrap'>Password :</label>
            <div className='input-with-icon-update relative flex items-center'>
              <FaLock className='absolute left-4 invert-75' />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/,
                    message: 'Must be 8+ chars with upper, lower, special char',
                  },
                })}
                className='w-full md:w-1/2'
                placeholder='Enter a strong password'
              />
              <button type='button' onClick={togglePassword} className='absolute right-3 md:right-[calc(50%+1rem)] text-gray-400'>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className='error text-red-500 text-sm'>{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className='form-group flex flex-col md:flex-row gap-1.5 sm:gap-3'>
            <label className='text-nowrap'>Confirm Password* :</label>
            <div className='input-with-icon-update relative flex items-center'>
              <FaLock className='absolute left-4 invert-75' />
              <input
                type={showPassword2 ? 'text' : 'password'}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match',
                })}
                className='w-full md:w-1/2'
                placeholder='Re-enter password'
              />
              <button
                type='button'
                onClick={() => setShowPassword2(!showPassword2)}
                className='absolute right-3 md:right-[calc(50%+1rem)] text-gray-400 my-2.5'
              >
                {showPassword2 ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className='text-red-500 text-sm'>{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit */}
          <div className='w-full flex justify-end'>
            <button type='submit' className='cursor-pointer bg-[#4d6175] hover:bg-[#3c4e5e] p-[12px] w-1/2 sm:w-1/4 text-white border-none rounded-full font-[1rem] transition-colors duration-100'>Update</button>
          </div>
          {updated && <UpdatedMessage show={updated} />}
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default SlidingPanel;
