import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import SeoHead from "@/components/SeoHead";

// SEO-TODO: Vercel's SPA rewrite returns HTTP 200 for unknown paths, so
// this page renders the visible 404 but cannot return a real status
// code without an edge function. The noindex meta tag below is the best
// signal we can give Googlebot today. When ready, add a Vercel edge
// middleware that returns 404 for any path not in the sitemap.
const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SeoHead
        title="Page not found | Build Right USA"
        description="The page you tried to visit does not exist. Head back to Build Right USA's homepage to start a contractor referral request or try the AI Renovation Preview."
        path={location.pathname}
        noindex
      />
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">{t.notFoundTitle}</h1>
          <p className="mb-4 text-xl text-muted-foreground">{t.notFoundText}</p>
          <Link to="/" className="inline-block mt-2 px-6 py-2 bg-accent text-accent-foreground rounded-md font-medium hover:opacity-90 transition-opacity">
            {t.notFoundBack}
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
