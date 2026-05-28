'use client';

import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Language } from '@/lib/translations';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export default function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(l => l.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all text-sm font-bold border border-white/20"
      >
        <span className="text-lg">{currentLang?.flag}</span>
        <span>{currentLang?.name}</span>
        <span className="text-xs">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-xl rounded-2xl py-2 border border-white/20 z-50 min-w-[160px] shadow-xl">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-white/10 transition-colors ${
                language === lang.code ? 'text-green-400' : 'text-white'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
              {language === lang.code && <span className="ml-auto text-green-400">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}