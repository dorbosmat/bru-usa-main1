import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, translations, LANGUAGES, RTL_LANGUAGES } from "./translations";

type TranslationKeys = typeof translations.en;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationKeys;
  dir: "ltr" | "rtl";
  isRTL: boolean;
  suggestedLang: Language | null;
  dismissSuggestion: () => void;
  acceptSuggestion: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "brusa_lang";
const MANUAL_KEY = "brusa_lang_manual";

const SUPPORTED: Language[] = LANGUAGES.map((l) => l.code);

function detectBrowserLanguage(): Language | null {
  const langs = navigator.languages ?? [navigator.language];
  for (const raw of langs) {
    const code = raw.split("-")[0].toLowerCase() as Language;
    if (SUPPORTED.includes(code)) return code;
  }
  return null;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved in translations) return saved as Language;
    return "en";
  });

  const [suggestedLang, setSuggestedLang] = useState<Language | null>(null);

  // On mount: detect browser language and suggest if different
  useEffect(() => {
    const manual = localStorage.getItem(MANUAL_KEY);
    if (manual) return; // User already made a choice, never auto-suggest

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved in translations) return; // Already has a saved preference

    const detected = detectBrowserLanguage();
    if (detected && detected !== "en") {
      setSuggestedLang(detected);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
    localStorage.setItem(MANUAL_KEY, "1");
    setSuggestedLang(null);
  };

  const dismissSuggestion = () => {
    localStorage.setItem(MANUAL_KEY, "1");
    localStorage.setItem(STORAGE_KEY, lang);
    setSuggestedLang(null);
  };

  const acceptSuggestion = () => {
    if (suggestedLang) {
      setLang(suggestedLang);
    }
  };

  const isRTL = RTL_LANGUAGES.includes(lang);
  const dir = isRTL ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, t: translations[lang], dir, isRTL, suggestedLang, dismissSuggestion, acceptSuggestion }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
