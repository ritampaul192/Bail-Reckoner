'use client';
import React, { useId } from 'react';

// Utility to color the stars
function getStarColor(rating) {
  if (rating > 4.5) return 'text-green-500';
  if (rating >= 4) return 'text-yellow-400';
  if (rating >= 3.5) return 'text-orange-400';
  return 'text-red-500';
}

// Star SVG path (a nice 5-pointed star)
const STAR_PATH =
  "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z";

function StarRating({ rating, max = 5 }) {
  const baseId = useId();
  const rounded = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(rounded);
  const hasHalf = rounded % 1 !== 0;
  const emptyStars = max - fullStars - (hasHalf ? 1 : 0);
  const colorClass = getStarColor(rating);
  const stars = [];
  let starIndex = 1;

  // Full stars
  for (let i = 0; i < fullStars; i++, starIndex++) {
    stars.push(
      <svg
        key={`full-${starIndex}`}
        viewBox="0 0 20 20"
        className={`w-5 h-5 inline ${colorClass}`}
        preserveAspectRatio="xMidYMid meet"
        fill="currentColor"
      >
        <path d={STAR_PATH} />
      </svg>
    );
  }

  // Half star
  if (hasHalf) {
    const gradId = `${baseId}-half-${starIndex}`;
    stars.push(
      <svg
        key={`half-${starIndex}`}
        viewBox="0 0 20 20"
        className={`w-5 h-5 inline ${colorClass}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={gradId}>
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path fill={`url(#${gradId})`} stroke="#ccc" strokeWidth="0.5" d={STAR_PATH} />
      </svg>
    );
    starIndex++;
  }

  // Empty stars
  for (let i = 0; i < emptyStars; i++, starIndex++) {
    stars.push(
      <svg
        key={`empty-${starIndex}`}
        viewBox="0 0 20 20"
        className="w-5 h-5 inline text-gray-300"
        preserveAspectRatio="xMidYMid meet"
        fill="currentColor"
      >
        <path d={STAR_PATH} />
      </svg>
    );
  }

  return <span>{stars}</span>;
}

export default StarRating;
