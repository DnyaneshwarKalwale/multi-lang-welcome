
import { useLanguage as useLanguageContext } from '@/contexts/LanguageContext';

// Define the LanguageType that matches what's in LanguageContext
type LanguageType = 'english' | 'german' | 'spanish' | 'french';

// This is a wrapper for useLanguage that ensures type safety
export function useLanguage() {
  const languageContext = useLanguageContext();
  
  return {
    ...languageContext,
    // Make sure the setLanguage function only accepts valid language types
    setLanguage: (language: LanguageType) => {
      languageContext.setLanguage(language as any);
    }
  };
}
