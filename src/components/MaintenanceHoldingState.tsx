import { Wrench, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CALLBACK_HOURS,
  CALLBACK_PHONE_DISPLAY,
  CALLBACK_PHONE_E164,
  MAINTENANCE_HEADLINE,
  MAINTENANCE_MESSAGE,
} from "@/lib/lead-submission-gate";

// ─────────────────────────────────────────────────────────────────────────────
// MaintenanceHoldingState — shown in place of the post-submit success UI
// while LEAD_SUBMISSION_ENABLED is false (see lead-submission-gate.ts).
//
// Variants:
//   - "card"   default panel with shadow/padding (matches LeadForm / GetQuote)
//   - "inline" no card chrome — for embedding inside a host card (e.g. chat
//              transcript or modal that already provides its own surface)
// ─────────────────────────────────────────────────────────────────────────────

type Variant = "card" | "inline";

interface Props {
  variant?: Variant;
  className?: string;
}

const hasRealCallbackNumber =
  CALLBACK_PHONE_E164.length > 0 && CALLBACK_PHONE_DISPLAY.length > 0;

export default function MaintenanceHoldingState({
  variant = "card",
  className = "",
}: Props) {
  const wrapper =
    variant === "card"
      ? `bg-card rounded-lg shadow-xl p-6 md:p-8 ${className}`
      : `${className}`;

  return (
    <div className={wrapper} role="status" aria-live="polite">
      <div className="flex flex-col items-center text-center space-y-5">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 text-accent">
          <Wrench size={26} aria-hidden="true" />
        </div>

        <div className="space-y-2 max-w-md">
          <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">
            {MAINTENANCE_HEADLINE}
          </h3>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {MAINTENANCE_MESSAGE}
          </p>
        </div>

        {/* TODO(LEAD-GATE-TODO): replace the placeholder callback block once
            CALLBACK_PHONE_E164 / CALLBACK_PHONE_DISPLAY are set in
            src/lib/lead-submission-gate.ts. */}
        <div className="w-full max-w-sm rounded-xl border border-border bg-muted/40 p-5 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Phone size={14} className="text-accent" aria-hidden="true" />
            <span>Prefer to talk to a human?</span>
          </div>

          {hasRealCallbackNumber ? (
            <a href={`tel:${CALLBACK_PHONE_E164}`} className="block">
              <Button variant="cta" size="lg" className="w-full">
                <Phone size={16} className="mr-2" aria-hidden="true" />
                {CALLBACK_PHONE_DISPLAY}
              </Button>
            </a>
          ) : (
            <div
              className="w-full rounded-md border border-dashed border-border bg-background px-4 py-3 text-sm text-muted-foreground"
              data-testid="callback-cta-placeholder"
            >
              Phone line being provisioned — check back soon.
            </div>
          )}

          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Clock size={12} aria-hidden="true" />
            <span>{CALLBACK_HOURS}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
