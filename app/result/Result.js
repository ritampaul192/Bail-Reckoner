'use client';

import React, { useState, useEffect } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';
import { FaBalanceScale } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Language Translations
const translations = {
    en: {
        bridge: "Your bridge to legal freedom",
        youSearched: "You searched:",
        ipcHeader: "The IPC Sections are:",
        section: "Section",
        subSection: "Sub_Section",
        description: "Description",
        punishment: "Punishment",
        bailable: "Bailable",
        bailYes: "Yes",
        bailNo: "No",
        bailType: "Type of Bail",
        bailTime: "Bail Time Limit",
        moreInfo: "More Info",
        backToHome: "Back To Home",
        loadingInsights: "Loading legal insights..."
    },
    hi: {
        bridge: "आपकी कानूनी स्वतंत्रता की सेतु",
        youSearched: "आपने खोजा:",
        ipcHeader: "आईपीसी धाराएं:",
        section: "धारा",
        subSection: "उप-धारा",
        description: "विवरण",
        punishment: "सजा",
        bailable: "जमानती",
        bailYes: "हाँ",
        bailNo: "नहीं",
        bailType: "जमानत का प्रकार",
        bailTime: "जमानत की समय-सीमा",
        moreInfo: "और जानकारी",
        backToHome: "मुखपृष्ठ पर जाएं",
        loadingInsights: "कानूनी जानकारियाँ लोड हो रही हैं..."
    }
};

export default function Result() {
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState([]);
    const [progress, setProgress] = useState(0);
    const [trivia, setTrivia] = useState('');
    const [icon, setIcon] = useState('⚖');
    const [lang, setLang] = useState('en');

    const searchParams = useSearchParams();
    const router = useRouter();
    const message = searchParams.get('message');

    const triviaList = [
        "In India, bail is a constitutional right under Article 21.",
        "Anticipatory bail is covered under Section 438 CrPC.",
        "The concept of bail traces back to medieval England.",
        "Supreme Court: 'Bail is the rule, jail the exception.'",
        "Juveniles are usually granted bail by default.",
        "Bail can be denied to prevent evidence tampering.",
        "Police can grant bail for bailable offences directly."
    ];

    const iconList = ['⚖', '📜', '🏛', '⏳', '🧑‍⚖', '🪪', '🔍', '📂'];

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
        <div className="min-h-screen w-full bg-[#f9f9f9]">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white text-[#2c3e50] p-6 rounded-2xl shadow-md">
                    <div className='w-full flex justify-end'>
                        <button
                            className="flex p-2 rounded-full bg-gray-100 text-[#c0392b]"
                            onClick={() => router.push('/Home')}
                        >
                            <ImCross />
                        </button>
                    </div>

                    <div className="flex flex-col gap-3 items-center mb-4">
                        <h1 className="font-extrabold text-3xl flex items-center gap-2 text-[#2c3e50]">
                            <FaBalanceScale />
                            BAIL <span className="text-[#c0392b]">सेतु</span>
                        </h1>
                        <p className="italic text-sm text-gray-600">{t.bridge}</p>
                    </div>

                    <div className="bg-[#ecf0f1] p-4 mb-4 rounded-2xl text-black">
                        <h3 className="text-xl font-semibold">{t.youSearched}</h3>
                        <p className="px-4 text-xl">{message}</p>
                    </div>

                    <hr />

                    {loading && (
                        <div className="flex flex-col items-center justify-center my-10 gap-6">
                            <div className="relative w-24 h-24">
                                <div className="absolute inset-0 bg-[#e74c3c] opacity-20 rounded-full blur-2xl animate-ping-slow"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-6xl text-[#e74c3c] animate-spin-slow">
                                    {icon}
                                </div>
                            </div>

                            <div className="w-full max-w-lg text-center">
                                <div className="relative bg-gray-200 h-4 rounded-md overflow-hidden">
                                    <div
                                        className="bg-[#e74c3c] h-full transition-all duration-300 ease-out"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm mt-2 font-bold text-[#34495e]">{Math.floor(progress)}%</p>
                                <div className="bg-[#ecf0f1] mt-4 p-3 rounded-lg min-h-[60px]">
                                    <p className="text-sm text-[#2c3e50]">{trivia || t.loadingInsights}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!loading && (
                        <>
                            {cards.length > 0 ? (
                                <div className="flex flex-col gap-4 mt-8">
                                    <h2 className="text-xl font-bold">{t.ipcHeader}</h2>
                                    {cards.map((card) => (
                                        <motion.div
                                            key={card.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-[#ecf0f1] p-4 rounded-2xl text-[#2c3e50] shadow-sm"
                                        >
                                            <div className="flex justify-between items-start flex-wrap gap-3">
                                                <div className="flex-1">
                                                    <AnimatePresence mode="wait">
                                                        {card.isCollapsed ? (
                                                            <motion.div
                                                                key="collapsed"
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <p><strong>{t.section}:</strong> {card.section_number}</p>
                                                                <p><strong>{t.subSection}:</strong> {card.sub_section}</p>
                                                                <p className="font-semibold">{card.title}</p>
                                                                <div className="flex flex-wrap gap-2 mt-2">
                                                                    {card.tags.map((tag) => (
                                                                        <div key={tag} className="bg-white px-3 py-1 rounded-full text-sm opacity-80">
                                                                            {tag}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div
                                                                key="expanded"
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                            >
                                                                <p><strong>{t.section}:</strong> {card.section_number}</p>
                                                                <p><strong>{t.subSection}:</strong> {card.sub_section}</p>
                                                                <p><strong>{t.description}:</strong> {card.description}</p>
                                                                <p><strong>{t.punishment}:</strong> {card.punishment}</p>
                                                                <p><strong>{t.bailable}:</strong> {card.bail_applicable ? t.bailYes : t.bailNo}</p>
                                                                {card.bail_applicable && (
                                                                    <>
                                                                        <p><strong>{t.bailType}:</strong> {card.bail_type}</p>
                                                                        <p><strong>{t.bailTime}:</strong> {card.bail_time_limit}</p>
                                                                    </>
                                                                )}
                                                                <p><strong>{t.moreInfo}:</strong> <Link href={card.source_link} target="_blank" className="text-blue-500 underline">{t.moreInfo}</Link></p>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <div className="mt-2 sm:mt-0">
                                                    <button
                                                        className="p-2 rounded-full bg-white opacity-60 hover:scale-110 transition-all duration-200"
                                                        onClick={() => toggleView(card.id)}
                                                    >
                                                        {card.isCollapsed ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-6 mt-10 text-center">
                                    <div className="text-6xl">❌</div>
                                    <p className="text-lg font-semibold text-gray-700">
                                        {lang === 'en'
                                            ? "Sorry, we couldn't find any IPC sections related to your query."
                                            : "माफ़ कीजिए, आपकी खोज से संबंधित कोई आईपीसी धारा नहीं मिली।"}
                                    </p>
                                    <button
                                        className="mt-4 px-4 py-2 bg-[#2c3e50] hover:bg-[#34495e] rounded-md text-white transition duration-200"
                                        onClick={() => router.push('/Home')}
                                    >
                                        {t.backToHome}
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    <div className="flex justify-end mt-6">
                        <button
                            className="px-4 py-2 bg-[#2c3e50] hover:bg-[#34495e] rounded-md text-white transition duration-200"
                            onClick={() => router.push('/Home')}
                        >
                            {t.backToHome}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
