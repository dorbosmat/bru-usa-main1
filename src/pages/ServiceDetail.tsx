import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import LeadForm from "@/components/LeadForm";
import { SERVICES } from "@/lib/constants";
import { SERVICE_CONTENT } from "@/lib/service-content";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, DollarSign, Lightbulb, ArrowRight } from "lucide-react";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = SERVICES.find((s) => s.slug === slug);
  const content = slug ? SERVICE_CONTENT[slug] : undefined;

  if (!service) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">Service Not Found</h1>
          <Link to="/services">
            <Button variant="outline" className="mt-4">Back to Services</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{content?.heroTitle || service.title} | Build Right USA</title>
        <meta name="description" content={content?.heroSubtitle || service.description} />
        <link rel="canonical" href={`https://www.buildright-usa.com/services/${service.slug}`} />
      </Helmet>

      {/* Hero with image */}
      <section className="relative h-[340px] md:h-[420px] overflow-hidden">
        {content?.image && (
          <img
            src={content.image}
            alt={service.title}
            className="absolute inset-0 w-full h-full object-cover"
            width={1280}
            height={720}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-10">
          <Link to="/services" className="text-white/70 text-sm hover:text-white transition-colors mb-3 inline-flex items-center gap-1">
            ← All Services
          </Link>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold text-white max-w-3xl leading-tight">
            {content?.heroTitle || service.title}
          </h1>
          <p className="mt-3 text-white/80 text-lg max-w-2xl">
            {content?.heroSubtitle || service.description}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick stats */}
            {content && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-2 text-accent mb-1">
                    <DollarSign size={18} />
                    <span className="text-xs font-semibold uppercase tracking-wide">Cost Range</span>
                  </div>
                  <p className="text-sm text-foreground font-medium">{content.costRange}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-2 text-accent mb-1">
                    <Clock size={18} />
                    <span className="text-xs font-semibold uppercase tracking-wide">Timeline</span>
                  </div>
                  <p className="text-sm text-foreground font-medium">{content.timeline}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-2 text-accent mb-1">
                    <Lightbulb size={18} />
                    <span className="text-xs font-semibold uppercase tracking-wide">Pro Tip</span>
                  </div>
                  <p className="text-sm text-foreground font-medium">{content.proTip}</p>
                </div>
              </div>
            )}

            {/* Article sections */}
            {content?.sections.map((section, i) => (
              <div key={i}>
                <h2 className="font-display text-2xl font-bold text-foreground mb-3">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed text-[15px]">{section.body}</p>
              </div>
            ))}

            {/* Did you know */}
            {content?.facts && content.facts.length > 0 && (
              <div className="rounded-lg bg-accent/10 border border-accent/20 p-6">
                <h3 className="font-display text-lg font-bold text-foreground mb-4">📊 Did You Know?</h3>
                <ul className="space-y-3">
                  {content.facts.map((fact, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground text-sm">
                      <CheckCircle size={18} className="text-accent shrink-0 mt-0.5" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What's included */}
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">What's Included</h2>
              <ul className="space-y-3">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-foreground">
                    <CheckCircle size={20} className="text-accent shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Process */}
            <div className="p-8 bg-muted rounded-lg">
              <h3 className="font-display text-xl font-bold text-foreground">Our Process</h3>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {["1. Free Consultation", "2. Detailed Estimate", "3. Expert Execution"].map((step) => (
                  <div key={step} className="text-center">
                    <span className="text-3xl font-display font-bold text-accent">{step.split(".")[0]}.</span>
                    <p className="mt-1 text-sm text-muted-foreground">{step.split(". ")[1]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center py-6">
              <h3 className="font-display text-xl font-bold text-foreground mb-2">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-4">Get a free, no-obligation quote in seconds.</p>
              <Link to="/get-a-quote">
                <Button variant="cta" size="lg" className="gap-2">
                  Get My Free Quote <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
            <LeadForm compact />
            <p className="text-[11px] text-muted-foreground leading-relaxed px-1">
              Project estimates or price ranges displayed on this website are preliminary and intended for informational purposes only. Final pricing will depend on on-site inspection, project scope, materials, and contractor evaluation. Build Right USA does not guarantee pricing or project availability.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
