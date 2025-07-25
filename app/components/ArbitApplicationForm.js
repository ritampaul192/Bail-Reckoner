'use client';

import { useState, useEffect } from 'react';

export default function ApplicationDrawer({ open, onClose, arbitrator, onSubmit, username }) {
  const [form, setForm] = useState({
    applicant: '',
    caseTitle: '',
    caseDesc: '',
    demand: '',
    hearingDate: '',
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (open) {
      if (open && username) {
        const formattedName = username
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');// ← fetch from localStorage
        setForm({
          applicant: formattedName,
          caseTitle: '',
          caseDesc: '',
          demand: '',
          hearingDate: '',
        });
        setMessage('');
      }
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        arbitratorId: arbitrator._id,
        arbitratorName: arbitrator.name,
      }),
    });

    const result = await response.json();
    if (result.success) {
      const fullData = {
        ...form,
        arbitratorName: arbitrator.name,
        arbitratorId: arbitrator._id,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
      };
      onSubmit?.(fullData);
      setMessage('✅ Application submitted!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setMessage('❌ Failed: ' + result.message);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
    >
      <div
        className={`absolute right-0 top-0 h-full w-full sm:w-[450px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Apply to {arbitrator?.name}</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 text-gray-700">
          <input required readOnly className="border px-3 py-2 rounded-lg bg-gray-100" value={form.applicant} />
          <input
            required
            className="border px-3 py-2 rounded-lg"
            placeholder="Case Title"
            value={form.caseTitle}
            onChange={(e) => setForm({ ...form, caseTitle: e.target.value })}
          />
          <textarea
            required
            className="border px-3 py-2 rounded-lg"
            placeholder="Case Description"
            rows={4}
            value={form.caseDesc}
            onChange={(e) => setForm({ ...form, caseDesc: e.target.value })}
          />
          <input
            required
            className="border px-3 py-2 rounded-lg"
            placeholder="Other Party's Demand"
            value={form.demand}
            onChange={(e) => setForm({ ...form, demand: e.target.value })}
          />
          <label className='flex gap-1 items-baseline'>Case Hearing Date:
            <input
              required
              type="date"
              className="border px-3 py-2 rounded-lg"
              value={form.hearingDate}
              onChange={(e) => setForm({ ...form, hearingDate: e.target.value })}
            />
          </label>
          {message && (
            <div className="text-sm text-blue-600">{message}</div>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}
