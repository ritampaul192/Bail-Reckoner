'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    FaEnvelope,
    FaLock,
    FaUser,
    FaUserTag,
    FaMapMarkerAlt,
    FaMapPin,
    FaPhone,
    FaEye,
    FaEyeSlash,
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import '../updateProfile/update.css';
import '../signup/style.css';

const SlidingPanel = ({ onClose, onUpdate, userinitiate }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [emailAddress, setEmailAddress] = useState('');
    const panelRef = useRef(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm();

    const password = watch('password');
    const confirmPassword = watch('confirmPassword');
    const fullname = watch('fullname') || '';
    const username = fullname.trim().toLowerCase().replace(/\s+/g, '_');

    // Pre-fill form fields from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        const USER = JSON.parse(storedUser);

        setEmailAddress(USER.emailAddress || '');

        // Reconstruct fullname from username
        const username = USER.username || '';
        const fullNameFromUsername = username
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

        // Set values
        setTimeout(() => {
            setValue('fullname', fullNameFromUsername);
            setValue('address', USER.address || '');
            setValue('pinNumber', USER.pinNumber || '');
            setValue('phoneNumber', USER.phoneNumber || '');
        }, 0);
    }, [setValue]);


    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                onClose?.();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const onSubmit = async (data) => {
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const payload = { ...data, emailAddress, username };

        try {
            const res = await fetch('/api/updateProfile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || result.error || 'Update failed');
            }

            localStorage.setItem('user', JSON.stringify(payload));
            onUpdate?.();
            onClose?.();
        } catch (err) {
            console.error('Update error:', err);
            alert(`❌ ${err.message}`);
        }
    };

    return (<>
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
            <form
                ref={panelRef}
                className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-2xl overflow-y-auto scrollbar-no-thumb animate-slideIn max-h-[90vh]"
                onSubmit={handleSubmit(onSubmit)}
                >
                <div className='flex justify-center form-group w-full'> <div className='profile-avatar bg-red-500 text-white z-10 rounded-full w-10 h-10 flex items-center justify-center font-bold'>{userinitiate}</div></div>
                {/* Full Name */}
                <div className="form-group items-end flex flex-col sm:flex-row gap-2">
                    <label htmlFor="fullname" className='text-nowrap'>Full Name :</label>
                    <div className="relative flex items-center w-full">
                        <FaUser className="absolute left-4 text-gray-400" />
                        <input
                            type="text"
                            id="fullname"
                            className="pl-10 w-full border border-gray-400 p-2 rounded"
                            placeholder="Enter your full name"
                            {...register('fullname', { required: 'Full name is required' })}
                        />
                    </div>
                </div>
                {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname.message}</p>}

                {/* Email */}
                <div className="form-group mt-4">
                    <label>Email :</label>
                    <div className="relative flex items-center">
                        <FaEnvelope className="absolute left-4 text-gray-400" />
                        <input
                            type="email"
                            value={emailAddress}
                            readOnly
                            className="pl-10 w-full border p-2 rounded border-gray-400 bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Username (derived from fullname) */}
                <div className="form-group mt-4">
                    <label>Username :</label>
                    <div className="relative flex items-center">
                        <FaUserTag className="absolute left-4 text-gray-400" />
                        <input
                            type="text"
                            value={username}
                            readOnly
                            disabled
                            className="pl-10 cursor-not-allowed w-full border p-2 border-gray-400 rounded bg-gray-100"
                        />
                    </div>
                </div>

                {/* Address */}
                <div className="form-group mt-4">
                    <label>Address :</label>
                    <div className="relative flex items-center">
                        <FaMapMarkerAlt className="absolute left-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Optional"
                            className="pl-10 w-full border p-2 rounded border-gray-400"
                            {...register('address')}
                        />
                    </div>
                </div>

                {/* PIN Code */}
                <div className="form-group mt-4">
                    <label>PIN Code :</label>
                    <div className="relative flex items-center">
                        <FaMapPin className="absolute left-4 text-gray-400" />
                        <input
                            type="text"
                            maxLength={6}
                            placeholder="Optional"
                            className="pl-10 w-full border p-2 rounded border-gray-400"
                            {...register('pinNumber')}
                        />
                    </div>
                </div>

                {/* Phone Number */}
                <div className="form-group mt-4">
                    <label>Phone Number :</label>
                    <div className="relative flex items-center">
                        <FaPhone className="absolute left-4 text-gray-400" />
                        <input
                            type="tel"
                            maxLength={10}
                            placeholder="Enter your number"
                            className="pl-10 w-full border p-2 rounded border-gray-400"
                            {...register('phoneNumber', { required: 'Phone is required' })}
                        />
                    </div>
                    {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                </div>

                {/* Password */}
                <div className="form-group mt-4">
                    <label>Password :</label>
                    <div className="relative flex items-center">
                        <FaLock className="absolute left-4 text-gray-400" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            {...register('password', {
                                required: 'Password is required',
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/,
                                    message: 'Must be 8+ chars with upper, lower, special char',
                                },
                            })}
                            className="pl-10 w-full border p-2 rounded border-gray-400"
                            placeholder="Enter a strong password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 text-gray-400"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div className="form-group mt-4">
                    <label>Confirm Password :</label>
                    <div className="relative flex items-center">
                        <FaLock className="absolute left-4 text-gray-400" />
                        <input
                            type={showPassword2 ? 'text' : 'password'}
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (value) => value === password || 'Passwords do not match',
                            })}
                            className="pl-10 w-full border p-2 rounded border-gray-400"
                            placeholder="Re-enter password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword2(!showPassword2)}
                            className="absolute right-4 text-gray-400"
                        >
                            {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                    )}
                </div>

                {/* Submit */}
                <div className="mt-6 flex justify-end">
                    <button type="submit" className="bg-[#4d6175] hover:bg-[#3c4e5e] text-white px-6 py-2 rounded-full font-semibold transition">
                        Update
                    </button>
                </div>
            </form>
        </div>
    </>
    );
};

export default SlidingPanel;
