// lib/localStorageDB.ts

export interface UserData {
  carbonScore: number;
  totalCO2: number;
  daysActive: number;
  activities: Array<{
    id: string;
    name: string;
    impact: number;
    desc: string;
    timestamp: string;
  }>;
  lastUpdated: string;
}

class LocalStorageDB {
  private getUserKey(userId: string): string {
    return `carbonmirror_${userId}`;
  }

  getOrCreateUserId(): string {
    let userId = localStorage.getItem('carbonmirror_userId');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('carbonmirror_userId', userId);
    }
    return userId;
  }

  async saveUserData(userId: string, data: Partial<UserData>): Promise<UserData> {
    const key = this.getUserKey(userId);
    const existing = await this.getUserData(userId);
    const merged = { 
      ...existing, 
      ...data, 
      lastUpdated: new Date().toISOString() 
    };
    localStorage.setItem(key, JSON.stringify(merged));
    return merged;
  }

  async getUserData(userId: string): Promise<UserData> {
    const key = this.getUserKey(userId);
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    return {
      carbonScore: 25,
      totalCO2: 0,
      daysActive: 1,
      activities: [],
      lastUpdated: new Date().toISOString()
    };
  }

  async updateCarbonScore(userId: string, newScore: number, impact: number, activity: any): Promise<UserData> {
    const userData = await this.getUserData(userId);
    
    const newActivity = {
      ...activity,
      timestamp: new Date().toISOString()
    };
    
    const updated = {
      ...userData,
      carbonScore: Math.max(0, Math.min(100, newScore)),
      totalCO2: userData.totalCO2 + Math.abs(impact),
      daysActive: userData.daysActive + 1,
      activities: [newActivity, ...userData.activities].slice(0, 50),
      lastUpdated: new Date().toISOString()
    };
    
    await this.saveUserData(userId, updated);
    return updated;
  }

  async clearAllData(): Promise<void> {
    const userId = this.getOrCreateUserId();
    const key = this.getUserKey(userId);
    localStorage.removeItem(key);
  }
}

export const localStorageDB = new LocalStorageDB();