import React from 'react';
import Spinner from './Spinner';
import StarRating from './StarRating';
import { VerifiedBadge } from './AdvocateCard';

function ModalBackdrop({ children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f9f9f9]/80 backdrop-blur-sm" style={{background: 'rgba(249,249,249,0.8)'}}>
      {children}
    </div>
  );
}

function AdvocateModal({ advocate, onClose, loading }) {
  if (!advocate && !loading) return null;
  return (
    <ModalBackdrop>
      <div className="bg-white/70 backdrop-blur-lg border border-[#ecf0f1] shadow-[0_8px_32px_0_rgba(44,62,80,0.10)] rounded-2xl p-4 sm:p-6 w-full max-w-4xl relative animate-fadeIn scale-95 animate-modalIn mx-2 flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col-reverse sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left flex-1 overflow-y-auto min-h-0">
            <div className="flex-1 w-full sm:w-auto min-h-[120px] max-h-[60vh] overflow-y-auto mt-6 sm:mt-0">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Bio</h3>
              <p className="text-base leading-relaxed font-medium whitespace-pre-line text-gray-900">{advocate.bio}</p>
            </div>
            <div className="flex flex-col items-center sm:items-start flex-shrink-0 w-full sm:w-64 min-w-0 min-h-0">
              <div className="w-24 h-24 bg-gray-200 rounded-full mb-3 flex items-center justify-center mx-auto sm:mx-0 flex-shrink-0" style={{minHeight: '6rem', minWidth: '6rem'}}>
                <span className="text-4xl text-gray-400">👤</span>
              </div>
              <h2 className="font-bold text-2xl mb-1 flex items-center justify-center sm:justify-start text-gray-900">
                {advocate.name}
                {advocate.verified && <VerifiedBadge />}
              </h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-1 mb-2">
                {advocate.practiceAreas && advocate.practiceAreas.map(area => (
                  <span key={area} className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">{area}</span>
                ))}
              </div>
              <div className="text-gray-500 mb-2">{advocate.city} | {advocate.court}</div>
              <div className="flex items-center justify-center sm:justify-start mb-2">
                <StarRating rating={advocate.rating} />
                <span className="text-gray-500 ml-1">({advocate.rating})</span>
              </div>
              <div className="mb-1 text-sm text-gray-800">Experience: <span className="font-medium text-gray-900">{advocate.experience} yrs</span></div>
              <div className="mb-1 text-xs text-gray-800">{advocate.specialization}</div>
              <div className="mb-1 text-sm text-gray-800">Bar Reg. No: <span className="font-mono text-gray-900">{advocate.barId}</span></div>
              <div className="mb-1 text-sm text-gray-800">Languages: <span className='text-gray-800'>{advocate.languages.join(', ')}</span></div>
              <div className="mb-1 text-sm text-gray-800">Email: <a href={`mailto:${advocate.email}`} className="underline break-all text-gray-900">{advocate.email}</a></div>
              <div className="mb-3 text-sm text-gray-800">WhatsApp: <a href={`https://wa.me/${advocate.whatsapp.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-500 underline break-all">{advocate.whatsapp}</a></div>
              <div className="flex gap-2 w-full mt-2">
                <a
                  href={`mailto:${advocate.email}`}
                  className="decoration-0 text-xs flex-1 px-2 py-1 bg-[#c55c44] rounded hover:bg-[#ff5f7f] transition text-center text-gray-300"
                >
                  Email
                </a>
                <a
                  href={`https://wa.me/${advocate.whatsapp.replace(/[^\d]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-xs text-center"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModalBackdrop>
  );
}

export default AdvocateModal; 