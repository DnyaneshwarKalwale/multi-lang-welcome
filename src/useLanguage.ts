
import { useLanguage as useLanguageContext } from '@/contexts/LanguageContext';

// This is a wrapper for useLanguage that ensures type safety
export function useLanguage() {
  const languageContext = useLanguageContext();
  
  return {
    ...languageContext,
    // Make sure the setLanguage function only accepts valid language types
    setLanguage: (language: "english" | "german" | "spanish" | "french") => {
      languageContext.setLanguage(language);
    }
  };
}
