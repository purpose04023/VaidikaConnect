"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import en from '@/locales/en.json';
import te from '@/locales/te.json';

export type Language = 'en' | 'te' | 'ta' | 'ka' | 'hi';
type Translations = { [key: string]: string };

const translations: { [key in Language]?: Translations } = {
  en,
  te,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Client-side automatic language detection based on browser locale / region
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language_pref') as Language;
      if (savedLang) {
        setLanguage(savedLang);
        return;
      }

      // Detect language based on user's region / browser settings
      const browserLang = navigator.language || (navigator as any).userLanguage;
      if (browserLang) {
        const langCode = browserLang.split('-')[0].toLowerCase();
        const supportedLanguages: Language[] = ['en', 'te', 'ta', 'ka', 'hi'];
        if (supportedLanguages.includes(langCode as Language)) {
          setLanguage(langCode as Language);
          
          if (langCode !== 'en') {
            const googleLangMap: { [key: string]: string } = {
              en: 'en',
              te: 'te',
              ta: 'ta',
              ka: 'kn',
              hi: 'hi'
            };
            const target = googleLangMap[langCode] || langCode;
            document.cookie = `googtrans=/en/${target}; path=/;`;
            document.cookie = `googtrans=/en/${target}; path=/; domain=${window.location.hostname};`;
          }
        }
      }
    }
  }, []);

  const changeLanguage = useCallback((newLang: Language) => {
    setLanguage(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language_pref', newLang);
      
      const googleLangMap: { [key: string]: string } = {
        en: 'en',
        te: 'te',
        ta: 'ta',
        ka: 'kn',
        hi: 'hi'
      };
      const target = googleLangMap[newLang] || newLang;

      if (newLang === 'en') {
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      } else {
        document.cookie = `googtrans=/en/${target}; path=/;`;
        document.cookie = `googtrans=/en/${target}; path=/; domain=${window.location.hostname};`;
      }
      
      // Reload page to instantly apply Google Translate to the entire DOM
      window.location.reload();
    }
  }, []);

  const t = useCallback((key: string): string => {
    const langTranslations = translations[language];
    if (langTranslations && langTranslations[key]) {
      return langTranslations[key];
    }
    return translations.en?.[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

