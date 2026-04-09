'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { localStorageDB } from '@/lib/localStorageDB';

// استيراد الكوكب بشكل ديناميكي عشان نتجنب مشاكل الـ SSR
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
  { id: 'car', name: '🚗 سيارة', impact: 8, desc: '+8 kg CO₂' },
  { id: 'bike', name: '🚲 دراجة', impact: -2, desc: '-2 kg CO₂' },
  { id: 'meat', name: '🍔 وجبة لحم', impact: 7, desc: '+7 kg CO₂' },
  { id: 'vegan', name: '🥗 وجبة نباتية', impact: -1, desc: '-1 kg CO₂' },
  { id: 'recycle', name: '♻️ تدوير', impact: -3, desc: '-3 kg CO₂' },
  { id: 'ac', name: '❄️ تكييف', impact: 5, desc: '+5 kg CO₂' },
];

export default function PlanetPage() {
  // تعريف كل الـ state variables
  const [carbonScore, setCarbonScore] = useState<number>(25);
  const [activities, setActivities] = useState<any[]>([]);
  const [showPrediction, setShowPrediction] = useState<boolean>(false);
  const [totalCO2, setTotalCO2] = useState<number>(0);
  const [userId, setUserId] = useState<string>('');
  const [showDailyChallenge, setShowDailyChallenge] = useState<boolean>(true);

  // تحميل البيانات عند بدء التشغيل
  useEffect(() => {
    const loadData = async () => {
      const uid = localStorageDB.getOrCreateUserId();
      setUserId(uid);
      
      const userData = await localStorageDB.getUserData(uid);
      setCarbonScore(userData.carbonScore);
      setActivities(userData.activities);
      setTotalCO2(userData.totalCO2);
      
      // إخفاء التحدي اليومي بعد 5 ثواني
      setTimeout(() => {
        setShowDailyChallenge(false);
      }, 5000);
    };
    loadData();
  }, []);

  // دالة إضافة نشاط
  const addActivity = async (activity: any) => {
    let newScore = carbonScore + activity.impact;
    newScore = Math.max(0, Math.min(100, newScore));
    setCarbonScore(newScore);
    
    const updated = await localStorageDB.updateCarbonScore(userId, newScore, activity.impact, activity);
    setActivities(updated.activities);
    setTotalCO2(updated.totalCO2);
  };
  
  // دالة حالة الكوكب
  const getPlanetState = () => {
    if (carbonScore < 20) return { text: '🌿 مزدهر', color: 'text-green-400' };
    if (carbonScore < 40) return { text: '🌱 صحي', color: 'text-green-300' };
    if (carbonScore < 60) return { text: '⚠️ معتدل', color: 'text-yellow-400' };
    if (carbonScore < 80) return { text: '🔥 حار', color: 'text-orange-500' };
    return { text: '💀 محترق', color: 'text-red-600' };
  };
  
  // دالة التوقع
  const getPrediction = () => {
    if (carbonScore > 70) return "تحذير: استمرار نفس العادات سيؤدي لتصحر الكوكب";
    if (carbonScore > 50) return "⚠️ تحذير: ارتفاع الحرارة سيستمر خلال 5 سنوات";
    if (carbonScore > 30) return "✅ أداء جيد، مع تحسين بسيط ستصل لمرحلة ممتازة";
    return "🌿 ممتاز! استمر على هذا المنوال لتحافظ على كوكب أخضر";
  };

  const treesEquivalent = Math.floor(totalCO2 / 21);
  
  // التحدي اليومي
  const dailyChallenge = {
    text: "🚲 استخدم الدراجة اليوم بدل السيارة",
    reward: "10 نقاط إضافية"
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
            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
              🌍 My Planet
            </h1>
            <p className="text-white/70 mt-2 text-sm">
              {activities.length} نشاط اليوم
            </p>
            <p className="text-white/50 text-xs mt-1">
              🌳 {treesEquivalent} شجرة مكافئة
            </p>
          </div>
          
          <div className="bg-black/50 backdrop-blur-md rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-white">{carbonScore}</div>
            <div className="text-xs text-white/60">Carbon Score</div>
            <div className={`text-sm font-bold ${getPlanetState().color}`}>
              {getPlanetState().text}
            </div>
            <div className="text-xs text-white/40 mt-1">
              {totalCO2} kg CO₂
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
              className="absolute top-24 left-4 md:left-8 bg-gradient-to-r from-yellow-600/90 to-orange-600/90 backdrop-blur-md rounded-2xl p-4 border border-yellow-500"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎯</span>
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
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {activitiesList.map((activity) => (
            <motion.button
              key={activity.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addActivity(activity)}
              className="bg-black/50 backdrop-blur-md rounded-xl p-3 text-white hover:bg-black/70 transition-all"
            >
              <div className="text-2xl md:text-3xl">{activity.name}</div>
              <div className="text-[10px] md:text-xs text-white/50 mt-1">{activity.desc}</div>
            </motion.button>
          ))}
        </div>
        
        {/* الأزرار السفلية - النسخة الكاملة */}
        <div className="flex flex-wrap justify-center items-center gap-3">
          <button
            onClick={() => setShowPrediction(!showPrediction)}
            className="px-4 md:px-5 py-2 md:py-2.5 bg-purple-600/80 backdrop-blur-md rounded-full text-white font-bold hover:bg-purple-700 transition-all text-sm"
          >
            🔮 Future
          </button>
          
          <Link href="/dashboard">
            <button className="px-4 md:px-5 py-2 md:py-2.5 bg-blue-600/80 backdrop-blur-md rounded-full text-white font-bold hover:bg-blue-700 transition-all text-sm">
              📊 Dashboard
            </button>
          </Link>
          
          <Link href="/ranking">
            <button className="px-4 md:px-5 py-2 md:py-2.5 bg-yellow-600/80 backdrop-blur-md rounded-full text-white font-bold hover:bg-yellow-700 transition-all text-sm">
              🏆 Ranking
            </button>
          </Link>
          
          <Link href="/">
            <button className="px-4 md:px-5 py-2 md:py-2.5 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all text-sm">
              🏠 Home
            </button>
          </Link>
        </div>
        
        {/* نافذة التوقع */}
        <AnimatePresence>
          {showPrediction && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-28 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-black/90 backdrop-blur-xl rounded-2xl p-6 border border-purple-500 z-20"
            >
              <h3 className="text-xl font-bold text-white mb-3">🔮 توقع 2030</h3>
              <p className="text-white/80 mb-4">{getPrediction()}</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${carbonScore}%`,
                    background: 'linear-gradient(90deg, #22c55e, #ef4444)'
                  }}
                />
              </div>
              <div className="text-white/60 text-sm mb-4">
                إجمالي CO₂: {totalCO2} kg
              </div>
              <div className="text-white/60 text-sm mb-4">
                🌳 أشجار مكافئة: {treesEquivalent}
              </div>
              <button
                onClick={() => setShowPrediction(false)}
                className="w-full py-2 bg-purple-600 rounded-lg text-white font-bold hover:bg-purple-700"
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