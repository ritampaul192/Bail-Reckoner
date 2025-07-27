'use client';

import { useEffect, useState } from 'react';
import { IoTrashBinSharp } from 'react-icons/io5';
import { FaFlag } from 'react-icons/fa';

export default function ManageReportedMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchReportedMessages();
  }, []);

  const fetchReportedMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/messages/reported');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching reported messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setMessageToDelete(id);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMessageToDelete(null);
  };

  const deleteMessage = async () => {
    if (!messageToDelete) return;
    
    try {
      setLoading(true);
      const res = await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: messageToDelete }),
      });

      const data = await res.json();
      if (data.success) {
        fetchReportedMessages();
      } else {
        alert(data.error || 'Failed to delete message');
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('Error deleting message');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setMessageToDelete(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-[#2c3e50] mb-6">
        Manage Reported Messages
      </h2>

      {loading && messages.length === 0 ? (
        <p className="text-gray-500">Loading reported messages...</p>
      ) : messages.length === 0 ? (
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
                  onClick={() => confirmDelete(msg._id)}
                  disabled={loading}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Confirm Deletion</h3>
            <p className="mb-6 text-gray-700">Are you sure you want to delete this message? This action cannot be undone.</p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={deleteMessage}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
