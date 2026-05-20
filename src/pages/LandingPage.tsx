import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import LeadForm from "@/components/LeadForm";
import { SERVICES, SERVICE_AREAS } from "@/lib/constants";
import { Shield, Users, CheckCircle } from "lucide-react";
import heroImage from "@/assets/home/hero-construction.jpg";
import NotFound from "./NotFound";

// TRUST-TODO: previous TRUST_BADGES included "4.8 ⭐ Average Rating" — a
// fabricated review-score claim that Tasks 2/8/9 cleaned everywhere else.
// Removed. When a real verified-review surface (Google Business Profile,
// Trustpilot) ships, re-add it with the actual measured number.
//
// FAKE-ACTIVITY-TODO: previous body rendered "{rand(3,8)} homeowners in
// {city} requested quotes today" — the same Math.random-driven fake
// social proof Task 2 removed in ActivityToast + LeadForm. Removed.
const TRUST_BADGES = [
  { icon: Shield, label: "Licensed & insured contractors only" },
  { icon: Users,  label: "Independent local pros" },
];

export default function LandingPage() {
  const { slug } = useParams<{ slug: string }>();
  // SEO-TODO: previously did <Navigate to="/" replace /> on slug miss,
  // which made Google see the homepage at unlimited random URLs (a soft-
  // 404 disaster). Now we render <NotFound /> (which carries a
  // noindex meta tag) so crawlers get the right signal. Real HTTP 404
  // status would require a Vercel edge function; that remains a TODO.
  if (!slug) return <NotFound />;

  // Parse slug: "roofing-tampa", "kitchen-bath-remodel-los-angeles"
  let matchedService: typeof SERVICES[0] | null = null;
  let matchedArea: typeof SERVICE_AREAS[0] | null = null;

  // Try longest service slug match first
  const sortedServices = [...SERVICES].sort((a, b) => b.slug.length - a.slug.length);
  for (const svc of sortedServices) {
    if (slug.startsWith(svc.slug + "-")) {
      const citySlug = slug.slice(svc.slug.length + 1);
      const area = SERVICE_AREAS.find((a) => a.slug === citySlug);
      if (area) {
        matchedService = svc;
        matchedArea = area;
        break;
      }
    }
  }

  if (!matchedService || !matchedArea) return <NotFound />;

  const { title: serviceName } = matchedService;
  const { city, name: areaName } = matchedArea;
  const landingPageSlug = `/${slug}`;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${serviceName} in ${city}`,
    provider: {
      "@type": "Organization",
      name: "Build Right USA",
    },
    areaServed: { "@type": "City", name: city },
    serviceType: serviceName,
    description: `Find trusted ${serviceName.toLowerCase()} contractors in ${city}. Compare quotes from licensed professionals.`,
  };

  return (
    <Layout>
      <Helmet>
        <title>{`${serviceName} Contractors in ${city} | Build Right USA`}</title>
        <meta
          name="description"
          content={`Find trusted ${serviceName.toLowerCase()} contractors in ${city}. Compare quotes from licensed professionals.`}
        />
        <link rel="canonical" href={`https://www.buildright-usa.com${landingPageSlug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[550px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground leading-tight">
              Top Rated{" "}
              <span className="text-accent">{serviceName}</span>{" "}
              Contractors in {city}
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-lg leading-relaxed">
              Get free quotes from licensed contractors near you.
            </p>

            <div className="mt-6 flex flex-wrap gap-5">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-primary-foreground/90 text-sm">
                  <Icon size={18} className="text-accent" />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* FAKE-ACTIVITY-TODO: removed the fake "{N} homeowners in
                {city} requested quotes today" pill — it was driven by
                Math.random and is exactly the fake social proof Task 2
                killed elsewhere. Replaced with an honest framing pill. */}
            <div className="mt-6 inline-flex items-center gap-2 bg-accent/20 text-primary-foreground rounded-full px-4 py-2 text-sm font-medium">
              <CheckCircle size={16} className="text-accent" />
              Free, no-obligation request — {city} project review same business day.
            </div>
          </div>

          <div className="lg:max-w-md lg:ml-auto">
            <LeadForm
              defaultServiceArea={matchedArea.slug}
              defaultService={matchedService.slug}
              landingPage={landingPageSlug}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
            Why Choose Build Right for{" "}
            <span className="text-accent">{serviceName}</span> in {city}?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(matchedService.features ?? []).slice(0, 6).map((feat) => (
              <div key={feat} className="bg-card rounded-lg p-6 shadow-sm flex items-start gap-3">
                <CheckCircle size={20} className="text-accent mt-0.5 shrink-0" />
                <span className="text-sm text-foreground font-medium">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">
            Ready to Start Your {serviceName} Project?
          </h2>
          <p className="mt-3 text-primary-foreground/80 max-w-lg mx-auto">
            Get a free, no-obligation estimate from top-rated contractors in {city}.
          </p>
          <a href="#top" className="inline-block mt-6">
            <button className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3 px-8 rounded-md text-lg transition-colors">
              Get Your Free Estimate →
            </button>
          </a>
        </div>
      </section>
    </Layout>
  );
}
