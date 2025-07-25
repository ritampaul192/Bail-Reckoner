'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AnswerFaqs from '../components/answer-faqs';
import UpdateFaqs from '../components/update-faqs';
import ReplyMessagesPage from '../components/Reply-messages';
import ManageReportedMessagesPage from '../components/manage-reported-messages';
import DislikedMessagesPage from '../components/disliked-messages';
import AdvocateManager from '../components/advocate-admin';
import './adminPanel.css'
import ArbitratorManager from '../components/arbitrator-admin';

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    if (rawUser) {
      try {
        const user = JSON.parse(rawUser);
        const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;
        if (user && user.userId && user.userId === adminId) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Invalid user JSON");
        setIsAdmin(false);
      }
    }
  }, []);


  const handleToggle = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const closeDropdowns = () => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  const isActive = (href) => pathname === href;

  const InnerComponents = () => {
    if (currentView === 'answer-faqs') {
      return (
        <div className="p-4 w-full h-[calc(100vh-64px)] lg:h-[calc(100vh-177px)] overflow-scroll">
          <button
            className="bg-gray-500 px-4 py-2 rounded text-sm mb-4 hover:bg-gray-600"
            onClick={() => setCurrentView(null)}
          >
            ← Back
          </button>
          <AnswerFaqs />
        </div>
      );
    } else if (currentView === 'update-faqs') {
      return (
        <div className="p-4 w-full h-[calc(100vh-64px)] lg:h-[calc(100vh-177px)] overflow-scroll">
          <button
            className="bg-gray-500 px-4 py-2 rounded text-sm mb-4 hover:bg-gray-600"
            onClick={() => setCurrentView(null)}
          >
            ← Back
          </button>
          <UpdateFaqs />
        </div>
      );
    } else if (currentView === 'reply-messages') {
      return (
        <div className="p-4 w-full h-[calc(100vh-64px)] lg:h-[calc(100vh-177px)] overflow-scroll">
          <button
            className="bg-gray-500 px-4 py-2 rounded text-sm mb-4 hover:bg-gray-600"
            onClick={() => setCurrentView(null)}
          >
            ← Back
          </button>
          <ReplyMessagesPage />
        </div>
      );
    } else if (currentView === 'manage-reported-messages') {
      return (
        <div className="p-4 w-full h-[calc(100vh-64px)] lg:h-[calc(100vh-177px)] overflow-scroll">
          <button
            className="bg-gray-500 px-4 py-2 rounded text-sm mb-4 hover:bg-gray-600"
            onClick={() => setCurrentView(null)}
          >
            ← Back
          </button>
          <ManageReportedMessagesPage />
        </div>
      );
    } else if (currentView === 'disliked-messages') {
      return (
        <div className="p-4 w-full h-[calc(100vh-64px)] lg:h-[calc(100vh-177px)] overflow-scroll">
          <button
            className="bg-gray-500 px-4 py-2 rounded text-sm mb-4 hover:bg-gray-600"
            onClick={() => setCurrentView(null)}
          >
            ← Back
          </button>
          <DislikedMessagesPage />
        </div>
      );
    } else if (currentView === 'update-advocate') {
      return (
        <div className="p-4 w-full h-[calc(100vh-64px)] lg:h-[calc(100vh-177px)] overflow-scroll">
          <button
            className="bg-gray-500 px-4 py-2 rounded text-sm mb-4 hover:bg-gray-600"
            onClick={() => setCurrentView(null)}
          >
            ← Back
          </button>
          <AdvocateManager />
        </div>
      );
    } else if (currentView === 'update-arbitrator') {
      return (
        <div className="p-4 w-full h-[calc(100vh-64px)] lg:h-[calc(100vh-177px)] overflow-scroll">
          <button
            className="bg-gray-500 px-4 py-2 rounded text-sm mb-4 hover:bg-gray-600"
            onClick={() => setCurrentView(null)}
          >
            ← Back
          </button>
          <ArbitratorManager />
        </div>
      );
    }
    return null;
  };

  if (!isAdmin) {
    return (
      <div className="h-screen flex items-center justify-center text-red-600 font-bold text-xl">
        Unauthorized Access
      </div>
    );
  }

  return (
    <div className='w-[100vw] h-[100vh] bg-white'>
      <div className="w-full">
        {/* Header */}
        <div className="relative border-b px-5 py-4 text-center">
          <span className="text-[#2c3e50] font-extrabold text-2xl lg:text-3xl">
            BAIL सेतु ~ <span className='text-[#e74c3c]'> Admin Dashboard</span>
          </span>
          <button
            className="absolute right-5 top-4 lg:hidden text-2xl text-black hover:cursor-pointer"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            ☰
          </button>
        </div>

        {/* Nav Menu */}
        <div className={`lg:flex justify-center w-full ${mobileMenuOpen ? '' : 'hidden'}`}>
          <ul className="flex flex-col py-5 text-xl lg:flex-row lg:space-x-8 lg:py-10 w-full lg:justify-center">

            {/* FAQs Dropdown */}
            <li className="relative w-full lg:w-auto">
              <button
                onClick={() => handleToggle('faqs')}
                className="w-full hover:cursor-pointer text-left py-2 pr-4 pl-3 duration-200 text-gray-700 lg:p-0 flex items-center gap-1"
              >
                FAQs <span className="text-sm">▼</span>
              </button>
              {openDropdown === 'faqs' && (
                <ul className="lg:absolute lg:left-0 lg:mt-2 w-full lg:w-52 flex flex-col bg-white border shadow-md rounded-md z-10 text-sm space-y-1 p-2">
                  <li>
                    <button
                      onClick={() => {
                        closeDropdowns();
                        setCurrentView('answer-faqs');
                      }}
                      className="hover:cursor-pointer block w-full text-left px-4 py-2 hover:text-[#2c3e50] text-gray-700 hover:bg-gray-50 rounded"
                    >
                      Answer FAQs
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        closeDropdowns();
                        setCurrentView('update-faqs');
                      }}
                      className="hover:cursor-pointer block px-4 py-2 hover:text-[#2c3e50] text-gray-700 hover:bg-gray-50 rounded"
                    >
                      Update FAQs
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Manage Message Dropdown */}
            <li className="relative w-full lg:w-auto">
              <button
                onClick={() => handleToggle('messages')}
                className="w-full hover:cursor-pointer text-left py-2 pr-4 pl-3 duration-200 text-gray-700 lg:p-0 flex items-center gap-1"
              >
                Manage Message <span className="text-sm">▼</span>
              </button>
              {openDropdown === 'messages' && (
                <ul className="lg:absolute lg:left-0 lg:mt-2 w-full lg:w-60 flex flex-col bg-white border shadow-md rounded-md z-10 text-sm space-y-1 p-2">
                  <li>
                    <button
                      onClick={() => {
                        closeDropdowns();
                        setCurrentView('reply-messages');
                      }}
                      className="hover:cursor-pointer block px-4 py-2 hover:text-[#2c3e50] text-gray-700 hover:bg-gray-50 rounded"
                    >
                      Reply Messages
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        closeDropdowns();
                        setCurrentView('manage-reported-messages');
                      }}
                      className="hover:cursor-pointer block px-4 py-2 hover:text-[#2c3e50] text-gray-700 hover:bg-gray-50 rounded"
                    >
                      Manage Reported Messages
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        closeDropdowns();
                        setCurrentView('disliked-messages');
                      }}
                      className="hover:cursor-pointer block px-4 py-2 hover:text-[#2c3e50] text-gray-700 hover:bg-gray-50 rounded"
                    >
                      Disliked Messages
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Static Items */}
            <li>
              <button
                onClick={() => {
                  closeDropdowns();
                  setCurrentView('update-advocate');
                }}
                className={`hover:cursor-pointer block py-2 pr-4 pl-3 duration-200 ${isActive('/update-advo') ? 'font-bold text-[#2c3e50]' : 'text-gray-700'
                  } hover:bg-gray-50 lg:p-0`}
              >
                Update Advocate
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  closeDropdowns();
                  setCurrentView('update-arbitrator');
                }}
                className={`hover:cursor-pointer block py-2 pr-4 pl-3 duration-200 ${isActive('/update-arbit') ? 'font-bold text-[#2c3e50]' : 'text-gray-700'
                  } hover:bg-gray-50 lg:p-0`}
              >
                Update Arbitration
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Render inner component like AnswerFaqs */}
      <InnerComponents />
    </div>
  );
};

export default AdminDashboard;
