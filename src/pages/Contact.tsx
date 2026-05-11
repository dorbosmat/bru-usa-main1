import Layout from "@/components/Layout";
import SmartQuoteEngine from "@/components/contact/SmartQuoteEngine";
import BruMark from "@/components/BruMark";
import Premium3DHeading from "@/components/Premium3DHeading";
import { COMPANY_EMAIL, COMPANY_ADDRESS } from "@/lib/constants";
import {
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  Shield,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const WHATSAPP_URL =
  "https://wa.me/972503721520?text=Hi%2C%20I%20saw%20your%20website%20and%20want%20a%20quote";

const ADDRESS_MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=11401+NW+12th+St,+Miami,+FL+33172";

// Inline WhatsApp glyph (uses currentColor so it tints with text-emerald-600)
const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.15 1.6 5.96L2 22l4.25-1.11a9.9 9.9 0 0 0 5.79 1.85h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2zm5.81 14.13c-.25.69-1.41 1.32-1.97 1.41-.5.07-1.13.1-1.83-.12-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.83-4.2-4.97-4.39-.15-.19-1.19-1.58-1.19-3.01 0-1.43.75-2.13 1.02-2.42.27-.29.59-.36.79-.36h.57c.18 0 .43-.07.67.51.25.6.84 2.07.91 2.22.07.15.12.32.02.51-.1.19-.15.31-.3.48-.15.17-.31.38-.45.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.07 1.31 2.36 1.46.29.15.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.39-.24.65-.15.27.1 1.71.81 2 .96.29.15.49.22.56.34.07.13.07.74-.18 1.43z" />
  </svg>
);

