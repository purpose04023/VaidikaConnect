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

  const t = useCallback((key: string): string => {
    const langTranslations = translations[language];
    if (langTranslations && langTranslations[key]) {
      return langTranslations[key];
    }
    // Fallback to English
    return translations.en?.[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
