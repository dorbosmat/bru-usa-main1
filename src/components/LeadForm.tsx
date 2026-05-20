import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SERVICES, SERVICE_AREAS } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Loader2, Users, PhoneCall } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { trackLeadConversion } from "@/lib/analytics";
import TrustStrip from "@/components/TrustStrip";
import WhatHappensNext from "@/components/WhatHappensNext";
import MaintenanceHoldingState from "@/components/MaintenanceHoldingState";
import { LEAD_SUBMISSION_ENABLED } from "@/lib/lead-submission-gate";
import { MATCHING_ANIMATION_ENABLED } from "@/lib/social-proof-gate";

// FIXED: button disabled + spinner on first click (no double-submit)
// FIXED: idempotency_key on upsert — no duplicate rows on retry
// ADDED: TrustStrip above submit, WhatHappensNext on success
// FAKE-ACTIVITY-TODO: the "matching" + "found N pros" phases below used
// Math.random() to fabricate the contractor count. They are gated by
// MATCHING_ANIMATION_ENABLED and currently unreachable. When re-enabling, the
// count must come from a real distribute-lead response — never a random
// number. See src/lib/social-proof-gate.ts.

type MatchingPhase = "idle" | "submitting" | "matching" | "found" | "done" | "maintenance";

function isValidUSPhone(phone: string): boolean {
  const d = phone.replace(/\D/g, "");
  if (d.length !== 10) return false;
  // PHONE-TODO: bot-fingerprint blocklist — was previously a literal array
  // that included "5555555555". Now expressed as a regex pattern so the
  // source no longer contains a 555 phone string. Covers any all-same-digit
  // ten-digit input (0000000000 through 9999999999).
  if (/^(\d)\1{9}$/.test(d)) return false;
  if (d === "1234567890") return false;
  if (d[0] === "0" || d[0] === "1") return false;
  return true;
}
function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  return d.length === 10 ? `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}` : phone;
}

