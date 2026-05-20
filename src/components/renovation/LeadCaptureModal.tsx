import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Lock, CheckCircle, Loader2 } from "lucide-react";
import { trackLeadConversion } from "@/lib/analytics";
import MaintenanceHoldingState from "@/components/MaintenanceHoldingState";
import { LEAD_SUBMISSION_ENABLED } from "@/lib/lead-submission-gate";
import { submitLeadV1 } from "@/lib/lead-submit-client";
import { CURRENT_CONSENT } from "@/lib/consent-text";
import { Link } from "react-router-dom";

interface LeadCaptureModalProps {
  projectType: string;
  style: string;
  onLeadCaptured: () => void;
}

function isValidUSPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) return false;
  if (digits[0] === "0" || digits[0] === "1") return false;
  return true;
}

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  return phone;
}

const LeadCaptureModal = ({ projectType, style, onLeadCaptured }: LeadCaptureModalProps) => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", zip: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);

  const inputClass = "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.zip) {
      toast({ title: "Please fill out all fields", variant: "destructive" });
      return;
    }
    if (!isValidUSPhone(form.phone)) {
      toast({ title: "Please enter a valid US phone number", variant: "destructive" });
      return;
    }
    if (!consentChecked) {
      toast({ title: "Please agree to the contact terms to continue", variant: "destructive" });
      return;
    }
    if (honeypot) return;

    // ─────────────────────────────────────────────────────────────────────
    // LEAD-GATE-TODO: Liability Containment Sprint — AI Preview modal lead
    // capture is temporarily disabled. While LEAD_SUBMISSION_ENABLED is
    // false we render the maintenance state (the `done` branch handles it)
    // without writing to Supabase / invoking notify-lead / invoking
    // distribute-lead / writing to event_log. See lead-submission-gate.ts.
    // ─────────────────────────────────────────────────────────────────────
    if (!LEAD_SUBMISSION_ENABLED) {
      setSubmitting(true);
      setDone(true);
      setSubmitting(false);
      return;
    }

    setSubmitting(true);

    // LEAD-REOPEN-TODO: post-gate path uses submit-lead edge function
    // (Sprint Task 7). Server captures IP/UA/consent, writes
    // lead_consent_log, invokes notify-lead server-to-server. distribute-
    // lead is intentionally paused server-side until real contractors are
    // onboarded.
    const result = await submitLeadV1({
      name: form.name,
      phone: form.phone,
      email: form.email,
      zip: form.zip,
      service: projectType,
      service_area: form.zip, // AI Preview modal doesn't ask for service_area; pass ZIP as a stand-in
      message: `AI Preview Lead | Style: ${style} | Project: ${projectType}`,
      landing_page: "/renovation-preview",
      honeypot,
      // TURNSTILE-TODO: pass turnstileToken when widget mounts.
    });

    if (!result.success) {
      if (!result.maintenance) {
        toast({ title: "Something went wrong", variant: "destructive" });
      }
      setSubmitting(false);
      return;
    }

    trackLeadConversion(projectType, form.zip);
    setDone(true);
    setSubmitting(false);
    setTimeout(() => onLeadCaptured(), 1200);
  };

  if (done) {
    // LEAD-GATE-TODO: while LEAD_SUBMISSION_ENABLED is false we render the
    // maintenance state instead of the "all set" success screen — the lead
    // was never actually transmitted.
    if (!LEAD_SUBMISSION_ENABLED) {
      return <MaintenanceHoldingState variant="inline" />;
    }
    return (
      <div className="text-center py-8 space-y-3">
        <CheckCircle size={48} className="text-accent mx-auto" />
        <p className="font-display text-xl font-bold text-foreground">You're all set!</p>
        <p className="text-sm text-muted-foreground">Unlocking your full renovation preview…</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10">
          <Lock size={22} className="text-accent" />
        </div>
        <h3 className="font-display text-xl font-bold text-foreground">
          Unlock Your Full Preview
        </h3>
        {/* AI-DISCLOSURE-TODO: replaced "connect with a specialist" with
            an honest AI-Preview + future-quote framing. */}
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Add your details to reveal the full AI-generated before &amp; after, plus ballpark price ranges. You'll be added to the Build Right USA list for a free quote once requests reopen.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="absolute opacity-0 h-0 w-0 pointer-events-none" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <input type="text" id="lcm-name" name="name" autoComplete="name" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} maxLength={100} />
        <input type="tel" id="lcm-phone" name="phone" autoComplete="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} maxLength={20} />
        <input type="email" id="lcm-email" name="email" autoComplete="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} maxLength={255} />
        <input type="text" id="lcm-zip" name="zip" autoComplete="postal-code" inputMode="numeric" placeholder="ZIP Code" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} className={inputClass} maxLength={10} />

        {/* CONSENT-TODO: required by submit-lead edge function. Sourced
            from src/lib/consent-text.ts. Replaced the prior one-line
            "agree to be contacted" copy with the versioned consent text. */}
        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" id="lcm-consent" name="consent" checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} className="mt-1 accent-accent" />
          <span className="text-[10px] text-muted-foreground leading-relaxed">
            {CURRENT_CONSENT.text}{" "}
            <Link to="/privacy-policy" className="text-accent hover:underline" onClick={(e) => e.stopPropagation()}>Privacy Policy</Link>{", "}
            <Link to="/sms-consent" className="text-accent hover:underline" onClick={(e) => e.stopPropagation()}>SMS Consent</Link>.
          </span>
        </label>

        <Button type="submit" variant="cta" size="lg" className="w-full" disabled={submitting}>
          {submitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
          {submitting ? "Submitting…" : "Unlock Full Preview"}
        </Button>
      </form>
    </div>
  );
};

export default LeadCaptureModal;
