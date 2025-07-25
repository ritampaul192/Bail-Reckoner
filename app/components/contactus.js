'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const ContactUs = ({ language = 'en', email }) => {
  const router = useRouter();

  const handleAdminClick = () => {
    router.push('/adminPanel');
  };

  return (
    <footer id="contact" className="bg-gray-900 text-white py-10 px-6 footer">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10 border-b border-gray-700 pb-8">
        {/* Contact Info */}
        <div className="md:w-1/2">
          <h3 className="text-2xl font-semibold mb-4">
            {language === 'en' ? 'Contact Us' : 'संपर्क करें'}
          </h3>
          <p className="mb-2">
            📧 {language === 'en' ? 'Email' : 'ईमेल'}:{' '}
            <a href="mailto:suvidhan.bail@gmail.com" className="text-blue-400 underline">
              suvidhan.bail@gmail.com
            </a>
          </p>
          <p>📞 {language === 'en' ? 'Phone' : 'फ़ोन'}: +91 0000000000</p>
        </div>

        {/* Quick Links */}
        <div className="md:w-1/2">
          <h3 className="text-2xl font-semibold mb-4">
            {language === 'en' ? 'Quick Links' : 'तेज़ लिंक'}
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="#faq" className="hover:text-blue-400 transition duration-300">
                {language === 'en' ? 'FAQs' : 'प्रश्न'}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition duration-300">
                {language === 'en' ? 'Privacy Policy' : 'गोपनीयता नीति'}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition duration-300">
                {language === 'en' ? 'Terms of Service' : 'सेवा की शर्तें'}
              </a>
            </li>

            {/* ✅ Admin Panel Button if email is matched */}
            {email === 'suvidhan.bail@gmail.com' && (
              <li>
                <button
                  onClick={handleAdminClick}
                  className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded transition duration-300"
                >
                  {language === 'en' ? 'Admin Panel' : 'प्रशासन पैनल'}
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="text-center pt-6 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()}{' '}
        <span className="font-medium text-white">
          {language === 'en' ? 'SUVIDHAN Bail Reckoner' : 'SUVIDHAN बेल रेकॉनर'}
        </span>
        . {language === 'en' ? 'All rights reserved.' : 'सभी अधिकार सुरक्षित।'}
      </div>
    </footer>
  );
};

export default ContactUs;
