import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import LeadForm from "@/components/LeadForm";
import { SERVICES, SERVICE_AREAS } from "@/lib/constants";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChefHat,
  Sofa,
  Bath,
  Home,
  Bed,
  Building2,
  Hammer,
  Layers,
  Paintbrush2,
  DoorOpen,
  Sparkles,
  MapPin,
  type LucideIcon,
} from "lucide-react";

// Slug → lucide icon (matches ServiceCard mapping)
const ICON_MAP: Record<string, LucideIcon> = {
  "roofing":              Home,
  "kitchen-bath-remodel": ChefHat,
  "flooring":             Layers,
  "painting":             Paintbrush2,
  "concrete-driveway":    Hammer,
  "windows-doors":        DoorOpen,
  "general-remodeling":   Building2,
};

const STYLES = [
  { id: "modern",  label: "Modern",          desc: "Clean lines, neutral tones",     swatch: "bg-gradient-to-br from-stone-200 to-stone-500" },
  { id: "luxury",  label: "Luxury",          desc: "Premium finishes & materials",   swatch: "bg-gradient-to-br from-amber-300 to-amber-600" },
  { id: "minimal", label: "Clean Minimal",   desc: "Simplicity, open space",         swatch: "bg-gradient-to-br from-white to-stone-200" },
  { id: "budget",  label: "Budget-Friendly", desc: "Smart upgrades, great value",    swatch: "bg-gradient-to-br from-emerald-300 to-emerald-600" },
];

const BUDGETS = [
  { id: "under-5k",  label: "Under $5,000",       note: "Quick fixes and refreshes — great for repaints and minor repairs." },
  { id: "5k-15k",    label: "$5,000 – $15,000",   note: "Mid-range upgrades like flooring, paint, or partial remodels." },
  { id: "15k-40k",   label: "$15,000 – $40,000",  note: "Most kitchen and bath remodels fall in this range." },
  { id: "40k-100k",  label: "$40,000 – $100,000", note: "Premium remodels and substantial additions." },
  { id: "100k-plus", label: "$100,000+",          note: "Full custom remodels and ground-up builds." },
];

const TOTAL_STEPS = 5;

