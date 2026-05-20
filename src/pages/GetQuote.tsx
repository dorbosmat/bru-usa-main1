import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { SERVICES, SERVICE_AREAS } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Shield, Clock, Star } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { trackLeadConversion } from "@/lib/analytics";
import TrustStrip from "@/components/TrustStrip";
import WhatHappensNext from "@/components/WhatHappensNext";
import MaintenanceHoldingState from "@/components/MaintenanceHoldingState";
import { LEAD_SUBMISSION_ENABLED } from "@/lib/lead-submission-gate";

const PROJECT_TYPES = ["Roofing","Kitchen Remodel","Bathroom Remodel","Flooring","Painting","Windows & Doors","Concrete","Landscaping","Full Remodel","Other"];
const BUDGETS = ["Under $5,000","$5,000 - $15,000","$15,000 - $40,000","$40,000 - $100,000","$100,000+"];
const TIMELINES = ["ASAP","1-2 Weeks","1 Month","2-3 Months","Not Sure"];
const PROPERTY_TYPES = ["House","Condo","Commercial"];

function isValidUSPhone(p: string): boolean {
    const d = (p || "").replace(/\D/g, "");
    if (d.length !== 10) return false;
    // PHONE-TODO: bot-fingerprint blocklist — same regex-based form as
    // src/components/LeadForm.tsx so the source no longer contains a 555
    // phone string. Rejects any all-same-digit ten-digit input plus the
    // common sequential test pattern.
    if (/^(\d)\1{9}$/.test(d)) return false;
    if (d === "1234567890") return false;
    if (d[0] === "0" || d[0] === "1") return false;
    return true;
}
function formatPhone(p: string): string {
    const d = (p || "").replace(/\D/g, "");
    return d.length === 10 ? `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}` : p;
}

