import Layout from "@/components/Layout";
import LeadForm from "@/components/LeadForm";
import HeroSlider from "@/components/HeroSlider";
import ProjectGallery from "@/components/ProjectGallery";
import AiPreviewSection from "@/components/AiPreviewSection";
import Premium3DHeading from "@/components/Premium3DHeading";
import { SERVICE_AREAS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Quote, Star } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { trackCtaClick } from "@/lib/analytics";
import { HARDCODED_TESTIMONIALS_ENABLED } from "@/lib/social-proof-gate";

import cardRoofing from "@/assets/services/card-roofing.jpg";
import cardStormDamage from "@/assets/services/card-storm-damage.jpg";
import cardKitchen from "@/assets/services/card-kitchen.jpg";
import cardBathroom from "@/assets/services/card-bathroom.jpg";
import cardGeneralRemodeling from "@/assets/services/card-general-remodeling.jpg";
import cardWindowsDoors from "@/assets/services/card-windows-doors.jpg";
import cardSiding from "@/assets/services/card-siding.jpg";

// FAKE-ACTIVITY-TODO: the original TESTIMONIALS block here held seven
// fabricated all-5★ Florida-only entries written in marketing-intern voice
// ("Loved how simple it was", "Highly recommend!"). Showing them was deceptive
// social proof and risked Meta/Google Ads policy enforcement plus FTC Section
// 5 exposure. The array now ships empty and the section below is gated by
// HARDCODED_TESTIMONIALS_ENABLED so the entire JSX is tree-shaken from the
// bundle while the flag is false.
//
// When you populate this array later, every entry MUST be a verifiable real
// review (Google Business Profile, Trustpilot, or first-party with signed
// permission). Do NOT re-add fabricated entries. Re-enable by flipping
// HARDCODED_TESTIMONIALS_ENABLED in src/lib/social-proof-gate.ts.
const TESTIMONIALS: Array<{ name: string; city: string; text: string; rating: number }> = [];

