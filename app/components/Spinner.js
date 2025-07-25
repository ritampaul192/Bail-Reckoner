import React from 'react';

function Spinner() {
  return (
    <div className='w-[100vw] h-[100vh] grid bg-white place-items-center'>
      <div className="flex flex-col items-center justify-center h-40">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-2"></div>
        <span className="font-medium text-gray-900">Loading...</span>
      </div>
    </div>
  );
}

export default Spinner; 