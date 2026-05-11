import { useLanguage } from "@/i18n/LanguageContext";
import { LANGUAGES } from "@/i18n/translations";
import { X } from "lucide-react";

export default function LanguageSuggestionBanner() {
  const { suggestedLang, acceptSuggestion, dismissSuggestion, lang } = useLanguage();

  if (!suggestedLang) return null;

  const suggested = LANGUAGES.find((l) => l.code === suggestedLang);
  const current = LANGUAGES.find((l) => l.code === lang);
  if (!suggested || !current) return null;

  return (
    <div className="fixed bottom-6 start-1/2 z-[200] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 duration-300 rtl:translate-x-1/2">
      <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/95 px-5 py-3.5 shadow-2xl backdrop-blur-md">
        <span className="text-2xl">{suggested.flag}</span>
        <p className="min-w-0 flex-1 text-sm text-foreground">
          Switch to <strong>{suggested.label}</strong>?
        </p>
        <button
          onClick={acceptSuggestion}
          className="shrink-0 rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Yes
        </button>
        <button
          onClick={dismissSuggestion}
          className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
        >
          Stay in {current.label}
        </button>
        <button
          onClick={dismissSuggestion}
          className="shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
