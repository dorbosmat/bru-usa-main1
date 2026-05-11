import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Shield, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Premium3DHeading from "@/components/Premium3DHeading";
import { useLanguage } from "@/i18n/LanguageContext";
import { trackCtaClick } from "@/lib/analytics";

import heroRoofing     from "@/assets/home/hero-roofing.jpg";
import heroSolar       from "@/assets/home/hero-solar.jpg";
import heroRoofingTeam from "@/assets/home/hero-roofing-team.jpg";
import heroRoofWork    from "@/assets/home/hero-roof-work.jpg";
import heroSolarWide   from "@/assets/home/hero-solar-wide.jpg";

// PERFORMANCE: slide[0] = eager + high priority (LCP). Slides 1-4 = lazy + low priority.
// <link rel="preload"> injected for slide[0] so browser finds it before React renders.
// Rotation paused when tab hidden (saves bandwidth) and for prefers-reduced-motion users.

const SLIDES = [heroRoofing, heroSolar, heroRoofingTeam, heroRoofWork, heroSolarWide];
const INTERVAL = 4000;

const HeroSlider = () => {
  const { t }    = useLanguage();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [service, setService] = useState("");
  const [zip, setZip]         = useState("");
  const intervalRef           = useRef<ReturnType<typeof setInterval> | null>(null);

  const prefersReducedMotion = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  // Preload hint for LCP image
  useEffect(() => {
    if (document.querySelector('link[data-hero-preload]')) return;
    const link = document.createElement("link");
    link.rel = "preload"; link.as = "image";
    link.href = SLIDES[0];
    link.dataset.heroPreload = "1";
    document.head.appendChild(link);
  }, []);

  const startRotation = useCallback(() => {
    if (prefersReducedMotion.current) return;
    intervalRef.current = setInterval(() => setCurrent(p => (p + 1) % SLIDES.length), INTERVAL);
  }, []);

  const stopRotation = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  useEffect(() => { startRotation(); return stopRotation; }, [startRotation, stopRotation]);

  useEffect(() => {
    const onVisibility = () => document.visibilityState === "hidden" ? stopRotation() : startRotation();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [startRotation, stopRotation]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (service) params.set("service", service);
    if (zip)     params.set("zip", zip);
    trackCtaClick("Get Free Quote");
    navigate(`/get-a-quote?${params.toString()}`);
  }, [service, zip, navigate]);

  return (
    <section
      className="relative w-full h-[88svh] min-h-[600px] md:h-[80vh] md:min-h-[640px] lg:h-[82vh] lg:max-h-[820px] flex items-center justify-center overflow-hidden"
      aria-label="Find a contractor"
    >
      {SLIDES.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover object-top"
            width={1920}
            height={1080}
            loading={i === 0 ? "eager" : "lazy"}
            {...({ fetchpriority: i === 0 ? "high" : "low" } as React.ImgHTMLAttributes<HTMLImageElement>)}
            decoding={i === 0 ? "sync" : "async"}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/15"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <Premium3DHeading
          as="h1"
          variant="hero"
          theme="light"
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-white"
        >
          {t.heroSliderHeadline}
        </Premium3DHeading>

        <p className="mt-4 md:mt-5 text-base md:text-lg text-white/90 max-w-xl mx-auto leading-relaxed [text-shadow:_0_1px_8px_rgba(0,0,0,0.5)]">
          {t.heroSliderSubtext}
        </p>

        <form
          onSubmit={handleSearch}
          className="mt-7 md:mt-8 mx-auto max-w-2xl bg-white/95 backdrop-blur-sm rounded-2xl p-3 md:p-4 shadow-2xl shadow-black/30 ring-1 ring-white/40 flex flex-col sm:flex-row items-stretch gap-2"
        >
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              id="hero-service"
              name="service"
              value={service}
              onChange={e => setService(e.target.value)}
              placeholder={t.heroSearchPlaceholder}
              aria-label={t.heroSearchPlaceholder}
              className="w-full h-12 pl-11 pr-3 rounded-xl border border-border bg-white text-foreground text-base focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-muted-foreground"
            />
          </div>

          <div className="relative sm:w-36">
            <MapPin
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              id="hero-zip"
              name="zip"
              inputMode="numeric"
              pattern="[0-9]*"
              value={zip}
              onChange={e => setZip(e.target.value)}
              placeholder={t.heroZipPlaceholder}
              maxLength={5}
              aria-label={t.heroZipPlaceholder}
              className="w-full h-12 pl-11 pr-3 rounded-xl border border-border bg-white text-foreground text-base focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-muted-foreground"
            />
          </div>

          <Button
            type="submit"
            variant="cta"
            className="h-12 rounded-xl px-6 text-sm md:text-base font-semibold"
          >
            {t.heroSearchCta}
          </Button>
        </form>

        <ul className="mt-5 md:mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-white/90 text-xs md:text-sm">
          {[
            { Icon: Shield,      label: t.trustLicensed },
            { Icon: Clock,       label: t.trustFastResponse },
            { Icon: MapPin,      label: t.trustLocalPros },
            { Icon: CheckCircle, label: t.trustNoObligation },
          ].map(({ Icon, label }) => (
            <li key={label} className="flex items-center gap-1.5">
              <Icon size={14} className="text-accent" aria-hidden="true" />
              <span className="font-medium [text-shadow:_0_1px_4px_rgba(0,0,0,0.5)]">{label}</span>
            </li>
          ))}
        </ul>

        <div className="flex justify-center gap-1.5 mt-6 md:mt-7">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); stopRotation(); startRotation(); }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-accent w-6"
                  : "bg-white/50 hover:bg-white/70 w-2"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