const Contact = () => {
  const { t } = useLanguage();

  const TRUST_PILLS = [
    { Icon: Shield,      label: t.trustLicensed },
    { Icon: Clock,       label: t.trustFastResponse },
    { Icon: MapPin,      label: t.trustLocalPros },
    { Icon: CheckCircle, label: t.trustNoObligation },
  ];

  const NEXT_STEPS = [
    {
      n: "1",
      title: "We review your request",
      desc: "Our team checks your project details — usually within hours.",
    },
    {
      n: "2",
      title: "We match you with a vetted pro",
      desc: "Licensed, insured, and experienced in your project type and area.",
    },
    {
      n: "3",
      title: "You receive a free quote",
      desc: "Compare options at your pace. No obligation, no pressure.",
    },
  ];

  return (
    <Layout>
      {/* ───────────── 1. CONVERSION HERO (text-only, no video) ───────────── */}
      <section className="relative py-20 md:py-28 bg-primary overflow-hidden">
        {/* Faded BRU watermark */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <BruMark size={520} className="text-accent opacity-[0.06]" />
        </div>
        {/* Soft accent radial */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 30%, hsl(24 95% 53% / 0.18), transparent 70%)",
          }}
        />

        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-4 rounded-full bg-white/8 backdrop-blur ring-1 ring-white/15 px-3 py-1">
            <Sparkles size={14} className="text-accent" aria-hidden="true" />
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-primary-foreground">
              Free Estimate
            </span>
          </div>
          <Premium3DHeading
            as="h1"
            variant="hero"
            theme="light"
            className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary-foreground leading-[1.05] max-w-3xl mx-auto"
          >
            Get a free quote for{" "}
            <span className="text-accent">your project.</span>
          </Premium3DHeading>
          <p className="mt-5 text-base md:text-lg text-primary-foreground/80 max-w-xl mx-auto leading-relaxed">
            Takes 60 seconds · No obligation · Licensed professionals
          </p>
        </div>
      </section>

      {/* ───────────── 2. TRUST STRIP ───────────── */}
      <section className="relative py-8 md:py-10 bg-background border-b border-border">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:gap-x-8 lg:gap-x-12">
            {TRUST_PILLS.map(({ Icon, label }, i) => (
              <li key={label} className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20">
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-foreground">{label}</span>
                {i < TRUST_PILLS.length - 1 && (
                  <BruMark size={14} className="hidden md:inline-block text-accent/35 ml-2" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── 3. SMART QUOTE ENGINE (CENTERPIECE) + ALT CONTACT ───────────── */}
      <section className="relative py-16 md:py-24 bg-muted/40">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* Speed-badge eyebrow + value-led headline + value chips */}
            <div className="text-center mb-8 md:mb-10">
              <div className="inline-flex items-center gap-2 mb-5 rounded-full bg-accent/15 ring-1 ring-accent/30 px-3.5 py-1.5">
                <Clock size={14} className="text-accent" aria-hidden="true" />
                <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-accent">
                  60-Second Smart Quote
                </span>
              </div>
              <Premium3DHeading
                as="h2"
                variant="section"
                theme="dark"
                className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.05]"
              >
                Get matched with a vetted pro
                <br className="hidden md:block" />{" "}
                <span className="text-accent">in 5 quick steps.</span>
              </Premium3DHeading>
              <p className="mt-4 text-base md:text-lg text-muted-foreground">
                Real estimate. Local pros. Zero obligation.
              </p>

              {/* What you'll receive — value chips */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
                {[
                  "Real cost estimate",
                  "Vetted local pros",
                  "24-hour reply",
                ].map((v) => (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1.5 text-foreground/85 font-medium"
                  >
                    <CheckCircle size={14} className="text-accent" aria-hidden="true" />
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* The Smart Quote Engine — multi-step wizard. LeadForm renders inside step 5. */}
            <SmartQuoteEngine />

            {/* Trust microcopy — risk reducers below the engine */}
            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle size={12} className="text-accent" aria-hidden="true" />
                Free, no obligation
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Shield size={12} className="text-accent" aria-hidden="true" />
                Your information is private
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle size={12} className="text-accent" aria-hidden="true" />
                No spam, ever
              </span>
            </div>

            {/* Subtle divider */}
            <div className="my-10 md:my-12 flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground whitespace-nowrap">
                Or reach out directly
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Alternative contact — secondary, subdued, 2×2 grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* WhatsApp */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                className="group flex items-center gap-3 rounded-xl bg-card ring-1 ring-border px-4 py-3 motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:ring-emerald-500/50 motion-safe:hover:shadow-md motion-safe:hover:-translate-y-0.5"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/25">
                  <WhatsAppIcon size={18} />
                </span>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    WhatsApp
                  </div>
                  <div className="text-sm font-semibold text-foreground truncate">
                    Chat with us
                  </div>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${COMPANY_EMAIL}`}
                aria-label={`Email us at ${COMPANY_EMAIL}`}
                className="group flex items-center gap-3 rounded-xl bg-card ring-1 ring-border px-4 py-3 motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:ring-accent/50 motion-safe:hover:shadow-md motion-safe:hover:-translate-y-0.5"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20">
                  <Mail size={18} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-accent">
                    {t.contactEmail}
                  </div>
                  <div className="text-sm font-semibold text-foreground truncate">
                    {COMPANY_EMAIL}
                  </div>
                </div>
              </a>

              {/* Map */}
              <a
                href={ADDRESS_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View address on Google Maps"
                className="group flex items-center gap-3 rounded-xl bg-card ring-1 ring-border px-4 py-3 motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:ring-accent/50 motion-safe:hover:shadow-md motion-safe:hover:-translate-y-0.5"
                title={COMPANY_ADDRESS}
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20">
                  <MapPin size={18} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-accent">
                    {t.contactAddress}
                  </div>
                  <div className="text-sm font-semibold text-foreground truncate">
                    Miami, FL · View on Maps
                  </div>
                </div>
              </a>

              {/* Hours */}
              <div className="flex items-center gap-3 rounded-xl bg-card ring-1 ring-border px-4 py-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20">
                  <Clock size={18} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-accent">
                    {t.contactHours}
                  </div>
                  <div className="text-sm font-semibold text-foreground truncate">
                    {t.contactHoursValue}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── 4. WHAT HAPPENS NEXT ───────────── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
            <div className="inline-flex items-center gap-3 mb-4">
              <BruMark size={20} />
              <span className="text-xs font-bold tracking-[0.22em] uppercase text-accent">
                What Happens Next
              </span>
              <BruMark size={20} />
            </div>
            <Premium3DHeading
              as="h2"
              variant="section"
              theme="dark"
              className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]"
            >
              Three simple steps from request to quote.
            </Premium3DHeading>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* Connector hairline on md+ */}
            <div
              className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
              aria-hidden="true"
            />
            {NEXT_STEPS.map(({ n, title, desc }) => (
              <div
                key={n}
                className="relative bg-card ring-1 ring-border rounded-2xl p-6 md:p-8 shadow-sm motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:shadow-xl motion-safe:hover:-translate-y-0.5 motion-safe:hover:ring-accent/40"
              >
                <div className="absolute -top-4 left-6 w-9 h-9 rounded-full bg-accent text-accent-foreground font-display font-bold flex items-center justify-center shadow-md shadow-accent/30 ring-4 ring-card">
                  {n}
                </div>
                <h3 className="mt-2 font-display text-lg md:text-xl font-bold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── 5. CLOSING REASSURANCE BAND ───────────── */}
      <section className="relative py-10 md:py-12 bg-muted/40 border-t border-border">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-x-8 gap-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20">
                <Clock size={16} aria-hidden="true" />
              </span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-accent">
                  Average response
                </div>
                <div className="text-sm font-semibold text-foreground">Under 24 hours</div>
              </div>
            </div>

            <BruMark size={16} className="hidden md:inline-block text-accent/35" />

            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20">
                <Shield size={16} aria-hidden="true" />
              </span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-accent">
                  Privacy
                </div>
                <div className="text-sm font-semibold text-foreground">
                  Your data stays private
                </div>
              </div>
            </div>

            <BruMark size={16} className="hidden md:inline-block text-accent/35" />

            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20">
                <CheckCircle size={16} aria-hidden="true" />
              </span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-accent">
                  Vetted Pros
                </div>
                <div className="text-sm font-semibold text-foreground">
                  Licensed & insured only
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
