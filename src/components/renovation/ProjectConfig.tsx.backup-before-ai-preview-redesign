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
  onBack: () => void;
  onGenerate: () => void;
  generating: boolean;
}

const ProjectConfig = ({
  previewUrl, projectType, style,
  onProjectTypeChange, onStyleChange,
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

        <Button
          variant="cta"
          size="lg"
          className="w-full gap-2 text-base py-4"
          onClick={onGenerate}
          disabled={!projectType || !style || generating}
        >
          <Sparkles size={18} />
          Continue to Preview
        </Button>
      </div>
    </div>
  </div>
  );
};

export default ProjectConfig;
