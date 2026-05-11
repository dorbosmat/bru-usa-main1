import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { COMPANY_PHONE, COMPANY_EMAIL, COMPANY_ADDRESS, SERVICE_AREAS } from "@/lib/constants";
import { Phone, Mail, MapPin, Menu, X } from "lucide-react";
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
              <div className="flex items-center gap-2"><a href="https://wa.me/972503721520?text=Hi%2C%20I%20saw%20your%20website%20and%20want%20a%20quote" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" title="Chat with us on WhatsApp" className="inline-flex"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.15 1.6 5.96L2 22l4.25-1.11a9.9 9.9 0 0 0 5.79 1.85h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2zm5.81 14.13c-.25.69-1.41 1.32-1.97 1.41-.5.07-1.13.1-1.83-.12-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.83-4.2-4.97-4.39-.15-.19-1.19-1.58-1.19-3.01 0-1.43.75-2.13 1.02-2.42.27-.29.59-.36.79-.36h.57c.18 0 .43-.07.67.51.25.6.84 2.07.91 2.22.07.15.12.32.02.51-.1.19-.15.31-.3.48-.15.17-.31.38-.45.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.07 1.31 2.36 1.46.29.15.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.39-.24.65-.15.27.1 1.71.81 2 .96.29.15.49.22.56.34.07.13.07.74-.18 1.43z"/></svg></a></div>
              <div className="flex items-center gap-2"><Mail size={14} /> {COMPANY_EMAIL}</div>
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
