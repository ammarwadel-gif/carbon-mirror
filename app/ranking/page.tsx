'use client';

import { useEffect, useState } from 'react';
import { localStorageDB } from '../../lib/localStorageDB';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RankingPage() {
  const [userScore, setUserScore] = useState(0);
  const [totalCO2, setTotalCO2] = useState(0);
  const [activitiesCount, setActivitiesCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const userId = localStorageDB.getOrCreateUserId();
      const data = await localStorageDB.getUserData(userId);
      setUserScore(data.carbonScore);
      setTotalCO2(data.totalCO2);
      setActivitiesCount(data.activities.length);
    };
    loadData();
  }, []);

  const achievements = [
    { name: '🌿 Save 100kg CO₂', requirement: 100, current: totalCO2, icon: '🌿' },
    { name: '🚲 Use bike 10 times', requirement: 10, current: 0, icon: '🚲' },
    { name: '🥗 Eat 20 vegan meals', requirement: 20, current: 0, icon: '🥗' },
    { name: '♻️ Recycle 30 times', requirement: 30, current: 0, icon: '♻️' },
    { name: '🔥 Keep score under 30', requirement: 30, current: userScore, icon: '🔥' },
    { name: '⭐ Complete 100 activities', requirement: 100, current: activitiesCount, icon: '⭐' },
  ];

  const completedAchievements = achievements.filter(a => a.current >= a.requirement).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            🏆 Rankings
          </h1>
          <p className="text-white/60">Track your achievements and progress</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-600/30 to-blue-600/30 backdrop-blur-md rounded-2xl p-6 mb-6"
        >
          <div className="text-center">
            <h3 className="text-lg text-white/70 mb-2">Your Carbon Score</h3>
            <p className="text-7xl font-bold text-green-400">{userScore}</p>
            <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-green-500 to-red-500 transition-all"
                style={{ width: `${Math.min(userScore, 100)}%` }}
              />
            </div>
            <p className="text-white/60 mt-3 text-sm">
              {userScore < 30 ? "🌿 Excellent! You're a planet hero!" :
               userScore < 50 ? "🌱 Good! Keep improving!" :
               userScore < 70 ? "⚠️ Need improvement!" : 
               "🔥 Critical! Change your habits now!"}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/50 backdrop-blur-md rounded-2xl p-4 text-center"
          >
            <p className="text-3xl font-bold text-blue-400">{totalCO2} kg</p>
            <p className="text-white/60 text-sm">Total CO₂ Saved</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/50 backdrop-blur-md rounded-2xl p-4 text-center"
          >
            <p className="text-3xl font-bold text-green-400">{Math.floor(totalCO2 / 21)}</p>
            <p className="text-white/60 text-sm">Trees Equivalent</p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-black/50 backdrop-blur-md rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">🏆 Achievements</h3>
            <span className="text-sm text-white/60">{completedAchievements}/{achievements.length} completed</span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all"
              style={{ width: `${(completedAchievements / achievements.length) * 100}%` }}
            />
          </div>
          
          <div className="space-y-3">
            {achievements.map((ach, index) => {
              const isCompleted = ach.current >= ach.requirement;
              const progress = Math.min((ach.current / ach.requirement) * 100, 100);
              
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-3 rounded-lg transition-all ${
                    isCompleted ? 'bg-green-600/20 border border-green-500' : 'bg-white/5'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{ach.icon}</span>
                      <span className={isCompleted ? 'text-green-300 font-medium' : 'text-white/70'}>
                        {ach.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/50">
                        {ach.current}/{ach.requirement}
                      </span>
                      {isCompleted && <span className="text-green-400">✅</span>}
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all ${
                        isCompleted ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="mt-6 flex gap-3">
          <Link href="/planet" className="flex-1">
            <button className="w-full py-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all">
              ← Back to Planet
            </button>
          </Link>
          <Link href="/dashboard" className="flex-1">
            <button className="w-full py-3 bg-blue-600/50 rounded-lg text-white hover:bg-blue-700/50 transition-all">
              📊 Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}