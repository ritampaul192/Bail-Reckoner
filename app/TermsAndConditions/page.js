'use client';
import React from 'react';
import { FaBalanceScale, FaEnvelope } from 'react-icons/fa';
import './style.css';

const Terms = () => {
    return (
        <div className='body1 w-full h-full'>
            <div className="container flex flex-col items-center px-4 md:px-10 py-10 max-w-5xl mx-auto text-[#333] bg-[#f5f7fa]">
                <header className="header bg-[#2c3e50] text-white py-6 px-4 rounded-md w-full text-center mb-10">
                    <h1 className="text-3xl font-bold flex justify-center items-center gap-3">
                        <FaBalanceScale /> BAIL <span className='text-[#c55c44]'>सेतु</span>
                    </h1>
                    <p className="text-lg mt-2">Terms and Conditions</p>
                </header>

                <div className="terms-container bg-white p-6 md:p-10 rounded-md shadow-md w-full">
                    <h2 className="text-2xl font-semibold border-b-2 border-gray-200 pb-2 mb-4">1. Acceptance of Terms</h2>
                    <p className="mb-6">
                        By accessing or using Bail Reckoner (&quot;Platform&quot;), you agree to comply with and be legally bound by these Terms and Conditions.
                        If you do not agree to these Terms, please do not use the platform. Your continued use of the service will be deemed your acceptance.
                    </p>

                    <h2 className="section-title">2. About Bail Reckoner</h2>
                    <p className="mb-6">
                        Bail Reckoner is a public legal information tool designed to assist users in understanding legal procedures related to bail under Indian law.
                        We do not offer legal representation or personalized legal advice. The platform is intended to enhance awareness and accessibility.
                    </p>

                    <h2 className="section-title">3. Eligibility</h2>
                    <p className="mb-6">
                        To use Bail Reckoner, you must be at least 18 years old or have the permission and supervision of a parent or guardian. You are also responsible
                        for ensuring that your use of the service complies with all applicable laws and regulations.
                    </p>

                    <h2 className="section-title">4. User Responsibilities</h2>
                    <p>Users are expected to provide accurate and complete information during registration and use of services. You must not:</p>
                    <ul className="list-disc pl-5 mb-6">
                        <li>Impersonate others</li>
                        <li>Upload harmful content</li>
                        <li>Misuse the platform</li>
                        <li>Violate any laws</li>
                    </ul>
                    <p className="mb-6">Failure to adhere to these responsibilities may result in suspension or termination of your account.</p>

                    <h2 className="section-title">5. OTP and Communications</h2>
                    <p>By registering your phone number or email, you consent to receiving:</p>
                    <ul className="list-disc pl-5 mb-6">
                        <li>One-Time Passwords (OTPs)</li>
                        <li>Transactional notifications</li>
                        <li>Important service-related messages</li>
                    </ul>
                    <p className="mb-6">We are not liable if your contact information is incorrect or inaccessible.</p>

                    <h2 className="section-title">6. No Legal Advice</h2>
                    <div className="highlight bg-[#f8f9fa] p-4 border-l-4 border-[#2c3e50] italic my-6">
                        All content and services provided are for general informational purposes only and do not constitute legal advice.
                        You are encouraged to consult with a qualified legal professional for case-specific guidance.
                    </div>

                    <h2 className="section-title">7. Privacy Policy</h2>
                    <p className="mb-6">
                        We respect your privacy. Your personal information is handled as per our Privacy Policy. Data such as your email, phone number,
                        or usage patterns are stored securely and never shared without your consent.
                    </p>

                    <h2 className="section-title">8. Intellectual Property</h2>
                    <p className="mb-6">
                        All trademarks, logos, content, and features on this platform are the exclusive property of Bail Reckoner unless otherwise stated.
                        You may not copy, reproduce, or distribute any content without prior written consent.
                    </p>

                    <h2 className="section-title">9. Limitation of Liability</h2>
                    <p className="mb-6">
                        Bail Reckoner is provided &#39;as is&#39; without warranties of any kind. We are not liable for any loss or damage, including but not limited to,
                        indirect or consequential losses, resulting from your use of the service.
                    </p>

                    <h2 className="section-title">10. Modifications to Terms</h2>
                    <p className="mb-6">
                        We reserve the right to update these Terms at any time. Significant changes will be notified through the platform.
                        Continued use after changes implies your consent.
                    </p>

                    <h2 className="section-title">11. Governing Law and Jurisdiction</h2>
                    <p className="mb-6">
                        These Terms shall be governed by the laws of India. Any disputes arising will be under the jurisdiction of the competent courts of Kolkata, India.
                    </p>

                    <div className="contact-info bg-[#e8f4fd] p-5 rounded-md mt-10">
                        <h2 className="text-xl font-semibold mb-2">12. Contact Us</h2>
                        <p className="flex items-center gap-2">
                            <FaEnvelope />
                            <a href="mailto:suvidhan.bail@gmail.com" className="text-blue-600 underline">suvidhan.bail@gmail.com</a>
                        </p>
                    </div>
                </div>

                <footer className="footer1 text-center text-gray-600 text-sm mt-10">
                    <p>Last updated: July 2023 | &copy; 2023 Bail Reckoner. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default Terms;
