import React from 'react';

function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        className="px-3 py-1 rounded bg-gray-200 text-gray-600 disabled:opacity-50"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        className="px-3 py-1 rounded bg-gray-200 text-gray-600 disabled:opacity-50"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination; 