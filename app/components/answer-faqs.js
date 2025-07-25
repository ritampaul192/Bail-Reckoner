'use client';

import { useEffect, useState, useRef } from 'react';

const AnswerFaqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/faqs')
      .then(res => res.json())
      .then(data => {
        setFaqs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load FAQs:', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (id, lang, value, field) => {
    setFaqs(prev =>
      prev.map(faq =>
        faq._id === id
          ? {
            ...faq,
            [field]: {
              ...faq[field],
              [lang]: value,
            },
          }
          : faq
      )
    );
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const transformedFaqs = faqs.map(faq => ({
        _id: faq._id,
        answer_en: faq.answer.en,
        answer_hi: faq.answer.hi,
      }));

      const res = await fetch('/api/faqs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faqs: transformedFaqs }),
      });

      const result = await res.json();
      alert(result.message || 'FAQs updated successfully!');
    } catch (error) {
      console.error('Error saving FAQs:', error);
      alert('Failed to update FAQs.');
    }
    setSaving(false);
  };


  if (loading) return <div className="p-6 text-center">Loading FAQs...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#2c3e50]">Answer FAQs</h2>

      {faqs.map((faq, idx) => (
        <div key={faq._id || idx} className="mb-8 border-b pb-4">
          <div className="mb-2 font-semibold text-[#292727]">Q{idx + 1} (EN): {faq.question.en}</div>
          <div className="mb-2 font-semibold text-[#e67e22]">Q{idx + 1} (HI): {faq.question.hi}</div>

          {/* English Answer */}
          <TextAreaWithAutoResize
            value={faq.answer?.en || ''}
            placeholder="Answer in English..."
            onChange={val => handleChange(faq._id, 'en', val, 'answer')}
          />

          {/* Hindi Answer */}
          <TextAreaWithAutoResize
            value={faq.answer?.hi || ''}
            placeholder="उत्तर हिंदी में..."
            onChange={val => handleChange(faq._id, 'hi', val, 'answer')}
          />
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="bg-[#2c3e50] text-white px-6 py-2 rounded hover:bg-[#34495e] transition duration-200"
      >
        {saving ? 'Saving...' : 'Save All'}
      </button>
    </div>
  );
};

export default AnswerFaqs;

// ---- Reusable Styled TextArea with Auto Resize ----
const TextAreaWithAutoResize = ({ value, placeholder, onChange }) => {
  const ref = useRef(null);
  const [buttonDown, setButtonDown] = useState(false);

  useEffect(() => {
    const ta = ref.current;
    if (!ta) return;
    ta.style.height = '54px';
    ta.style.height = `${ta.scrollHeight}px`;
    setButtonDown(ta.scrollHeight > 54);
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`text-[#292727] w-full sm:w-[528.4px] h-[54px] border border-[#868686] rounded-md p-3 resize-none z-0 overflow-hidden outline-none transition duration-200 focus:shadow-md ${buttonDown
        ? 'focus:border-[#868686] focus:ring focus:ring-gray-200'
        : 'focus:border-[#868686] focus:border-r-0 focus:ring focus:ring-gray-200 focus:shadow-md'
        } mb-3`}
    />
  );
};
