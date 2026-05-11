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