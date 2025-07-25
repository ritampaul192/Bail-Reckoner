'use client';

import { useEffect, useState } from 'react';
import { IoTrashBinSharp } from 'react-icons/io5';
import { FaFlag } from 'react-icons/fa';

export default function ManageReportedMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportedMessages();
  }, []);

  const fetchReportedMessages = async () => {
    try {
      const res = await fetch('/api/messages/reported');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching reported messages:', err);
    }
  };

  const deleteMessage = async (id) => {
    try {
      setLoading(true);
      const res = await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }), // ✅ Send as { id: "..." }
      });

      const data = await res.json();
      if (data.success) {
        alert('Message deleted successfully');
        fetchReportedMessages();
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('Error deleting message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-[#2c3e50] mb-6">
        Manage Reported Messages
      </h2>

      {messages.length === 0 ? (
        <p className="text-gray-500">No reported messages found.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg._id} className="p-4 border rounded bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold text-gray-800">
                    {msg.messageSender || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-600">{msg.text}</p>
                </div>
                <button
                  onClick={() => deleteMessage(msg._id)}
                  disabled={loading}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  <IoTrashBinSharp /> Delete
                </button>
              </div>

              <div className="mt-2 text-sm text-gray-700 bg-red-100 p-2 rounded">
                <FaFlag className="inline mr-2 text-red-600" />
                <strong>{msg.reports?.length || 0}</strong> report
                {msg.reports?.length === 1 ? '' : 's'} by:
                <ul className="list-disc ml-6 mt-1">
                  {msg.reports?.map((r, idx) => (
                    <li key={idx}>
                      <span className="font-semibold">
                        {r.username || 'Unknown'}
                      </span>{' '}
                      at {new Date(r.createdAt).toLocaleString()} — Reason:{' '}
                      <span className="italic text-red-600">{r.reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
