'use client';
import { useEffect, useState, useRef } from 'react';
import { FaReply } from 'react-icons/fa';

export default function ReplyMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState({});
  const [loading, setLoading] = useState(false);
  const textareaRefs = useRef({});

  useEffect(() => {
    fetch('/api/messages')
      .then(res => res.json())
      .then(setMessages);
  }, []);

  const resizeTextarea = (id) => {
    const ta = textareaRefs.current[id];
    if (!ta) return;
    ta.style.height = '54px';
    ta.style.height = `${ta.scrollHeight}px`;
  };

  const handleReply = async (id) => {
    const text = reply[id]?.trim();
    if (!text) return;

    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const username = user.username || 'Admin';
    const userId = user.userId || 'admin';

    const res = await fetch('/api/messages/comment', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, comment: text, userId, username }),
    });

    if (res.ok) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === id
            ? {
                ...msg,
                comments: [
                  ...(msg.comments || []),
                  { text, createdAt: new Date(), username },
                ],
              }
            : msg
        )
      );
      setReply((prev) => ({ ...prev, [id]: '' }));
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#2c3e50]">Reply to Messages</h2>
      {messages.map((msg) => (
        <div key={msg._id} className="border rounded-md p-4 mb-4 bg-gray-50">
          <div className="mb-2">
            <p className="text-gray-800 font-semibold">{msg.messageSender}</p>
            <p className="text-sm text-gray-600">{msg.text}</p>
          </div>

          {msg.comments?.length > 0 && (
            <div className="mb-2 text-sm text-blue-800 bg-blue-50 p-2 rounded">
              <strong>Replies:</strong>
              <ul className="list-disc ml-4 mt-1">
                {msg.comments.map((c, idx) => (
                  <li key={idx}>
                    <span className="font-semibold text-gray-800">{c.username || 'User'}:</span> {c.text} <span className="text-xs text-gray-400">({new Date(c.createdAt).toLocaleString()})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <textarea
              ref={el => textareaRefs.current[msg._id] = el}
              value={reply[msg._id] || ''}
              onChange={(e) => {
                setReply((prev) => ({ ...prev, [msg._id]: e.target.value }));
                resizeTextarea(msg._id);
              }}
              placeholder="Type your reply..."
              className={`w-full text-gray-700 h-[54px] border border-[#868686] rounded-md p-3 resize-none z-0 overflow-hidden outline-none transition duration-200 focus:shadow-md focus:border-[#868686] focus:ring focus:ring-gray-200`}
            />
            <button
              onClick={() => handleReply(msg._id)}
              disabled={loading}
              className="flex items-center gap-2 bg-[#2c3e50] text-white px-4 py-2 rounded hover:bg-[#34495e]"
            >
              <FaReply /> {loading ? 'Sending...' : 'Send Reply'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
