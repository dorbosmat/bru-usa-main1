import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Lock, CheckCircle, Loader2 } from "lucide-react";
import { trackLeadConversion } from "@/lib/analytics";

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
    if (honeypot) return;

    setSubmitting(true);

    const params = new URLSearchParams(window.location.search);
    const newLeadId = crypto.randomUUID();
    const { error } = await supabase.from("leads").insert({
      id: newLeadId,
      name: form.name,
      phone: formatPhone(form.phone),
      email: form.email,
      zip: form.zip,
      service: projectType,
      source: "website" as const,
      landing_page: "/renovation-preview", source_page: window.location.pathname,
      message: `AI Preview Lead | Style: ${style} | Project: ${projectType}`,
      utm_source: params.get("utm_source") || null,
      utm_medium: params.get("utm_medium") || null,
      utm_campaign: params.get("utm_campaign") || null,
    } as any);

    if (error) {
      toast({ title: "Something went wrong", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    // Trigger email notification + lead distribution
    supabase.functions.invoke("notify-lead", { body: { lead_id: newLeadId } }).then(() => {});
    supabase.functions.invoke("distribute-lead", { body: { lead_id: newLeadId } }).then(() => {});
    supabase.from("event_log").insert({ event_type: "ai_preview_lead", zip: form.zip }).then(() => {});

    trackLeadConversion(projectType, form.zip);
    setDone(true);
    setSubmitting(false);
    setTimeout(() => onLeadCaptured(), 1200);
  };

  if (done) {
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
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Enter your details to see the full before & after result, estimated pricing, and connect with a specialist.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="absolute opacity-0 h-0 w-0 pointer-events-none" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <input type="text" id="lcm-name" name="name" autoComplete="name" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} maxLength={100} />
        <input type="tel" id="lcm-phone" name="phone" autoComplete="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} maxLength={20} />
        <input type="email" id="lcm-email" name="email" autoComplete="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} maxLength={255} />
        <input type="text" id="lcm-zip" name="zip" autoComplete="postal-code" inputMode="numeric" placeholder="ZIP Code" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} className={inputClass} maxLength={10} />

        <Button type="submit" variant="cta" size="lg" className="w-full" disabled={submitting}>
          {submitting ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
          {submitting ? "Submitting…" : "Unlock Full Preview"}
        </Button>

        <p className="text-[10px] text-center text-muted-foreground">
          By submitting, you agree to be contacted about your project.
        </p>
      </form>
    </div>
  );
};

export default LeadCaptureModal;
