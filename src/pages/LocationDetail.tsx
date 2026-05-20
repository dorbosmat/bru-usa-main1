import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import LeadForm from "@/components/LeadForm";
import { SERVICES, SERVICE_AREAS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Shield, Clock, ThumbsUp, ArrowRight } from "lucide-react";
import NotFound from "./NotFound";

// TRUST-TODO: previous chips claimed "On-Time Guarantee" / "Satisfaction
// Promise" / "5-Star Reviews" — three unverifiable promises Build Right
// USA cannot substantiate (we don't perform the work and we don't yet
// have a public review surface). Replaced with mechanism-level statements
// consistent with Task 8/9 messaging across About + Services.
const TRUST_ITEMS = [
  { icon: Shield,   label: "Licensed & insured contractors only" },
  { icon: Clock,    label: "Same-business-day request review" },
  { icon: ThumbsUp, label: "No obligation, ever" },
];

export default function LocationDetail() {
  const { slug } = useParams<{ slug: string }>();
  const area = SERVICE_AREAS.find((a) => a.slug === slug);

  if (!area) return <NotFound />;

  const topServices = SERVICES.filter((s) => area.topServices.includes(s.slug));

  return (
    <Layout>
      <SeoHead
        title={`${area.name} | Build Right USA Contractor Referrals`}
        description={`${area.heroSub} Build Right USA refers ${area.city} homeowners to independent licensed contractors. Free, no-obligation requests.`}
        path={`/locations/${area.slug}`}
      />
      {/* Hero */}
      <section className="relative bg-primary py-16 md:py-24">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">
              Serving {area.city}, {area.state}
            </p>
            <h1 className="font-display text-3xl md:text-5xl font-extrabold text-primary-foreground leading-tight">
              {area.heroHeadline}
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-lg leading-relaxed">
              {area.heroSub}
            </p>
            <div className="mt-8 flex flex-wrap gap-6">
              {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-primary-foreground/90 text-sm">
                  <Icon size={18} className="text-accent" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:max-w-md lg:ml-auto">
            <LeadForm defaultServiceArea={area.slug} />
          </div>
        </div>
      </section>

      {/* Top Services — card grid with local notes + CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Top Services in <span className="text-accent">{area.city}</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              The most requested projects from homeowners in {area.city} — delivered with expert craftsmanship.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {topServices.map((s) => {
              const note = area.serviceNotes?.[s.slug] || s.shortDesc;
              return (
                <div key={s.slug} className="rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-lg transition-shadow flex flex-col">
                  <span className="text-4xl mb-3">{s.icon}</span>
                  <h3 className="font-display text-xl font-bold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{note}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link to={`/services/${s.slug}`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        Learn More <ArrowRight size={14} />
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button variant="cta" size="sm">
                        Request Estimate
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link to="/services">
              <Button variant="outline" size="lg">View All Services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
            Ready to Start Your {area.city} Project?
          </h2>
          {/* TRUST-TODO: removed "most quotes delivered within 24 hours"
              — unverifiable contractor-side SLA. Replaced with the same
              honest framing used on About + Services. */}
          <p className="mt-3 text-primary-foreground/80 max-w-lg mx-auto">
            Tell us about your project — there's no obligation, and there's no charge to you.
          </p>
          <Link to="/contact">
            <Button variant="hero" size="lg" className="mt-6">
              Get Your Free Estimate →
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
