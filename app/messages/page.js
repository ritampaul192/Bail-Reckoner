/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaThumbsUp, FaThumbsDown, FaComments } from 'react-icons/fa';
import { IoTrashBinSharp } from 'react-icons/io5';
import { MdReport } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import Spinner from '../components/Spinner';
import '../updateProfile/update.css';

export default function ChatPage() {
  const [identityOption, setIdentityOption] = useState('show');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [replyInputs, setReplyInputs] = useState({});
  const [commentsVisible, setCommentsVisible] = useState({});
  const [shouldScroll, setShouldScroll] = useState(false);
  const [reportingId, setReportingId] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [anonymous, setAnonymous] = useState('');
  const [reportError, setReportError] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ... (previous useEffect and other functions remain the same)

  const deleteMessage = async (id) => {
    setMessageToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!messageToDelete) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: messageToDelete }),
      });

      if (!res.ok) throw new Error('Failed to delete message');

      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setShowDeleteConfirm(false);
      setMessageToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setMessageToDelete(null);
  };
  const router = useRouter();
  const messageRefs = useRef({});
  const bottomRef = useRef(null);

  const reportReasons = [
    'Spam',
    'Abusive Language',
    'Hate Speech',
    'False Information',
    'Other'
  ];

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.replace('/signin');
    } else {
      const parsedUser = JSON.parse(user);
      setUserId(parsedUser.userId);
      const formattedName = parsedUser.username
        .split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
      setUserName(formattedName);
      setAnonymous(parsedUser.anonymousUser || "Anonymous");
    }
   
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchMessages().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (shouldScroll) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setShouldScroll(false);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newMsg,
          userId,
          username: identityOption === 'anonymous' ? anonymous : userName,
        }),
      });

      if (!res.ok) throw new Error('Failed to send message');

      const data = await res.json();
      setMessages(prev => [...prev, data]);
      setNewMsg('');
      setShouldScroll(true);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const updateReaction = async (id, action) => {
    try {
      await fetch('/api/messages/react', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, userId }),
      });
      fetchMessages();
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  const reportMessage = async () => {
    if (!reportReason) {
      setReportError('Please select a reason');
      return;
    }

    setIsReporting(true);
    setReportError('');
    setReportSuccess(false);

    try {
      const res = await fetch('/api/messages/report', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: reportingId,
          userId,
          username: userName,
          reason: reportReason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setReportError('You have already reported this message');
        } else {
          setReportError(data.error || 'Failed to report message');
        }
        return;
      }

      // Success handling
      setReportSuccess(true);
      setTimeout(() => {
        setReportingId(null);
        setReportReason('');
        setReportSuccess(false);
        fetchMessages();
      }, 1500);

    } catch (error) {
      console.error('Error reporting message:', error);
      setReportError('An unexpected error occurred');
    } finally {
      setIsReporting(false);
    }
  };

  const submitComment = async (id, comment) => {
    try {
      const res = await fetch('/api/messages/comment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, comment, userId, username: userName }),
      });

      setReplyInputs(prev => ({ ...prev, [id]: '' }));
      fetchMessages();
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) =>
        (b.reactions?.filter(r => r.liked).length || 0) -
        (a.reactions?.filter(r => r.liked).length || 0)
    );
  }, [messages]);

  const toggleComments = (id) => {
    setCommentsVisible(prev => ({ ...prev, [id]: !prev[id] }));
    setReplyInputs(prev => ({ ...prev, [id]: prev[id] ?? '' }));
  };

  // Duplicate deleteMessage function removed to fix redeclaration error.

  const handleReplySubmit = (id) => {
    if (!replyInputs[id]?.trim()) return;
    submitComment(id, replyInputs[id]);
  };

  const handleClickOutside = (e) => {
    Object.entries(commentsVisible).forEach(([id, isVisible]) => {
      if (isVisible && messageRefs.current[id] && !messageRefs.current[id].contains(e.target)) {
        setCommentsVisible(prev => ({ ...prev, [id]: false }));
      }
    });
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [commentsVisible]);

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="p-4 bg-[#2c3e50] text-white font-bold text-xl flex justify-between">
        <div>
          Message Community
          <span className='text-[#e74c3c] text-sm font-extralight'> ~powered By BAIL सेतु</span>
        </div>
        <div>
          <div className="flex items-center mb-2">
            <label htmlFor="identitySelect" className="text-sm mr-2 text-gray-200">
              Do you want to reveal your self while sending messages:
            </label>
            <select
              id="identitySelect"
              value={identityOption}
              onChange={(e) => setIdentityOption(e.target.value)}
              className="px-2 py-1 border border-gray-300 bg-gray-100 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c0392b]"
            >
              <option value="show">Show my name</option>
              <option value="anonymous">Send anonymously</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-h-[calc(100vh-135px)]">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No messages yet. Start the conversation!
          </div>
        )}

        <AnimatePresence>
          {sortedMessages.map((msg) => {
            const isUser = msg.userId === userId;
            const align = isUser ? 'justify-end' : 'justify-start';
            const bgColor = isUser ? 'bg-blue-100' : 'bg-white';
            const userReaction = msg.reactions?.find(r => r.userId === userId) || {};
            const liked = userReaction.liked;
            const disliked = userReaction.disliked;

            return (
              <motion.div
                key={msg._id}
                ref={(el) => (messageRefs.current[msg._id] = el)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className={`w-full flex ${align}`}
              >
                <div className={`${bgColor} p-3 rounded-lg shadow max-w-md w-fit`}>
                  <p className="mb-1 font-semibold text-sm text-gray-700">
                    {isUser ? 'You' : msg.messageSender || 'Anonymous'}
                  </p>
                  <p className="mb-2 text-gray-800">{msg.text}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    <button
                      onClick={() => updateReaction(msg._id, 'like')}
                      className={`flex items-center gap-1 ${liked ? 'text-blue-800' : ''}`}
                    >
                      <FaThumbsUp /> {msg.reactions?.filter(r => r.liked).length || 0}
                    </button>

                    <button
                      onClick={() => updateReaction(msg._id, 'dislike')}
                      className={`flex items-center gap-1 ${disliked ? 'text-red-700' : ''}`}
                    >
                      <FaThumbsDown /> {msg.reactions?.filter(r => r.disliked).length || 0}
                    </button>

                    <button
                      onClick={() => toggleComments(msg._id)}
                      className={`flex items-center gap-1 ${commentsVisible[msg._id] ? "text-pink-400" : ""}`}
                    >
                      <FaComments /> Comments
                    </button>

                    <button
                      onClick={() => setReportingId(msg._id)}
                      className="flex items-center gap-1 hover:text-red-600"
                    >
                      <MdReport /> Report
                    </button>

                    {isUser && (
                      <button
                        onClick={() => deleteMessage(msg._id)}
                        className="flex items-center gap-1 hover:text-orange-500"
                      >
                        <IoTrashBinSharp /> Delete
                      </button>
                    )}
                    {showDeleteConfirm && (
                      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-80 space-y-4">
                          <h3 className="text-lg font-semibold text-red-500">Confirm Deletion</h3>
                          <p>Are you sure you want to delete this message? This action cannot be undone.</p>
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={cancelDelete}
                              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={confirmDelete}
                              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {commentsVisible[msg._id] && (
                    <div className="mt-2 space-y-2">
                      {msg.comments?.length > 0 ? (
                        <div className="text-sm text-gray-700 space-y-1">
                          {msg.comments.map((c, idx) => (
                            <div key={idx} className="flex items-start">
                              <span className="font-semibold text-gray-900 mr-2">{c.username || 'User'}:</span>
                              <span className="text-gray-800">{c.text}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-700">No comments yet.</p>
                      )}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={replyInputs[msg._id] || ''}
                          onChange={(e) =>
                            setReplyInputs((prev) => ({ ...prev, [msg._id]: e.target.value }))
                          }
                          placeholder="Write a comment..."
                          className="px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#c0392b] text-gray-900"
                          onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit(msg._id)}
                        />
                        <button
                          onClick={() => handleReplySubmit(msg._id)}
                          className="px-3 py-2 bg-[#2c3e50] text-white rounded"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />

        {reportingId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-80 space-y-4">
              <h3 className="text-lg font-semibold text-red-500">Select Reason to Report</h3>
              <select
                value={reportReason}
                onChange={(e) => {
                  setReportReason(e.target.value);
                  setReportError('');
                }}
                className="w-full border p-2 rounded text-gray-800"
                disabled={isReporting}
              >
                <option value="">Select a reason</option>
                {reportReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>

              {reportError && (
                <p className="text-red-500 text-sm">{reportError}</p>
              )}

              {reportSuccess && (
                <p className="text-green-500 text-sm">Report submitted successfully!</p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setReportingId(null);
                    setReportError('');
                  }}
                  className="text-gray-500 hover:text-gray-800"
                  disabled={isReporting}
                >
                  Cancel
                </button>
                <button
                  onClick={reportMessage}
                  disabled={isReporting}
                  className={`bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 ${isReporting ? 'opacity-50' : ''}`}
                >
                  {isReporting ? 'Reporting...' : 'Report'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-300">
        <div className="flex gap-2 w-full">
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c0392b] text-gray-900"
          />
          <button
            onClick={sendMessage}
            className="shrink-0 bg-[#2c3e50] hover:bg-[#34495e] text-white px-4 py-2 rounded-lg transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}