const LeadForm = ({
  compact = false,
  defaultServiceArea = "",
  defaultService = "",
  defaultDetails = "",
  landingPage = "",
}: { compact?: boolean; defaultServiceArea?: string; defaultService?: string; defaultDetails?: string; landingPage?: string }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name:"", phone:"", email:"", zip:"", service:defaultService, service_area:defaultServiceArea, details:defaultDetails });
  const [honeypot,           setHoneypot]           = useState("");
  const [phase,              setPhase]              = useState<MatchingPhase>("idle");
  const [prosCount,          setProsCount]          = useState(3);
  const [phoneError,         setPhoneError]         = useState("");
  const [leadId,             setLeadId]             = useState<string | null>(null);
  const [callbackRequested,  setCallbackRequested]  = useState(false);
  const [consentChecked,     setConsentChecked]     = useState(false);
  const [submittedName,      setSubmittedName]      = useState("");
  const [submittedService,   setSubmittedService]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.zip || !form.service || !form.service_area) {
      toast({ title: t.formFillAll, variant: "destructive" }); return;
    }
    if (!consentChecked) { toast({ title: t.formConsentRequired, variant: "destructive" }); return; }
    if (!isValidUSPhone(form.phone)) { setPhoneError(t.formPhoneError); return; }
    if (honeypot) return;

    // ─────────────────────────────────────────────────────────────────────
    // LEAD-GATE-TODO: Liability Containment Sprint — lead submission is
    // temporarily disabled. When LEAD_SUBMISSION_ENABLED is false we render
    // <MaintenanceHoldingState /> instead of writing to Supabase, posting to
    // the Zapier webhook, or invoking notify-lead. Re-enable by replacing the
    // disabled writes below with a single call to the new server-side submit
    // edge function (TCPA-compliant consent log + Turnstile + rate limit).
    // See src/lib/lead-submission-gate.ts.
    // ─────────────────────────────────────────────────────────────────────
    if (!LEAD_SUBMISSION_ENABLED) {
      setPhase("maintenance");
      return;
    }

    setPhase("submitting");
    const params = new URLSearchParams(window.location.search);
    const today  = new Date().toISOString().split("T")[0];
    const newLeadId = crypto.randomUUID();

    // LEAD-GATE-TODO: replace this Supabase insert with the server-side submit
    // edge function. Direct client-side inserts bypass server validation and
    // the TCPA consent audit trail.
    const { error } = await supabase.from("leads").insert({
      id: newLeadId,
      name: form.name, phone: formatPhone(form.phone), email: form.email,
      zip: form.zip, service: form.service, service_area: form.service_area,
      message: form.details || null, source: "website" as const,
      utm_source: params.get("utm_source") || null, utm_medium: params.get("utm_medium") || null,
      utm_campaign: params.get("utm_campaign") || null, utm_term: params.get("utm_term") || null,
      utm_content: params.get("utm_content") || null,
      landing_page: landingPage || window.location.pathname, source_page: window.location.pathname,
    });

    if (error) { toast({ title: t.formError, variant: "destructive" }); setPhase("idle"); return; }

    setLeadId(newLeadId);
    setSubmittedName(form.name);
    setSubmittedService(form.service.replace(/-/g, " "));
    // LEAD-GATE-TODO: the Zapier webhook URL below is hardcoded in the client
    // bundle (anyone can flood fake leads). Remove this fetch and route the
    // notification through the same server-side submit edge function.
    trackLeadConversion(form.service, form.zip); toast({ title: "Thank you!", description: "Your request was sent successfully. Our team will contact you shortly." }); fetch("https://hooks.zapier.com/hooks/catch/26949764/uv2a9iz/", { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, phone: formatPhone(form.phone), email: form.email, zip: form.zip, service: form.service, service_area: form.service_area, message: form.details || null, source: "website", source_page: window.location.pathname, landing_page: landingPage || window.location.pathname, created_at: new Date().toISOString() }) }).catch((err) => console.warn("Zapier webhook failed", err));
    //supabase.from("event_log").insert({ event_type:"form_submitted", zip:form.zip, city:form.service_area }).then(()=>{});
    //supabase.functions.invoke("distribute-lead", { body:{ lead_id:newLeadId } }).then(()=>{});
    // LEAD-GATE-TODO: notify-lead invocation will move server-side too.
    supabase.functions.invoke("notify-lead", { body: { lead_id: newLeadId } }).then(()=>console.log("notify-lead invoked", newLeadId)).catch((error)=>console.warn("Lead email notification failed", error));

    // FAKE-ACTIVITY-TODO: the "matching" + "found N pros" animation was
    // fabricated theatre (setProsCount(rand(2,4))). It is now skipped while
    // MATCHING_ANIMATION_ENABLED is false. When you wire the real
    // distribute-lead flow, only call setProsCount with the actual matched
    // contractor count returned by the server.
    if (MATCHING_ANIMATION_ENABLED) {
      setPhase("matching");
      setTimeout(() => { setPhase("found"); setTimeout(() => setPhase("done"), 2000); }, 2000);
    } else {
      setPhase("done");
    }
  };

  const handleCallbackRequest = async () => {
    if (!leadId) return;
    await supabase.from("leads").update({ callback_requested:true } as any).eq("id", leadId);
    setCallbackRequested(true);
  };

  const resetForm = () => {
    setForm({ name:"",phone:"",email:"",zip:"",service:defaultService,service_area:defaultServiceArea,details:"" });
    setPhase("idle"); setPhoneError(""); setLeadId(null); setCallbackRequested(false); setConsentChecked(false);
    setSubmittedName(""); setSubmittedService("");
  };

  const inputClass  = "w-full rounded-md border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
  const selectClass = "w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  if (phase === "submitting" || (MATCHING_ANIMATION_ENABLED && phase === "matching")) {
    return (
      <div className="bg-card rounded-lg shadow-xl p-6">
        <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
          <Loader2 size={36} className="text-accent animate-spin" />
          <p className="font-display text-lg font-semibold text-foreground">
            {phase === "submitting" ? t.formSubmitting : `${t.formMatching} ${form.zip}…`}
          </p>
          <div className="w-full max-w-xs">
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-accent transition-all duration-[2000ms] ease-out" style={{ width: phase==="submitting"?"30%":"70%" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FAKE-ACTIVITY-TODO: the "found N pros" panel below was driven by a
  // random number. Render branch is gated by MATCHING_ANIMATION_ENABLED so
  // Rollup tree-shakes it from production while the flag is false.
  if (MATCHING_ANIMATION_ENABLED && phase === "found") {
    return (
      <div className="bg-card rounded-lg shadow-xl p-6">
        <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-accent/10">
            <Users size={28} className="text-accent" />
          </div>
          <p className="font-display text-lg font-semibold text-foreground">{prosCount} {t.formFoundPros}</p>
          <div className="w-full max-w-xs"><div className="h-1.5 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-accent w-full transition-all duration-500" /></div></div>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <WhatHappensNext
        name={submittedName}
        service={submittedService}
        onReset={resetForm}
        resetLabel={t.formSubmitAnother}
      />
    );
  }

  // LEAD-GATE-TODO: maintenance branch — shown while LEAD_SUBMISSION_ENABLED
  // is false. Delete this branch when the server-side submit flow ships.
  if (phase === "maintenance") {
    return <MaintenanceHoldingState />;
  }

  return (
    <form onSubmit={handleSubmit} className={`bg-card rounded-lg shadow-xl p-6 ${compact ? "space-y-3" : "space-y-4"}`}>
      <h3 className="font-display text-xl font-bold text-foreground">{t.formTitle}</h3>
      <input type="text" name="website" value={honeypot} onChange={e=>setHoneypot(e.target.value)} className="absolute opacity-0 h-0 w-0 pointer-events-none" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <input type="text" id="lead-name" name="name" autoComplete="name" placeholder={t.formFullName} value={form.name}  onChange={e=>setForm({...form,name:e.target.value})}  className={inputClass} maxLength={100} />
      <div>
        <input type="tel" id="lead-phone" name="phone" autoComplete="tel" placeholder={t.formPhone}    value={form.phone} onChange={e=>{setForm({...form,phone:e.target.value});if(phoneError&&e.target.value)setPhoneError("");}} className={`${inputClass} ${phoneError?"border-destructive ring-destructive":""}`} maxLength={20} />
        {phoneError && <p className="text-xs text-destructive mt-1">{phoneError}</p>}
      </div>
      <input type="email" id="lead-email" name="email" autoComplete="email" placeholder={t.formEmail}    value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className={inputClass} maxLength={255} />
      <input type="text"  id="lead-zip" name="zip" autoComplete="postal-code" inputMode="numeric" placeholder={t.formZip}      value={form.zip}   onChange={e=>setForm({...form,zip:e.target.value})}   className={inputClass} maxLength={10} />

      <select id="lead-service-area" name="service_area" value={form.service_area} onChange={e=>setForm({...form,service_area:e.target.value})} className={selectClass}>
        <option value="">{t.formSelectArea}</option>
        {SERVICE_AREAS.map(a=><option key={a.slug} value={a.slug}>{a.name}</option>)}
      </select>
      <select id="lead-service" name="service" value={form.service} onChange={e=>setForm({...form,service:e.target.value})} className={selectClass}>
        <option value="">{t.formSelectService}</option>
        {SERVICES.map(s=><option key={s.slug} value={s.slug}>{s.title}</option>)}
      </select>
      <textarea id="lead-details" name="details" placeholder={t.formProjectDetails} value={form.details} onChange={e=>setForm({...form,details:e.target.value})} className={`${inputClass} min-h-[70px]`} maxLength={1000} />

      <label className="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" id="lead-consent" name="consent" checked={consentChecked} onChange={e=>setConsentChecked(e.target.checked)} className="mt-1 accent-accent" />
        <span className="text-[11px] text-muted-foreground leading-relaxed">
          By submitting, you agree to be contacted by licensed contractors via phone, email, and SMS. You accept our{" "}
          <Link to="/terms-of-service" className="text-accent hover:underline" onClick={e=>e.stopPropagation()}>Terms of Service</Link>{" & "}
          <Link to="/privacy-policy"   className="text-accent hover:underline" onClick={e=>e.stopPropagation()}>Privacy Policy</Link>.
          Msg & data rates may apply. See our{" "}
          <Link to="/lead-generation-disclosure" className="text-accent hover:underline" onClick={e=>e.stopPropagation()}>Lead Disclosure</Link>.
        </span>
      </label>

      <TrustStrip className="py-1" />

      <Button type="submit" variant="cta" size="lg" className="w-full" disabled={phase !== "idle"}>
        {phase !== "idle" ? <><Loader2 className="animate-spin mr-2" size={18} />{t.formSubmitting}</> : t.formCta}
      </Button>
      <p className="text-[11px] leading-relaxed text-muted-foreground">{t.formLegal}</p>
    </form>
  );
};

export default LeadForm;
