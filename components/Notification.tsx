'use client';

import { useEffect, useState } from 'react';

export default function NotificationManager() {
  const [permission, setPermission] = useState('default');
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // التحقق من دعم الإشعارات
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      setIsSupported(false);
      return;
    }

    setPermission(Notification.permission);
    
    // طلب الإذن بعد 3 ثواني
    const timer = setTimeout(() => {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then((perm) => {
          setPermission(perm);
        });
      }
    }, 3000);
    
    // إشعار يومي
    const checkDailyNotification = () => {
      const lastNotify = localStorage.getItem('lastNotify');
      const today = new Date().toDateString();
      
      if (lastNotify !== today && Notification.permission === 'granted') {
        // إشعار التحدي اليومي
        new Notification('🌍 CarbonMirror Daily Challenge', {
          body: 'Complete today\'s challenge to improve your carbon score! 🎯',
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'daily-challenge',
        });
        
        localStorage.setItem('lastNotify', today);
      }
    };
    
    // فحص الإشعار اليومي عند تحميل الصفحة
    checkDailyNotification();
    
    // تعيين فحص كل ساعة
    const interval = setInterval(checkDailyNotification, 60 * 60 * 1000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // عرض زر لطلب الإذن إذا لم يتم منحه بعد
  const requestPermission = () => {
    Notification.requestPermission().then((perm) => {
      setPermission(perm);
    });
  };

  if (!isSupported) return null;

  return (
    <>
      {permission === 'default' && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 bg-black/90 backdrop-blur-xl rounded-2xl p-4 border border-blue-500">
          <p className="text-white text-sm mb-2">🔔 Enable notifications for daily challenges!</p>
          <button
            onClick={requestPermission}
            className="px-4 py-2 bg-blue-600 rounded-lg text-white text-sm font-bold"
          >
            Allow Notifications
          </button>
        </div>
      )}
    </>
  );
}