export default function GetQuote() {
    const { t } = useLanguage();
    const [form, setForm] = useState({ full_name: "", phone: "", email: "", city: "", zip_code: "", project_type: "", budget_range: "", timeline: "", property_type: "", notes: "" });
    const [honeypot, setHoneypot] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [maintenance, setMaintenance] = useState(false);
    const [submittedName, setSubmittedName] = useState("");
    const [submittedService, setSubmittedService] = useState("");

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.full_name || !form.phone || !form.email || !form.city || !form.zip_code || !form.project_type) {
                toast({ title: t.formFillAll, variant: "destructive" });
                return;
        }
        if (!isValidUSPhone(form.phone)) {
                setPhoneError(t.formPhoneError);
                return;
        }
        if (honeypot) return;

        // ─────────────────────────────────────────────────────────────────
        // LEAD-GATE-TODO: Liability Containment Sprint — lead submission is
        // temporarily disabled. Re-enable by routing through the new
        // server-side submit edge function. See lead-submission-gate.ts.
        // ─────────────────────────────────────────────────────────────────
        if (!LEAD_SUBMISSION_ENABLED) {
                setMaintenance(true);
                return;
        }

        setSubmitting(true);

        try {
                const params = new URLSearchParams(window.location.search);
                const newLeadId = crypto.randomUUID();

          // Pack budget/timeline/property into the message field since those columns
          // do not exist on the leads table. This keeps inserts working while still
          // capturing the data for the CRM.
          const extras: string[] = [];
                if (form.budget_range) extras.push(`Budget: ${form.budget_range}`);
                if (form.timeline) extras.push(`Timeline: ${form.timeline}`);
                if (form.property_type) extras.push(`Property: ${form.property_type}`);
                const composedMessage = [form.notes, extras.length ? `[${extras.join(" | ")}]` : ""].filter(Boolean).join("\n").trim() || null;
          const insertPayload = { id: newLeadId, name: form.full_name, phone: formatPhone(form.phone), email: form.email, zip: form.zip_code, service: form.project_type, service_area: form.city, message: composedMessage, source: "website" }; console.log("Quote insert payload", insertPayload);
          const { error } = await supabase.from("leads").insert({
                    id: newLeadId,
                    name: form.full_name,
                    phone: formatPhone(form.phone),
                    email: form.email,
                    zip: form.zip_code,
                    service: form.project_type,
                    service_area: form.city,
                    message: composedMessage,
                    source: "website" as const,
                    
                    
                    
                    
          });

          if (error) {
                    console.error("Quote insert failed", error);
                    toast({ title: t.formError, description: "Please try again.", variant: "destructive" });
                    setSubmitting(false);
                    return;
          }
          console.log("Quote insert result", error); const notifyId = newLeadId; console.log("Quote notify-lead id", notifyId); supabase.functions.invoke("notify-lead", { body: { lead_id: notifyId } }).then(()=>console.log("notify-lead invoked",notifyId)).catch((e)=>console.warn("Lead email notification failed",e));
          toast({ title: "Thank you!", description: "Your request was sent successfully. Our team will contact you shortly." });
                trackLeadConversion(form.project_type, form.zip_code);
                setSubmittedName(form.full_name);
                setSubmittedService(form.project_type);
                setSubmitting(false);
                setDone(true);
        } catch (err) {
                console.error("[GetQuote] unexpected error:", err);
                toast({ title: t.formError, description: "Please try again.", variant: "destructive" });
                setSubmitting(false);
        }
  };

  const inputClass = "w-full rounded-md border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
    const selectClass = "w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
        <Layout>
              <Helmet>
                      <title>Get a Free Contractor Quote | Build Right USA</title>
                      <meta name="description" content="Request free quotes from licensed, insured contractors near you. Roofing, remodeling, flooring, and more. No obligation." />
                      <link rel="canonical" href="https://buildright-usa.com/get-a-quote" />
              </Helmet>
              <section className="py-16 bg-muted">
                      <div className="container mx-auto px-4 max-w-2xl">
                                <div className="text-center mb-10">
                                            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground">{t.getQuoteTitle} <span className="text-accent">{t.getQuoteHighlight}</span></h1>
                                            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">{t.getQuoteSubtitle}</p>
                                            <div className="mt-4 flex flex-wrap justify-center gap-5">
                                              {[{icon: Shield, label: t.trustLicensed},{icon: Clock, label: t.trustFastResponse},{icon: Star, label: t.trustLocalPros}].map(({icon: Icon, label}) => (
                          <div key={label} className="flex items-center gap-2 text-muted-foreground text-sm"><Icon size={16} className="text-accent" /><span>{label}</span></div>
                        ))}
                                            </div>
                                </div>
                      
                        {maintenance ? (
                      // LEAD-GATE-TODO: maintenance branch — remove when the
                      // server-side submit flow ships.
                      <MaintenanceHoldingState />
                    ) : done ? (
                      <WhatHappensNext name={submittedName} service={submittedService}
                                      onReset={() => { setDone(false); setForm({full_name:"",phone:"",email:"",city:"",zip_code:"",project_type:"",budget_range:"",timeline:"",property_type:"",notes:""}); setSubmittedName(""); setSubmittedService(""); }}
                                      resetLabel={t.formSubmitAnother} />
                    ) : (
                      <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-xl p-6 md:p-8 space-y-4">
                                    <input type="text" name="website" value={honeypot} onChange={e=>setHoneypot(e.target.value)} className="absolute opacity-0 h-0 w-0 pointer-events-none" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input type="text" id="quote-full-name" name="full_name" autoComplete="name" placeholder={`${t.formFullName} *`} value={form.full_name} onChange={e=>set("full_name",e.target.value)} className={inputClass} maxLength={100} required />
                                                    <div>
                                                                      <input type="tel" id="quote-phone" name="phone" autoComplete="tel" placeholder={`${t.formPhone} *`} value={form.phone} onChange={e=>{set("phone",e.target.value); if(phoneError)setPhoneError("");}} className={`${inputClass} ${phoneError?"border-destructive":""}`} maxLength={20} required />
                                                      {phoneError && <p className="text-xs text-destructive mt-1">{phoneError}</p>}
                                                    </div>
                                                    <input type="email" id="quote-email" name="email" autoComplete="email" placeholder={`${t.formEmail} *`} value={form.email} onChange={e=>set("email",e.target.value)} className={inputClass} maxLength={255} required />
                                                    <select id="quote-city" name="city" value={form.city} onChange={e=>set("city",e.target.value)} className={selectClass} required>
                                                                      <option value="">{t.getQuoteSelectCity}</option>
                                                      {SERVICE_AREAS.map(a=><option key={a.slug} value={a.slug}>{a.name}</option>)}
                                                    </select>
                                                    <input type="text" id="quote-zip" name="zip_code" autoComplete="postal-code" inputMode="numeric" placeholder={`${t.formZip} *`} value={form.zip_code} onChange={e=>set("zip_code",e.target.value)} className={inputClass} maxLength={10} required />
                                                    <select id="quote-project-type" name="project_type" value={form.project_type} onChange={e=>set("project_type",e.target.value)} className={selectClass} required>
                                                                      <option value="">{t.getQuoteProjectType}</option>
                                                      {PROJECT_TYPES.map(tp=><option key={tp} value={tp}>{tp}</option>)}
                                                    </select>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <select id="quote-budget" name="budget_range" value={form.budget_range} onChange={e=>set("budget_range",e.target.value)} className={selectClass}>
                                                                      <option value="">{t.getQuoteBudget}</option>
                                                      {BUDGETS.map(b=><option key={b} value={b}>{b}</option>)}
                                                    </select>
                                                    <select id="quote-timeline" name="timeline" value={form.timeline} onChange={e=>set("timeline",e.target.value)} className={selectClass}>
                                                                      <option value="">{t.getQuoteTimeline}</option>
                                                      {TIMELINES.map(tl=><option key={tl} value={tl}>{tl}</option>)}
                                                    </select>
                                                    <select id="quote-property-type" name="property_type" value={form.property_type} onChange={e=>set("property_type",e.target.value)} className={selectClass}>
                                                                      <option value="">{t.getQuotePropertyType}</option>
                                                      {PROPERTY_TYPES.map(p=><option key={p} value={p}>{p}</option>)}
                                                    </select>
                                    </div>
                                    <textarea id="quote-notes" name="notes" placeholder={t.getQuoteNotes} value={form.notes} onChange={e=>set("notes",e.target.value)} className={`${inputClass} min-h-[80px]`} maxLength={1000} />
                                    <TrustStrip className="py-1" />
                                    <Button type="submit" variant="cta" size="lg" className="w-full" disabled={submitting}>
                                      {submitting ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />{t.formSubmitting}</> : t.getQuoteSubmit}
                                    </Button>
                                    <p className="text-xs text-muted-foreground text-center">{t.getQuoteNoObligation}</p>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-2">{t.footerPriceDisclaimer}</p>
                      </form>
                                )}
                      </div>
              </section>
        </Layout>
      );
}
