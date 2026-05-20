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
