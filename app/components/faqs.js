'use client';
import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [language, setLanguage] = useState('en');
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    const lang = localStorage.getItem('bailLang');
    if (lang === 'hi' || lang === 'en') {
      setLanguage(lang);
    }
  }, []);

  useEffect(() => {
    fetch('/api/faqs', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setFaqs(data))
      .catch((err) => {
        console.error('Failed to load FAQs:', err);
      });
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [inView, controls]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section py-16 px-4 bg-gray-50" id="faq" ref={ref}>
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
        {language === 'hi'
          ? 'अक्सर पूछे जाने वाले प्रश्न'
          : 'Frequently Asked Questions'}
      </h2>

      <div className="max-w-3xl mx-auto space-y-6">
        {faqs.map((item, index) => (
          <motion.div
            key={item._id || index}
            className="border border-gray-300 rounded-xl bg-white shadow-sm"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 50, scale: 0.95 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  delay: index * 0.15,
                  duration: 0.6,
                  type: 'spring',
                  stiffness: 60,
                },
              },
            }}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none"
            >
              <h3 className="text-lg font-medium text-gray-800">
                {item.question?.[language]}
              </h3>
              <span
                className={`transition-transform duration-300 text-gray-600 ${
                  openIndex === index ? 'rotate-45' : ''
                }`}
              >
                <FaPlus className="text-xl" />
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out px-6 ${
                openIndex === index ? 'max-h-96 py-2' : 'max-h-0'
              }`}
            >
              <p className="text-gray-600">{item.answer?.[language]}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FAQs;
