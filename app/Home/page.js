'use client';
import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Search from '../components/Search';
import Timelines from '../components/Timelines';
import DoAndDonts from '../components/doAndDonts';
import WhyWe from '../components/whyWe';
import FAQs from '../components/faqs';
import ContactUs from '../components/contactus';
import Spinner from '../components/Spinner';
import SlidingPanel from '../components/Slidingpanel';
import UpdatedMessage from '../components/updatedMessage';
import ChatIcon from '../components/ChatIcon';

export default function Page() {
  const inputRef = useRef(null);
  const router = useRouter();

  const [condSatisfied, setCondSatisfied] = useState(false);
  const [handleNavTrigger, setHandleNavTrigger] = useState(false);
  const [language, setLanguage] = useState('en');
  const [userDetails, setUserDetails] = useState({});
  const [isReady, setIsReady] = useState(false);

  const [updateProfile, setUpdateProfile] = useState(false);
  const [changepassword, setChangepassword] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  // ✅ Handle action from Navbar (edit, logout, etc.)
  const handleNavbarAction = (actionType) => {
    if (actionType === 'logout') {
      setHandleNavTrigger(true);
    } else if (actionType === 'edit-profile') {
      setUpdateProfile(true);
    } else if (actionType === 'change-password') {
      setChangepassword(true);
    } else if (actionType === 'advocateClick') {
      setCondSatisfied(false);
    }
  };

  // ✅ Handle logout from search component
  const handleSearchAction = (actionType) => {
    if (actionType === 'search') {
      setHandleNavTrigger(true);
    }
  };

  // ✅ Close profile/password panel
  const handleClosePanel = () => {
    setUpdateProfile(false);
    setChangepassword(false);
  };

  // ✅ Called from SlidingPanel after successful update
  const handleProfileUpdated = () => {
    setIsUpdated(true);
  };

  // ✅ useEffect to auto-dismiss update message
  useEffect(() => {
    if (isUpdated) {
      const timeout = setTimeout(() => {
        setIsUpdated(false);
      }, 3000); // message shown for 3s
      return () => clearTimeout(timeout);
    }
  }, [isUpdated]);

  // ✅ Authentication check
  useEffect(() => {
    setCondSatisfied(false);
    const rawUser = localStorage.getItem('user');
    if (!rawUser || rawUser === '""' || rawUser === '{}' || rawUser === null) {
      router.replace(handleNavTrigger ? '/' : '/signin');
      return;
    }

    try {
      const user = JSON.parse(rawUser);
      if (!user || !user.username || user.username.trim() === '') {
        router.replace('/signin');
        return;
      }
      setUserDetails(user);
      setCondSatisfied(true);
    } catch {
      router.replace('/signin');
    }
  }, [handleNavTrigger]);

  // ✅ Load language from localStorage
  useEffect(() => {
    setCondSatisfied(false);
    const rawUser = localStorage.getItem('user');
    if (!rawUser || rawUser === '""' || rawUser === '{}' || rawUser === null) {
      router.replace(handleNavTrigger ? '/' : '/signin');
      return;
    }

    try {
      const user = JSON.parse(rawUser);
      if (!user || !user.username || user.username.trim() === '') {
        router.replace('/signin');
        return;
      }
      setUserDetails(user);
      setCondSatisfied(true);
    } catch {
      router.replace('/signin');
    }
    const savedLang = localStorage.getItem('bailLang') || 'en';
    setLanguage(savedLang);
    setIsReady(true);
  }, []);

  if (!isReady) return <Spinner />;

  return condSatisfied ? (
    <>
      {/* ✅ Success message */}
      {isUpdated && <UpdatedMessage message={'User is Updated'} />}

      {/* ✅ Navbar */}
      <Navbar
        userInitiate={(userDetails.username || 'U')[0].toUpperCase()}
        username={userDetails.username}
        emailAddress={userDetails.emailAddress}
        address={userDetails.address}
        phoneNumber={userDetails.phoneNumber}
        scrollToInputRef={inputRef}
        language={language}
        setLanguage={setLanguage}
        onAction={handleNavbarAction}
      />

      {/* ✅ Page Sections */}
      <Search inputRef={inputRef} onAction={handleSearchAction} lang={language} />
      <Timelines language={language} />
      <DoAndDonts language={language} />
      <WhyWe language={language} />
      <FAQs language={language} />
      <ContactUs language={language} email={userDetails.emailAddress} />

      {/* ✅ Sliding Panel */}
      {(updateProfile || changepassword) && (
        <SlidingPanel
          onClose={handleClosePanel}
          onUpdate={handleProfileUpdated}
          userinitiate={(userDetails.username || 'U')[0].toUpperCase()}
        />
      )}
      <ChatIcon />
    </>
  ) : (
    <Spinner />
  );
}
