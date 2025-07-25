'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaThumbsUp, FaThumbsDown, FaComments } from 'react-icons/fa';

export default function ChatMessage({
  msg,
  userId,
  updateReaction,
  submitComment,
  replyInputs,
  setReplyInputs,
  commentsVisible,
  setCommentsVisible,
  messageRefs,
}) {
  const [messageSender, setMessageSender] = useState('');
  const isUser = msg.userId === userId;
  const align = isUser ? 'justify-end' : 'justify-start';
  const bgColor = isUser ? 'bg-blue-100' : 'bg-white';
  const textColor = isUser ? 'text-gray-900' : 'text-gray-800';
  const userReaction = msg.reactions?.find(r => r.userId === userId) || {};
  const liked = userReaction.liked || false;
  const disliked = userReaction.disliked || false;

  useEffect(() => {
    async function fetchUsername() {
      try {
        const res = await fetch('/userBeUserId', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: msg.userId }),
        });
        const sender = await res.json();
        if (msg.userId !== userId) setMessageSender(sender.username || 'User');
        else setMessageSender('You');
      } catch {
        setMessageSender('User');
      }
    }
    fetchUsername();
  }, [msg.userId, userId]);

  const toggleComments = () => {
    setCommentsVisible(prev => ({ ...prev, [msg._id]: !prev[msg._id] }));
    setReplyInputs(prev => ({ ...prev, [msg._id]: prev[msg._id] ?? '' }));
  };

  const handleReplySubmit = () => {
    if (!replyInputs[msg._id]?.trim()) return;
    submitComment(msg._id, replyInputs[msg._id]);
  };

  return (
    <motion.div
      ref={el => (messageRefs.current[msg._id] = el)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={`w-full flex ${align}`}
    >
      <div className={`${bgColor} p-3 rounded-lg shadow max-w-md w-fit ${textColor}`}>
        <p className="mb-2">{messageSender}</p>
        <p className="mb-2">{msg.text}</p>

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
          <button onClick={toggleComments} className="flex items-center gap-1">
            <FaComments /> Comments
          </button>
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
                onChange={(e) => setReplyInputs((prev) => ({ ...prev, [msg._id]: e.target.value }))}
                placeholder="Write a comment..."
                className="px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#c0392b] text-gray-900"
              />
              <button
                onClick={handleReplySubmit}
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
}
