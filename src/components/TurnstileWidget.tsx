import { forwardRef, useImperativeHandle } from "react";
import { useTurnstile, type TurnstileOptions } from "@/hooks/useTurnstile";

// ─────────────────────────────────────────────────────────────────────────────
// TurnstileWidget (Sprint Task 6)
//
// Thin, presentational wrapper around the useTurnstile hook. Renders a
// container div for the Cloudflare widget plus an optional "dev mode"
// badge when no site key is configured. NOT yet mounted in any user-
// facing form — the lead form, AI Preview lead capture, and chat widget
// are all gated off in Tasks 1–4. Add this component to those surfaces
// only when re-enabling them.
//
// TURNSTILE-TODO: mount in the following surfaces once re-enabled, and
// forward the token via .getToken() into the request body:
//   - src/components/LeadForm.tsx
//   - src/pages/GetQuote.tsx
//   - src/components/renovation/LeadCaptureForm.tsx
//   - src/components/renovation/LeadCaptureModal.tsx
//   - src/components/ChatWidget.tsx (header X-Turnstile-Token)
// ─────────────────────────────────────────────────────────────────────────────

export interface TurnstileWidgetHandle {
  getToken: () => Promise<string>;
  reset: () => void;
  isDevBypass: boolean;
}

interface Props extends TurnstileOptions {
  /** Optional className passed through to the widget container. */
  className?: string;
  /** Render a small "dev-mode" tag when no VITE_TURNSTILE_SITE_KEY is
   *  set, so developers can spot the bypass during local work. */
  showDevBadge?: boolean;
}

const TurnstileWidget = forwardRef<TurnstileWidgetHandle, Props>(function TurnstileWidget(
  { className, showDevBadge = false, ...opts }: Props,
  ref,
) {
  const { containerRef, getToken, reset, isDevBypass } = useTurnstile(opts);

  useImperativeHandle(ref, () => ({ getToken, reset, isDevBypass }), [getToken, reset, isDevBypass]);

  if (isDevBypass) {
    if (!showDevBadge) return null;
    return (
      <div className={`text-[10px] text-muted-foreground italic ${className ?? ""}`}>
        Turnstile: dev bypass (no site key)
      </div>
    );
  }

  return <div ref={containerRef} className={className} aria-hidden="true" />;
});

export default TurnstileWidget;
