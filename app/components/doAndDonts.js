'use client';
import React, { useState, useEffect } from 'react';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaThumbsUp,
  FaThumbsDown,
} from 'react-icons/fa';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const translations = {
  en: {
    title: 'DO & DON’T',
    doTitle: 'DO',
    dontTitle: 'DON’T',
    dos: [
      'Consult a lawyer immediately',
      'Gather all relevant documents',
      'Be truthful in court',
    ],
    donts: [
      'Don’t miss court dates',
      'Don’t contact the complainant',
      'Don’t leave the country without permission',
    ],
  },
  hi: {
    title: 'क्या करें और क्या नहीं करें',
    doTitle: 'क्या करें',
    dontTitle: 'क्या नहीं करें',
    dos: [
      'तुरंत वकील से संपर्क करें',
      'सभी संबंधित दस्तावेज़ एकत्र करें',
      'कोर्ट में सच्चाई बोलें',
    ],
    donts: [
      'कोर्ट की तारीख़ों को न छोड़ें',
      'शिकायतकर्ता से संपर्क न करें',
      'अनुमति के बिना देश न छोड़ें',
    ],
  },
};

const DoAndDonts = () => {
  const [language, setLanguage] = useState('en');

  const controlsLeft = useAnimation();
  const controlsRight = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    const savedLang = localStorage.getItem('bailLang');
    if (savedLang && ['en', 'hi'].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  useEffect(() => {
    if (inView) {
      controlsLeft.start({ x: 0, opacity: 1 });
      controlsRight.start({ x: 0, opacity: 1 });
    }
  }, [inView]);

  const t = translations[language];

  return (
    <section className="features py-10 px-4 bg-[#f9f9f9]" id="dos-donts" ref={ref}>
      <div className="flex justify-between items-center max-w-5xl mx-auto mb-6">
        <h2 className="text-3xl font-bold">{t.title}</h2>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto">
        {/* DO Card */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={controlsLeft}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex-1 bg-gradient-to-r from-green-600 to-green-400 rounded-2xl shadow-lg text-white overflow-hidden"
        >
          <div className="flex items-center px-6 py-4 border-b border-white/30">
            <FaThumbsUp className="text-3xl mr-3" />
            <h3 className="text-xl font-semibold">{t.doTitle}</h3>
          </div>
          <ul className="bg-white text-gray-800 p-6 space-y-4">
            {t.dos.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <FaCheckCircle className="text-green-600 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* DON'T Card */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={controlsRight}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex-1 bg-gradient-to-r from-pink-600 to-orange-400 rounded-2xl shadow-lg text-white overflow-hidden"
        >
          <div className="flex items-center px-6 py-4 border-b border-white/30">
            <FaThumbsDown className="text-3xl mr-3" />
            <h3 className="text-xl font-semibold">{t.dontTitle}</h3>
          </div>
          <ul className="bg-white text-gray-800 p-6 space-y-4">
            {t.donts.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <FaTimesCircle className="text-red-600 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default DoAndDonts;
