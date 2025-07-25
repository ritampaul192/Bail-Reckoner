'use client';

import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FaSearch } from 'react-icons/fa';
import SearchTextArea from './SearchTextArea';

export default function UpdateFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newQuestion, setNewQuestion] = useState('');
  const [newQuestionHi, setNewQuestionHi] = useState('');

  const enRef = useRef(null);
  const hiRef = useRef(null);

  useEffect(() => {
    fetch('/api/faqs')
      .then((res) => res.json())
      .then((data) => setFaqs(data));
  }, []);

  const addFaq = async () => {
    if (!newQuestion.trim() || !newQuestionHi.trim()) return;

    setLoading(true);
    const res = await fetch('/api/faqs/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question_en: newQuestion.trim(),
        question_hi: newQuestionHi.trim(),
      }),
    });

    const saved = await res.json();

    if (!res.ok) {
      alert(`Failed to add FAQ: ${saved.error || 'Unknown error'}`);
      setLoading(false);
      return;
    }

    setFaqs((prev) => [...prev, saved]);
    setNewQuestion('');
    setNewQuestionHi('');
    setLoading(false);
  };


  const deleteFaq = async (id) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    setLoading(true);

    const res = await fetch('/api/faqs/add', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    const result = await res.json();

    if (!res.ok) {
      alert(`Failed to delete FAQ: ${result.error || 'Unknown error'}`);
      setLoading(false);
      return;
    }

    setFaqs((prev) => prev.filter((f) => f._id !== id));
    setLoading(false);
  };


  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-[#2c3e50]">Update FAQs</h2>

      <div className="mb-6">
        <SearchTextArea
          ref={enRef}
          value={newQuestion}
          setValue={setNewQuestion}
          placeholder="New question (English)"
        />
        <SearchTextArea
          ref={hiRef}
          value={newQuestionHi}
          setValue={setNewQuestionHi}
          placeholder="New question (Hindi)"
        />
        <button
          onClick={addFaq}
          disabled={loading}
          className="bg-[#2c3e50] text-white px-4 py-2 rounded hover:bg-[#34495e] mt-2"
        >
          {loading ? 'Adding...' : 'Add FAQ'}
        </button>
      </div>

      <div>
        {faqs.map((faq, index) => (
          <div key={faq._id || uuidv4()} className="border rounded p-4 mb-4 bg-gray-50">
            <p className="font-semibold text-gray-700">Q{index + 1} (EN): {faq.question?.en}</p>
            <p className="font-semibold text-sm text-gray-700 mt-1">Q{index + 1} (HI): {faq.question?.hi}</p>
            <button
              onClick={() => deleteFaq(faq._id)}
              className="mt-2 text-sm text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
