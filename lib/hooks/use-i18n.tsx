'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, translations, defaultLocale } from '@/lib/i18n';

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const LOCALE_STORAGE_KEY = 'locale';
const VALID_LOCALES: Locale[] = ['en-US', 'ko-KR'];

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  /* eslint-disable react-hooks/set-state-in-effect -- Hydration from localStorage must happen in effect */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY);

      // Force Korean if stored locale is zh-CN (migration fix)
      if (stored === 'zh-CN' || !stored || !VALID_LOCALES.includes(stored as Locale)) {
        const detected = navigator.language?.startsWith('ko')
          ? 'ko-KR'
          : 'en-US';
        localStorage.setItem(LOCALE_STORAGE_KEY, detected);
        setLocaleState(detected);
        return;
      }

      setLocaleState(stored as Locale);
    } catch {
      // localStorage unavailable, keep default
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: unknown = translations[locale];
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return (typeof value === 'string' ? value : undefined) ?? key;
  };

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
