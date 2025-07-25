import React from 'react';

export default function ArbitrationNav({ currentView, setView }) {
  const linkClass = (view) =>
    `cursor-pointer hover:text-blue-600 transition ${
      currentView === view ? 'text-blue-700 font-semibold underline' : 'text-gray-800'
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 shadow z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <span className="font-bold text-lg text-gray-800">
          Arbit. Finder <span className='text-[#e74c3c] text-sm font-extralight'>~powered by BailSetu</span>
        </span>
        <div className="flex gap-6 text-base font-medium">
          <span onClick={() => setView('search')} className={linkClass('search')}>Search Ar.</span>
          <span onClick={() => setView('wishlist')} className={linkClass('wishlist')}>Your Wishlist</span>
          <span onClick={() => setView('application')} className={linkClass('application')}>Your Application</span>
        </div>
      </div>
    </nav>
  );
}
