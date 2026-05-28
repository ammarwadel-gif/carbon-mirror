// hooks/useLanguage.ts
'use client';

import { useState, useEffect } from 'react';
import { translations, Language } from '@/lib/translations';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved && translations[saved]) {
      setLanguage(saved);
      setDirection(saved);
    }
  }, []);

  const setDirection = (lang: Language) => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    setDirection(lang);
    window.location.reload();
  };

  const t = (key: string): string => {
    return translations[language]?.[key as keyof typeof translations.en] || key;
  };

  return { language, changeLanguage, t };
}