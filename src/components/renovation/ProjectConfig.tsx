import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Sparkles } from "lucide-react";

const PROJECT_TYPES = [
  { id: "kitchen", label: "Kitchen", icon: "🍳" },
  { id: "living-room", label: "Living Room", icon: "🛋️" },
  { id: "bathroom", label: "Bathroom", icon: "🚿" },
  { id: "roofing", label: "Roofing", icon: "🏠" },
  { id: "bedroom", label: "Bedroom", icon: "🛏️" },
  { id: "exterior", label: "Exterior", icon: "🏡" },
  { id: "full-remodel", label: "Full Room Remodel", icon: "🔨" },
];

const STYLES = [
  { id: "modern", label: "Modern", desc: "Clean lines, neutral tones" },
  { id: "luxury", label: "Luxury", desc: "High-end finishes, premium materials" },
  { id: "contemporary", label: "Contemporary", desc: "Current trends, bold accents" },
  { id: "budget-friendly", label: "Budget-Friendly", desc: "Smart upgrades, great value" },
  { id: "clean-minimal", label: "Clean Minimal", desc: "Simplicity, open space" },
];

interface ProjectConfigProps {
  previewUrl: string;
  projectType: string;
  style: string;
  onProjectTypeChange: (t: string) => void;
  onStyleChange: (s: string) => void;
  // Sprint 2 V1: personalization moved here from the (gated) lead form so the
  // AI preview is reachable with no PII. All optional — generation defaults if blank.
  budget: string;
  region: string;
  clientType: string;
  personalRequest: string;
  onBudgetChange: (v: string) => void;
  onRegionChange: (v: string) => void;
  onClientTypeChange: (v: string) => void;
  onPersonalRequestChange: (v: string) => void;
  onBack: () => void;
  onGenerate: () => void;
  generating: boolean;
}

const selectClass = "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow cursor-pointer";

const ProjectConfig = ({
  previewUrl, projectType, style,
  onProjectTypeChange, onStyleChange,
  budget, region, clientType, personalRequest,
  onBudgetChange, onRegionChange, onClientTypeChange, onPersonalRequestChange,
  onBack, onGenerate, generating,
}: ProjectConfigProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
  <div ref={sectionRef} className="space-y-6">
    {/* Friendly confirmation message */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-accent font-display font-semibold text-base md:text-lg animate-fade-in">
        <span>Nice — let's see what we can do with this 👍</span>
      </div>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Camera size={14} />
        Retake photo
      </button>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      {/* Photo preview */}
      <div className="rounded-xl overflow-hidden border border-border shadow-md aspect-[4/3]">
        <img src={previewUrl} alt="Your space" className="w-full h-full object-cover" />
      </div>

      <div className="space-y-5">
        {/* Project type */}
        <div>
          <h3 className="font-display font-bold text-foreground mb-3">Project Type</h3>
          <div className="grid grid-cols-2 gap-2">
            {PROJECT_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => onProjectTypeChange(t.id)}
                className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                  projectType === t.id
                    ? "border-accent bg-accent/10 text-foreground ring-1 ring-accent"
                    : "border-border hover:border-accent/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-lg">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div>
          <h3 className="font-display font-bold text-foreground mb-3">Preferred Style</h3>
          <div className="space-y-2">
            {STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => onStyleChange(s.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border text-sm transition-all text-left ${
                  style === s.id
                    ? "border-accent bg-accent/10 ring-1 ring-accent"
                    : "border-border hover:border-accent/40"
                }`}
              >
                <span className="font-medium text-foreground">{s.label}</span>
                <span className="text-xs text-muted-foreground">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Personalization (optional) — moved out of the gated lead form so the
            AI before/after is reachable with no PII. */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="pc-budget" className="text-sm font-medium text-foreground">Budget</label>
            <select id="pc-budget" value={budget} onChange={(e) => onBudgetChange(e.target.value)} className={selectClass}>
              <option>Budget-Friendly</option>
              <option>Mid-Range</option>
              <option>Luxury</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="pc-region" className="text-sm font-medium text-foreground">Region</label>
            <select id="pc-region" value={region} onChange={(e) => onRegionChange(e.target.value)} className={selectClass}>
              <option>Florida</option>
              <option>California</option>
              <option>Texas</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="pc-client-type" className="text-sm font-medium text-foreground">Client Type</label>
            <select id="pc-client-type" value={clientType} onChange={(e) => onClientTypeChange(e.target.value)} className={selectClass}>
              <option>Homeowner</option>
              <option>Investor</option>
              <option>Luxury Buyer</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="pc-personal-request" className="text-sm font-medium text-foreground">Tell us what you want <span className="text-muted-foreground font-normal">(optional)</span></label>
          <textarea
            id="pc-personal-request"
            value={personalRequest}
            onChange={(e) => onPersonalRequestChange(e.target.value)}
            placeholder="Example: a modern luxury kitchen with an island and warm lighting"
            className={selectClass + " resize-none min-h-[80px]"}
            maxLength={500}
          />
        </div>

        <Button
          variant="cta"
          size="lg"
          className="w-full gap-2 text-base py-4"
          onClick={onGenerate}
          disabled={!projectType || !style || generating}
        >
          <Sparkles size={18} />
          Reveal My Renovation
        </Button>
      </div>
    </div>
  </div>
  );
};

export default ProjectConfig;
