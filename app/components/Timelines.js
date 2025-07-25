'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const timelineData = {
  en: [
    {
      title: 'First Hearing',
      image: '/firstHearing.jpg',
      shortText: 'Typically within 24 hours of arrest',
      fullText:
        'The First Hearing is the accused\'s initial court appearance after arrest. As per Article 22(2) of the Constitution of India and Section 57 of the Criminal Procedure Code (CrPC), the arrested person must be presented before a Magistrate within 24 hours of arrest.',
      source: 'https://indiankanoon.org/doc/1218094/',
    },
    {
      title: 'Regular Bail',
      image: '/regularBail.jpg',
      shortText: 'Usually decided within 7–15 days',
      fullText:
        'A regular bail is applied for after a person is arrested and is in custody. The court generally decides such bail within 7–15 days depending on the gravity of the offense and judicial workload.',
      source: 'https://indiankanoon.org/doc/1161476/',
    },
    {
      title: 'Anticipatory Bail',
      image: '/anticipatoryBail.jpg',
      shortText: 'Can be filed before arrest',
      fullText:
        'Anticipatory Bail is a provision under Section 438 of CrPC, which allows a person to seek bail in anticipation of arrest for a non-bailable offense, before actual arrest.',
      source: 'https://indiankanoon.org/doc/1487551/',
    },
  ],
  hi: [
    {
      title: 'पहली सुनवाई',
      image: '/firstHearing.jpg',
      shortText: 'गिरफ्तारी के 24 घंटे के भीतर आमतौर पर',
      fullText:
        'पहली सुनवाई गिरफ्तारी के बाद आरोपी की प्रारंभिक अदालत उपस्थिति होती है। भारत के संविधान के अनुच्छेद 22(2) और दंड प्रक्रिया संहिता (CrPC) की धारा 57 के अनुसार, गिरफ्तार व्यक्ति को 24 घंटे के भीतर मजिस्ट्रेट के सामने पेश किया जाना चाहिए।',
      source: 'https://indiankanoon.org/doc/1218094/',
    },
    {
      title: 'नियमित जमानत',
      image: '/regularBail.jpg',
      shortText: 'आमतौर पर 7–15 दिनों में तय होती है',
      fullText:
        'नियमित जमानत तब दायर की जाती है जब कोई व्यक्ति गिरफ्तार होता है और हिरासत में होता है। अदालत आमतौर पर अपराध की गंभीरता और न्यायिक कार्यभार के आधार पर 7–15 दिनों में निर्णय लेती है।',
      source: 'https://indiankanoon.org/doc/1161476/',
    },
    {
      title: 'अग्रिम जमानत',
      image: '/anticipatoryBail.jpg',
      shortText: 'गिरफ्तारी से पहले दायर की जा सकती है',
      fullText:
        'अग्रिम जमानत CrPC की धारा 438 के तहत एक प्रावधान है, जो किसी व्यक्ति को गैर-जमानती अपराध में गिरफ्तारी की आशंका के आधार पर जमानत प्राप्त करने की अनुमति देता है।',
      source: 'https://indiankanoon.org/doc/1487551/',
    },
  ],
};

const Timelines = () => {
  const [expanded, setExpanded] = useState([]);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const lang = localStorage.getItem('bailLang');
    if (lang && timelineData[lang]) {
      setLanguage(lang);
    }
    setExpanded(Array(timelineData[lang || 'en'].length).fill(false));
  }, []);

  const toggleCard = (index) => {
    setExpanded((prev) =>
      prev.map((val, i) => (i === index ? !val : val))
    );
  };

  const data = timelineData[language];

  return (
    <section className="features py-10 px-4 bg-gray-50" id="timelines">
      <h2 className="text-3xl font-bold text-center mb-10">
        {language === 'hi' ? 'टाइमलाइन विवरण' : 'Timelines Explained'}
      </h2>

      <div className="timeline block w-full md:w-auto md:flex md:flex-col gap-8 justify-center items-start max-w-6xl mx-auto">
        {data.map((item, index) => {
          const ref = useRef(null);
          const isInView = useInView(ref, { once: true, margin: '-100px' });

          return (
            <motion.div
              ref={ref}
              key={index}
              className="timeline-item flex flex-col items-center shadow-md shadow-gray-300 bg-white rounded-lg overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="w-full h-[250px] relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>

              <div className="p-5 w-full">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-700 mt-1">{item.shortText}</p>

                <AnimatePresence mode="wait">
                  {expanded[index] && (
                    <motion.div
                      key="expanded"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="overflow-hidden text-gray-600"
                    >
                      <p className="mt-2">{item.fullText}</p>
                      <p className="font-bold mt-2">
                        {language === 'hi' ? 'स्रोत' : 'Source'}:{' '}
                        <a
                          href={item.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          Link
                        </a>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="my-4">
                  <div
                    className={`flex items-center w-full border-2 rounded-full border-gray-300 justify-end p-1 transition-all duration-500 ${
                      expanded[index] ? 'bg-gray-200' : 'bg-white'
                    }`}
                  >
                    <p className="mr-3 font-medium">
                      {language === 'hi'
                        ? expanded[index]
                          ? 'कम पढ़ें'
                          : 'और पढ़ें'
                        : expanded[index]
                        ? 'Read less'
                        : 'Read more'}
                    </p>
                    <button
                      onClick={() => toggleCard(index)}
                      className={`p-2 rounded-full transition-all duration-500 ${
                        expanded[index] ? 'bg-white' : 'bg-gray-200'
                      }`}
                    >
                      {expanded[index] ? <FaArrowLeft /> : <FaArrowRight />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Timelines;
