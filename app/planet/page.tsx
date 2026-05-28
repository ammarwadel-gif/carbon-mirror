'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { localStorageDB } from '@/lib/localStorageDB';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSelector from '@/components/LanguageSelector';

const EarthScene = dynamic(() => import('../../components/Earth3D/EarthScene'), {
  ssr: false,
  loading: () => (
    <div className="h-screen bg-black flex items-center justify-center text-white text-xl">
      <div className="animate-pulse">🌍 Loading 3D Earth...</div>
    </div>
  ),
});

export default function PlanetPage() {
  const { t, language } = useLanguage();
  
  const [carbonScore, setCarbonScore] = useState<number>(25);
  const [activities, setActivities] = useState<any[]>([]);
  const [showPrediction, setShowPrediction] = useState<boolean>(false);
  const [totalCO2, setTotalCO2] = useState<number>(0);
  const [userId, setUserId] = useState<string>('');
  const [showDailyChallenge, setShowDailyChallenge] = useState<boolean>(true);
  const [weekStreak, setWeekStreak] = useState<number>(0);
  const [treeSize, setTreeSize] = useState(100);
  const [treeEmoji, setTreeEmoji] = useState('🌳');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: string }>({
    show: false, message: '', type: ''
  });
  const [audioEnabled] = useState<boolean>(true);

  const icons = {
    car: '🚗',
    bike: '🚲',
    meat: '🍔',
    vegan: '🥗',
    recycle: '♻️',
    ac: '❄️',
  };

  const activitiesList = [
    { id: 'car', icon: icons.car, name: t('car'), impact: 8, desc: '+8 kg CO₂', color: 'from-red-600 to-red-800' },
    { id: 'bike', icon: icons.bike, name: t('bike'), impact: -2, desc: '-2 kg CO₂', color: 'from-green-600 to-green-800' },
    { id: 'meat', icon: icons.meat, name: t('meat'), impact: 7, desc: '+7 kg CO₂', color: 'from-red-600 to-red-800' },
    { id: 'vegan', icon: icons.vegan, name: t('vegan'), impact: -1, desc: '-1 kg CO₂', color: 'from-green-600 to-green-800' },
    { id: 'recycle', icon: icons.recycle, name: t('recycle'), impact: -3, desc: '-3 kg CO₂', color: 'from-green-600 to-green-800' },
    { id: 'ac', icon: icons.ac, name: t('ac'), impact: 5, desc: '+5 kg CO₂', color: 'from-blue-600 to-blue-800' },
  ];

  const playSound = (type: 'good' | 'bad') => {
    if (!audioEnabled) return;
    const audio = new Audio();
    audio.volume = 0.2;
    if (type === 'good') {
      audio.src = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3';
    } else {
      audio.src = 'https://www.soundjay.com/misc/sounds/failure-drum-02.mp3';
    }
    audio.play().catch(() => {});
  };

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
    
    const lastActive = localStorage.getItem('lastActiveDate');
    const today = new Date().toDateString();
    if (lastActive !== today) {
      const newStreak = (parseInt(localStorage.getItem('weekStreak') || '0') + 1) % 8;
      setWeekStreak(newStreak);
      localStorage.setItem('weekStreak', newStreak.toString());
      localStorage.setItem('lastActiveDate', today);
    } else {
      setWeekStreak(parseInt(localStorage.getItem('weekStreak') || '0'));
    }
  }, []);

  useEffect(() => {
    if (carbonScore < 20) {
      setTreeSize(150);
      setTreeEmoji('🌳');
    } else if (carbonScore < 40) {
      setTreeSize(120);
      setTreeEmoji('🌳');
    } else if (carbonScore < 60) {
      setTreeSize(90);
      setTreeEmoji('🌳');
    } else if (carbonScore < 80) {
      setTreeSize(50);
      setTreeEmoji('🌱');
    } else {
      setTreeSize(25);
      setTreeEmoji('💀');
    }
  }, [carbonScore]);

  const addActivity = async (activity: any) => {
    let newScore = carbonScore + activity.impact;
    newScore = Math.max(0, Math.min(100, newScore));
    setCarbonScore(newScore);
    const updated = await localStorageDB.updateCarbonScore(userId, newScore, activity.impact, activity);
    setActivities(updated.activities);
    setTotalCO2(updated.totalCO2);
    
    if (activity.impact < 0) playSound('good');
    else if (activity.impact > 0) playSound('bad');
    
    setToast({
      show: true,
      message: `${activity.icon} ${activity.name}: ${activity.impact > 0 ? '+' : ''}${activity.impact} kg CO₂`,
      type: activity.impact > 0 ? 'bad' : 'good'
    });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 2000);
  };
  
  const getPlanetState = () => {
    if (carbonScore < 20) return { text: t('thriving'), color: 'text-green-400', bg: 'from-green-900/50 to-green-800/50' };
    if (carbonScore < 40) return { text: t('healthy'), color: 'text-green-300', bg: 'from-green-900/30 to-green-800/30' };
    if (carbonScore < 60) return { text: t('moderate'), color: 'text-yellow-400', bg: 'from-yellow-900/30 to-yellow-800/30' };
    if (carbonScore < 80) return { text: t('warning'), color: 'text-orange-500', bg: 'from-orange-900/40 to-orange-800/40' };
    return { text: t('critical'), color: 'text-red-600', bg: 'from-red-900/50 to-red-800/50' };
  };
  
  const getPrediction = () => {
    if (carbonScore > 70) return t('pred1');
    if (carbonScore > 50) return t('pred2');
    if (carbonScore > 30) return t('pred3');
    return t('pred4');
  };

  const treesEquivalent = Math.floor(totalCO2 / 21);
  const planetState = getPlanetState();

  const shareOnTwitter = () => {
    const text = `My carbon score is ${carbonScore}! I saved ${totalCO2}kg CO₂. That's equivalent to ${treesEquivalent} trees! 🌍 #CarbonMirror #ClimateAction`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const dailyChallenge = {
    text: language === 'ar' ? "🚲 استخدم الدراجة اليوم بدل السيارة" :
           language === 'de' ? "🚲 Nutze heute das Fahrrad statt des Autos" :
           language === 'fr' ? "🚲 Utilisez le vélo aujourd'hui au lieu de la voiture" :
           "🚲 Use bike today instead of car",
    reward: language === 'ar' ? "10 نقاط إضافية" : "10 bonus points"
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <EarthScene carbonLevel={carbonScore} />
      </div>
      
      <div className="relative z-10 h-full flex flex-col justify-between p-4 md:p-8">
        {/* الهيدر */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg flex items-center gap-2">
              <span className="animate-spin-slow">🌍</span>
              {t('myPlanet')}
            </h1>
            <p className="text-white/70 mt-2 text-sm">
              📋 {activities.length} {t('activitiesToday')}
            </p>
            <p className="text-white/50 text-xs mt-1">
              🌳 {treesEquivalent} {t('treesEquivalent')}
            </p>
            <div className="flex gap-1 mt-2">
              {[1,2,3,4,5,6,7].map((day) => (
                <div key={day} className={`w-2 h-2 rounded-full ${day <= weekStreak ? 'bg-green-500' : 'bg-white/20'}`} />
              ))}
              <span className="text-white/40 text-[10px] ml-1">{weekStreak}/7 days</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <LanguageSelector />
            
            <div className="flex items-center gap-4">
              {/* شجرة واحدة بتكبر */}
              <motion.div
                animate={{ scale: treeSize / 100 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="text-7xl filter drop-shadow-lg"
              >
                {treeEmoji}
              </motion.div>
              
              <div className={`bg-gradient-to-br ${planetState.bg} backdrop-blur-md rounded-2xl p-4 text-center border border-white/20`}>
                <div className="text-4xl font-bold text-white">{carbonScore}</div>
                <div className="text-xs text-white/60">{t('carbonScore')}</div>
                <div className={`text-xl font-bold ${planetState.color} mt-1`}>
                  {planetState.text}
                </div>
                <div className="text-xs text-white/40 mt-1">
                  📊 {totalCO2} kg CO₂
                </div>
                <div className="flex gap-1 mt-2 justify-center">
                  {totalCO2 > 100 && <span className="text-sm" title="Climate Hero">🏅</span>}
                  {treesEquivalent > 10 && <span className="text-sm" title="Tree Planter">🌳</span>}
                  {weekStreak >= 7 && <span className="text-sm" title="Weekly Warrior">⚡</span>}
                  {carbonScore < 30 && <span className="text-sm" title="Eco Master">💚</span>}
                  {activities.length > 100 && <span className="text-sm" title="Veteran">🎖️</span>}
                </div>
              </div>
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
                  <p className="text-white font-bold text-sm">{t('dailyChallenge')}</p>
                  <p className="text-white/90 text-sm">{dailyChallenge.text}</p>
                  <p className="text-yellow-300 text-xs mt-1">{t('reward')}: {dailyChallenge.reward}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* أزرار الأنشطة العلوية */}
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
                <div className="text-xl md:text-2xl mb-1">{activity.icon}</div>
                <div className="text-xs md:text-sm font-bold">{activity.name}</div>
                <div className="text-[10px] md:text-xs text-white/80 mt-0.5">{activity.desc}</div>
              </div>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </motion.button>
          ))}
        </div>
        
        {/* الأزرار السفلية - إيموجي واحد بس ومرتبين */}
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPrediction(!showPrediction)}
            className="px-3 md:px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full text-white font-medium text-xs md:text-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 whitespace-nowrap"
          >
            🔮 {t('futureMode')}
          </motion.button>
          
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 md:px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full text-white font-medium text-xs md:text-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 whitespace-nowrap"
            >
              📊 {t('dashboard')}
            </motion.button>
          </Link>
          
          <Link href="/ranking">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 md:px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full text-white font-medium text-xs md:text-sm transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/50 whitespace-nowrap"
            >
              🏆 {t('ranking')}
            </motion.button>
          </Link>
          
          <Link href="/analytics">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 md:px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-full text-white font-medium text-xs md:text-sm transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/50 whitespace-nowrap"
            >
              📈 {t('analytics')}
            </motion.button>
          </Link>
          
          <Link href="/impact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 md:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-800 rounded-full text-white font-medium text-xs md:text-sm transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 whitespace-nowrap"
            >
              🌍 {t('globalImpact')}
            </motion.button>
          </Link>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareOnTwitter}
            className="px-3 py-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-all duration-300 text-sm border border-white/20"
          >
            🐦
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareOnFacebook}
            className="px-3 py-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-all duration-300 text-sm border border-white/20"
          >
            📘
          </motion.button>
          
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 md:px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300 text-sm whitespace-nowrap border border-white/20"
            >
              🏠 {t('home')}
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
                <h3 className="text-2xl font-bold text-white">{t('prediction2030')}</h3>
              </div>
              <p className="text-white/80 mb-4 text-center">{getPrediction()}</p>
              <div className="w-full bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
                <div className="h-3 rounded-full transition-all duration-1000" style={{ width: `${carbonScore}%`, background: `linear-gradient(90deg, #22c55e, #ef4444)` }} />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center bg-white/10 rounded-xl p-2">
                  <div className="text-white/60 text-xs">{t('totalCO2')}</div>
                  <div className="text-white font-bold">{totalCO2} kg</div>
                </div>
                <div className="text-center bg-white/10 rounded-xl p-2">
                  <div className="text-white/60 text-xs">{t('treesEquivalent')}</div>
                  <div className="text-white font-bold">{treesEquivalent} 🌳</div>
                </div>
              </div>
              <button onClick={() => setShowPrediction(false)} className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-bold hover:opacity-90 transition-all">
                {t('close')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast.show && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`fixed bottom-28 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg ${toast.type === 'good' ? 'bg-green-600' : 'bg-red-600'}`}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}