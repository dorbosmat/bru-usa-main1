import { ShieldCheck, Clock, BadgeDollarSign, Phone } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck,     text: "Licensed & insured contractors only" },
  { icon: Clock,           text: "Respond within 2 hours" },
  { icon: BadgeDollarSign, text: "100% free to homeowners" },
  { icon: Phone,           text: "No obligation, ever" },
];

interface TrustStripProps {
  layout?: "horizontal" | "vertical";
  className?: string;
}

export default function TrustStrip({ layout = "horizontal", className = "" }: TrustStripProps) {
  if (layout === "vertical") {
    return (
      <div className={`space-y-1.5 ${className}`}>
        {ITEMS.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon size={13} className="text-accent shrink-0" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={`flex flex-wrap justify-center gap-x-5 gap-y-1.5 ${className}`}>
      {ITEMS.map(({ icon: Icon, text }) => (
        <div key={text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon size={13} className="text-accent shrink-0" />
          <span>{text}</span>
        </div>
      ))}
    </div>
  );
}
