import React, { createContext, useContext, ReactNode } from "react";

// Simplified language context that only supports English
type LanguageContextType = {
  language: "english";
  setLanguage: () => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Simplified language functions that only return the key
  const t = (key: string): string => key;

  return (
    <LanguageContext.Provider value={{ 
      language: "english", 
      setLanguage: () => {}, // No-op function
      t
    }}>
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