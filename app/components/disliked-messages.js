// FRONTEND: pages/admin/disliked-messages.js
"use client";

import { useEffect, useState } from "react";
import { IoTrashBinSharp } from "react-icons/io5";

export default function DislikedMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDislikedMessages();
  }, []);

  const fetchDislikedMessages = async () => {
    try {
      const res = await fetch("/api/messages/disliked");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Error fetching disliked messages:", err);
    }
  };

  const deleteMessage = async (id) => {
    try {
      setLoading(true);
      const res = await fetch("/api/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Message deleted");
        fetchDislikedMessages();
      } else {
        alert(result.error || "Failed to delete message");
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-[#2c3e50] mb-6">Messages with 50+ Dislikes</h2>

      {messages.length === 0 ? (
        <p className="text-gray-500">No messages found with more than 50 dislikes.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg._id} className="p-4 border rounded bg-red-50">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold text-gray-800">{msg.messageSender || "Unknown"}</p>
                  <p className="text-sm text-gray-600">{msg.text}</p>
                  <p className="text-sm text-red-700 mt-1">
                    Dislikes: <strong>{msg.reactions?.filter(r => r.disliked).length}</strong>
                  </p>
                </div>
                <button
                  onClick={() => deleteMessage(msg._id)}
                  disabled={loading}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  <IoTrashBinSharp /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
