'use client';

import { useEffect, useState } from 'react';
import { localStorageDB } from '../../lib/localStorageDB';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [stats, setStats] = useState({
    carbonScore: 0,
    totalCO2: 0,
    treesEquivalent: 0,
    activitiesCount: 0,
    daysActive: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      const userId = localStorageDB.getOrCreateUserId();
      const userData = await localStorageDB.getUserData(userId);
      setStats({
        carbonScore: userData.carbonScore,
        totalCO2: userData.totalCO2,
        treesEquivalent: Math.floor(userData.totalCO2 / 21),
        activitiesCount: userData.activities.length,
        daysActive: userData.daysActive
      });
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold text-white"
          >
            📊 Dashboard
          </motion.h1>
          <Link href="/planet">
            <button className="px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20">
              ← Back to Planet
            </button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/50 backdrop-blur-md rounded-2xl p-6"
          >
            <h3 className="text-lg text-white/60 mb-2">Carbon Score</h3>
            <p className="text-6xl font-bold text-white">{stats.carbonScore}</p>
            <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-green-500 to-red-500 transition-all"
                style={{ width: `${stats.carbonScore}%` }}
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/50 backdrop-blur-md rounded-2xl p-6"
          >
            <h3 className="text-lg text-white/60 mb-2">Total CO₂</h3>
            <p className="text-6xl font-bold text-white">{stats.totalCO2} kg</p>
            <p className="text-green-400 mt-2">🌳 {stats.treesEquivalent} trees equivalent</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/50 backdrop-blur-md rounded-2xl p-6"
          >
            <h3 className="text-lg text-white/60 mb-2">Total Activities</h3>
            <p className="text-6xl font-bold text-white">{stats.activitiesCount}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black/50 backdrop-blur-md rounded-2xl p-6"
          >
            <h3 className="text-lg text-white/60 mb-2">Days Active</h3>
            <p className="text-6xl font-bold text-white">{stats.daysActive}</p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-black/50 backdrop-blur-md rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">🏆 Your Impact</h3>
          <p className="text-white/80">
            {stats.totalCO2 === 0 
              ? "ابدأ بإضافة أنشطة لترى تأثيرك على الكوكب!"
              : `لقد وفرت ${stats.totalCO2} كجم من ثاني أكسيد الكربون، 
                 وهو ما يعادل زراعة ${stats.treesEquivalent} شجرة! 🎉`}
          </p>
        </motion.div>
      </div>
    </div>
  );
}