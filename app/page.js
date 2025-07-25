'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaBalanceScale, FaSearch, FaMobileAlt, FaInfoCircle } from 'react-icons/fa';
import { BsShieldLockFill } from 'react-icons/bs';
import Spinner from './components/Spinner';

export default function LandingPage() {
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedLang = localStorage.getItem('bailLang') || 'en';
    setLang(savedLang);
  }, []);

  const switchLanguage = () => {
    const nextLang = lang === 'en' ? 'hi' : 'en';
    localStorage.setItem('bailLang', nextLang);
    setLang(nextLang);
  };

  const decisionMaking = (actionType) => {
    if (actionType === 'english' || actionType === 'hindi') {
      setLoading(true);
      router.push('/Home');
    }
  }

  return (
    (!loading ? (<main className="min-h-screen w-full bg-[#f5f7fa] text-[#2c3e50]">
      {lang === 'en' ? (
        <EnglishLanding language={lang} decision={decisionMaking} switchLanguage={switchLanguage} />
      ) : (
        <HindiLanding language={lang} decision={decisionMaking} switchLanguage={switchLanguage} />
      )}
    </main>) : (<Spinner />))
  );
}

function LanguageToggle({ language, switchLanguage }) {
  return (
    <div className="z-20">
      <button
        onClick={switchLanguage}
        className="relative flex items-center w-[90px] h-[36px] bg-[#e74c3c] rounded-full px-1 transition-all duration-1000 focus:outline-none shadow-md"
        aria-label="Switch language"
      >
        <div
          className={`absolute top-1/2 left-1 transform -translate-y-1/2 w-[28px] h-[28px] bg-white rounded-full transition-all duration-300 ${language === 'hi' ? 'translate-x-[53px]' : 'translate-x-0'
            }`}
        />
        <div className="flex justify-between w-full px-2 text-sm font-semibold z-10">
          <span className="text-white">EN</span>
          <span className="text-white">हि</span>
        </div>
      </button>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 transition hover:shadow-lg border border-gray-200">
      <div className="text-3xl mb-4 text-[#e74c3c]">{icon}</div>
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function EnglishLanding({ language, switchLanguage, decision }) {
  function connectToHome() {
    decision?.('english');
  }
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#2c3e50] text-white py-20 px-6 text-center relative">
        <div className="max-w-4xl mx-auto relative">
          <div className='w-full flex justify-end'>
            <LanguageToggle language={language} switchLanguage={switchLanguage} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold flex justify-center items-center gap-2">
            <FaBalanceScale />
            Welcome to <span className="text-[#e74c3c] ml-2">BAIL सेतु</span>
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Your bridge to understanding Indian bail laws, rights & legal aid.
          </p>
          <button
            onClick={connectToHome}
            className="mt-8 inline-block bg-[#e74c3c] hover:bg-[#c0392b] text-white px-6 py-3 rounded-md font-medium transition"
          >
            Start Exploring
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">What You Can Do</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <FeatureCard icon={<FaSearch />} title="Search IPC Sections" desc="Type your case or situation to find relevant IPC sections and bail eligibility." />
            <FeatureCard icon={<FaMobileAlt />} title="SMS & WhatsApp Help" desc="No smartphone? No problem. Get legal info over SMS or chat." />
            <FeatureCard icon={<BsShieldLockFill />} title="Know Your Rights" desc="Get clear explanations of legal rights and when bail is applicable." />
            <FeatureCard icon={<FaInfoCircle />} title="Understand Punishments" desc="View detailed descriptions, punishments, and conditions for bail." />
            <FeatureCard icon={<FaBalanceScale />} title="Hindi & English Support" desc="Built for all users – in both English and Hindi for broader access." />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#ecf0f1] py-12 px-6 text-center">
        <h3 className="text-2xl font-semibold">Empower yourself legally.</h3>
        <p className="mt-2 text-gray-600">Search now and take your first step towards justice.</p>
        <button onClick={connectToHome} className="mt-6 inline-block bg-[#2c3e50] hover:bg-[#34495e] text-white px-6 py-3 rounded-md transition font-medium">
          Go to Bail Search
        </button>
      </section>

      <footer className="bg-[#2c3e50] text-white text-center py-6">
        <p>&copy; {new Date().getFullYear()} BAIL सेतु. All rights reserved.</p>
        <p className="text-sm mt-1 text-gray-400">Made with ❤️ to promote legal awareness.</p>
      </footer>
    </>
  );
}

function HindiLanding({ language, switchLanguage, decision }) {
  function connectToHome() {
    decision?.('hindi');
  }
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#2c3e50] text-white py-20 px-6 text-center relative">
        <div className="max-w-4xl mx-auto relative">
          <LanguageToggle language={language} switchLanguage={switchLanguage} />

          <h1 className="text-4xl sm:text-5xl font-bold flex justify-center items-center gap-2">
            <FaBalanceScale />
            <span>स्वागत है <span className="text-[#e74c3c] ml-2">BAIL सेतु</span></span>
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            भारतीय ज़मानत कानून, अधिकारों और कानूनी सहायता को समझने का सेतु।
          </p>
          <button onClick={connectToHome} className="mt-8 inline-block bg-[#e74c3c] text-white px-6 py-3 rounded-md font-medium hover:bg-[#c0392b] transition">
            खोज शुरू करें
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">आप क्या कर सकते हैं</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            <FeatureCard icon={<FaSearch />} title="IPC अनुभाग खोजें" desc="अपने मामले या स्थिति को टाइप करें और जानें कि कौन-कौन से धाराएं लागू होती हैं।" />
            <FeatureCard icon={<FaMobileAlt />} title="SMS और WhatsApp सहायता" desc="स्मार्टफोन नहीं? SMS या चैट से जानकारी प्राप्त करें।" />
            <FeatureCard icon={<BsShieldLockFill />} title="अपने अधिकार जानें" desc="कानूनी अधिकारों की स्पष्ट जानकारी और ज़मानत कब मिल सकती है।" />
            <FeatureCard icon={<FaInfoCircle />} title="दंड समझें" desc="हर अपराध के लिए दंड और ज़मानत की शर्तें पढ़ें।" />
            <FeatureCard icon={<FaBalanceScale />} title="हिंदी और अंग्रेज़ी दोनों में" desc="हर किसी के लिए – हिंदी और अंग्रेज़ी में उपलब्ध।" />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#ecf0f1] py-12 px-6 text-center">
        <h3 className="text-2xl font-semibold">कानूनी रूप से सशक्त बनें।</h3>
        <p className="mt-2 text-gray-600">खोज शुरू करें और न्याय की ओर पहला कदम बढ़ाएँ।</p>
        <button onClick={connectToHome} className="mt-6 inline-block bg-[#2c3e50] hover:bg-[#34495e] text-white px-6 py-3 rounded-md transition font-medium">
          बेल खोज पर जाएं
        </button>
      </section>

      <footer className="bg-[#2c3e50] text-white text-center py-6">
        <p>&copy; {new Date().getFullYear()} BAIL सेतु. सर्वाधिकार सुरक्षित।</p>
        <p className="text-sm mt-1 text-gray-400">❤️ के साथ बनाया गया — न्यायिक जानकारी को सरल बनाने के लिए।</p>
      </footer>
    </>
  );
}