const SmartQuoteEngine = () => {
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [styleSel, setStyleSel] = useState("");
  const [budget, setBudget] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [showSkip, setShowSkip] = useState(false);

  const locationRef = useRef<HTMLInputElement>(null);

  // Auto-focus the location input when step 4 opens
  useEffect(() => {
    if (step === 4) {
      const t = setTimeout(() => locationRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Best-effort match input → SERVICE_AREA slug
  const findArea = (input: string) => {
    const q = input.trim().toLowerCase();
    if (!q) return undefined;
    return SERVICE_AREAS.find(
      (area) =>
        area.slug === q ||
        area.name.toLowerCase().includes(q) ||
        area.city.toLowerCase().includes(q)
    );
  };

  const matchedArea = findArea(locationInput);

  // Build the prefilled details text the user will see on step 5's form
  const getDefaultDetails = () => {
    const styleObj  = STYLES.find((s) => s.id === styleSel);
    const budgetObj = BUDGETS.find((b) => b.id === budget);
    const lines: string[] = [];
    if (styleObj)  lines.push(`Style: ${styleObj.label}`);
    if (budgetObj) lines.push(`Budget: ${budgetObj.label}`);
    if (locationInput && !matchedArea) lines.push(`Location: ${locationInput}`);
    return lines.join("\n");
  };

  // Auto-advance helper for steps 1 & 2 (instant feel after selection)
  const selectAndAdvance = (
    setter: (v: string) => void,
    value: string
  ) => {
    setter(value);
    setTimeout(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS)), 280);
  };

  const handleLocationContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchedArea) setServiceArea(matchedArea.slug);
    setStep(5);
  };

  const progress = (step / TOTAL_STEPS) * 100;

  // ─────────────────────────── Skip-to-full-form view
  if (showSkip) {
    return (
      <div className="relative">
        <div className="text-center mb-5">
          <button
            onClick={() => setShowSkip(false)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to quick quote
          </button>
        </div>
        <LeadForm landingPage="/contact" />
      </div>
    );
  }

  // ─────────────────────────── Step 1 — Project Type
  const renderStep1 = () => (
    <div key="s1" className="motion-safe:animate-fade-in">
      <div className="text-center mb-7 md:mb-8">
        <h3 className="font-display text-xl md:text-2xl font-extrabold text-foreground">
          What's your project?
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Pick the closest match — we'll fine-tune later.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {SERVICES.map((s) => {
          const Icon = ICON_MAP[s.slug] ?? Home;
          const isActive = service === s.slug;
          return (
            <button
              key={s.slug}
              onClick={() => selectAndAdvance(setService, s.slug)}
              aria-pressed={isActive}
              className={`group relative flex flex-col rounded-xl overflow-hidden bg-card transition-all duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-xl ${
                isActive
                  ? "ring-2 ring-accent shadow-xl"
                  : "ring-1 ring-border hover:ring-accent/40"
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {s.image && (
                  <img
                    src={s.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                {isActive && (
                  <span className="absolute top-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-md shadow-accent/40">
                    <Check size={14} aria-hidden="true" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 p-3 text-left">
                <span
                  className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "bg-accent/10 text-accent"
                  }`}
                >
                  <Icon size={14} aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-foreground">{s.title}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  // ─────────────────────────── Step 2 — Style
  const renderStep2 = () => (
    <div key="s2" className="motion-safe:animate-fade-in">
      <div className="text-center mb-7 md:mb-8">
        <h3 className="font-display text-xl md:text-2xl font-extrabold text-foreground">
          What style fits your vision?
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          You can always adjust this with your contractor.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {STYLES.map((s) => {
          const isActive = styleSel === s.id;
          return (
            <button
              key={s.id}
              onClick={() => selectAndAdvance(setStyleSel, s.id)}
              aria-pressed={isActive}
              className={`group flex flex-col items-start gap-3 rounded-xl bg-card p-4 text-left transition-all duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-xl ${
                isActive
                  ? "ring-2 ring-accent shadow-xl"
                  : "ring-1 ring-border hover:ring-accent/40"
              }`}
            >
              <span
                className={`h-12 w-12 rounded-lg ${s.swatch} ring-1 ring-white/30`}
                style={{
                  boxShadow:
                    "inset 0 -4px 8px rgba(0,0,0,0.30), 0 2px 4px rgba(0,0,0,0.18)",
                }}
                aria-hidden="true"
              />
              <div className="flex items-center justify-between w-full gap-2">
                <div className="min-w-0">
                  <span className="block font-display font-bold text-base text-foreground">
                    {s.label}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    {s.desc}
                  </span>
                </div>
                {isActive && (
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-md shadow-accent/40">
                    <Check size={14} aria-hidden="true" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  // ─────────────────────────── Step 3 — Budget
  const renderStep3 = () => {
    const selected = BUDGETS.find((b) => b.id === budget);
    return (
      <div key="s3" className="motion-safe:animate-fade-in">
        <div className="text-center mb-7 md:mb-8">
          <h3 className="font-display text-xl md:text-2xl font-extrabold text-foreground">
            What's your budget range?
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Just a rough number — final estimates come from licensed pros.
          </p>
        </div>
        <div className="space-y-2.5">
          {BUDGETS.map((b) => {
            const isActive = budget === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setBudget(b.id)}
                aria-pressed={isActive}
                className={`group w-full flex items-center justify-between gap-3 rounded-xl bg-card px-5 py-4 text-left transition-all duration-200 motion-safe:hover:shadow-md motion-safe:hover:-translate-y-0.5 ${
                  isActive
                    ? "ring-2 ring-accent shadow-md"
                    : "ring-1 ring-border hover:ring-accent/40"
                }`}
              >
                <span className="font-display font-bold text-foreground">{b.label}</span>
                {isActive ? (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm">
                    <Check size={13} aria-hidden="true" />
                  </span>
                ) : (
                  <span className="inline-flex h-6 w-6 rounded-full ring-1 ring-border" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
        {/* Smart message — appears after selection */}
        {selected && (
          <div className="mt-5 rounded-xl bg-accent/[0.07] ring-1 ring-accent/25 p-4 motion-safe:animate-fade-in">
            <div className="flex items-start gap-2.5">
              <Sparkles size={16} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-foreground/90 leading-relaxed">{selected.note}</p>
            </div>
          </div>
        )}
        {selected && (
          <Button
            variant="cta"
            size="lg"
            className="w-full mt-5 h-12 gap-2 text-base font-semibold shadow-lg shadow-accent/30"
            onClick={() => setStep(4)}
          >
            Continue
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
        )}
      </div>
    );
  };

  // ─────────────────────────── Step 4 — Location
  const renderStep4 = () => (
    <div key="s4" className="motion-safe:animate-fade-in">
      <div className="text-center mb-7 md:mb-8">
        <h3 className="font-display text-xl md:text-2xl font-extrabold text-foreground">
          Where's your project?
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          ZIP code or city — we'll match you with vetted pros nearby.
        </p>
      </div>
      <form onSubmit={handleLocationContinue} className="space-y-4">
        <div className="relative">
          <MapPin
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <input
            ref={locationRef}
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="e.g., Tampa, 33602, Miami…"
            aria-label="Project location ZIP or city"
            autoComplete="postal-code"
            className="w-full h-14 pl-11 pr-4 rounded-xl border border-input bg-background text-base font-medium placeholder:text-muted-foreground/60 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {locationInput.trim().length >= 2 && matchedArea && (
          <div className="rounded-xl bg-emerald-50 ring-1 ring-emerald-300/40 p-3.5 motion-safe:animate-fade-in">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shrink-0">
                <Check size={13} aria-hidden="true" />
              </span>
              <p className="text-sm text-foreground font-medium">
                {matchedArea.name} — vetted pros available in your area.
              </p>
            </div>
          </div>
        )}

        <Button
          variant="cta"
          size="lg"
          type="submit"
          className="w-full h-12 gap-2 text-base font-semibold shadow-lg shadow-accent/30 disabled:shadow-none"
          disabled={!locationInput.trim()}
        >
          Continue
          <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </form>
    </div>
  );

  // ─────────────────────────── Step 5 — Lead Capture
  const renderStep5 = () => {
    const projectTypeObj = SERVICES.find((s) => s.slug === service);
    const styleObj       = STYLES.find((s) => s.id === styleSel);
    const budgetObj      = BUDGETS.find((b) => b.id === budget);
    const summaryItems   = [
      projectTypeObj?.title,
      styleObj?.label,
      budgetObj?.label,
      matchedArea?.name ?? (locationInput.trim() || undefined),
    ].filter(Boolean) as string[];

    return (
      <div key="s5" className="motion-safe:animate-fade-in space-y-5">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-3 rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30 px-3 py-1">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check size={10} aria-hidden="true" />
            </span>
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-emerald-700">
              All set
            </span>
          </div>
          <h3 className="font-display text-xl md:text-2xl font-extrabold text-foreground leading-tight">
            One last step — where should we send your matched pros?
          </h3>
        </div>

        {summaryItems.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {summaryItems.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 ring-1 ring-accent/25 px-3 py-1 text-xs font-semibold text-accent"
              >
                <Check size={11} aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        )}

        <div className="pt-2">
          {/* Existing LeadForm — submission unchanged. defaultDetails carries the
              wizard's style + budget context so it actually reaches Supabase. */}
          <LeadForm
            defaultService={service}
            defaultServiceArea={serviceArea}
            defaultDetails={getDefaultDetails()}
            landingPage="/contact"
          />
        </div>
      </div>
    );
  };

  // ─────────────────────────── Wizard shell
  return (
    <div className="relative">
      {/* Soft accent halo */}
      <div
        className="pointer-events-none absolute -inset-6 -z-10"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 30%, hsl(24 95% 53% / 0.16), transparent 70%)",
          filter: "blur(34px)",
        }}
      />

      <div className="relative bg-card rounded-2xl ring-1 ring-border shadow-2xl shadow-black/15 p-5 md:p-7">
        {/* Progress header */}
        <div className="flex items-center gap-3 mb-6">
          {step > 1 && step < 5 ? (
            <button
              onClick={() => setStep((s) => Math.max(s - 1, 1))}
              aria-label="Previous step"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <ArrowLeft size={16} aria-hidden="true" />
            </button>
          ) : (
            <div className="w-9 shrink-0" aria-hidden="true" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-accent">
                Step {step} of {TOTAL_STEPS}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent/80 to-accent motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
      </div>

      {/* Skip-to-form escape hatch (only on early steps) */}
      {step < 5 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowSkip(true)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
          >
            Or fill out the full form instead
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartQuoteEngine;
