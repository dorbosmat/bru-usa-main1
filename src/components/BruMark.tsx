interface BruMarkProps {
  /** Width in pixels. Height auto-derived from viewBox aspect (~28% of width). */
  size?: number;
  className?: string;
}

/**
 * BRU roof-chevron mark — inline SVG recreation of the orange chevron from
 * the BRU logo (/public/bru-icon.png). Used as a small architectural accent
 * across the Services page (section eyebrows, certified badge, watermark).
 *
 * Inherits color via `currentColor` — pass any text-{color} utility to tint.
 */
const BruMark = ({ size = 28, className = "text-accent" }: BruMarkProps) => (
  <svg
    viewBox="0 0 100 28"
    width={size}
    height={size * 0.28}
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M 0 24 L 50 4 L 100 24 L 88 24 L 50 14 L 12 24 Z" />
  </svg>
);

export default BruMark;
