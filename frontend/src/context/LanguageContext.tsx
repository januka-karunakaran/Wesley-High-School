"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ta";

export interface Translations {
  [key: string]: {
    en: string;
    ta: string;
  };
}

export const translations: Translations = {
  // Brand & Crest
  schoolName: {
    en: "Wesley High School",
    ta: "வெஸ்லி உயர்தர பாடசாலை",
  },
  location: {
    en: "Kalmunai",
    ta: "கல்முனை",
  },
  motto: {
    en: "Utmost for the Highest",
    ta: "உயர்ந்தவற்றிற்காக உன்னதம்",
  },
  nationalSchoolBadge: {
    en: "Official National School Portal",
    ta: "அரச தேசிய பாடசாலை இணையத்தளம்",
  },
  established: {
    en: "Established 1885 • National School",
    ta: "நிறுவப்பட்டது 1885 • தேசிய பாடசாலை",
  },
  address: {
    en: "Beach Road, Kalmunai, Eastern Province, Sri Lanka",
    ta: "கடற்கரை வீதி, கல்முனை, கிழக்கு மாகாணம், இலங்கை",
  },

  // Navigation
  navHome: {
    en: "Home",
    ta: "முகப்பு",
  },
  navAbout: {
    en: "About",
    ta: "எங்களை பற்றி",
  },
  navTimetable: {
    en: "Timetable",
    ta: "நேர அட்டவணை",
  },
  navNotices: {
    en: "Notices",
    ta: "அறிவித்தல்கள்",
  },
  navEvents: {
    en: "Events & RSVP",
    ta: "நிகழ்வுகள் & பதிவு",
  },
  navGallery: {
    en: "Gallery",
    ta: "படத்தொகுப்பு",
  },
  navPortal: {
    en: "Student Portal",
    ta: "மாணவர் தளம்",
  },
  navResults: {
    en: "Results",
    ta: "பரீட்சை முடிவுகள்",
  },
  navStaff: {
    en: "Staff",
    ta: "ஆசிரியர் குழாம்",
  },
  navAdmissions: {
    en: "Admissions",
    ta: "சேர்க்கை",
  },
  navContact: {
    en: "Contact",
    ta: "தொடர்பு",
  },

  // Buttons & Actions
  enrollNow: {
    en: "Enroll Now",
    ta: "விண்ணப்பிக்கவும்",
  },
  studentResults: {
    en: "Student Results",
    ta: "மாணவர் முடிவுகள்",
  },
  portalLogin: {
    en: "Portal Login",
    ta: "உள்நுழைவு",
  },
  downloadPdf: {
    en: "Download Official Report Card (PDF)",
    ta: "அதிகாரபூர்வ அறிக்கை அட்டை பதிவிறக்கம் (PDF)",
  },
  viewAllNotices: {
    en: "View All Notices",
    ta: "அனைத்து அறிவித்தல்களையும் பார்க்க",
  },
  registerForEvent: {
    en: "Register / RSVP Now",
    ta: "நிகழ்வுக்கு பதிவு செய்யவும்",
  },

  // Headings
  welcomeTitle: {
    en: "140 Years of Academic & Moral Distinction",
    ta: "140 ஆண்டுகால கல்வி மற்றும் ஒழுக்கச் சிறப்பு",
  },
  welcomeSubtitle: {
    en: "Nurturing intellect, character, and spiritual leadership in the heart of Kalmunai since 1885.",
    ta: "1885 முதல் கல்முனையின் இதயத்தில் அறிவாற்றல், பண்பு மற்றும் தலைமைத்துவத்தை வளர்க்கிறது.",
  },
  announcementsHeading: {
    en: "Collegiate Circulars & Announcements",
    ta: "கல்லூரி சுற்றறிக்கைகள் மற்றும் அறிவித்தல்கள்",
  },
  upcomingEventsHeading: {
    en: "Upcoming Collegiate Events & Sports",
    ta: "வரவிருக்கும் பள்ளி நிகழ்வுகள் & விளையாட்டுப் போட்டிகள்",
  },
  quickStatsStudents: {
    en: "Active Students",
    ta: "கற்கும் மாணவர்கள்",
  },
  quickStatsTeachers: {
    en: "Academic Faculty",
    ta: "ஆசிரியர் குழாம்",
  },
  quickStatsPassRate: {
    en: "O/L & A/L Pass Rate",
    ta: "தேர்ச்சி சதவீதம்",
  },
  quickStatsHeritage: {
    en: "Years of Heritage",
    ta: "பாரம்பரிய ஆண்டுகள்",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wesley_lang") as Language | null;
      if (stored === "en" || stored === "ta") {
        setLanguageState(stored);
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("wesley_lang", lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ta" : "en");
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key]["en"];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      language: "en",
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (key: string) => (translations[key] ? translations[key].en : key),
    };
  }
  return context;
};
