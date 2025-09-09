import React, { createContext, useState, useMemo, useCallback, useContext, ReactNode } from 'react';
import { Language, Translations } from '../types';
import { LOCALES } from '../constants';

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType>({
  language: Language.EN,
  setLanguage: () => {},
  t: (key: string) => LOCALES[Language.EN][key] || key,
});

export function useLocalization() {
    return useContext(LocalizationContext);
}

interface LocalizationProviderProps {
    children: ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(Language.EN);

  const t = useCallback((key: string): string => {
    return LOCALES[language][key] || LOCALES[Language.EN][key] || key;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, t]);

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};
