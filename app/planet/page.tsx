'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { localStorageDB } from '@/lib/localStorageDB';

// استيراد الكوكب بشكل ديناميكي
const EarthScene = dynamic(() => import('../../components/Earth3D/EarthScene'), {
  ssr: false,
  loading: () => (
    <div className="h-screen bg-black flex items-center justify-center text-white text-xl">
      🌍 Loading 3D Earth...
    </div>
  )
});

// قائمة الأنشطة المتاحة
const activitiesList = [
  { id: 'car', name: '🚗 سيارة', impact: 8, desc: '+8 kg CO₂', color: 'from-red-600 to-red-800' },
  { id: 'bike', name: '🚲 دراجة', impact: -2, desc: '-2 kg CO₂', color: 'from-green-600 to-green-800' },
  { id: 'meat', name: '🍔 لحم', impact: 7, desc: '+7 kg CO₂', color: 'from-red-600 to-red-800' },
  { id: 'vegan', name: '🥗 نباتي', impact: -1, desc: '-1 kg CO₂', color: 'from-green-600 to-green-800' },
  { id: 'recycle', name: '♻️ تدوير', impact: -3, desc: '-3 kg CO₂', color: 'from-green-600 to-green-800' },
  { id: 'ac', name: '❄️ تكييف', impact: 5, desc: '+5 kg CO₂', color: 'from-blue-600 to-blue-800' },
];

