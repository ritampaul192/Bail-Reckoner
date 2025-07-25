'use client';

import React, { useState } from 'react';
import '../style.css';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaLock, FaBalanceScale } from "react-icons/fa";

const NewPasswordForm = () => {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    const password = watch("password");
    const confirmPassword = watch("confirmPassword");

    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const toggleView1 = () => setShowPassword1((prev) => !prev);
    const toggleView2 = () => setShowPassword2((prev) => !prev);

    const router = useRouter();

    async function savePassword() {
        setLoading(true);
        try {
            const response = await fetch('/api/login/forgot-password/reset-password/password-update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailAddress: email, password }),
            });

            if (response.ok) {
                alert('✅ Password is updated successfully');
                alert('🧑‍💻 Now you can sign in with your new password 📶');
                router.replace('/signin');
            } else {
                alert('❌ Failed to update password');
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            alert('❌ An error occurred while saving password');
            setLoading(false);
        }
    }

    return (
        <div className='h-[100vh] w-[100vw] body flex justify-center items-center text-[#333] bg-[#2c3e50]'>
            <div className='page-container flex flex-col items-center'>
                <header className="site-header">
                    <h1 className='font-extrabold flex items-center gap-2 text-white text-xl'>
                        <FaBalanceScale className='invert-0' />
                        BAIL <span className='text-[#c55c44]'>सेतु</span>
                    </h1>
                    <p className="intro-text text-white">Your Guide to Bail Laws & Rights in India</p>
                </header>

                <div className="bg-white rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.2)] w-[90%] max-w-[450px] p-10 my-8">
                    <form id="reset-password-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="mb-6">
                            <label htmlFor="Newpassword" className="block mb-2 font-semibold text-[#2c3e50]">New Password:</label>
                            <div className="relative mb-2.5">
                                <div className="relative flex items-center">
                                    <FaLock className='absolute left-4 invert-75' />
                                    <input
                                        type={showPassword1 ? "text" : "password"}
                                        {...register("password", {
                                            required: "Password is required",
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/,
                                                message: "Must be 8+ chars, with upper, lower, special char",
                                            },
                                        })}
                                        className="w-full border border-[#ddd] pl-12 py-3 rounded-md text-base focus:outline-none focus:border-[#2c3e50]"
                                        placeholder="Create a strong password"
                                    />
                                    <button type="button" onClick={toggleView1} className="absolute right-3 text-gray-400">
                                        {showPassword1 ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </div>

                            <label htmlFor="Confirmpassword" className="block mb-2 font-semibold text-[#2c3e50]">Confirm Password:</label>
                            <div className="relative mb-2.5">
                                <div className="relative flex items-center">
                                    <FaLock className='absolute left-4 invert-75' />
                                    <input
                                        type={showPassword2 ? "text" : "password"}
                                        {...register("confirmPassword", {
                                            required: "Please confirm your password",
                                            validate: (value) => value === password || "Passwords do not match",
                                        })}
                                        className="w-full border border-[#ddd] pl-12 py-3 rounded-md text-base focus:outline-none focus:border-[#2c3e50]"
                                        placeholder="Re-enter password"
                                    />
                                    <button type="button" onClick={toggleView2} className="absolute right-3 text-gray-400">
                                        {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="my-6">
                            <button
                                className="w-full py-3 bg-[#2c3e50] text-white rounded-md text-base font-semibold hover:bg-[#1a252f] transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                                onClick={savePassword}
                                disabled={loading}
                            >
                                {loading ? 'Submitting new password...' : 'Save password'}
                            </button>
                        </div>
                    </form>
                </div>

                <footer className="site-footer">
                    <p className="outro-text text-white">Thank you for trusting us</p>
                </footer>
            </div>
        </div>
    );
};

export default NewPasswordForm;

