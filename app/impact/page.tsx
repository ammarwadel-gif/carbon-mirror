'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getGlobalStats, updateActiveUsers, GlobalStats } from '@/lib/globalStats';
import { useLanguage } from '@/hooks/useLanguage';

export default function ImpactPage() {
  const { t, language } = useLanguage();
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [userContribution, setUserContribution] = useState(0);

  useEffect(() => {
    updateActiveUsers();
    const stats = getGlobalStats();
    setGlobalStats(stats);
    const userId = localStorage.getItem('carbonmirror_userId');
    if (userId) {
      const userData = localStorage.getItem(`carbonmirror_${userId}`);
      if (userData) setUserContribution(JSON.parse(userData).totalCO2 || 0);
    }
  }, []);

  if (!globalStats) return <div className="h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-white">
            🌍 {language === 'ar' ? 'تأثيرنا الجماعي' : 'Our Collective Impact'}
          </motion.h1>
          <Link href="/planet"><button className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20">← {t('backToPlanet')}</button></Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-green-900/40 to-green-800/40 backdrop-blur-md rounded-2xl p-6 text-center border border-green-500/30">
            <div className="text-5xl mb-3">🌳</div>
            <div className="text-3xl md:text-4xl font-bold text-green-400">{globalStats.totalTreesEquivalent.toLocaleString()}</div>
            <div className="text-white/60 text-sm mt-2">{language === 'ar' ? 'شجرة مكافئة تم زرعها' : 'Trees equivalent planted'}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 backdrop-blur-md rounded-2xl p-6 text-center border border-blue-500/30">
            <div className="text-5xl mb-3">🌍</div>
            <div className="text-3xl md:text-4xl font-bold text-blue-400">{(globalStats.totalCO2Saved / 1000).toFixed(1)} Tons</div>
            <div className="text-white/60 text-sm mt-2">{language === 'ar' ? 'ثاني أكسيد كربون تم توفيره' : 'CO₂ saved'}</div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-black/50 backdrop-blur-md rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">🎯 {language === 'ar' ? 'مساهمتك الشخصية' : 'Your Personal Contribution'}</h2>
          <div className="text-center">
            <div className="text-5xl font-bold text-yellow-400 mb-2">{userContribution} kg</div>
            <p className="text-white/70">{language === 'ar' ? `من إجمالي ${(globalStats.totalCO2Saved / 1000).toFixed(1)} طن تم توفيرها بواسطة ${globalStats.totalActiveUsers} مستخدم نشط` : `Out of ${(globalStats.totalCO2Saved / 1000).toFixed(1)} tons saved by ${globalStats.totalActiveUsers} active users`}</p>
            <div className="w-full bg-gray-700 rounded-full h-4 mt-4 overflow-hidden"><div className="h-4 rounded-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all" style={{ width: `${Math.min((userContribution / globalStats.totalCO2Saved) * 100, 100)}%` }} /></div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-black/50 backdrop-blur-md rounded-2xl p-4 text-center"><div className="text-3xl mb-2">🚗</div><div className="text-xl font-bold text-white">{Math.floor(globalStats.totalCO2Saved / 4.6).toLocaleString()}</div><div className="text-white/60 text-xs">{language === 'ar' ? 'سيارة عن الطريق لمدة عام' : 'cars off the road for 1 year'}</div></div>
          <div className="bg-black/50 backdrop-blur-md rounded-2xl p-4 text-center"><div className="text-3xl mb-2">💡</div><div className="text-xl font-bold text-white">{Math.floor(globalStats.totalCO2Saved / 0.4).toLocaleString()}</div><div className="text-white/60 text-xs">{language === 'ar' ? 'لمبة LED ليوم كامل' : 'LED bulbs for 24 hours'}</div></div>
          <div className="bg-black/50 backdrop-blur-md rounded-2xl p-4 text-center"><div className="text-3xl mb-2">📱</div><div className="text-xl font-bold text-white">{Math.floor(globalStats.totalCO2Saved / 0.05).toLocaleString()}</div><div className="text-white/60 text-xs">{language === 'ar' ? 'شحن هاتف ذكي' : 'smartphone charges'}</div></div>
        </div>
      </div>
    </div>
  );
}