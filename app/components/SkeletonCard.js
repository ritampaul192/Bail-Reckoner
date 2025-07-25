import React from 'react';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center text-center animate-pulse h-full aspect-[3/4]">
      <div className="w-20 h-20 bg-gray-200 rounded-full mb-2" />
      <div className="h-4 w-24 bg-gray-200 rounded mb-1" />
      <div className="h-3 w-20 bg-gray-100 rounded mb-1" />
      <div className="h-3 w-16 bg-gray-100 rounded mb-1" />
      <div className="h-3 w-20 bg-gray-100 rounded mb-1" />
      <div className="h-3 w-16 bg-gray-100 rounded mb-2" />
      <div className="flex gap-2 w-full">
        <div className="flex-1 h-6 bg-gray-200 rounded" />
        <div className="flex-1 h-6 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default SkeletonCard; 