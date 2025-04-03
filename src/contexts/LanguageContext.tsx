
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Update supported languages type
type Language = "english" | "german" | "spanish" | "french";

// Define translations type
type Translations = {
  [key: string]: string;
};

// Sample translations
const translations: Record<Language, Translations> = {
  english: {
    createAccount: "Create Account",
    personalizeExperience: "Personalize your experience",
    firstName: "First Name",
    lastName: "Last Name",
    usernamePreview: "Username Preview",
    profileAppear: "This is how your profile will appear to others",
    continue: "Continue",
    skipToDashboard: "Skip to Dashboard",
    choosePlan: "Choose Your Plan",
    setupWorkspace: "Set up your workspace the way you like",
    forTeam: "For Teams",
    teamDescription: "Collaborate with teammates, share content, and manage projects together.",
    forPersonal: "For Personal Use",
    personalDescription: "Manage your own content and projects without team features.",
    chooseStyle: "Choose Your Style",
    styleDescription: "Select the theme that works best for you",
    light: "Light Mode",
    dark: "Dark Mode",
    connectTwitter: "Connect Twitter",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    create: "Create",
    schedule: "Schedule",
    analytics: "Analytics",
    myTweets: "My Tweets",
    createNewTweet: "Create New Tweet",
    recordVoice: "Record Voice",
    writeText: "Write Text",
    uploadMedia: "Upload Media",
    whatsHappening: "What's happening?",
    characters: "characters",
    generateWithAI: "Generate with AI",
    postTweet: "Post Tweet",
    preview: "Preview",
    previewDescription: "See how your tweet will look",
    upcomingTweets: "Upcoming Tweets",
    scheduledPublication: "Scheduled for publication",
    viewCalendar: "View Calendar",
    aiSuggestions: "AI Suggestions",
    trendingTopics: "Trending topics to write about",
    contentCalendar: "Content Calendar",
    manageSchedule: "Manage your publishing schedule",
    impressions: "Impressions",
    totalViews: "Total views of your tweets",
    engagementRate: "Engagement Rate",
    interactions: "Likes, retweets and replies",
    followersGrowth: "Followers Growth",
    newFollowers: "New followers over time"
  },
  german: {
    createAccount: "Konto erstellen",
    personalizeExperience: "Personalisiere deine Erfahrung",
    firstName: "Vorname",
    lastName: "Nachname",
    usernamePreview: "Benutzername Vorschau",
    profileAppear: "So wird dein Profil für andere aussehen",
    continue: "Weiter",
    skipToDashboard: "Zum Dashboard",
    choosePlan: "Wähle deinen Plan",
    setupWorkspace: "Richte deinen Arbeitsbereich ein",
    forTeam: "Für Teams",
    teamDescription: "Arbeite mit Teammitgliedern zusammen und verwalte Projekte gemeinsam.",
    forPersonal: "Für persönliche Nutzung",
    personalDescription: "Verwalte deine eigenen Inhalte ohne Team-Funktionen.",
    chooseStyle: "Wähle deinen Stil",
    styleDescription: "Wähle das Theme, das am besten zu dir passt",
    light: "Heller Modus",
    dark: "Dunkler Modus",
    connectTwitter: "Twitter verbinden",
    profile: "Profil",
    settings: "Einstellungen",
    logout: "Abmelden",
    create: "Erstellen",
    schedule: "Planen",
    analytics: "Analysen",
    myTweets: "Meine Tweets",
    createNewTweet: "Neuen Tweet erstellen",
    recordVoice: "Stimme aufnehmen",
    writeText: "Text schreiben",
    uploadMedia: "Medien hochladen",
    whatsHappening: "Was passiert gerade?",
    characters: "Zeichen",
    generateWithAI: "Mit KI generieren",
    postTweet: "Tweet posten",
    preview: "Vorschau",
    previewDescription: "So wird dein Tweet aussehen",
    upcomingTweets: "Kommende Tweets",
    scheduledPublication: "Geplant zur Veröffentlichung",
    viewCalendar: "Kalender anzeigen",
    aiSuggestions: "KI-Vorschläge",
    trendingTopics: "Beliebte Themen zum Schreiben",
    contentCalendar: "Inhaltskalender",
    manageSchedule: "Verwalte deinen Veröffentlichungsplan",
    impressions: "Impressionen",
    totalViews: "Gesamtaufrufe deiner Tweets",
    engagementRate: "Engagement-Rate",
    interactions: "Likes, Retweets und Antworten",
    followersGrowth: "Follower-Wachstum",
    newFollowers: "Neue Follower im Zeitverlauf"
  },
  spanish: {
    createAccount: "Crear Cuenta",
    personalizeExperience: "Personaliza tu experiencia",
    firstName: "Nombre",
    lastName: "Apellido",
    usernamePreview: "Vista previa del nombre de usuario",
    profileAppear: "Así es como verán tu perfil los demás",
    continue: "Continuar",
    skipToDashboard: "Ir al Dashboard",
    choosePlan: "Elige tu Plan",
    setupWorkspace: "Configura tu espacio de trabajo",
    forTeam: "Para Equipos",
    teamDescription: "Colabora con compañeros y gestiona proyectos juntos.",
    forPersonal: "Para Uso Personal",
    personalDescription: "Gestiona tu propio contenido sin funciones de equipo.",
    chooseStyle: "Elige tu Estilo",
    styleDescription: "Selecciona el tema que mejor funcione para ti",
    light: "Modo Claro",
    dark: "Modo Oscuro",
    connectTwitter: "Conectar Twitter",
    profile: "Perfil",
    settings: "Configuración",
    logout: "Cerrar sesión",
    create: "Crear",
    schedule: "Programar",
    analytics: "Analíticas",
    myTweets: "Mis Tweets",
    createNewTweet: "Crear Nuevo Tweet",
    recordVoice: "Grabar Voz",
    writeText: "Escribir Texto",
    uploadMedia: "Subir Medios",
    whatsHappening: "¿Qué está pasando?",
    characters: "caracteres",
    generateWithAI: "Generar con IA",
    postTweet: "Publicar Tweet",
    preview: "Vista Previa",
    previewDescription: "Así se verá tu tweet",
    upcomingTweets: "Próximos Tweets",
    scheduledPublication: "Programados para publicación",
    viewCalendar: "Ver Calendario",
    aiSuggestions: "Sugerencias de IA",
    trendingTopics: "Temas tendencia para escribir",
    contentCalendar: "Calendario de Contenido",
    manageSchedule: "Gestiona tu calendario de publicación",
    impressions: "Impresiones",
    totalViews: "Vistas totales de tus tweets",
    engagementRate: "Tasa de Interacción",
    interactions: "Likes, retweets y respuestas",
    followersGrowth: "Crecimiento de Seguidores",
    newFollowers: "Nuevos seguidores a lo largo del tiempo"
  },
  french: {
    createAccount: "Créer un Compte",
    personalizeExperience: "Personnalisez votre expérience",
    firstName: "Prénom",
    lastName: "Nom",
    usernamePreview: "Aperçu du nom d'utilisateur",
    profileAppear: "Voici comment votre profil apparaîtra aux autres",
    continue: "Continuer",
    skipToDashboard: "Aller au Tableau de bord",
    choosePlan: "Choisissez Votre Plan",
    setupWorkspace: "Configurez votre espace de travail",
    forTeam: "Pour les Équipes",
    teamDescription: "Collaborez avec des coéquipiers et gérez des projets ensemble.",
    forPersonal: "Pour Usage Personnel",
    personalDescription: "Gérez votre propre contenu sans fonctionnalités d'équipe.",
    chooseStyle: "Choisissez Votre Style",
    styleDescription: "Sélectionnez le thème qui vous convient le mieux",
    light: "Mode Clair",
    dark: "Mode Sombre",
    connectTwitter: "Connecter Twitter",
    profile: "Profil",
    settings: "Paramètres",
    logout: "Déconnexion",
    create: "Créer",
    schedule: "Planifier",
    analytics: "Analyses",
    myTweets: "Mes Tweets",
    createNewTweet: "Créer un Nouveau Tweet",
    recordVoice: "Enregistrer Voix",
    writeText: "Écrire Texte",
    uploadMedia: "Télécharger Média",
    whatsHappening: "Quoi de neuf ?",
    characters: "caractères",
    generateWithAI: "Générer avec IA",
    postTweet: "Publier Tweet",
    preview: "Aperçu",
    previewDescription: "Voici à quoi ressemblera votre tweet",
    upcomingTweets: "Tweets à Venir",
    scheduledPublication: "Programmés pour publication",
    viewCalendar: "Voir Calendrier",
    aiSuggestions: "Suggestions IA",
    trendingTopics: "Sujets tendance à écrire",
    contentCalendar: "Calendrier de Contenu",
    manageSchedule: "Gérez votre calendrier de publication",
    impressions: "Impressions",
    totalViews: "Vues totales de vos tweets",
    engagementRate: "Taux d'Engagement",
    interactions: "J'aimes, retweets et réponses",
    followersGrowth: "Croissance des Abonnés",
    newFollowers: "Nouveaux abonnés au fil du temps"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string; // Add translation function
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
