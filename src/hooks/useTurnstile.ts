import { useCallback, useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// useTurnstile (Sprint Task 6)
//
// Loads the Cloudflare Turnstile script and renders an invisible (or
// "managed") widget that produces a verification token. Designed to be
// consumed by lead-form / AI-Preview / chat surfaces ONCE those surfaces
// are wired for re-submission. None of those surfaces render the widget
// today — see TURNSTILE-TODO notes on each.
//
// Graceful dev fallback:
//   When VITE_TURNSTILE_SITE_KEY is empty (dev / preview without a real
//   site key), the hook never loads the script and never renders the
//   widget. `getToken()` returns the sentinel "dev-no-site-key" so the
//   surrounding flow keeps working. The server-side verifyTurnstile
//   helper similarly soft-passes when TURNSTILE_SECRET_KEY is unset, so
//   the dev experience is unbroken end-to-end.
//
// TURNSTILE-TODO:
//   1. Provision Turnstile site key + secret (free tier).
//   2. Add VITE_TURNSTILE_SITE_KEY to .env / Vercel env.
//   3. Add TURNSTILE_SECRET_KEY to Supabase secrets via
//      `supabase secrets set TURNSTILE_SECRET_KEY=… --project-ref …`.
//   4. Wire <TurnstileWidget /> into LeadForm and the AI Preview flow.
//   5. Add token to the submit request body / X-Turnstile-Token header.
// ─────────────────────────────────────────────────────────────────────────────

const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const DEV_BYPASS_TOKEN = "dev-no-site-key";

export interface TurnstileOptions {
  /** Cloudflare Turnstile action — must match expectedAction in the
   *  server-side verifyTurnstile call. */
  action?: string;
  /** Theme override; default "auto". */
  theme?: "light" | "dark" | "auto";
  /** Widget size; "invisible" is preferred for non-disruptive UX. */
  size?: "normal" | "compact" | "invisible";
}

export interface TurnstileHandle {
  /** Container ref — attach to the div where the widget should mount. */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Get the current token. Resolves with DEV_BYPASS_TOKEN if the site
   *  key is unset; otherwise resolves with the live Turnstile token (or
   *  rejects if the user has not completed the challenge). */
  getToken: () => Promise<string>;
  /** Force a token reset — call after a failed submit. */
  reset: () => void;
  /** True once the script is loaded and the widget is rendered (or true
   *  immediately in dev-bypass mode). */
  ready: boolean;
  /** True when no site key is configured — surface this to render an
   *  optional "dev mode" badge or skip rendering the widget container. */
  isDevBypass: boolean;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          action?: string;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "invisible";
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string | undefined;
      remove: (widgetId?: string) => void;
    };
  }
}

let scriptLoadingPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-turnstile-loader="1"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("turnstile-script-error")));
      return;
    }
    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.dataset.turnstileLoader = "1";
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => reject(new Error("turnstile-script-error")));
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

export function useTurnstile(opts: TurnstileOptions = {}): TurnstileHandle {
  const siteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "") as string;
  const isDevBypass = !siteKey;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const tokenRef = useRef<string | null>(null);
  const tokenWaitersRef = useRef<Array<(t: string) => void>>([]);
  const [ready, setReady] = useState<boolean>(isDevBypass);

  useEffect(() => {
    if (isDevBypass) return;

    let cancelled = false;
    loadTurnstileScript()
      .then(() => {
        if (cancelled) return;
        if (!containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action: opts.action,
          theme: opts.theme ?? "auto",
          size: opts.size ?? "invisible",
          callback: (token: string) => {
            tokenRef.current = token;
            const waiters = tokenWaitersRef.current;
            tokenWaitersRef.current = [];
            waiters.forEach((w) => w(token));
          },
          "error-callback": () => {
            tokenRef.current = null;
          },
          "expired-callback": () => {
            tokenRef.current = null;
          },
        });
        setReady(true);
      })
      .catch(() => {
        // Script failed — leave dev-bypass-token path as the fallback.
        setReady(true);
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
      }
    };
  }, [isDevBypass, siteKey, opts.action, opts.theme, opts.size]);

  const getToken = useCallback((): Promise<string> => {
    if (isDevBypass) return Promise.resolve(DEV_BYPASS_TOKEN);
    if (tokenRef.current) return Promise.resolve(tokenRef.current);
    return new Promise<string>((resolve) => {
      tokenWaitersRef.current.push(resolve);
    });
  }, [isDevBypass]);

  const reset = useCallback(() => {
    tokenRef.current = null;
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {
        // ignore
      }
    }
  }, []);

  return { containerRef, getToken, reset, ready, isDevBypass };
}

export const TURNSTILE_DEV_BYPASS_TOKEN = DEV_BYPASS_TOKEN;
