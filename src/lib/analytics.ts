// GA4 event tracking utilities with bot/internal traffic filtering

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

function isBot(): boolean {
  const ua = navigator.userAgent;
  if (!ua) return true;
  const botPatterns = /bot|crawl|spider|slurp|facebookexternalhit|baiduspider|yandex|duckduckbot|googlebot|bingbot|semrush|ahrefs|mj12bot|dotbot|rogerbot|screaming|lighthouse|headless|phantom|puppeteer|playwright|selenium|webdriver/i;
  if (botPatterns.test(ua)) return true;
  if (navigator.webdriver) return true;
  if (!window.innerWidth || !window.innerHeight) return true;
  return false;
}

function isRealUser(): boolean {
  if (isBot()) return false;
  if (typeof window === "undefined") return false;
  // Filter prefetch/prerender
  const nav = navigator as any;
  if ((document.visibilityState as string) === "prerender") return false;
  if (nav.connection?.saveData) return false;
  return true;
}

export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  if (!isRealUser()) return;
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, {
      ...params,
      traffic_type: "external",
    });
  }
}

export function trackLeadConversion(serviceType: string, zipCode: string) {
  trackEvent("generate_lead", {
    service_type: serviceType,
    zip_code: zipCode,
    page_location: window.location.pathname,
  });
}

export function trackCtaClick(label: string = "Get My Free Quote") {
  trackEvent("cta_click", {
    button_label: label,
    page_location: window.location.pathname,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// The Reveal™ funnel taxonomy (Sprint 1 — T1)
//
// Ordered steps the homeowner moves through in the AI Renovation Preview flow.
// While leads are gated OFF, the honest near-term north-star is:
//   completion  = reveal_viewed / upload_start
//   share/save  = (added when share UI ships)
// Every step is emitted via trackFunnelStep, which inherits the same
// bot/prerender filtering as trackEvent above. Pure client-side GA4 — no
// Supabase, edge function, or PII involved.
// ─────────────────────────────────────────────────────────────────────────────
export type RevealFunnelStep =
  | "upload_start"        // user lands on the upload step
  | "photo_selected"      // a photo has been chosen
  | "generation_start"    // generation request dispatched
  | "generation_complete" // a usable preview was returned
  | "generation_failed"   // generation errored / returned no image
  | "reveal_viewed"       // the before/after result became visible
  | "slider_interacted"   // user dragged the before/after slider (once per result)
  | "cta_tap";            // user tapped a result-stage call-to-action

export function trackFunnelStep(
  step: RevealFunnelStep,
  params?: Record<string, string | number | boolean>,
) {
  trackEvent(step, {
    funnel: "reveal",
    ...params,
    page_location: window.location.pathname,
  });
}