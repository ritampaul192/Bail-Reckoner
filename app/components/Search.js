'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { useRouter } from 'next/navigation';

const Search = ({ inputRef, onAction }) => {
  const [value, setValue] = useState('');
  const [buttonDown, setButtonDown] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [hisCard, setHisCard] = useState([]);
  const [langu, setLangu] = useState('en');
  const textareaRef = useRef(null);
  const router = useRouter();

  // Load valid history on mount
  useEffect(() => {
    const cache = JSON.parse(localStorage.getItem('searchKeys')) || [];
    const lang = localStorage.getItem('bailLang') || 'en';
    setLangu(lang);

    const valid = cache.filter(term => {
      const item = localStorage.getItem(`bail-result-${term}`);
      if (!item) return false;
      try {
        const parsed = JSON.parse(item);
        return Array.isArray(parsed) && parsed.length > 0;
      } catch (e) {
        return false;
      }
    });

    setHisCard(valid);
  }, []);

  // Resize textarea
  const resizeTextarea = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = '54px';
    ta.style.height = `${ta.scrollHeight}px`;
    setButtonDown(ta.scrollHeight > 54);
  };
  useEffect(resizeTextarea, [value]);

  const handleInputChange = e => setValue(e.target.value);
  const handleFocus = () => setHistoryVisible(true);
  const handleBlur = () => setTimeout(() => setHistoryVisible(false), 100);

  const submitSearch = e => {
    e.preventDefault();
    const term = value.trim();
    if (!term) return;

    const cache = JSON.parse(localStorage.getItem('searchKeys')) || [];
    const filtered = cache.filter(t => t !== term);
    filtered.unshift(term);
    if (filtered.length > 10) filtered.pop();
    localStorage.setItem('searchKeys', JSON.stringify(filtered));
    setHisCard(filtered);

    router.push(`/result?message=${encodeURIComponent(term)}&lang=${langu}`);
    setHistoryVisible(false);
  };

  const searchClick = term => {
    setValue(term);
    resizeTextarea();
    setHistoryVisible(false);
  };

  const T = {
    en: {
      heading: 'Find Your Section',
      sub: `Your Guide to Bail Laws & Rights in India
Navigating the legal system can be confusing — especially when it comes to bail.
We built Bail Reckoner to simplify this process, empower individuals, and promote fair access to justice.`,
      placeholder: 'Start typing...',
    },
    hi: {
      heading: 'अपना सेक्शन खोजें',
      sub: `ज़मानत कानून और अधिकारों की जानकारी के लिए आपका गाइड।
कानूनी प्रक्रिया को समझना मुश्किल हो सकता है — विशेषकर ज़मानत के मामले में।
हमने Bail Reckoner इसे सरल बनाने, व्यक्तियों को सशक्त बनाने, और न्याय तक समान पहुँच सुनिश्चित करने के लिए बनाया है।`,
      placeholder: 'यहाँ टाइप करें...',
    }
  };

  const txt = T[langu] || T.en;

  return (
    <section className="hero">
      <div className="hero-content">
        <h2>{txt.heading}</h2>
        <p style={{ whiteSpace: 'pre-line' }}>{txt.sub}</p>
        <div className="search-container">
          <form
            onSubmit={submitSearch}
            className={`search-form relative ${buttonDown ? 'flex flex-col justify-center gap-2' : 'flex h-[50px]'}`}
          >
            <textarea
              ref={el => {
                textareaRef.current = el;
                if (inputRef) inputRef.current = el;
              }}
              value={value}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={txt.placeholder}
              className={`w-full sm:w-[528.4px] h-[54px] border border-[#868686] rounded-md p-3 resize-none z-0 overflow-hidden outline-none transition duration-200 focus:shadow-md ${buttonDown
                ? 'focus:border-[#868686] focus:ring focus:ring-gray-200'
                : 'focus:border-[#868686] focus:border-r-0 focus:ring focus:ring-gray-200 focus:shadow-md'
                }`}
            />
            <ul className={`absolute top-full mt-2 w-full p-1 bg-[#fdfbe9] text-gray-700 rounded shadow-xl z-10 ${historyVisible && hisCard.length ? 'block' : 'hidden'
              }`}>
              {hisCard.map(term => (
                <li
                  key={term}
                  onMouseDown={() => searchClick(term)}
                  className="p-2 flex hover:bg-[#f0dbd8] cursor-pointer border-b border-gray-300"
                >
                  {term}
                </li>
              ))}
            </ul>
            <button
              type="submit"
              onClick={() => onAction?.('search')}
              id="search-btn"
              className={`bg-[#2c7699] text-white flex items-center justify-center ${buttonDown
                ? 'sm:w-[528.4px] rounded-md mt-2'
                : 'relative sm:absolute right-6 w-[51px] h-[51px] rounded-r-sm'
                }`}
            >
              <FaSearch />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Search;
