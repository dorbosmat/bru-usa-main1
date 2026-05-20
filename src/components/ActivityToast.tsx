import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X, TrendingUp } from "lucide-react";
import { useLocation } from "react-router-dom";
import { REALTIME_ACTIVITY_ENABLED } from "@/lib/social-proof-gate";

// FAKE-ACTIVITY-TODO: this component used to display "Someone in {city} just
// requested a {service} quote" toasts. Even when sourced from real Realtime
// data, the framing implied live homeowner activity that the platform cannot
// currently substantiate (lead submission is gated off in Task 1; the only
// rows arriving in the leads table are admin-created). The component is now
// disabled at the top via REALTIME_ACTIVITY_ENABLED. To re-enable:
//   1. Wire to a genuine, post-submission lead stream that reflects real
//      paying-homeowner activity, not seed/admin/test rows.
//   2. Flip REALTIME_ACTIVITY_ENABLED in src/lib/social-proof-gate.ts.
//   3. Remove this guard.

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// FAKE-ACTIVITY-TODO: hard kill switch — see header comment. The default
// export resolves to a no-op while REALTIME_ACTIVITY_ENABLED is false, which
// keeps hooks rules-compliant and lets Rollup tree-shake the implementation
// entirely.
export default function ActivityToast() {
  if (!REALTIME_ACTIVITY_ENABLED) return null;
  return <ActivityToastImpl />;
}

function ActivityToastImpl() {
  const [enabled,  setEnabled]  = useState<boolean | null>(null);
  const [visible,  setVisible]  = useState(false);
  const [message,  setMessage]  = useState("");
  const location                = useLocation();
  const hideTimerRef            = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackTimerRef        = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAdmin                 = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    supabase.from("site_settings").select("value").eq("key", "FAKE_ACTIVITY_ENABLED").maybeSingle()
      .then(({ data }) => setEnabled(data?.value === true || data?.value === "true"));
  }, [isAdmin]);

  const showToast = useCallback((msg: string) => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setMessage(msg);
    setVisible(true);
    supabase.from("event_log").insert({ event_type: "toast_shown" }).then(() => {});
    hideTimerRef.current = setTimeout(() => setVisible(false), 7000);
  }, []);

  useEffect(() => {
    if (isAdmin || enabled !== true) return;

    // Real-time: actual new leads
    const channel = supabase
      .channel("activity-toast")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "leads" }, payload => {
        const area    = (payload.new as any)?.service_area || "your area";
        const service = ((payload.new as any)?.service || "home improvement").replace(/-/g, " ");
        showToast(`Someone in ${area} just requested a ${service} quote`);
      })
      .subscribe();

    // Fallback: aggregate count if no real events arrive
    fallbackTimerRef.current = setTimeout(async () => {
      const today = new Date().toISOString().split("T")[0];
      const { count } = await supabase.from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", `${today}T00:00:00`);
      if (count && count > 0) showToast(`${count} homeowners requested quotes today`);
    }, rand(8000, 15000));

    return () => {
      supabase.removeChannel(channel);
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
      if (hideTimerRef.current)     clearTimeout(hideTimerRef.current);
    };
  }, [enabled, isAdmin, showToast]);

  if (!visible || isAdmin) return null;

  return (
    <div className="fixed left-4 max-w-[90vw] md:max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-300"
      style={{ bottom: "var(--toast-offset-bottom, 120px)", zIndex: 9999 }}>
      <div className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-lg">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 shrink-0 mt-0.5">
          <TrendingUp size={16} className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-snug">{message}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Just now</p>
        </div>
        <button onClick={() => setVisible(false)} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors" aria-label="Dismiss">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
