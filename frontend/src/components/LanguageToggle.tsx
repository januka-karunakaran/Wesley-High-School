"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Languages } from "lucide-react";

interface LanguageToggleProps {
  className?: string;
  variant?: "pill" | "button" | "minimal";
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  className = "",
  variant = "pill",
}) => {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  if (variant === "minimal") {
    return (
      <button
        onClick={toggleLanguage}
        className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded transition-colors ${
          language === "ta" ? "text-amber-300 bg-amber-500/10" : "text-slate-300 hover:text-white"
        } ${className}`}
        title="Switch language / மொழியை மாற்றுக"
      >
        <Languages className="w-3.5 h-3.5 text-amber-400" />
        <span>{language === "en" ? "தமிழ்" : "English"}</span>
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-lg bg-[#071526]/80 border border-amber-500/30 shadow-inner backdrop-blur-sm ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
          language === "en"
            ? "bg-amber-500 text-slate-950 shadow-sm"
            : "text-slate-300 hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("ta")}
        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
          language === "ta"
            ? "bg-amber-500 text-slate-950 shadow-sm font-sans"
            : "text-slate-300 hover:text-white"
        }`}
      >
        தமிழ்
      </button>
    </div>
  );
};
