import React, { useEffect, useState } from 'react';

const translations = {
  en: {
    heading: "Why We Built This",
    paragraph: `Many people — especially those from marginalized communities — lack access to clear, timely, and affordable legal information.
    Misunderstanding bail laws can lead to unnecessary jail time, financial burden, or legal delays.`,
    highlight: "Bail Reckoner bridges this gap",
    end: "by providing accurate, easy-to-understand legal tools for everyone."
  },
  hi: {
    heading: "हमने इसे क्यों बनाया",
    paragraph: `कई लोगों को — विशेष रूप से हाशिए पर रहने वाले समुदायों से — स्पष्ट, समय पर और सस्ती कानूनी जानकारी तक पहुंच नहीं होती है।
    जमानत कानूनों की गलत समझ से अनावश्यक जेल, वित्तीय बोझ या कानूनी देरी हो सकती है।`,
    highlight: "बेल रेकनर इस अंतर को भरता है",
    end: "सभी के लिए सटीक और समझने में आसान कानूनी उपकरण प्रदान करके।"
  }
};

const WhyWe = () => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('bailLang') || 'en';
    setLanguage(savedLang);
  }, []);

  const t = translations[language];

  return (
    <div>
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white" id="about">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">{t.heading}</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {t.paragraph}{" "}
              <span className="font-semibold text-black">{t.highlight}</span>{" "}
              {t.end}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyWe;
