// lib/levels.ts

export interface Level {
  id: number;
  name: string;
  minScore: number;
  maxScore: number;
  icon: string;
  color: string;
  description: string;
}

export const levels: Level[] = [
  { id: 1, name: 'Planet Hero', minScore: 0, maxScore: 20, icon: '🌿', color: 'text-green-400', description: 'You are a true environmental champion!' },
  { id: 2, name: 'Eco Warrior', minScore: 21, maxScore: 40, icon: '🌱', color: 'text-green-300', description: 'Great progress! Keep it up!' },
  { id: 3, name: 'Climate Saver', minScore: 41, maxScore: 60, icon: '⚠️', color: 'text-yellow-400', description: 'Good start, but room for improvement' },
  { id: 4, name: 'Carbon Emitter', minScore: 61, maxScore: 80, icon: '🔥', color: 'text-orange-500', description: 'Your carbon footprint is high!' },
  { id: 5, name: 'Planet Burner', minScore: 81, maxScore: 100, icon: '💀', color: 'text-red-600', description: 'Emergency! Change your habits now!' },
];

export function getLevel(score: number): Level {
  return levels.find(l => score >= l.minScore && score <= l.maxScore) || levels[0];
}

export function getNextLevel(score: number): Level | null {
  const current = getLevel(score);
  const nextIndex = levels.findIndex(l => l.id === current.id) + 1;
  return nextIndex < levels.length ? levels[nextIndex] : null;
}

export function getProgressToNextLevel(score: number): number {
  const current = getLevel(score);
  const next = getNextLevel(score);
  if (!next) return 100;
  
  const progress = ((score - current.minScore) / (current.maxScore - current.minScore)) * 100;
  return Math.min(100, Math.max(0, progress));
}