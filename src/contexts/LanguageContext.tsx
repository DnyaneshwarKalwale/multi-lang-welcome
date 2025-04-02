
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

// Export the context as a named export
export const LanguageContext = createContext<LanguageContextType>({
  language: 'english',
  setLanguage: () => {},
  t: (key: string) => key
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('english');

  // Simple translation function
  const t = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      english: {
        chooseLanguage: 'Choose your preferred language',
        languageDescription: 'Select the language you want to use for generating content',
        english: 'English',
        englishDescription: 'Content will be generated in English',
        german: 'German',
        germanDescription: 'Content will be generated in German',
        continue: 'Continue',
        welcomeTitle: 'Welcome to Scripe',
        welcomeSubtitle: 'Let\'s get you set up to start creating amazing content'
      },
      german: {
        chooseLanguage: 'Wählen Sie Ihre bevorzugte Sprache',
        languageDescription: 'Wählen Sie die Sprache, in der Sie Inhalte generieren möchten',
        english: 'Englisch',
        englishDescription: 'Inhalte werden auf Englisch generiert',
        german: 'Deutsch',
        germanDescription: 'Inhalte werden auf Deutsch generiert',
        continue: 'Fortfahren',
        welcomeTitle: 'Willkommen bei Scripe',
        welcomeSubtitle: 'Lassen Sie uns einrichten, damit Sie erstaunliche Inhalte erstellen können'
      }
    };

    return translations[language]?.[key] || key;
  };

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
