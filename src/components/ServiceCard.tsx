import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  ChefHat,
  CheckCircle,
  DoorOpen,
  Hammer,
  Home,
  Layers,
  Paintbrush2,
  type LucideIcon,
} from "lucide-react";
import BruMark from "@/components/BruMark";

interface ServiceCardProps {
  slug: string;
  title: string;
  shortDesc: string;
  icon: string; // emoji string from SERVICES data — preserved as fallback
  image?: string;
  features?: string[];
}

// Slug → lucide vector icon (replaces emoji as structural icon per skill rule)
const ICON_MAP: Record<string, LucideIcon> = {
  "roofing":              Home,
  "kitchen-bath-remodel": ChefHat,
  "flooring":             Layers,
  "painting":             Paintbrush2,
  "concrete-driveway":    Hammer,
  "windows-doors":        DoorOpen,
  "general-remodeling":   Building2,
};

const ServiceCard = ({ slug, title, shortDesc, icon, image, features }: ServiceCardProps) => {
  const Icon = ICON_MAP[slug];
  const topFeatures = features?.slice(0, 3) ?? [];

  return (
    <Link
      to={`/services/${slug}`}
      className="
        group flex flex-col rounded-2xl bg-card overflow-hidden
        ring-1 ring-border shadow-sm
        transition-all duration-300
        motion-safe:hover:-translate-y-0.5
        motion-safe:hover:shadow-xl
        motion-safe:hover:ring-accent/40
      "
    >
      {/* Image area — hover zoom inside frame, no layout shift */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
          />
        ) : Icon ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <Icon size={48} aria-hidden="true" />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl" aria-hidden="true">
            {icon}
          </div>
        )}
        {/* Soft bottom gradient for any future overlay legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/35 to-transparent" />
        {/* BRU Certified badge — strategic brand mark */}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm ring-1 ring-black/5 px-2.5 py-1 shadow-sm">
          <BruMark size={14} className="text-accent" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground">
            BRU Certified
          </span>
        </div>
      </div>

      {/* Body — flex-1 so cards in same row align bottoms */}
      <div className="flex flex-col flex-1 p-5 md:p-6 gap-3">
        <div className="flex items-center gap-2.5">
          {Icon ? (
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-accent/20 motion-safe:transition-all motion-safe:group-hover:bg-accent motion-safe:group-hover:text-accent-foreground motion-safe:group-hover:shadow-md motion-safe:group-hover:shadow-accent/30">
              <Icon size={17} aria-hidden="true" />
            </span>
          ) : (
            <span className="text-2xl" aria-hidden="true">{icon}</span>
          )}
          <h3 className="font-display text-lg md:text-xl font-bold text-foreground motion-safe:transition-colors group-hover:text-accent">
            {title}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{shortDesc}</p>

        {topFeatures.length > 0 && (
          <ul className="mt-1 space-y-1.5">
            {topFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-foreground/85">
                <CheckCircle size={14} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}

        <span className="mt-auto pt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
          Explore service
          <ArrowRight
            size={16}
            className="motion-safe:transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
};

export default ServiceCard;
