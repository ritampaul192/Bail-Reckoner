'use client';

import React, { useState, useEffect } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { FaBalanceScale } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const translations = {
  en: {
    bridge: 'Your bridge to legal freedom',
    youSearched: 'You searched:',
    ipcHeader: 'The IPC Sections are:',
    section: 'Section',
    subSection: 'Sub_Section',
    description: 'Description',
    punishment: 'Punishment',
    bailable: 'Bailable',
    bailYes: 'Yes',
    bailNo: 'No',
    bailType: 'Type of Bail',
    bailTime: 'Bail Time Limit',
    moreInfo: 'More Info',
    backToHome: 'Back To Home',
    loadingInsights: 'Loading legal insights...'
  },
  hi: {
    bridge: 'आपकी कानूनी स्वतंत्रता की सेतु',
    youSearched: 'आपने खोजा:',
    ipcHeader: 'आईपीसी धाराएं:',
    section: 'धारा',
    subSection: 'उप-धारा',
    description: 'विवरण',
    punishment: 'सजा',
    bailable: 'जमानती',
    bailYes: 'हाँ',
    bailNo: 'नहीं',
    bailType: 'जमानत का प्रकार',
    bailTime: 'जमानत की समय-सीमा',
    moreInfo: 'और जानकारी',
    backToHome: 'मुखपृष्ठ पर जाएं',
    loadingInsights: 'कानूनी जानकारियाँ लोड हो रही हैं...'
  }
};

export default function Result() {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [progress, setProgress] = useState(0);
  const [trivia, setTrivia] = useState('');
  const [icon, setIcon] = useState('⚖️');
  const [lang, setLang] = useState('en');

  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get('message');

  const triviaList = [
    'In India, bail is a constitutional right under Article 21.',
    'Anticipatory bail is covered under Section 438 CrPC.',
    'The concept of bail traces back to medieval England.',
    "Supreme Court: 'Bail is the rule, jail the exception.'",
    'Juveniles are usually granted bail by default.',
    'Bail can be denied to prevent evidence tampering.',
    'Police can grant bail for bailable offences directly.'
  ];

  const iconList = ['⚖️', '📜', '🏛️', '⏳', '🧑‍⚖️', '🪪', '🔍', '📂'];

  useEffect(() => {
    const savedLang = localStorage.getItem('bailLang') || 'en';
    setLang(savedLang);
  }, []);

  const t = translations[lang];

  useEffect(() => {
    let progressInterval, triviaInterval, iconInterval;

    const updateProgress = () => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.random() * 5 + 2, 98);
        if (Math.floor(next) % 20 < 3) {
          setTrivia(triviaList[Math.floor(Math.random() * triviaList.length)]);
        }
        return next;
      });
    };

    if (loading) {
      setProgress(0);
      setTrivia(triviaList[Math.floor(Math.random() * triviaList.length)]);
      progressInterval = setInterval(updateProgress, 2000);

      triviaInterval = setInterval(() => {
        setTrivia(triviaList[Math.floor(Math.random() * triviaList.length)]);
      }, 4000);

      iconInterval = setInterval(() => {
        setIcon((prev) => {
          let next;
          do {
            next = iconList[Math.floor(Math.random() * iconList.length)];
          } while (next === prev);
          return next;
        });
      }, 1000);
    }

    return () => {
      clearInterval(progressInterval);
      clearInterval(triviaInterval);
      clearInterval(iconInterval);
    };
  }, [loading]);

  useEffect(() => {
    if (!message) return;

    async function fetchData() {
      const cacheKey = `bail-result-${message}`;
      const cached = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null;

      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const formatted = parsed.map(item => ({
              ...item,
              id: uuidv4(),
              isCollapsed: true,
            }));
            setCards(formatted);
            return;
          }
        } catch (err) {
          console.warn("Invalid cache format:", err);
        }
      }

      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        });

        const data = await response.json();
        const result = data.sections;

        if (Array.isArray(result)) {
          const updatedCards = result.map(item => ({
            ...item,
            id: uuidv4(),
            isCollapsed: true,
          }));
          setCards(updatedCards);

          localStorage.setItem(cacheKey, JSON.stringify(result));

          let keys = JSON.parse(localStorage.getItem('searchKeys') || '[]');
          if (!keys.includes(message)) {
            keys.unshift(message);
            if (keys.length > 10) {
              const removedKey = keys.pop();
              localStorage.removeItem(`bail-result-${removedKey}`);
            }
            localStorage.setItem('searchKeys', JSON.stringify(keys));
          }
        } else {
          setCards([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [message]);

  function toggleView(id) {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, isCollapsed: !card.isCollapsed } : card
      )
    );
  }

  return (
    <div className="text-gray-800 text-center py-10">
      <h1 className="text-3xl font-bold">Result Page</h1>
      <p className="mt-4">Message: {message}</p>
    </div>
  );
}