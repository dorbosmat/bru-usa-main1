import { DollarSign, Info } from "lucide-react";
import { getEstimatedPriceRange } from "@/services/renovation/pricing";

const fmt = (n: number) => "$" + n.toLocaleString();

interface PriceEstimateProps {
  projectType: string;
  style: string;
}

const PriceEstimate = ({ projectType, style }: PriceEstimateProps) => {
  const { low, high } = getEstimatedPriceRange(projectType, style);
  const range: [number, number] = [low, high];

  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-4 shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
          <DollarSign size={20} className="text-accent" />
        </div>
        <div>
          <h3 className="font-display font-bold text-foreground">Estimated Price Range</h3>
          <p className="text-xs text-muted-foreground">Based on project type & style selection</p>
        </div>
      </div>

      <div className="text-center py-4">
        <p className="font-display text-3xl md:text-4xl font-extrabold text-foreground">
          {fmt(range[0])} – {fmt(range[1])}
        </p>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border">
        <Info size={14} className="text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Project estimates or price ranges displayed on this website are preliminary and intended for informational purposes only. Final pricing will depend on on-site inspection, project scope, materials, and contractor evaluation. Build Right USA does not guarantee pricing or project availability.
        </p>
      </div>
    </div>
  );
};

export default PriceEstimate;
