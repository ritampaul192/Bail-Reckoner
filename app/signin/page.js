'use client';

import React, { useState, useEffect } from 'react';
import './login.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEnvelope } from "react-icons/fa6";
import { FaLock, FaEye, FaEyeSlash, FaBalanceScale } from "react-icons/fa";
import Spinner from '../components/Spinner';
import UpdatedMessage from '../components/updatedMessage';
import ErrorMessage from '../components/errorMessage';

const Page = () => {
  const [showPassword1, setShowPassword1] = useState(false);
  const [condSatisfied, setCondSatisfied] = useState(false);
  const [login, setLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const toggleView1 = () => setShowPassword1((prev) => !prev);

  const handleLogin = async (e) => {
    setCondSatisfied(true);
    e.preventDefault();
    setLogin(true);
    try {
      const res = await fetch('api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        setShowSuccess(true);
        setTimeout(() => {
          router.replace('/Home');
        }, 1800);
      } else {
        setErrorMsg(data.message || 'Invalid credentials.');
        setCondSatisfied(false);
        setLogin(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg('Something went wrong. Try again.');
      setCondSatisfied(false);
      setLogin(false);
    }
  };

  return (!condSatisfied ?
    (<div className='body w-100vw h-100vh'>
      <div className='page-container flex flex-col items-center'>
        <header className="site-header">
          <h1 className='font-extrabold'>
            <FaBalanceScale className='invert-0' />
            BAIL <span className='text-[#c55c44]'>सेतु</span>
          </h1>
          <p className="intro-text">Your Guide to Bail Laws & Rights in India</p>
        </header>

        <div className="login-container">
          <form id="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-icon relative flex items-center">
                <FaEnvelope className='absolute left-4 invert-75' />
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon relative flex items-center">
                <FaLock className='absolute left-4 invert-75' />
                <input
                  type={showPassword1 ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={toggleView1} className="absolute right-3 text-gray-400">
                  {showPassword1 ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" id="remember" />
                <span>Remember me</span>
              </label>
              <Link href="signin/forgot-password" className="forgot-password">Forgot password?</Link>
            </div>

            <button type="submit" className="cursor-pointer bg-[#2c3e50] p-[12px] w-full text-white border-none rounded-[5px] font-[1rem] transition-colors duration-100 disabled:bg-gray-500 disabled:text-gray-800 disabled:cursor-not-allowed" disabled={login}>Login</button>

            <div className="signup-link">
              Don’t have an account? <Link href="/signup">Sign up</Link>
            </div>
          </form>
        </div>

        <footer className="site-footer">
          <p className="outro-text">Thank you for trusting us</p>
        </footer>
      </div>

      {showSuccess && <UpdatedMessage message="Login successful!" />}
      {errorMsg && <ErrorMessage message={errorMsg} />}
    </div>) : <Spinner />
  );
};

export default Page;
