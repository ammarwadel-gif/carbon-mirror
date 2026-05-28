export interface GlobalStats {
  totalCO2Saved: number;
  totalTreesEquivalent: number;
  totalActiveUsers: number;
  totalActions: number;
  lastUpdated: string;
}

const STORAGE_KEY = 'carbonmirror_global_stats';

const defaultStats: GlobalStats = {
  totalCO2Saved: 1250000,
  totalTreesEquivalent: 59523,
  totalActiveUsers: 1250,
  totalActions: 45800,
  lastUpdated: new Date().toISOString(),
};

export const getGlobalStats = (): GlobalStats => {
  if (typeof window === 'undefined') return defaultStats;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  return defaultStats;
};

export const saveGlobalStats = (stats: GlobalStats): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export const updateGlobalStats = (co2Added: number): GlobalStats => {
  const stats = getGlobalStats();
  const newStats: GlobalStats = {
    ...stats,
    totalCO2Saved: stats.totalCO2Saved + Math.abs(co2Added),
    totalTreesEquivalent: Math.floor((stats.totalCO2Saved + Math.abs(co2Added)) / 21),
    totalActions: stats.totalActions + 1,
    lastUpdated: new Date().toISOString(),
  };
  saveGlobalStats(newStats);
  return newStats;
};

export const updateActiveUsers = (): void => {
  const stats = getGlobalStats();
  const lastActive = localStorage.getItem('last_active_date');
  const today = new Date().toDateString();
  if (lastActive !== today) {
    localStorage.setItem('last_active_date', today);
    const newStats = { ...stats, totalActiveUsers: stats.totalActiveUsers + 1 };
    saveGlobalStats(newStats);
  }
};