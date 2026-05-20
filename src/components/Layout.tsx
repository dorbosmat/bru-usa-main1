import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { COMPANY_EMAIL, COMPANY_ADDRESS, SERVICE_AREAS } from "@/lib/constants";
import { Mail, MapPin, Menu, X } from "lucide-react";
import ChatWidget from "@/components/ChatWidget";
import ActivityToast from "@/components/ActivityToast";
import CookieConsent from "@/components/CookieConsent";
import LanguageSuggestionBanner from "@/components/LanguageSuggestionBanner";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { t }    = useLanguage();
  const { isAdmin } = useAuth();

  const NAV_LINKS = [
    { to: "/",                   label: t.navHome },
    { to: "/services",           label: t.navServices },
    { to: "/renovation-preview", label: t.navAiPreview },
    { to: "/about",              label: t.navAbout },
    { to: "/contact",            label: t.navContact },  ];

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-extrabold text-primary-foreground tracking-tight">
            Build Right <span className="text-accent">USA</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to} className={`text-sm font-medium transition-colors ${l.to === "/renovation-preview" ? "nav-ai-preview" : ""} ${location.pathname === l.to ? "text-accent" : "text-primary-foreground/80 hover:text-primary-foreground"}`}>
              {l.label}
            </Link>
          ))}
          <LanguageSelector />
          <Link to="/contact"><Button variant="navCta" size="sm">{t.navGetFreeEstimate}</Button></Link>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSelector />
          <button className="text-primary-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav className="md:hidden bg-primary border-t border-primary-foreground/10 px-4 pb-4">
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
              className={`block py-3 text-sm font-medium border-b border-primary-foreground/10 ${l.to === "/renovation-preview" ? "nav-ai-preview" : ""} ${location.pathname === l.to ? "text-accent" : "text-primary-foreground/80"}`}>
              {l.label}
            </Link>
          ))}
          <Link to="/contact" onClick={() => setMobileOpen(false)}>
            <Button variant="cta" className="w-full mt-3">{t.navGetFreeEstimate}</Button>
          </Link>
        </nav>
      )}
    </header>
  );
};

const Footer = () => {
  const { t } = useLanguage();
  const NAV_LINKS = [
    { to: "/",                   label: t.navHome },
    { to: "/services",           label: t.navServices },
    { to: "/renovation-preview", label: t.navAiPreview },
    { to: "/about",              label: t.navAbout },
    { to: "/contact",            label: t.navContact },
  ];
  return (
    <footer className="bg-navy-dark text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="font-display text-xl font-bold">Build Right <span className="text-accent">USA</span></span>
            <p className="mt-3 text-sm text-primary-foreground/70 leading-relaxed">{t.footerDisclaimer}</p>
          </div>
          <div>
            <h4 className="font-display font-bold mb-3">{t.footerQuickLinks}</h4>
            <div className="space-y-2">
              {NAV_LINKS.map(l => (
                <Link key={l.to} to={l.to} className="block text-sm text-primary-foreground/70 hover:text-accent transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display font-bold mb-3">{t.footerServiceAreas}</h4>
            <div className="space-y-2">
              {SERVICE_AREAS.map(a => (
                <Link key={a.slug} to={`/locations/${a.slug}`} className="block text-sm text-primary-foreground/70 hover:text-accent transition-colors">{a.name}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display font-bold mb-3">{t.footerContactUs}</h4>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              {/* PHONE-TODO: footer previously rendered an Israeli WhatsApp
                  deep-link (wa.me/972…) as the only "Phone:" affordance. Email
                  is the public contact path until a real US callback line is
                  provisioned. Then re-add a <tel:> link sourced from
                  COMPANY_PHONE in src/lib/constants.ts. */}
              <div className="flex items-center gap-2"><Mail size={14} /> <a href={`mailto:${COMPANY_EMAIL}`} className="hover:text-accent transition-colors">{COMPANY_EMAIL}</a></div>
              <div className="flex items-center gap-2"><MapPin size={14} /> <a href="https://www.google.com/maps/search/?api=1&query=11401+NW+12th+St,+Miami,+FL+33172" target="_blank" rel="noopener noreferrer" aria-label="Open address in Google Maps" title="Open in Google Maps" className="hover:text-accent transition-colors underline-offset-2 hover:underline">{COMPANY_ADDRESS}</a></div>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-primary-foreground/10 text-center text-[11px] text-primary-foreground/40 leading-relaxed max-w-2xl mx-auto">
          {t.footerPriceDisclaimer}
        </div>
        <div className="mt-4 pt-4 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/50 space-y-2">
          <p>© {new Date().getFullYear()} Build Right USA – Lead Generation Platform</p>
          <p className="text-[11px] text-primary-foreground/40">{t.footerReferral}</p>
          <div className="flex flex-wrap justify-center gap-x-1 gap-y-1">
            {[["Terms","/terms-of-service"],["Privacy","/privacy-policy"],["Cookies","/cookie-policy"],["Disclaimer","/disclaimer"],["Lead Disclosure","/lead-generation-disclosure"],["CCPA","/ccpa-notice"]].map(([label,path]) => (
              <span key={path} className="flex items-center gap-1">
                <Link to={path} className="hover:text-accent transition-colors">{label}</Link>
                {path !== "/ccpa-notice" && <span>|</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// FIXED: bottom-[76px] on mobile so chat button clears the sticky CTA bar (h-16 = 64px + 12px gap)
const StickyMobileCTA = () => {
  const { t } = useLanguage();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-primary p-3 shadow-[0_-4px_12px_rgba(0,0,0,0.15)]">
      <Link to="/contact"><Button variant="cta" className="w-full">{t.navGetFreeEstimate}</Button></Link>
    </div>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
    <ChatWidget />
    <ActivityToast />
    <StickyMobileCTA />
    <CookieConsent />
    <LanguageSuggestionBanner />
    {/* Spacer so content isn't hidden behind sticky CTA on mobile */}
    <div className="h-16 md:hidden" />
  </div>
);

export default Layout;
