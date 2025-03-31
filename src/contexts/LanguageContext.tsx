import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "english" | "german";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Simple translation dictionary
const translations: Record<Language, Record<string, string>> = {
  english: {
    welcomeTitle: "Welcome to Scripe",
    welcomeSubtitle: "Scripe is the content workspace to share valuable posts everyday.",
    welcomeDescription: "Receive tailored, algorithm-optimized LinkedIn posts in <5 minutes.",
    getStarted: "Get started",
    back: "Back",
    continue: "Continue",
    choosePlan: "How would you like to use Scripe?",
    setupWorkspace: "We'll setup your workspace accordingly.",
    forTeam: "For my team",
    forPersonal: "For personal use",
    teamDescription: "One place to create, review and track content for your team.",
    personalDescription: "Create content for a single LinkedIn profile.",
    chooseStyle: "Choose your style",
    styleDescription: "You can change the UI style at any time in the settings.",
    light: "Light",
    dark: "Dark",
    chooseLanguage: "Choose the language of your content",
    languageDescription: "Scripe is in English but you can answer all questions in your chosen language at all times.",
    english: "English",
    german: "German",
    englishDescription: "Recommended for most users to reach larger audience.",
    germanDescription: "Recommended if your main audience is German.",
    formatTitle: "Pick your preferred post formatting style",
    formatDescription: "Scripe is trained on millions of viral posts. When you create posts, the best performing posts about the same topics will be used as a reference.",
    postLength: "Post length",
    superLong: "Super long",
    learnPreferences: "Scripe will learn your individual preferences over time.",
    frequencyTitle: "How often do you want to post per week?",
    frequencyDescription: "We recommend posting at least 1-2 times per week.",
    postingSchedule: "Posting Schedule",
    optimalTime: "Optimal posting time",
    aiSuggest: "AI will suggest",
    onePostWeek: "One post per week",
    postsPerWeek: "posts per week",
    teamInviteTitle: "Invite members to",
    teamInviteDescription: "Team members can collaborate on content creation and share analytics.",
    addTeamMembers: "Invite team members",
    placeholderEmail: "colleague@example.com",
    add: "Add",
    teamMembers: "Team members",
    noMembers: "No team members added yet",
    admin: "Admin",
    member: "Member",
    canInviteLater: "You can invite more members after setup is complete"
  },
  german: {
    welcomeTitle: "Willkommen bei Scripe",
    welcomeSubtitle: "Scripe ist der Content-Workspace, um täglich wertvolle Beiträge zu teilen.",
    welcomeDescription: "Erhalten Sie maßgeschneiderte, algorithmusoptimierte LinkedIn-Beiträge in <5 Minuten.",
    getStarted: "Loslegen",
    back: "Zurück",
    continue: "Weiter",
    choosePlan: "Wie möchten Sie Scripe nutzen?",
    setupWorkspace: "Wir richten Ihren Arbeitsbereich entsprechend ein.",
    forTeam: "Für mein Team",
    forPersonal: "Für persönliche Nutzung",
    teamDescription: "Ein Ort zum Erstellen, Überprüfen und Verfolgen von Inhalten für Ihr Team.",
    personalDescription: "Erstellen Sie Inhalte für ein einzelnes LinkedIn-Profil.",
    chooseStyle: "Wählen Sie Ihren Stil",
    styleDescription: "Sie können den UI-Stil jederzeit in den Einstellungen ändern.",
    light: "Hell",
    dark: "Dunkel",
    chooseLanguage: "Wählen Sie die Sprache Ihrer Inhalte",
    languageDescription: "Scripe ist auf Englisch, aber Sie können alle Fragen jederzeit in Ihrer gewählten Sprache beantworten.",
    english: "Englisch",
    german: "Deutsch",
    englishDescription: "Empfohlen für die meisten Benutzer, um ein größeres Publikum zu erreichen.",
    germanDescription: "Empfohlen, wenn Ihre Hauptzielgruppe deutsch ist.",
    formatTitle: "Wählen Sie Ihren bevorzugten Beitragsformatierungsstil",
    formatDescription: "Scripe wird mit Millionen viraler Beiträge trainiert. Wenn Sie Beiträge erstellen, werden die besten Beiträge zu ähnlichen Themen als Referenz verwendet.",
    postLength: "Beitragslänge",
    superLong: "Sehr lang",
    learnPreferences: "Scripe lernt mit der Zeit Ihre individuellen Präferenzen.",
    frequencyTitle: "Wie oft möchten Sie pro Woche posten?",
    frequencyDescription: "Wir empfehlen, mindestens 1-2 Mal pro Woche zu posten.",
    postingSchedule: "Posting-Zeitplan",
    optimalTime: "Optimale Posting-Zeit",
    aiSuggest: "KI wird vorschlagen",
    onePostWeek: "Ein Beitrag pro Woche",
    postsPerWeek: "Beiträge pro Woche",
    teamInviteTitle: "Laden Sie Mitglieder ein zu",
    teamInviteDescription: "Teammitglieder können bei der Erstellung von Inhalten zusammenarbeiten und Analysen teilen.",
    addTeamMembers: "Teammitglieder einladen",
    placeholderEmail: "kollege@beispiel.de",
    add: "Hinzufügen",
    teamMembers: "Teammitglieder",
    noMembers: "Noch keine Teammitglieder hinzugefügt",
    admin: "Administrator",
    member: "Mitglied",
    canInviteLater: "Sie können nach Abschluss der Einrichtung weitere Mitglieder einladen"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Check if language is saved in localStorage
    const savedLanguage = localStorage.getItem("language") as Language;
    
    // Default to English if no saved preference
    return savedLanguage || "english";
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("language", language);
    
    // Set language attribute on html tag
    document.documentElement.setAttribute("lang", language === "english" ? "en" : "de");
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
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
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
} 