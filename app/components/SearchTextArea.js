'use client';

import React, { useEffect, useRef, forwardRef } from 'react';

const SearchTextArea = forwardRef(({ value, setValue, placeholder }, ref) => {
  const localRef = useRef(null);
  const textareaRef = ref || localRef;

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = '54px';
    ta.style.height = `${ta.scrollHeight}px`;
  }, [value]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full h-[54px] text-gray-700 border border-[#868686] rounded-md p-3 resize-none z-0 overflow-hidden outline-none transition duration-200 focus:shadow-md mb-2"
    />
  );
});

SearchTextArea.displayName = 'SearchTextArea';
export default SearchTextArea;
