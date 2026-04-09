'use client';

import { useEffect, useState } from 'react';
import { localStorageDB } from '@/lib/localStorageDB';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AnalyticsPage() {
  const [carbonHistory, setCarbonHistory] = useState<number[]>([25, 25, 25]);
  const [totalCO2, setTotalCO2] = useState(0);
  const [carbonScore, setCarbonScore] = useState(25);

  useEffect(() => {
    const loadData = async () => {
      const userId = localStorageDB.getOrCreateUserId();
      const data = await localStorageDB.getUserData(userId);
      setCarbonScore(data.carbonScore);
      setTotalCO2(data.totalCO2);
      
      // محاكاة تاريخ الكربون (من localStorage)
      const savedHistory = localStorage.getItem('carbonHistory');
      if (savedHistory) {
        setCarbonHistory(JSON.parse(savedHistory));
      } else {
        const history = [data.carbonScore, data.carbonScore, data.carbonScore];
        setCarbonHistory(history);
        localStorage.setItem('carbonHistory', JSON.stringify(history));
      }
    };
    loadData();
  }, []);

  // تحديث التاريخ عند تغيير الـ score
  useEffect(() => {
    const updateHistory = async () => {
      const userId = localStorageDB.getOrCreateUserId();
      const data = await localStorageDB.getUserData(userId);
      const newHistory = [...carbonHistory.slice(-6), data.carbonScore];
      setCarbonHistory(newHistory);
      localStorage.setItem('carbonHistory', JSON.stringify(newHistory));
    };
    
    const timer = setTimeout(() => {
      updateHistory();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [carbonScore]);

  // بيانات الرسم الخطي
  const lineData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'],
    datasets: [
      {
        label: 'Carbon Score',
        data: [...carbonHistory, carbonScore],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // بيانات الرسم الدائري
  const doughnutData = {
    labels: ['Transport', 'Food', 'Energy', 'Saved'],
    datasets: [
      {
        data: [35, 28, 22, 15],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: 'white' },
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: 'white' },
      },
      x: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: 'white' },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: 'white' },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold text-white"
          >
            📊 Analytics
          </motion.h1>
          <Link href="/planet">
            <button className="px-4 py-2 bg-white/10 rounded-lg text-white">
              ← Back
            </button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Line Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/50 backdrop-blur-md rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">📈 Carbon Trend</h3>
            <Line data={lineData} options={options} />
          </motion.div>

          {/* Doughnut Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/50 backdrop-blur-md rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">🥧 Impact Distribution</h3>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/50 backdrop-blur-md rounded-2xl p-4 text-center"
          >
            <p className="text-3xl font-bold text-green-400">{carbonScore}</p>
            <p className="text-white/60 text-sm">Current Score</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black/50 backdrop-blur-md rounded-2xl p-4 text-center"
          >
            <p className="text-3xl font-bold text-blue-400">{totalCO2} kg</p>
            <p className="text-white/60 text-sm">Total CO₂</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-black/50 backdrop-blur-md rounded-2xl p-4 text-center"
          >
            <p className="text-3xl font-bold text-purple-400">
              {carbonScore < 30 ? 'Good' : carbonScore < 60 ? 'Medium' : 'Bad'}
            </p>
            <p className="text-white/60 text-sm">Status</p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-black/50 backdrop-blur-md rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-3">💡 Insights</h3>
          <ul className="space-y-2 text-white/80 text-sm">
            <li>• {carbonScore < 30 ? "Excellent! You're 80% lower than average" : "Keep going! Small changes = big impact"}</li>
            <li>• {totalCO2 > 100 ? `You saved ${totalCO2}kg CO₂ = ${Math.floor(totalCO2 / 21)} trees!` : "Complete more activities to see your impact"}</li>
            <li>• {carbonScore > 50 ? "Try using bike instead of car to reduce score" : "Great job maintaining low carbon score!"}</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}