import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const COOKIE_KEY = "brusa_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-16 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[60] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t.cookieText}{" "}
            <Link to="/privacy-policy" className="underline text-accent hover:text-accent/80 transition-colors">
              {t.footerPrivacy}
            </Link>
          </p>
          <button onClick={accept} className="text-muted-foreground hover:text-foreground shrink-0" aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <Button variant="cta" size="sm" className="w-full" onClick={accept}>
          {t.cookieAccept}
        </Button>
      </div>
    </div>
  );
};

export default CookieConsent;
