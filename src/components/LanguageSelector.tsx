import { Check, ChevronDown } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { LANGUAGES, Language } from "@/i18n/translations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ──────────────────────────────────────────────
   Crisp SVG flags — uniform 24×16 with 2px radius
   ────────────────────────────────────────────── */

function FlagIcon({ code, size = "sm" }: { code: Language; size?: "sm" | "md" }) {
  const dim = size === "md" ? "h-[18px] w-[27px]" : "h-4 w-6";

  const flags: Record<Language, JSX.Element> = {
    en: (
      <svg viewBox="0 0 60 40">
        <rect width="60" height="40" fill="#fff" />
        <g>{[0, 6, 12, 18, 24, 30, 36].map((y, i) => i % 2 === 0 && <rect key={y} y={y} width="60" height="3.08" fill="#B22234" />)}</g>
        <rect width="24" height="21.5" fill="#3C3B6E" />
        {/* simplified stars pattern */}
        {[3.5, 8.5, 13.5, 18.5].map((x) =>
          [3, 7, 11, 15, 19].map((y) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9" fill="#fff" />
          ))
        )}
        {[6, 11, 16].map((x) =>
          [5, 9, 13, 17].map((y) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9" fill="#fff" />
          ))
        )}
      </svg>
    ),
    es: (
      <svg viewBox="0 0 60 40">
        <rect width="60" height="10" fill="#AA151B" />
        <rect y="10" width="60" height="20" fill="#F1BF00" />
        <rect y="30" width="60" height="10" fill="#AA151B" />
      </svg>
    ),
    ar: (
      <svg viewBox="0 0 60 40">
        <rect width="60" height="40" fill="#006C35" />
        <text x="30" y="24" textAnchor="middle" fill="#fff" fontSize="10" fontFamily="serif" style={{ direction: "rtl" }}>لا إله</text>
        <rect x="22" y="28" width="16" height="1.5" rx="0.75" fill="#fff" />
      </svg>
    ),
    ru: (
      <svg viewBox="0 0 60 40">
        <rect width="60" height="13.33" fill="#fff" />
        <rect y="13.33" width="60" height="13.34" fill="#0039A6" />
        <rect y="26.67" width="60" height="13.33" fill="#D52B1E" />
      </svg>
    ),
    pt: (
      <svg viewBox="0 0 60 40">
        <rect width="60" height="40" fill="#009B3A" />
        <polygon points="30,5 55,20 30,35 5,20" fill="#FEDF00" />
        <circle cx="30" cy="20" r="7" fill="#002776" />
        <path d="M23.5 20 Q30 15 36.5 20 Q30 25 23.5 20" fill="none" stroke="#fff" strokeWidth="0.8" />
      </svg>
    ),
    he: (
      <svg viewBox="0 0 60 40">
        <rect width="60" height="40" fill="#fff" />
        <rect y="5" width="60" height="5" fill="#0038B8" />
        <rect y="30" width="60" height="5" fill="#0038B8" />
        <polygon points="30,12 36,23 24,23" fill="none" stroke="#0038B8" strokeWidth="1.8" />
        <polygon points="30,27 36,16 24,16" fill="none" stroke="#0038B8" strokeWidth="1.8" />
      </svg>
    ),
    hi: (
      <svg viewBox="0 0 60 40">
        <rect width="60" height="13.33" fill="#FF9933" />
        <rect y="13.33" width="60" height="13.34" fill="#fff" />
        <rect y="26.67" width="60" height="13.33" fill="#138808" />
        <circle cx="30" cy="20" r="4" fill="none" stroke="#000080" strokeWidth="1" />
        <circle cx="30" cy="20" r="0.8" fill="#000080" />
      </svg>
    ),
    zh: (
      <svg viewBox="0 0 60 40">
        <rect width="60" height="40" fill="#DE2910" />
        <polygon points="12,8 13.8,13.5 10,10.2 14,10.2 10.2,13.5" fill="#FFDE00" />
        <polygon points="22,4 22.7,6.2 21,5 23,5 21.3,6.2" fill="#FFDE00" />
        <polygon points="26,8 26.7,10.2 25,9 27,9 25.3,10.2" fill="#FFDE00" />
        <polygon points="26,14 26.7,16.2 25,15 27,15 25.3,16.2" fill="#FFDE00" />
        <polygon points="22,18 22.7,20.2 21,19 23,19 21.3,20.2" fill="#FFDE00" />
      </svg>
    ),
  };

  return (
    <span
      className={`inline-block ${dim} shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10`}
      style={{ lineHeight: 0 }}
    >
      {flags[code]}
    </span>
  );
}

/* ──────────────────────────────────────────────
   Language Selector
   ────────────────────────────────────────────── */

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group inline-flex items-center gap-2 rounded-lg border border-primary-foreground/15 bg-primary-foreground/[0.06] px-3 py-2 text-[13px] font-semibold text-primary-foreground/90 transition-all duration-200 hover:bg-primary-foreground/[0.12] hover:border-primary-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/30"
          aria-label="Select language"
          dir="ltr"
        >
          <FlagIcon code={current.code} />
          <span className="uppercase tracking-wide">{current.code}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56 rounded-xl border border-border/50 bg-popover p-1.5 shadow-xl shadow-black/10"
      >
        {LANGUAGES.map((language) => {
          const selected = language.code === lang;
          return (
            <DropdownMenuItem
              key={language.code}
              onSelect={() => setLang(language.code)}
              className={`group/item flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-all duration-200 focus:bg-accent/10 focus:text-foreground ${
                selected
                  ? "bg-accent/[0.08] font-semibold text-accent"
                  : "font-medium text-foreground/80 hover:bg-foreground/[0.04] hover:text-foreground"
              }`}
              dir="ltr"
            >
              <FlagIcon code={language.code} size="md" />
              <span className="flex-1 truncate" dir={language.dir}>
                {language.label}
              </span>
              {selected && (
                <Check className="h-3.5 w-3.5 shrink-0 text-accent opacity-80" strokeWidth={2.5} />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
