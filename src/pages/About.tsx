import Layout from "@/components/Layout";
import BruMark from "@/components/BruMark";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Shield,
  Award,
  MapPin,
  Clock,
  ClipboardList,
  Users,
  Rocket,
  CheckCircle,
  ArrowRight,
  Eye,
  Handshake,
  MessageCircle,
} from "lucide-react";
import cardKitchen from "@/assets/services/card-kitchen.jpg";
import cardRoofing from "@/assets/services/card-roofing.jpg";
import cardBathroom from "@/assets/services/card-bathroom.jpg";

/**
 * AboutHero — custom cinematic hero for the About page.
 *
 * Renders a static team image with cinematic overlay layers
 * (left-to-right dark gradient, warm radial from upper-right, subtle
 * 1px backdrop blur), plus a left-aligned content block (eyebrow,
 * headline, subtext, CTA, trust microcopy).
 */
const AboutHero = () => {
  return (
    <section className="relative h-[70vh] min-h-[520px] flex items-center overflow-hidden bg-primary">
      {/* Background — static team image */}
      <img
        src="/images/work-team-pic.jpg"
        alt="Construction team working together"
        className="absolute inset-0 w-full h-full object-cover scale-[1.05] rounded-2xl shadow-lg"
      />

      {/* Layer 1 — dark gradient L→R for left-aligned text legibility */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/15"
        aria-hidden="true"
      />

      {/* Layer 2 — warm cinematic light from upper-right (away from text) */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, rgba(255,165,0,0.18), transparent 60%)",
        }}
      />

      {/* Layer 3 — very subtle backdrop blur softening (1px) */}
      <div
        className="pointer-events-none absolute inset-0 backdrop-blur-[1px]"
        aria-hidden="true"
      />

      {/* Bottom-edge fade — smooths transition into the next section */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent"
        aria-hidden="true"
      />

      {/* Content — left-aligned per spec */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Eyebrow chip — OUR MISSION */}
          <div className="inline-flex items-center gap-2 mb-5 rounded-full bg-white/10 backdrop-blur ring-1 ring-white/20 px-3 py-1">
            <BruMark size={14} className="text-accent" />
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-white/95">
              Our Mission
            </span>
          </div>

          {/* H1 — strong, bold, left-aligned */}
          <h1
            className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.05]"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
          >
            Built on trust.
            <br />
            <span className="text-accent">Designed to deliver.</span>
          </h1>

          {/* Subtext */}
          <p
            className="mt-5 text-base md:text-lg text-white/85 max-w-xl leading-relaxed"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.45)" }}
          >
            We connect homeowners with licensed local pros — fast, transparent, and built around real projects.
          </p>

          {/* CTA — premium, tactile press feedback */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="/contact">
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 gap-2 text-base font-semibold bg-accent hover:bg-accent text-accent-foreground shadow-lg shadow-accent/40 motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:shadow-xl motion-safe:hover:shadow-accent/60 motion-safe:active:scale-[0.98]"
              >
                Get My Free Quote
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
            </Link>
          </div>

          {/* Trust microcopy under CTA */}
          <p
            className="mt-5 inline-flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/75"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle size={11} className="text-accent" aria-hidden="true" />
              Free
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle size={11} className="text-accent" aria-hidden="true" />
              No obligation
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle size={11} className="text-accent" aria-hidden="true" />
              60 seconds
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

const STEPS = [
  {
    icon: ClipboardList,
    title: "Submit Your Request",
    desc: "Tell us what you need — under a minute, no commitment.",
  },
  {
    icon: Users,
    title: "We Match You",
    desc: "We connect you with vetted, licensed pros in your area.",
  },
  {
    icon: Rocket,
    title: "Get Your Quote",
    desc: "Compare options at your pace. Move forward only when you're ready.",
  },
];

const TRUST_PILLARS = [
  {
    Icon: Shield,
    title: "Licensed & Insured",
    desc: "Every contractor we work with is fully licensed, bonded, and insured.",
  },
  {
    Icon: Award,
    title: "25+ Years Combined Experience",
    desc: "Decades of hands-on craftsmanship across roofing, remodeling, and exterior work.",
  },
  {
    Icon: MapPin,
    title: "Local Florida Pros",
    desc: "Vetted teams that know your climate, codes, and neighborhoods.",
  },
  {
    Icon: Clock,
    title: "Fast 24-Hour Response",
    desc: "Get matched with the right pro within a day — no waiting weeks.",
  },
];

const PROJECTS = [
  {
    image: cardKitchen,
    title: "Kitchen Remodel",
    location: "Tampa, FL",
    blurb: "Custom cabinetry, quartz countertops, and a full layout redesign.",
  },
  {
    image: cardRoofing,
    title: "Roof Replacement",
    location: "Orlando, FL",
    blurb: "Storm-rated shingle replacement with full warranty backing.",
  },
  {
    image: cardBathroom,
    title: "Bathroom Transformation",
    location: "Miami, FL",
    blurb: "Walk-in shower, premium tile work, and modern fixtures.",
  },
];

const VALUES = [
  {
    Icon: Eye,
    title: "Transparency",
    desc: "Clear pricing. No surprise fees, ever.",
  },
  {
    Icon: Handshake,
    title: "No Pressure",
    desc: "We don't pitch. We match — then step back.",
  },
  {
    Icon: Shield,
    title: "Real Professionals",
    desc: "Licensed, insured, and reviewed before they reach you.",
  },
  {
    Icon: MessageCircle,
    title: "Honest Communication",
    desc: "Straight answers. No salesy talk.",
  },
];

const About = () => {
  const { t } = useLanguage();

  const TRUST_STRIP = [
    { Icon: Shield,      label: t.trustLicensed },
    { Icon: Clock,       label: t.trustFastResponse },
    { Icon: MapPin,      label: t.trustLocalPros },
    { Icon: CheckCircle, label: t.trustNoObligation },
  ];

  return (
    <Layout>
      {/* ───────────── HERO (custom cinematic) ───────────── */}
      <AboutHero />

      {/* ───────────── TRUST STRIP ───────────── */}
      <section className="relative py-8 md:py-10 bg-muted/40 border-y border-border">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:gap-x-8 lg:gap-x-12">
            {TRUST_STRIP.map(({ Icon, label }, i) => (
              <li key={label} className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20">
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-foreground">{label}</span>
                {i < TRUST_STRIP.length - 1 && (
                  <BruMark size={14} className="hidden md:inline-block text-accent/35 ml-2" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── LIVE ACTIVITY BAND ───────────── */}
      <section className="py-3 md:py-4 bg-background border-b border-border">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2.5 text-xs md:text-sm">
            <span className="relative inline-flex h-2 w-2 shrink-0">
              <span className="absolute inset-0 rounded-full bg-emerald-500 motion-safe:animate-ping opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-foreground/80 font-medium">
              Homeowners across Florida are getting quotes right now
            </span>
          </div>
        </div>
      </section>

      {/* ───────────── 01 · STORY (problem → solution + humanization) ───────────── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Image — wire to /images/about-hero-team.jpg in /public/.
                Drop the user-provided JPG at: public/images/about-hero-team.jpg */}
            <div className="lg:col-span-6 relative">
              <div className="group relative rounded-2xl overflow-hidden ring-1 ring-border shadow-xl shadow-black/20 aspect-[4/5] motion-safe:transition-shadow motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:shadow-2xl">
                <img
                  src="/images/about-hero-team.jpg"
                  alt="A licensed contractor team reviewing blueprints on a residential roof at golden hour"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
                />
                {/* Subtle bottom-up gradient — depth + readability per spec */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                  aria-hidden="true"
                />
                {/* BRU watermark — bottom-right, white at 20% opacity */}
                <div className="pointer-events-none absolute bottom-3 right-3" aria-hidden="true">
                  <BruMark size={32} className="text-white opacity-20" />
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-muted-foreground">
                  01
                </span>
                <span className="h-px w-8 bg-accent/50" aria-hidden="true" />
                <BruMark size={18} />
                <span className="text-xs font-bold tracking-[0.22em] uppercase text-accent">
                  Our Mission
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Most homeowners spend weeks chasing contractors.
                <br />
                <span className="text-accent">We built a faster way.</span>
              </h2>
              <div className="mt-5 space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                <p>
                  Finding the right pro shouldn't mean six unanswered calls, three no-shows, and a quote on the back of a napkin.
                </p>
                <p>
                  BuildRight USA connects you directly with vetted, licensed local professionals — quickly, transparently, and without the usual friction.
                </p>
              </div>
              {/* Humanization quote callout */}
              <div className="mt-7 rounded-xl bg-muted/40 ring-1 ring-border border-l-2 border-l-accent p-4 md:p-5">
                <p className="text-sm md:text-base italic text-foreground/85 leading-relaxed">
                  "We've seen what happens when projects go wrong — and we built BuildRight to prevent that."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── 02 · HOW IT WORKS ───────────── */}
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-muted-foreground">
                02
              </span>
              <span className="h-px w-8 bg-accent/50" aria-hidden="true" />
              <BruMark size={18} />
              <span className="text-xs font-bold tracking-[0.22em] uppercase text-accent">
                How It Works
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Three steps. Zero friction.
            </h2>
            <p className="mt-3 text-muted-foreground">
              From request to matched pro — in under 60 seconds.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            <div
              className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
              aria-hidden="true"
            />
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="group relative bg-card ring-1 ring-border rounded-2xl p-6 md:p-8 shadow-sm motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:shadow-xl motion-safe:hover:-translate-y-0.5 motion-safe:hover:ring-accent/40"
              >
                <div className="absolute -top-4 left-6 w-9 h-9 rounded-full bg-accent text-accent-foreground font-display font-bold flex items-center justify-center shadow-md shadow-accent/30 ring-4 ring-card">
                  {i + 1}
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20 flex items-center justify-center mb-4 mt-2 motion-safe:transition-shadow motion-safe:duration-200 motion-safe:group-hover:shadow-md motion-safe:group-hover:shadow-accent/30">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── 03 · WHY HOMEOWNERS TRUST US ───────────── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-muted-foreground">
                03
              </span>
              <span className="h-px w-8 bg-accent/50" aria-hidden="true" />
              <BruMark size={18} />
              <span className="text-xs font-bold tracking-[0.22em] uppercase text-accent">
                Why Homeowners Trust Us
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Built on trust,<span className="text-accent"> not on hype.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 max-w-6xl mx-auto">
            {TRUST_PILLARS.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="group bg-card ring-1 ring-border rounded-2xl p-6 motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-xl motion-safe:hover:ring-accent/40"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20 motion-safe:transition-all motion-safe:duration-200 motion-safe:group-hover:bg-accent motion-safe:group-hover:text-accent-foreground motion-safe:group-hover:shadow-md motion-safe:group-hover:shadow-accent/30">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── 04 · REAL PROJECTS ───────────── */}
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-muted-foreground">
                04
              </span>
              <span className="h-px w-8 bg-accent/50" aria-hidden="true" />
              <BruMark size={18} />
              <span className="text-xs font-bold tracking-[0.22em] uppercase text-accent">
                Real Work
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Real projects. Real results.
            </h2>
            <p className="mt-3 text-muted-foreground">
              A snapshot of recent work completed by pros in our network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
            {PROJECTS.map(({ image, title, location, blurb }) => (
              <div
                key={title}
                className="group bg-card ring-1 ring-border rounded-2xl overflow-hidden shadow-sm motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-xl motion-safe:hover:ring-accent/40"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={image}
                    alt={`${title} in ${location}`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-md">
                    <CheckCircle size={11} aria-hidden="true" />
                    Completed
                  </span>
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
                    <MapPin size={12} aria-hidden="true" />
                    {location}
                  </p>
                  <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">{blurb}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── 05 · OUR VALUES ───────────── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-muted-foreground">
                05
              </span>
              <span className="h-px w-8 bg-accent/50" aria-hidden="true" />
              <BruMark size={18} />
              <span className="text-xs font-bold tracking-[0.22em] uppercase text-accent">
                Our Values
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              What we stand for.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 max-w-6xl mx-auto">
            {VALUES.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="group bg-card ring-1 ring-border rounded-2xl p-6 motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md motion-safe:hover:ring-accent/40"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20 motion-safe:transition-all motion-safe:duration-200 motion-safe:group-hover:shadow-md motion-safe:group-hover:shadow-accent/25">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display font-bold text-foreground">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── BRIDGE + FINAL CTA ───────────── */}
      <section className="relative py-16 md:py-24 bg-primary overflow-hidden">
        {/* Faded BRU watermark */}
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
          {/* Bridge sentence — softens the jump into the CTA */}
          <p className="text-sm md:text-base text-primary-foreground/70 italic">
            If you're planning a project, the next step is simple.
          </p>

          <div className="mt-4 inline-flex items-center mb-2">
            <BruMark size={32} className="text-accent" />
          </div>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary-foreground leading-[1.1]">
            Ready to see what your project could cost?
          </h2>
          <p className="mt-4 text-base md:text-lg text-primary-foreground/80 max-w-xl mx-auto leading-relaxed">
            Get matched with vetted local pros in 60 seconds. Real estimates. Zero obligation.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/contact">
              <Button
                variant="cta"
                size="lg"
                className="w-full sm:w-auto h-12 gap-2 text-base font-semibold shadow-lg shadow-accent/40 motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:shadow-xl motion-safe:hover:shadow-accent/50 motion-safe:active:scale-[0.98]"
              >
                Get My Free Quote
                <ArrowRight size={18} aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-12 gap-2 text-base font-semibold bg-white/5 text-primary-foreground border-primary-foreground/25 hover:bg-white/10 hover:text-primary-foreground hover:border-primary-foreground/45 backdrop-blur motion-safe:active:scale-[0.98]"
              >
                Talk to an Expert
              </Button>
            </Link>
          </div>

          <p className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-primary-foreground/70">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle size={12} className="text-accent" aria-hidden="true" />
              No obligation
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle size={12} className="text-accent" aria-hidden="true" />
              Free to use
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle size={12} className="text-accent" aria-hidden="true" />
              Reply within 24 hours
            </span>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default About;
