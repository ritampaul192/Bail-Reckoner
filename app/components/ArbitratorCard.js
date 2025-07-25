import React from 'react';

export default function ArbitratorCard({ arbitrator, onClick, StarRating }) {
  return (
    <div onClick={onClick} className="bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center p-5 gap-2 min-h-[260px] group">
      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-3xl mb-2">
        {arbitrator.avatar ? (
          <img src={arbitrator.avatar} alt={arbitrator.name} className="w-16 h-16 rounded-full object-cover" />
        ) : (
          <span role="img" aria-label="profile">👤</span>
        )}
      </div>
      <div className="font-semibold text-lg text-gray-900 truncate w-full text-center">{arbitrator.name}</div>
      <div className="text-sm text-gray-500 text-center truncate w-full">{arbitrator.title}</div>
      <div className="text-xs text-gray-400 mb-1">Cases Resolved: <span className="font-bold text-blue-700">{arbitrator.casesResolved}+</span></div>
      <div className="flex items-center gap-1 justify-center">
        {StarRating && <StarRating rating={arbitrator.rating} />}
      </div>
      <div className="text-xs text-gray-400">{arbitrator.experience} yrs exp • {arbitrator.languages.join(', ')}</div>
    </div>
  );
}