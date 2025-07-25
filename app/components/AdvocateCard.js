'use client'
import React from 'react';
import StarRating from './StarRating';
import { FaWhatsapp } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { MdVerified } from "react-icons/md";

function getStarColor(rating) {
  if (rating > 4.5) return 'text-green-500';
  if (rating >= 4) return 'text-yellow-400';
  if (rating >= 3.5) return 'text-orange-400';
  return 'text-red-500';
}

function VerifiedBadge() {
  return (
    <span className="ml-2 inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
      <MdVerified className='text-blue-400' />
      Verified
    </span>
  );
}

function AdvocateCard({ advocate, onClick }) {
  const shownPracticeAreas = advocate.practiceAreas?.slice(0, 3) || [];
  const morePracticeAreas = (advocate.practiceAreas?.length || 0) - shownPracticeAreas.length;
  const shownCourts = advocate.court && Array.isArray(advocate.court) ? advocate.court.slice(0, 3) : [advocate.court];
  const moreCourts = advocate.court && Array.isArray(advocate.court) ? advocate.court.length - shownCourts.length : 0;

  const ratingColor = getStarColor(advocate.rating);

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition h-full min-h-[420px] md:aspect-[3/4] w-full" onClick={onClick} tabIndex={0} role="button" aria-label={`View details for ${advocate.name}`}> 
      <div className="w-20 h-20 bg-gray-200 rounded-full mb-2 flex items-center justify-center flex-shrink-0 flex-grow-0 min-h-20 min-w-20">
        <span className="text-3xl text-gray-400">👤</span>
      </div>
      <h3 className="font-semibold text-lg mb-1 flex items-center justify-center text-gray-900 w-full truncate" title={advocate.name}>
        {advocate.name}
        {advocate.verified && <VerifiedBadge />}
      </h3>
      <div className="flex flex-wrap justify-center gap-1 mb-2 w-full min-h-[2.5rem]">
        {shownPracticeAreas.map(area => (
          <span key={area} className="bg-green-100 text-green-700 w-fit h-fit text-xs px-2 py-0.5 rounded-full font-medium max-w-[6rem] whitespace-nowrap overflow-hidden text-ellipsis" title={area}>{area}</span>
        ))}
        {morePracticeAreas > 0 && (
          <span className="bg-gray-200 text-gray-700 w-fit h-fit text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap">+{morePracticeAreas} more</span>
        )}
      </div>
      <div className="text-sm text-gray-800 mb-1 w-full truncate" title={shownCourts.join(', ')}>
        {shownCourts.join(', ')}{moreCourts > 0 ? ` +${moreCourts} more` : ''}
      </div>
      <div className="flex items-center justify-center mb-1 w-full min-h-[2rem]">
        <StarRating rating={advocate.rating} />
        <span
          className={`ml-1 font-semibold ${ratingColor}`}
          aria-label={`Rating: ${advocate.rating.toFixed(1)} out of 5`}
        >
          ({advocate.rating.toFixed(1)})
        </span>
      </div>
      <div className="text-sm mb-1 text-gray-800 w-full truncate" title={`Experience: ${advocate.experience} yrs`}>Experience: <span className="font-medium text-gray-900">{advocate.experience} yrs</span></div>
      <div className="text-xs text-blue-600 mb-2 w-full truncate" title={advocate.specialization}>{advocate.specialization}</div>
      <div className="flex gap-6 w-full mt-auto justify-center">
        <a
          href={`mailto:${advocate.email}`}
          onClick={e => e.stopPropagation()}
          className="flex items-center justify-center"
          aria-label="Email"
          title="Email"
          tabIndex={-1}
        >
          <CiMail className='text-gray-500 text-2xl' />
        </a>
        <a
          href={`https://wa.me/${advocate.whatsapp.replace(/[^\d]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex items-center justify-center"
          aria-label="WhatsApp"
          title="WhatsApp"
          tabIndex={-1}
        >
         <FaWhatsapp className="text-green-500 text-2xl" />
        </a>
      </div>
    </div>
  );
}

export default AdvocateCard;
export { VerifiedBadge }; 