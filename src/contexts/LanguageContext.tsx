
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Update supported languages type
type Language = "english" | "german" | "spanish" | "french";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Check if language is saved in localStorage
    const savedLanguage = localStorage.getItem("language") as Language;
    // Default to English
    return savedLanguage || "english";
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
