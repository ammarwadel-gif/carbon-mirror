'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const [language, setLanguage] = useState('en');

  // تحميل اللغة المحفوظة عند بدء التشغيل
  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang === 'ar' || savedLang === 'en') {
      setLanguage(savedLang);
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLang;
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    localStorage.setItem('language', newLang);
  };

  const texts = {
    en: {
      title: 'CarbonMirror',
      subtitle: 'See the planet reacting to you',
      start: '🌍 Start Your Planet',
      features: 'Features',
      realtime: 'Real-time 3D Visualization',
      realtimeDesc: 'Watch your planet change color based on your carbon score',
      track: 'Track Your Impact',
      trackDesc: 'Every action you take affects your personal Earth',
      predict: 'AI Predictions',
      predictDesc: 'See your future impact with our prediction engine',
      share: 'Share & Compete',
      shareDesc: 'Compare your score with friends worldwide'
    },
    ar: {
      title: 'CarbonMirror',
      subtitle: 'شاهد الكوكب يتفاعل معك',
      start: '🌍 ابدأ كوكبك',
      features: 'المميزات',
      realtime: 'تصور ثلاثي الأبعاد فوري',
      realtimeDesc: 'شاهد كوكبك يتغير لونه بناءً على درجة الكربون',
      track: 'تتبع تأثيرك',
      trackDesc: 'كل قرار تتخذه يؤثر على كوكبك الشخصي',
      predict: 'توقعات الذكاء الاصطناعي',
      predictDesc: 'شاهد تأثيرك المستقبلي',
      share: 'شارك وتنافس',
      shareDesc: 'قارن نتيجتك مع أصدقائك حول العالم'
    }
  };

  const t = texts[language as keyof typeof texts];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      {/* Language Toggle Button */}
      <button
        onClick={toggleLanguage}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all text-sm font-bold"
      >
        {language === 'en' ? '🇸🇦 العربية' : '🇬🇧 English'}
      </button>

      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-8xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"
        >
          {t.title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-xl md:text-2xl mt-6 text-center max-w-2xl text-white/90"
        >
          {t.subtitle}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12"
        >
          <Link href="/planet">
            <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-2xl text-white">
              {t.start}
            </button>
          </Link>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
            <p className="text-3xl font-bold text-green-400">🌍 3D</p>
            <p className="text-white/70 text-sm mt-2">Interactive Earth</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
            <p className="text-3xl font-bold text-blue-400">⚡ Real-time</p>
            <p className="text-white/70 text-sm mt-2">Instant Feedback</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
            <p className="text-3xl font-bold text-purple-400">🤖 AI</p>
            <p className="text-white/70 text-sm mt-2">Predictions</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
            <p className="text-3xl font-bold text-yellow-400">🏆 Free</p>
            <p className="text-white/70 text-sm mt-2">Forever</p>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
          >
            {t.features}
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 text-center hover:scale-105 transition-transform"
            >
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-white mb-2">{t.realtime}</h3>
              <p className="text-white/60 text-sm">{t.realtimeDesc}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 text-center hover:scale-105 transition-transform"
            >
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-2">{t.track}</h3>
              <p className="text-white/60 text-sm">{t.trackDesc}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 text-center hover:scale-105 transition-transform"
            >
              <div className="text-5xl mb-4">🔮</div>
              <h3 className="text-xl font-bold text-white mb-2">{t.predict}</h3>
              <p className="text-white/60 text-sm">{t.predictDesc}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 text-center hover:scale-105 transition-transform"
            >
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-white mb-2">{t.share}</h3>
              <p className="text-white/60 text-sm">{t.shareDesc}</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-white/40 text-sm">
        <p>© 2024 CarbonMirror - Make Climate Change Visible</p>
      </footer>
    </div>
  );
}