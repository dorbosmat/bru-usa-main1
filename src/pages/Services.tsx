import Layout from "@/components/Layout";
import ImageHero from "@/components/ImageHero";
import ServiceCard from "@/components/ServiceCard";
import BruMark from "@/components/BruMark";
import { SERVICES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Shield,
  Award,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const Services = () => {
  const { t } = useLanguage();

  const TRUST_ITEMS = [
    { Icon: Shield,      label: t.trustLicensed },
    { Icon: Clock,       label: t.trustFastResponse },
    { Icon: MapPin,      label: t.trustLocalPros },
    { Icon: CheckCircle, label: t.trustNoObligation },
  ];

  // TRUST-TODO: mirrors the WHY pillars in src/pages/About.tsx. Both must
  // make claims that are factually defensible. As Build Right USA onboards
  // real contractors, replace each `desc` with a measured statement
  // backed by data. Never reintroduce unverifiable numbers ("25+ years
  // combined experience" referred to the founders' background and was
  // easy to misread as an active-network claim) or unverifiable SLAs
  // ("Fast 24-Hour Response" promised a contractor turnaround the
  // platform can't currently substantiate).
  const WHY_PILLARS = [
    {
      Icon: Shield,
      title: "Licensed & Insured Only",
      desc: "We require every contractor in our referral network to hold a current state license and active insurance for the work they perform.",
    },
    {
      Icon: Award,
      title: "Independent Operators",
      desc: "Each contractor is an independent local business — never a Build Right USA employee. You contract with them directly.",
    },
    {
      Icon: MapPin,
      title: "Florida-First Coverage",
      desc: "Build Right USA is currently active in Florida and selected California metros, and is expanding from there.",
    },
    {
      Icon: Clock,
      title: "We Aim to Respond Quickly",
      desc: "We try to review every request the same business day. Contractor outreach timing varies and is not guaranteed.",
    },
  ];

  const STEPS = [
    { step: "1", title: t.step1Title, desc: t.step1Desc },
    { step: "2", title: t.step2Title, desc: t.step2Desc },
    { step: "3", title: t.step3Title, desc: t.step3Desc },
  ];

  return (
    <Layout>
      <ImageHero
        title={
          <>
            {t.servicesPageTitle} <span className="text-accent">{t.navServices}</span>
          </>
        }
        subtitle={t.servicesPageSubtitle}
      />

      {/* ───────────── TRUST STRIP ───────────── */}
      <section className="relative py-8 md:py-10 bg-muted/40 border-y border-border">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:gap-x-8 lg:gap-x-12">
            {TRUST_ITEMS.map(({ Icon, label }, i) => (
              <li key={label} className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20">
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-foreground">{label}</span>
                {i < TRUST_ITEMS.length - 1 && (
                  <BruMark size={14} className="hidden md:inline-block text-accent/35 ml-2" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── SERVICE GRID ───────────── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-3 mb-4">
              <BruMark size={20} />
              <span className="text-xs font-bold tracking-[0.22em] uppercase text-accent">
                Expertise
              </span>
              <BruMark size={20} />
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Comprehensive home services,
              <br className="hidden md:block" />{" "}
              <span className="text-accent">handled end to end.</span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              Licensed pros, transparent estimates, and project management from first call to final walk-through.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {SERVICES.map((s) => (
              <ServiceCard key={s.slug} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── WHY BUILDRIGHT ───────────── */}
      <section className="py-16 md:py-24 bg-muted/40 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10 md:mb-14 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-3 mb-4">
              <BruMark size={20} />
              <span className="text-xs font-bold tracking-[0.22em] uppercase text-accent">
                Why BuildRight
              </span>
              <BruMark size={20} />
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Built on trust,<span className="text-accent"> not on hype.</span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              Four reasons homeowners across Florida choose BuildRight for major projects.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {WHY_PILLARS.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="
                  group bg-card rounded-2xl ring-1 ring-border p-6
                  transition-all duration-300
                  motion-safe:hover:-translate-y-0.5
                  motion-safe:hover:shadow-md
                  motion-safe:hover:ring-accent/30
                "
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20 motion-safe:transition-shadow motion-safe:group-hover:shadow-md motion-safe:group-hover:shadow-accent/25">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── HOW IT WORKS (reuses i18n) ───────────── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-3 mb-4">
              <BruMark size={20} />
              <span className="text-xs font-bold tracking-[0.22em] uppercase text-accent">
                Process
              </span>
              <BruMark size={20} />
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              {t.howItWorksTitle} <span className="text-accent">{t.howItWorksHighlight}</span>
            </h2>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {/* Connector hairline on md+ */}
            <div
              className="hidden md:block absolute top-6 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
              aria-hidden="true"
            />
            {STEPS.map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="inline-flex w-12 h-12 rounded-full bg-accent text-accent-foreground font-display font-bold text-lg items-center justify-center mx-auto mb-4 shadow-md shadow-accent/30 ring-4 ring-background">
                  {item.step}
                </div>
                <h3 className="font-display text-lg md:text-xl font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed max-w-xs mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── BOTTOM CTA ───────────── */}
      <section className="relative py-16 md:py-24 bg-primary overflow-hidden">
        {/* Faded BRU watermark — large, centered, very low opacity */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <BruMark size={520} className="text-accent opacity-[0.08]" />
        </div>
        {/* Soft accent glow */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 50%, hsl(24 95% 53% / 0.15), transparent 70%)",
          }}
        />

        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center mb-4">
            <BruMark size={32} className="text-accent" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary-foreground leading-[1.1]">
            {t.servicesNotSure}
          </h2>
          <p className="mt-4 text-base md:text-lg text-primary-foreground/80 max-w-xl mx-auto leading-relaxed">
            {t.servicesNotSureDesc}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/contact">
              <Button
                variant="cta"
                size="lg"
                className="w-full sm:w-auto h-12 gap-2 text-base font-semibold shadow-lg shadow-accent/30"
              >
                {t.servicesTalkExpert}
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/get-a-quote">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-12 gap-2 text-base font-semibold bg-white/5 text-primary-foreground border-primary-foreground/25 hover:bg-white/10 hover:text-primary-foreground hover:border-primary-foreground/45 backdrop-blur"
              >
                Get a Free Quote
              </Button>
            </Link>
          </div>

          <p className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-primary-foreground/70">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle size={12} className="text-accent" aria-hidden="true" />
              {t.trustNoObligation}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle size={12} className="text-accent" aria-hidden="true" />
              {t.trustLicensed}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle size={12} className="text-accent" aria-hidden="true" />
              {t.trustFastResponse}
            </span>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
