import { Link } from "react-router-dom";
import { Upload, Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import { trackCtaClick } from "@/lib/analytics";

import beforeBathroom from "@/assets/ai-preview/before-bathroom.png";
import afterBathroom from "@/assets/ai-preview/after-bathroom.png";

// TODO(i18n): move section copy below into LanguageContext when localizing.
// AI-DISCLOSURE-TODO: this section markets an AI tool. The eyebrow,
// subtext, and disclosure footnote together establish "this output is
// AI-generated" so users do not mistake the preview for a real photograph
// or a contractor's actual rendering.
const COPY = {
  eyebrow: "AI-Powered Renovation Preview",
  headline: "See Your Renovation",
  headlineAccent: "Before You Build",
  subtext:
    "Upload a photo of your space and our AI generates an illustrative preview in seconds — so you can explore ideas before any work starts.",
  bullets: [
    "AI-generated illustration, ready in seconds.",
    "Try kitchen, bath, or full remodel.",
    "Free preview — no credit card.",
  ],
  ctaPrimary: "Try AI Preview",
  ctaSecondary: "See how it works",
  beforeLabel: "Before",
  afterLabel: "After (AI)",
  step1Eyebrow: "Step 1",
  step1Label: "Upload a photo",
  step2Eyebrow: "Step 2",
  step2Label: "AI generates preview",
  step3Eyebrow: "Step 3",
  step3Label: "See your result",
  disclosure:
    "AI-generated illustration for inspiration only — not a guarantee of final build, materials, cost, or scope.",
};

const AiPreviewSection = () => {
  const { t } = useLanguage();

  const handleScrollToHowItWorks = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const node = document.getElementById("how-it-works");
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <section
      id="ai-preview"
      aria-labelledby="ai-preview-heading"
      className="py-16 md:py-24 bg-background"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT — text */}
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              <Sparkles size={14} aria-hidden="true" />
              {COPY.eyebrow}
            </span>

            <h2
              id="ai-preview-heading"
              className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.05] text-foreground"
            >
              {COPY.headline}{" "}
              <span className="text-accent">{COPY.headlineAccent}</span>
            </h2>

            <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
              {COPY.subtext}
            </p>

            <ul className="mt-6 space-y-3">
              {COPY.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm md:text-base text-foreground">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <CheckCircle size={14} aria-hidden="true" />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/renovation-preview">
                <Button
                  variant="cta"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => trackCtaClick("Try AI Preview")}
                >
                  {COPY.ctaPrimary}
                  <ArrowRight size={18} className="ml-2" aria-hidden="true" />
                </Button>
              </Link>
              <a href="#how-it-works" onClick={handleScrollToHowItWorks}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  {COPY.ctaSecondary}
                </Button>
              </a>
            </div>

            <p className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <CheckCircle size={12} className="text-accent" aria-hidden="true" />
                {t.trustNoObligation}
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle size={12} className="text-accent" aria-hidden="true" />
                {t.trustLicensed}
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle size={12} className="text-accent" aria-hidden="true" />
                {t.trustFastResponse}
              </span>
            </p>
            {/* AI-DISCLOSURE-TODO: persistent disclosure so the AI nature of
                the output is visible above the fold, not buried in a tooltip. */}
            <p className="mt-3 text-[11px] leading-snug text-muted-foreground italic">
              {COPY.disclosure}
            </p>
          </div>

          {/* RIGHT — visual stage */}
          <div className="relative w-full max-w-[560px] mx-auto lg:max-w-none">
            {/* Soft radial glow behind device (sits under tilted device) */}
            <div
              className="absolute inset-0 -z-10 [background:radial-gradient(55%_55%_at_50%_45%,hsl(var(--accent)/0.12),transparent_70%)]"
              aria-hidden="true"
            />

            {/* Stage — perspective only on md+ so mobile stays flat */}
            <div className="relative aspect-[5/4] flex items-center justify-center md:[perspective:1200px] md:[transform-style:preserve-3d]">

              {/* Flat ground shadow — does NOT tilt with device, md+ only */}
              <div
                className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-3 w-[70%] h-6 rounded-[50%] bg-black/35 blur-2xl"
                aria-hidden="true"
              />

              {/* Device frame — 3D tilt on md+, flat on mobile.
                  Mobile is intentionally narrower (82%) so the mockup feels
                  centered and breathes within the column. Desktop keeps 88%. */}
              <div
                className="
                  relative w-[82%] md:w-[88%] rounded-[2rem] bg-foreground p-1.5 md:p-3
                  ring-1 ring-black/10 shadow-2xl shadow-black/25
                  md:shadow-[0_50px_90px_-20px_rgba(0,0,0,0.45),0_20px_40px_-20px_rgba(0,0,0,0.25)]
                  transition-transform duration-500 ease-out
                  motion-safe:md:[transform:rotateX(6deg)_rotateY(-8deg)_scale(0.98)]
                  motion-safe:md:hover:[transform:rotateX(2deg)_rotateY(-3deg)_scale(1)]
                "
                aria-hidden="true"
              >
                {/* Top-edge highlight — simulates light catching the bezel */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/15 via-white/0 to-transparent"
                  aria-hidden="true"
                />

                {/* Tablet inner screen */}
                <div className="relative aspect-[5/3.5] rounded-[1.25rem] overflow-hidden bg-muted">
                  <div className="absolute inset-0 grid grid-cols-2">
                    {/* Before — outdated bathroom (real photo, no filter) */}
                    <div className="relative">
                      <img
                        src={beforeBathroom}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width={640}
                        height={480}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 rounded-md bg-black/60 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5">
                        {COPY.beforeLabel}
                      </span>
                    </div>
                    {/* After — renovated bathroom (real photo, no filter) */}
                    <div className="relative">
                      <img
                        src={afterBathroom}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width={640}
                        height={480}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <span className="absolute top-2 right-2 rounded-md bg-accent text-accent-foreground text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5">
                        {COPY.afterLabel}
                      </span>
                    </div>
                  </div>
                  {/* Subtle divider glow — soft accent halo behind the white seam,
                      hints at the "transformation" without being flashy */}
                  <div
                    className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 [background:linear-gradient(to_right,transparent,hsl(var(--accent)/0.18),transparent)] blur-md"
                    aria-hidden="true"
                  />
                  {/* Vertical divider with AI badge */}
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/70" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-full bg-white text-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 shadow-md">
                    <Sparkles size={10} className="text-accent" />
                    AI
                  </div>
                </div>
              </div>

              {/* Floating card 1 — wrapper handles position + 3D tilt; inner does the float.
                  md+ only: on mobile we use a clean static step row below the device. */}
              <div
                className="hidden md:block absolute md:-top-4 md:-left-8 motion-safe:md:[transform:rotateY(-6deg)_translateZ(-8px)]"
                aria-hidden="true"
              >
                <div className="max-w-[200px] flex items-center gap-2.5 bg-white rounded-xl px-3 py-2.5 shadow-lg shadow-black/10 ring-1 ring-black/5 motion-safe:animate-[float_4s_ease-in-out_infinite]">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Upload size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{COPY.step1Eyebrow}</span>
                    <span className="block text-sm font-semibold text-foreground leading-tight">{COPY.step1Label}</span>
                  </span>
                </div>
              </div>

              {/* Floating card 3 — bottom-left, same tilt as card 1. md+ only. */}
              <div
                className="hidden md:block absolute md:-bottom-4 md:left-8 motion-safe:md:[transform:rotateY(-6deg)_translateZ(-8px)]"
                aria-hidden="true"
              >
                <div
                  className="max-w-[200px] flex items-center gap-2.5 bg-white rounded-xl px-3 py-2.5 shadow-lg shadow-black/10 ring-1 ring-black/5 motion-safe:animate-[float_4s_ease-in-out_infinite]"
                  style={{ animationDelay: "2.6s" }}
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <CheckCircle size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{COPY.step3Eyebrow}</span>
                    <span className="block text-sm font-semibold text-foreground leading-tight">{COPY.step3Label}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Floating card 2 — placed OUTSIDE the perspective stage so its
                z-index is honoured (inside transform-style: preserve-3d, the
                browser ignores z-index and orders by translateZ instead, which
                let the tilted device occlude this card). Positioned absolutely
                relative to the right column at vertical mid-line, pulled
                outward enough that the card body sits clearly past the device
                right edge. No 3D tilt — keeps it fully readable.
                md+ only: replaced by the mobile step row on small screens. */}
            <div
              className="hidden md:block absolute z-30 top-1/2 -translate-y-1/2 md:-right-3 lg:-right-6 pointer-events-none"
              aria-hidden="true"
            >
              <div
                className="max-w-[200px] flex items-center gap-2.5 bg-white rounded-xl px-3 py-2.5 shadow-lg shadow-black/10 ring-1 ring-black/5 motion-safe:animate-[float_4s_ease-in-out_infinite]"
                style={{ animationDelay: "1.3s" }}
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Sparkles size={16} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{COPY.step2Eyebrow}</span>
                  <span className="block text-sm font-semibold text-foreground leading-tight">{COPY.step2Label}</span>
                </span>
              </div>
            </div>

            {/* Mobile-only step flow — shown < md to replace the 3 floating
                cards. Compact 3-column grid sits cleanly below the device,
                never overlaps the mockup, and reads as a linear Step 1→2→3. */}
            <ol className="md:hidden mt-5 grid grid-cols-3 gap-2 list-none">
              {[
                { Icon: Upload,      eyebrow: COPY.step1Eyebrow, label: COPY.step1Label },
                { Icon: Sparkles,    eyebrow: COPY.step2Eyebrow, label: COPY.step2Label },
                { Icon: CheckCircle, eyebrow: COPY.step3Eyebrow, label: COPY.step3Label },
              ].map(({ Icon, eyebrow, label }) => (
                <li
                  key={eyebrow}
                  className="flex flex-col items-center text-center bg-white rounded-xl px-2 py-2.5 shadow-md shadow-black/5 ring-1 ring-black/5"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon size={14} aria-hidden="true" />
                  </span>
                  <span className="mt-1.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {eyebrow}
                  </span>
                  <span className="text-[11px] font-semibold text-foreground leading-tight">
                    {label}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiPreviewSection;