export default function PlanetPage() {
  const [carbonScore, setCarbonScore] = useState<number>(25);
  const [activities, setActivities] = useState<any[]>([]);
  const [showPrediction, setShowPrediction] = useState<boolean>(false);
  const [totalCO2, setTotalCO2] = useState<number>(0);
  const [userId, setUserId] = useState<string>('');
  const [showDailyChallenge, setShowDailyChallenge] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      const uid = localStorageDB.getOrCreateUserId();
      setUserId(uid);
      const userData = await localStorageDB.getUserData(uid);
      setCarbonScore(userData.carbonScore);
      setActivities(userData.activities);
      setTotalCO2(userData.totalCO2);
      setTimeout(() => setShowDailyChallenge(false), 5000);
    };
    loadData();
  }, []);

  const addActivity = async (activity: any) => {
    let newScore = carbonScore + activity.impact;
    newScore = Math.max(0, Math.min(100, newScore));
    setCarbonScore(newScore);
    const updated = await localStorageDB.updateCarbonScore(userId, newScore, activity.impact, activity);
    setActivities(updated.activities);
    setTotalCO2(updated.totalCO2);
  };
  
  const getPlanetState = () => {
    if (carbonScore < 20) return { text: '🌿 مزدهر', color: 'text-green-400', bg: 'from-green-900/50 to-green-800/50' };
    if (carbonScore < 40) return { text: '🌱 صحي', color: 'text-green-300', bg: 'from-green-900/30 to-green-800/30' };
    if (carbonScore < 60) return { text: '⚠️ معتدل', color: 'text-yellow-400', bg: 'from-yellow-900/30 to-yellow-800/30' };
    if (carbonScore < 80) return { text: '🔥 حار', color: 'text-orange-500', bg: 'from-orange-900/40 to-orange-800/40' };
    return { text: '💀 محترق', color: 'text-red-600', bg: 'from-red-900/50 to-red-800/50' };
  };

  const getPrediction = () => {
    if (carbonScore > 70) return "تحذير: استمرار نفس العادات سيؤدي لتصحر الكوكب";
    if (carbonScore > 50) return "⚠️ تحذير: ارتفاع الحرارة سيستمر خلال 5 سنوات";
    if (carbonScore > 30) return "✅ أداء جيد، مع تحسين بسيط ستصل لمرحلة ممتازة";
    return "🌿 ممتاز! استمر على هذا المنوال لتحافظ على كوكب أخضر";
  };

  const treesEquivalent = Math.floor(totalCO2 / 21);
  const planetState = getPlanetState();

  // دوال المشاركة
  const shareOnTwitter = () => {
    const text = `My carbon score is ${carbonScore}! I saved ${totalCO2}kg CO₂. That's equivalent to ${treesEquivalent} trees! 🌍 #CarbonMirror #ClimateAction`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* طبقة الكوكب 3D */}
      <div className="absolute inset-0 z-0">
        <EarthScene carbonLevel={carbonScore} />
      </div>
      
      {/* طبقة المحتوى */}
      <div className="relative z-10 h-full flex flex-col justify-between p-4 md:p-8">
        {/* الهيدر */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg flex items-center gap-2">
              <span className="animate-spin-slow">🌍</span>
              My Planet
            </h1>
            <p className="text-white/70 mt-2 text-sm">
              📋 {activities.length} نشاط اليوم
            </p>
            <p className="text-white/50 text-xs mt-1">
              🌳 {treesEquivalent} شجرة مكافئة
            </p>
          </div>
          
          <div className={`bg-gradient-to-br ${planetState.bg} backdrop-blur-md rounded-2xl p-4 text-center border border-white/20`}>
            <div className="text-4xl font-bold text-white">{carbonScore}</div>
            <div className="text-xs text-white/60">Carbon Score</div>
            <div className={`text-sm font-bold ${planetState.color} mt-1`}>
              {planetState.text}
            </div>
            <div className="text-xs text-white/40 mt-1">
              📊 {totalCO2} kg CO₂
            </div>
          </div>
        </div>
        
        {/* التحدي اليومي */}
        <AnimatePresence>
          {showDailyChallenge && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="absolute top-24 left-4 md:left-8 bg-gradient-to-r from-yellow-600/90 to-orange-600/90 backdrop-blur-md rounded-2xl p-4 border border-yellow-500 shadow-lg shadow-yellow-500/20"
            >
              <div className="flex items-center gap-3">
                <div className="text-4xl animate-bounce">🎯</div>
                <div>
                  <p className="text-white font-bold text-sm">Daily Challenge</p>
                  <p className="text-white/90 text-sm">{dailyChallenge.text}</p>
                  <p className="text-yellow-300 text-xs mt-1">Reward: {dailyChallenge.reward}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* أزرار الأنشطة */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {activitiesList.map((activity) => (
            <motion.button
              key={activity.id}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addActivity(activity)}
              className={`group relative overflow-hidden bg-gradient-to-br ${activity.color} rounded-xl p-3 text-white transition-all duration-300 shadow-lg hover:shadow-xl`}
            >
              <div className="relative z-10">
                <div className="text-3xl md:text-4xl mb-1">{activity.name}</div>
                <div className="text-[10px] md:text-xs text-white/80">{activity.desc}</div>
              </div>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </motion.button>
          ))}
        </div>
        
        {/* الأزرار السفلية - تصميم احترافي */}
        <div className="flex flex-wrap justify-center items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPrediction(!showPrediction)}
            className="group relative px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full text-white font-bold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 text-sm overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-lg">🔮</span>
              <span>Future Mode</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
          
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full text-white font-bold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 text-sm overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-lg">📊</span>
                <span>Dashboard</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </Link>
          
          <Link href="/ranking">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-5 py-2.5 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full text-white font-bold transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/50 text-sm overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-lg">🏆</span>
                <span>Ranking</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </Link>
          
          <Link href="/analytics">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-full text-white font-bold transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50 text-sm overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-lg">📈</span>
                <span>Analytics</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </Link>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareOnTwitter}
            className="px-4 py-2.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-all duration-300 text-sm flex items-center gap-2 border border-white/20"
          >
            <span className="text-lg">🐦</span>
            <span className="hidden sm:inline">Twitter</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareOnFacebook}
            className="px-4 py-2.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-all duration-300 text-sm flex items-center gap-2 border border-white/20"
          >
            <span className="text-lg">📘</span>
            <span className="hidden sm:inline">Facebook</span>
          </motion.button>
          
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 text-sm flex items-center gap-2 border border-white/20"
            >
              <span className="text-lg">🏠</span>
              <span>Home</span>
            </motion.button>
          </Link>
        </div>
        
        {/* نافذة التوقع */}
        <AnimatePresence>
          {showPrediction && (
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="fixed bottom-28 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-xl rounded-2xl p-6 border border-purple-500 shadow-2xl shadow-purple-500/20 z-20"
            >
              <div className="text-center mb-4">
                <div className="text-5xl mb-2 animate-pulse">🔮</div>
                <h3 className="text-2xl font-bold text-white">توقع 2030</h3>
              </div>
              <p className="text-white/80 mb-4 text-center">{getPrediction()}</p>
              <div className="w-full bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
                <div 
                  className="h-3 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${carbonScore}%`,
                    background: `linear-gradient(90deg, #22c55e, #ef4444)`
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center bg-white/10 rounded-xl p-2">
                  <div className="text-white/60 text-xs">إجمالي CO₂</div>
                  <div className="text-white font-bold">{totalCO2} kg</div>
                </div>
                <div className="text-center bg-white/10 rounded-xl p-2">
                  <div className="text-white/60 text-xs">أشجار مكافئة</div>
                  <div className="text-white font-bold">{treesEquivalent} 🌳</div>
                </div>
              </div>
              <button
                onClick={() => setShowPrediction(false)}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-bold hover:opacity-90 transition-all"
              >
                إغلاق
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// التحدي اليومي
const dailyChallenge = {
  text: "🚲 استخدم الدراجة اليوم بدل السيارة",
  reward: "10 نقاط إضافية"
};