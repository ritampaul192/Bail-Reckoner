'use client';

import { useEffect, useState } from 'react';

export default function ApplicationsLog({ applicant }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🧠 Get applicant name from localStorage and format it
    const username = localStorage.getItem('user') || '';

    if (!applicant) return;

    // 🔁 Fetch applications from backend
    fetch('/api/form', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicant }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setApplications(data.data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Applications</h2>

      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : applications.length === 0 ? (
        <div className="text-gray-500 text-center">
          You haven't submitted any applications yet.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {applications.map((app, index) => (
            <div key={index} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2">
              <div className="text-lg font-semibold text-gray-800">{app.caseTitle}</div>
              <div className="text-sm text-gray-600">
                <strong>Arbitrator:</strong> {app.arbitratorName}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Hearing Date:</strong> {app.hearingDate}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Demand:</strong> {app.demand}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Description:</strong> {app.caseDesc}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-white text-xs font-semibold
                  ${app.status === 'Accepted'
                      ? 'bg-green-500'
                      : app.status === 'Rejected'
                        ? 'bg-red-500'
                        : app.status === 'Cancelled'
                          ? 'bg-gray-500'
                          : app.status === 'Pending Cancellation'
                            ? 'bg-yellow-500 text-gray-900'
                            : 'bg-yellow-500'
                    }`}
                >
                  {app.status}
                </span>
                {app.cancelReason && (
                  <span className="text-xs text-gray-500">
                    Reason: {app.cancelReason}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