const Index = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* Premium Hero Slider — trust chips relocated into the hero above the fold */}
      <HeroSlider />

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <Premium3DHeading
            as="h2"
            variant="section"
            theme="dark"
            className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-12"
          >
            {t.howItWorksTitle} <span className="text-accent">{t.howItWorksHighlight}</span>
          </Premium3DHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: t.step1Title, desc: t.step1Desc },
              { step: "2", title: t.step2Title, desc: t.step2Desc },
              { step: "3", title: t.step3Title, desc: t.step3Desc },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities Served */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-4 text-center">
          <Premium3DHeading
            as="h2"
            variant="section"
            theme="dark"
            className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8"
          >
            {t.servingTitle} <span className="text-accent">{t.servingHighlight}</span>
          </Premium3DHeading>
          <div className="flex flex-wrap justify-center gap-4">
            {SERVICE_AREAS.map((area) => (
              <Link key={area.slug} to={`/locations/${area.slug}`} className="flex items-center gap-2 bg-card border border-border rounded-full px-5 py-2.5 text-sm font-medium text-foreground hover:border-accent hover:text-accent transition-colors">
                <MapPin size={14} className="text-accent" />
                {area.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Premium3DHeading
              as="h2"
              variant="section"
              theme="dark"
              className="font-display text-3xl md:text-4xl font-bold text-foreground"
            >
              {t.servicesCoverTitle} <span className="text-accent">{t.servicesCoverHighlight}</span>
            </Premium3DHeading>
            <p className="mt-3 max-w-xl mx-auto text-muted-foreground">{t.servicesCoverSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { image: cardRoofing, label: t.serviceRoofing, desc: "Full replacement, repairs & inspections" },
              { image: cardStormDamage, label: t.serviceStormDamage, desc: "Insurance claims & emergency repairs" },
              { image: cardKitchen, label: t.serviceKitchen, desc: "Cabinets, countertops & full redesigns" },
              { image: cardBathroom, label: t.serviceBathroom, desc: "Tile, fixtures & complete remodels" },
              { image: cardGeneralRemodeling, label: t.serviceRenovation, desc: "Whole-home updates & improvements" },
              { image: cardWindowsDoors, label: t.serviceWindowsDoors, desc: "Energy-efficient upgrades & installs" },
              { image: cardSiding, label: t.serviceExterior, desc: "Siding, painting & curb appeal" },
            ].map(({ image, label, desc }) => (
              <Link
                key={label}
                to="/get-a-quote"
                onClick={() => trackCtaClick(label)}
                className="group bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.03] transition-all duration-300 cursor-pointer"
              >
                <div
                  className="h-[110px] md:h-[150px] w-full relative overflow-hidden rounded-t-xl aspect-[4/3]"
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-base font-bold text-foreground group-hover:text-accent transition-colors">{label}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/get-a-quote">
              <Button variant="cta" size="lg" onClick={() => trackCtaClick("Get My Free Quote")}>{t.formCta} →</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Renovation Preview — feature pitch between Services and ProjectGallery */}
      <AiPreviewSection />

      {/* Real Projects Gallery */}
      <ProjectGallery />

      {/* ─── How We Review Your Request ─────────────────────────────
          TRUST-TODO: this section replaces fabricated social proof with
          an honest, mechanism-level explanation of what actually happens
          when a homeowner submits a request. No reviews, no contractor
          counts, no time-window promises. Replace these bullet steps
          with measured SLA data once contractor distribution is wired
          and tracked. */}
      <section id="how-we-review" className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-3 rounded-full bg-accent/10 ring-1 ring-accent/25 px-3 py-1">
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-accent">Florida-First</span>
            </div>
            <Premium3DHeading
              as="h2"
              variant="section"
              theme="dark"
              className="font-display text-2xl md:text-3xl font-bold text-foreground"
            >
              How we review your request — <span className="text-accent">step by step</span>
            </Premium3DHeading>
            <p className="mt-3 max-w-2xl mx-auto text-sm md:text-base text-muted-foreground leading-relaxed">
              Build Right USA is a contractor referral service operating Florida-first, expanding into selected California metros. We do not perform construction work and we do not employ contractors. Here's exactly what happens when you submit a request.
            </p>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-2 gap-5 list-none">
            {[
              {
                num: "01",
                title: "You submit your project details",
                body: "Service type, ZIP, scope, and how to reach you. Submission is via a single secure form — no third-party trackers in the submit path.",
              },
              {
                num: "02",
                title: "We review the request the same business day",
                body: "Our team checks fit: service mix, coverage area, project size. If we can't help, we tell you — no cost, no follow-up.",
              },
              {
                num: "03",
                title: "We refer you to an independent licensed contractor",
                body: "We forward your request to a Florida-licensed contractor whose service mix matches. You verify their license and insurance directly with them.",
              },
              {
                num: "04",
                title: "You stay in control",
                body: "The contractor contacts you for an estimate. You choose whether to proceed. No charge, no pressure, no obligation.",
              },
            ].map(({ num, title, body }) => (
              <li key={num} className="bg-card border border-border rounded-xl p-5 md:p-6">
                <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-accent">{num}</span>
                <h3 className="mt-2 font-display text-base md:text-lg font-bold text-foreground leading-tight">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </li>
            ))}
          </ol>

          {/* TRUST-TODO: the "what we do not guarantee" block is the trust-
              building counterweight to the steps above. Direct, calm, and
              short — not legalistic. Cross-links the Disclaimer for the
              full version. */}
          <div className="mt-10 rounded-xl bg-muted/40 ring-1 ring-border p-5 md:p-6">
            <h4 className="font-display text-sm font-bold text-foreground mb-3">What we don't guarantee</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-muted-foreground leading-relaxed">
              <li>· A specific contractor will accept your project</li>
              <li>· A specific response time or callback window</li>
              <li>· Final price, scope, materials, or timeline</li>
              <li>· Outcomes of the work the contractor performs</li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              For the full version see our{" "}
              <Link to="/disclaimer" className="text-accent hover:underline">Disclaimer</Link>{" and "}
              <Link to="/lead-generation-disclosure" className="text-accent hover:underline">Lead Generation Disclosure</Link>.
              For active emergencies, call 911.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* FAKE-ACTIVITY-TODO: section gated by HARDCODED_TESTIMONIALS_ENABLED.
          While the flag is false (and the TESTIMONIALS array is empty), the
          entire JSX subtree below is tree-shaken from the bundle so we ship
          zero fabricated review copy. Re-enable only after wiring real,
          verifiable reviews. See src/lib/social-proof-gate.ts. */}
      {HARDCODED_TESTIMONIALS_ENABLED && TESTIMONIALS.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Premium3DHeading
                as="h2"
                variant="section"
                theme="dark"
                className="font-display text-3xl md:text-4xl font-bold text-foreground"
              >
                {t.testimonialsTitle} <span className="text-accent">{t.testimonialsHighlight}</span>
              </Premium3DHeading>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((item) => (
                <div key={item.name} className="bg-card rounded-lg p-6 shadow-sm border border-border">
                  <Quote size={20} className="text-accent/40 mb-3" />
                  <p className="text-sm text-foreground leading-relaxed mb-4">{item.text}</p>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} size={14} className="text-accent fill-accent" />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.city}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 max-w-2xl">
          <Premium3DHeading
            as="h2"
            variant="section"
            theme="dark"
            className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-10"
          >
            {t.faqTitle} <span className="text-accent">{t.faqHighlight}</span>
          </Premium3DHeading>
          <div className="space-y-4">
            {[
              { q: t.faqQ1, a: t.faqA1 },
              { q: t.faqQ2, a: t.faqA2 },
              { q: t.faqQ3, a: t.faqA3 },
              { q: t.faqQ4, a: t.faqA4 },
            ].map((faq) => (
              <div key={faq.q} className="bg-card border border-border rounded-lg p-5">
                <h3 className="font-display text-sm font-bold text-foreground">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <Premium3DHeading
            as="h2"
            variant="section"
            theme="dark"
            className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6"
          >
            {t.getInTouchTitle} <span className="text-accent">{t.getInTouchHighlight}</span>
          </Premium3DHeading>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><a href="mailto:support@buildright-usa.com" className="hover:text-accent transition-colors">support@buildright-usa.com</a></p>
            <p><a href="mailto:estimate@buildright-usa.com" className="hover:text-accent transition-colors">estimate@buildright-usa.com</a></p>
            <p><a href="mailto:info@buildright-usa.com" className="hover:text-accent transition-colors">info@buildright-usa.com</a></p>
            {/* PHONE-TODO: this line used to render an Israeli WhatsApp icon
                (wa.me/972…) next to "Phone:" — deceptive on a USA brand.
                Replace with a real <tel:> link once a US callback line is
                provisioned (COMPANY_PHONE in src/lib/constants.ts). */}
            <p className="pt-2 text-xs text-muted-foreground italic">Phone line coming soon — email us in the meantime.</p>
            <p>Hours: Mon–Fri 8AM–6PM EST</p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <Premium3DHeading
            as="h2"
            variant="section"
            theme="light"
            className="font-display text-3xl md:text-4xl font-bold text-primary-foreground"
          >
            {t.ctaReady}
          </Premium3DHeading>
          <p className="mt-3 text-primary-foreground/80 max-w-lg mx-auto">{t.ctaSubtitle}</p>
          <Link to="/get-a-quote">
            <Button variant="hero" size="lg" className="mt-6" onClick={() => trackCtaClick("Get My Free Quote")}>{t.ctaButton}</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
