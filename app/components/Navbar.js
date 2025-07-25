'use client';

import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { FaUserEdit, FaKey, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';

const Navbar = ({
  userInitiate,
  username,
  emailAddress,
  address,
  phoneNumber,
  scrollToInputRef,
  onAction,
}) => {
  const [fullname, setFullname] = useState('');
  const [profileVisible, setProfileVisible] = useState(false);
  const [sectionDropdownVisible, setSectionDropdownVisible] = useState(false);
  const [mobileHam, setMobileHam] = useState(false);
  const [language, setLanguage] = useState('en');
  const profileRef = useRef(null);
  const sectionDropdownRef = useRef(null);
  const router = useRouter();


  // Load stored language on mount
  useEffect(() => {
    const fullNameFromUsername = username
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    setFullname(fullNameFromUsername);
    const storedLang = localStorage.getItem('bailLang') || 'en';
    setLanguage(storedLang);
  }, []);

  const toggleLanguage = (e) => {
    const nextLang = e.target.value;
    localStorage.setItem('bailLang', nextLang);
    setLanguage(nextLang);
    window.location.reload();
  };

  const handleInputSectionClick = () => {
    setSectionDropdownVisible(false);
    if (scrollToInputRef?.current) {
      scrollToInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      scrollToInputRef.current.focus();
    }
  };

  const handleInputAdvocateClick = () => {
    onAction?.('advocateClick');
    setSectionDropdownVisible(false);
    router.push('/AdvocateFinder');
  };

  const handleInputArbitratorClick = () => {
    onAction?.('arbitratorClick');
    setSectionDropdownVisible(false);
    router.push('/ArbitrationFinder');
  };

  const handleInputMessageClick = () => {
    onAction?.('messageClick');
    setSectionDropdownVisible(false);
    router.push('/messages');
  };

  const toggleProfile = () => setProfileVisible((v) => !v);
  const toggleSectionDropdown = () => setSectionDropdownVisible((v) => !v);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('bailLang');
    router.replace('/');
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (ev) => {
      if (profileRef.current && !profileRef.current.contains(ev.target)) {
        setProfileVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function toggleHam() {
    setMobileHam(!mobileHam);
  }

  return (
    <header>
      <nav>
        <div className="nav-container relative">
          {/* Logo and mobile toggle */}
          <div className="logo">
            <h1 className="font-extrabold">BAIL <span className='text-[#e74c3c]'>सेतु</span></h1>
            <button className="menu-toggle mr-2" id="mobile-menu" onClick={toggleHam}>
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </button>
          </div>

          {/* Navigation links */}
          <ul className={`absolute left-0 top-full w-full flex-col flex-wrap bg-[#2c3e50] list-none [&.active]:flex
              md:flex md:flex-row md:bg-transparent md:w-auto md:relative z-10 ${mobileHam ? 'flex flex-col' : 'hidden'}`} id="nav-list">
            <li className="nav-item"><a href="#home">{language === 'en' ? 'Home' : 'मुखपृष्ठ'}</a></li>

            {/* Language Selector */}
            <li className="nav-item flex gap-x-6 items-start dropdown relative">
              <select
                value={language}
                onChange={toggleLanguage}
                className="bg-[#e74c3c] text-white font-semibold text-sm px-3 py-2 rounded-md shadow-md focus:outline-none"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
            </li>

            {/* Services Dropdown */}
            <li className="nav-item flex gap-x-6 items-start dropdown relative" ref={sectionDropdownRef}>
              <button
                onClick={toggleSectionDropdown}
                className="flex items-center gap-1 text-white visible"
              >
                {language === 'en' ? 'Services' : 'सेवाएँ'}
                {sectionDropdownVisible ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              <ul className={`relative md:absolute md:top-full mt-2 md:right-0 w-full md:w-50 p-0 md:p-1 bg-[#2c7699] text-white rounded shadow-md transition-all ${sectionDropdownVisible ? 'block' : 'hidden'}`}>
                <li
                  onClick={handleInputSectionClick}
                  className="p-2 hover:bg-[#34495e] pl-1.5 border-b-1 border-gray-700 cursor-pointer"
                >
                  <span className="pl-1.5">{language === 'en' ? 'IPC Sections' : 'आईपीसी धाराएं'}</span>
                </li>
                <li
                  onClick={handleInputAdvocateClick}
                  className="p-2 hover:bg-[#34495e] pl-1.5 border-b-1 border-gray-700 cursor-pointer"
                >
                  <span className="pl-1.5">{language === 'en' ? 'Advocate Search Engine' : 'वकील खोज इंजन'}</span>
                </li>
                <li
                  onClick={handleInputMessageClick}
                  className="p-2 hover:bg-[#34495e] pl-1.5 border-b-1 border-gray-700 cursor-pointer"
                >
                  <span className="pl-1.5">{language === 'en' ? 'Message Community' : 'वार्तालाप समुदाय '}</span>
                </li>
                <li
                  onClick={handleInputArbitratorClick}
                  className="p-2 hover:bg-[#34495e] pl-1.5 border-b-1 border-gray-700 cursor-pointer"
                >
                  <span className="pl-1.5">{language === 'en' ? 'Arbitrator Search' : 'मध्यस्थकर्ता खोज'}</span>
                </li>
              </ul>
            </li>

            <li className="nav-item"><a href="#timelines">{language === 'en' ? 'Timelines' : 'समयरेखा'}</a></li>
            <li className="nav-item"><a href="#dos-donts">{language === 'en' ? "Dos & Don'ts" : 'क्या करें और क्या न करें'}</a></li>
            <li className="nav-item">
              <a href="#faq">
                <abbr title={language === 'en' ? "Frequently Asked Questions" : "अक्सर पूछे जाने वाले प्रश्न"} className="no-underline">
                  {language === 'en' ? 'FAQs' : 'प्रश्न'}
                </abbr>
              </a>
            </li>
            <li className="nav-item"><a href="#contact">{language === 'en' ? 'Contact' : 'संपर्क करें'}</a></li>
          </ul>

          {/* User Profile */}
          <div className="user-profile relative">
            <button className="profile-icon" onClick={toggleProfile}>
              {userInitiate}
            </button>
            <div
              ref={profileRef}
              className={`profile-dropdown fixed top-16 right-4 bg-white rounded-lg shadow-lg transition-transform duration-300 ease-in-out w-[280px] z-50 ${profileVisible ? 'translate-y-0 opacity-100' : '-z-20 translate-y-4 opacity-0 pointer-events-none'
                }`}
            >
              <div className="profile-header rounded-t-md p-4 border-b bg-gray-100">
                <div className="profile-avatar bg-red-500 text-white z-10 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  {userInitiate}
                </div>
                <div className="profile-info ml-3">
                  <h4 className="profile-name font-medium">{fullname}</h4>
                  <p className="profile-email text-sm text-gray-600">{emailAddress}</p>
                </div>
              </div>
              <div className="profile-details px-4 py-2 text-sm text-gray-700">
                <div className="detail-item flex mb-2">
                  <span className="detail-label w-20 font-semibold">{language === 'en' ? 'Username:' : 'उपयोगकर्ता:'}</span>
                  <span className="detail-value">{username}</span>
                </div>
                <div className="detail-item flex mb-2">
                  <span className="detail-label w-20 font-semibold">{language === 'en' ? 'Phone:' : 'फोन:'}</span>
                  <span className="detail-value">{phoneNumber}</span>
                </div>
                <div className="detail-item flex">
                  <span className="detail-label w-20 font-semibold">{language === 'en' ? 'Address:' : 'पता:'}</span>
                  <span className="detail-value">{address}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="profile-actions px-4 pb-4 flex flex-col gap-2 text-sm">
                <button
                  className="profile-action flex items-center gap-2 text-gray-700 hover:text-red-500"
                  onClick={() => {
                    setProfileVisible(false);
                    onAction?.('edit-profile');
                  }}
                >
                  <FaUserEdit /> {language === 'en' ? 'Edit Profile' : 'प्रोफ़ाइल संपादित करें'}
                </button>

                <button
                  className="profile-action flex items-center gap-2 text-gray-700 hover:text-red-500"
                  onClick={() => {
                    setProfileVisible(false);
                    onAction?.('change-password');
                  }}
                >
                  <FaKey /> {language === 'en' ? 'Change Password' : 'पासवर्ड बदलें'}
                </button>

                <button
                  className="profile-action flex items-center gap-2 text-gray-700 hover:text-red-500"
                  onClick={() => {
                    setProfileVisible(false);
                    onAction?.('logout');
                    handleLogout();
                  }}
                >
                  <RiLogoutBoxLine /> {language === 'en' ? 'Logout' : 'लॉगआउट'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
