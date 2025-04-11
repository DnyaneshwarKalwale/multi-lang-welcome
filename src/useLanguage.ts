// Simple mock of language functionality since we've removed the language feature
export type LanguageType = 'english';

// This provides a simplified version with only English
export function useLanguage() {
  return {
    language: 'english' as LanguageType,
    setLanguage: () => {}, // No-op function
    t: (key: string) => key, // Just returns the key as is
  };
}
