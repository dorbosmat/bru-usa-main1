import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { trackLeadConversion } from "@/lib/analytics";
import TrustStrip from "@/components/TrustStrip";
import WhatHappensNext from "@/components/WhatHappensNext";
import MaintenanceHoldingState from "@/components/MaintenanceHoldingState";
import { LEAD_SUBMISSION_ENABLED } from "@/lib/lead-submission-gate";

interface LeadCaptureFormProps {
    previewUrl: string;
    projectType: string;
    style: string;
    onBack: () => void;
    onLeadCaptured: (budget: string, region: string, clientType: string, personalRequest: string) => void;
}

function isValidUSPhone(phone: string): boolean {
    const digits = (phone || "").replace(/\D/g, "");
    if (digits.length !== 10) return false;
    if (digits[0] === "0" || digits[0] === "1") return false;
    return true;
}
function formatPhone(phone: string): string {
    const d = (phone || "").replace(/\D/g, "");
    return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : phone;
}
function safeReplace(value: string | undefined | null, search: RegExp | string, replacement: string): string {
    return (value || "").replace(search, replacement);
}

export default function LeadCaptureForm({ previewUrl, projectType, style, onBack, onLeadCaptured }: LeadCaptureFormProps) {
    const [form, setForm] = useState({ name: "", phone: "", email: "", location: "" });
    const [budget, setBudget] = useState("Mid-Range");
    const [region, setRegion] = useState("Florida");
    const [clientType, setClientType] = useState("Homeowner");
    const [personalRequest, setPersonalRequest] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [honeypot, setHoneypot] = useState("");
    const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const inputClass = "w-full rounded-xl border border-input bg-background px-4 py-3.5 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow";
    const selectClass = "w-full rounded-xl border border-input bg-background px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow cursor-pointer";

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
                toast({ title: "Please fill out name, phone, and email", variant: "destructive" });
                return;
        }
        if (!isValidUSPhone(form.phone)) {
                toast({ title: "Please enter a valid US phone number", variant: "destructive" });
                return;
        }
        if (honeypot) return;

        // ─────────────────────────────────────────────────────────────────
        // LEAD-GATE-TODO: Liability Containment Sprint — AI Preview lead
        // capture is temporarily disabled. While LEAD_SUBMISSION_ENABLED is
        // false we do NOT insert into Supabase or invoke notify-lead. The
        // upstream AI Preview UX is preserved (the preview was already
        // generated before this form rendered) — we just render the
        // maintenance state in place of the post-submit success screen.
        // See src/lib/lead-submission-gate.ts.
        // ─────────────────────────────────────────────────────────────────
        if (!LEAD_SUBMISSION_ENABLED) {
                setSubmitting(true);
                setDone(true);
                setSubmitting(false);
                return;
        }

        setSubmitting(true);

        try {
                const params = new URLSearchParams(window.location.search);
                const zipOrArea = (form.location || "").trim();
                const isZip = /^\d{5}$/.test(zipOrArea);
                const newLeadId = crypto.randomUUID();

          // LEAD-GATE-TODO: replace this insert + notify-lead trio with the
          // server-side submit edge function.
          const { error } = await supabase.from("leads").insert({
                    id: newLeadId,
                    name: form.name.trim(),
                    phone: formatPhone(form.phone),
                    email: form.email.trim(),
                    zip: isZip ? zipOrArea : "00000",
                    service: projectType || "general",
                    source: "website",
                    service_area: !isZip ? (zipOrArea || null) : null,
                    landing_page: "/renovation-preview", source_page: "/renovation-preview", region: region || null, budget_range: budget || null, client_type: clientType || null, notes: personalRequest || null,
                    message: `AI Preview Lead | Style: ${style || ""} | Project: ${projectType || ""} | Budget: ${budget} | Region: ${region} | Client: ${clientType}${zipOrArea ? ` | Area: ${zipOrArea}` : ""}${personalRequest ? ` | Request: ${personalRequest}` : ""}`,
                    utm_source: params.get("utm_source") ?? null,
                    utm_medium: params.get("utm_medium") ?? null,
                    utm_campaign: params.get("utm_campaign") ?? null,
          } as any);

          if (error) {
                    console.error("[LeadCaptureForm] insert error:", error);
                    toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
                    setSubmitting(false);
                    return;
          }

          toast({ title: "Thank you!", description: "Your request was sent successfully. Our team will contact you shortly." });
                supabase.functions.invoke("notify-lead", { body: { lead_id: newLeadId } }).then(() => console.log("AI Preview notify-lead invoked", newLeadId)).catch((error) => console.warn("AI Preview email notification failed", error)); trackLeadConversion(projectType || "renovation", zipOrArea);
                setDone(true);
                setSubmitting(false);
                setTimeout(() => onLeadCaptured(budget, region, clientType, personalRequest), 1800);
        } catch (err) {
                console.error("[LeadCaptureForm] unexpected error:", err);
                toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
                setSubmitting(false);
        }
  };

  if (done) return (
        <div className="max-w-md mx-auto animate-fade-in">
              {/* LEAD-GATE-TODO: while LEAD_SUBMISSION_ENABLED is false we
                  render the maintenance state instead of the WhatHappensNext
                  success screen — the lead was never actually transmitted. */}
              {LEAD_SUBMISSION_ENABLED ? (
                <WhatHappensNext name={form.name} service={safeReplace(projectType, / /g, "") || "Renovation"} />
              ) : (
                <MaintenanceHoldingState />
              )}
        </div>
      );
  
    const safeProjectLabel = safeReplace(projectType, / /g, "");
  
    return (
          <div ref={formRef} className="space-y-5 max-w-md mx-auto">
                <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft size={14} />Back to preview
                </button>
          
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                        <img src={previewUrl} alt="Your space" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">Your preview is ready</p>
                          {projectType && <p className="text-xs text-muted-foreground">{safeProjectLabel !== "Renovation" ? projectType : "Renovation"}{style && style !== "custom" ? ` • ${style}` : ""}</p>}
                        </div>
                </div>
          
                <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                                  <Sparkles size={12} />One last step
                        </div>
                        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">Unlock your full renovation preview</h2>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                                  Enter your details to reveal the full before &amp; after — and we&apos;ll connect you with a <strong className="text-foreground">licensed contractor</strong>.
                        </p>
                </div>
          
                <form onSubmit={handleSubmit} className="space-y-3">
                        <input type="text" name="website" value={honeypot} onChange={e=>setHoneypot(e.target.value)}
                                    className="absolute opacity-0 h-0 w-0 pointer-events-none" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                
                        <input type="text" id="lcf-name" name="name" placeholder="Full Name" value={form.name}
                                    onChange={e=>setForm({...form,name:e.target.value})}
                                    className={inputClass} maxLength={100} autoComplete="name" required />

                        <input type="tel" id="lcf-phone" name="phone" placeholder="Phone Number" value={form.phone}
                                    onChange={e=>setForm({...form,phone:e.target.value})}
                                    className={inputClass} maxLength={15} autoComplete="tel" required inputMode="tel" />

                        <input type="email" id="lcf-email" name="email" placeholder="Email Address" value={form.email}
                                    onChange={e=>setForm({...form,email:e.target.value})}
                                    className={inputClass} maxLength={255} autoComplete="email" required inputMode="email" />

                        <input type="text" id="lcf-location" name="location" placeholder="ZIP Code or City (optional)" value={form.location}
                                    onChange={e=>setForm({...form,location:e.target.value})}
                                    className={inputClass} maxLength={100} autoComplete="postal-code" />
                
                        <div className="space-y-1.5">
                                  <label htmlFor="lcf-budget" className="text-sm font-medium text-foreground">Budget</label>
                                  <select id="lcf-budget" name="budget" value={budget} onChange={e=>setBudget(e.target.value)} className={selectClass}>
                                              <option>Budget-Friendly</option>
                                              <option>Mid-Range</option>
                                              <option>Luxury</option>
                                  </select>
                        </div>

                        <div className="space-y-1.5">
                                  <label htmlFor="lcf-region" className="text-sm font-medium text-foreground">Region</label>
                                  <select id="lcf-region" name="region" value={region} onChange={e=>setRegion(e.target.value)} className={selectClass}>
                                              <option>Florida</option>
                                              <option>California</option>
                                              <option>Texas</option>
                                  </select>
                        </div>

                        <div className="space-y-1.5">
                                  <label htmlFor="lcf-client-type" className="text-sm font-medium text-foreground">Client Type</label>
                                  <select id="lcf-client-type" name="client_type" value={clientType} onChange={e=>setClientType(e.target.value)} className={selectClass}>
                                              <option>Homeowner</option>
                                              <option>Investor</option>
                                              <option>Luxury Buyer</option>
                                  </select>
                        </div>

                        <div className="space-y-1.5">
                                  <label htmlFor="lcf-personal-request" className="text-sm font-medium text-foreground">Tell us what you want</label>
                                  <textarea
                                                id="lcf-personal-request"
                                                name="personal_request"
                                                value={personalRequest}
                                                onChange={e=>setPersonalRequest(e.target.value)}
                                                placeholder="Example: I want a modern luxury kitchen with island and warm lighting"
                                                className={inputClass + " resize-none min-h-[90px]"}
                                                maxLength={500}
                                              />
                        </div>
                
                        <TrustStrip layout="vertical" className="px-1 py-1" />
                
                        <Button type="submit" variant="cta" size="lg" className="w-full text-base py-4" disabled={submitting}>
                          {submitting ? (<><Loader2 className="animate-spin mr-2" size={18} />Submitting…</>) : (<><Sparkles size={16} className="mr-2" />Show My Renovation Preview</>)}
                        </Button>
                        <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
                                  A licensed contractor will contact you within 2 hours. No spam, no pressure.
                        </p>
                </form>
          </div>
        );
}
