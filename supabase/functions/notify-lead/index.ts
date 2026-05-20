import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS-TODO: shared origin allowlist. Move to a shared deno module once
// the edge-function count grows. Wildcard "*" is no longer accepted.
// SECURITY-TODO: notify-lead currently trusts the caller-supplied lead_id
// and uses service_role internally. Before re-enabling lead submission,
// verify the caller is authenticated and the lead_id belongs to that
// caller (use the user JWT, not the anon key).
const ALLOWED_ORIGINS = [
  "https://buildright-usa.com",
  "https://www.buildright-usa.com",
  "http://localhost:5173",
  "http://localhost:8080",
];
function corsHeadersFor(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[1];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}

const EMAIL_CONFIG = {
  primary: "estimate@buildright-usa.com",
  cc: ["info@buildright-usa.com", "support@buildright-usa.com"],
  fromName: "Built Right USA Leads",
  // Use Resend's default domain until buildright-usa.com is fully verified
  fromEmail: "estimate@buildright-usa.com",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  });
}

function buildSubject(service: string, location: string): string {
  return `New Lead – ${service || "General"} – ${location || "Unknown"}`;
}

function buildHtml(lead: Record<string, any>): string {
  const rows = [
    ["Full Name", lead.name],
    ["Phone Number", lead.phone],
    ["Email", lead.email || "Not provided"],
    ["ZIP Code", lead.zip],
    ["Service Area", lead.service_area || "Not specified"],
    ["Service Requested", lead.service],
    ["Message / Notes", lead.message || "None"],
    ["Source", lead.source || "website"],
    ["Landing Page", lead.landing_page || "N/A"],
    ["Callback Requested", lead.callback_requested ? "Yes ⚡" : "No"],
    ["Submitted", formatDate(lead.created_at)],
  ];

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;background:#f8f8f8;border:1px solid #e0e0e0;width:180px">${label}</td><td style="padding:8px 12px;border:1px solid #e0e0e0">${value}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#1a1a2e;padding:20px;text-align:center">
        <h1 style="color:#f5a623;margin:0;font-size:20px">New Lead Received</h1>
      </div>
      <div style="padding:20px">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${tableRows}
        </table>
        <p style="margin-top:20px;font-size:13px;color:#666">
          This lead was submitted via the Built Right USA website. Please follow up promptly.
        </p>
      </div>
    </div>
  `;
}

Deno.serve(async (req) => {
  const corsHeaders = corsHeadersFor(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => null); if (!body) { return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }); } const { lead_id } = body;
    if (!lead_id) {
      return new Response(JSON.stringify({ error: "lead_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY")!;

    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: lead, error: leadErr } = await supabase
      .from("leads")
      .select("*")
      .eq("id", lead_id)
      .single();

    if (leadErr || !lead) {
      return new Response(JSON.stringify({ error: "Lead not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subject = buildSubject(lead.service, lead.service_area || lead.zip);
    const html = buildHtml(lead);

    // Send to primary + CC via Resend
    const resendPayload = {
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`,
      to: [EMAIL_CONFIG.primary],
      cc: EMAIL_CONFIG.cc,
      subject,
      html,
    };

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resendPayload),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("Resend error:", resendData);
      return new Response(
        JSON.stringify({ error: "Email send failed", details: resendData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send customer confirmation email (independent try/catch). if (lead.email) { try { await fetch("https://api.resend.com/emails", { method: "POST", headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromEmail}>`, to: [lead.email], subject: "We received your request – BuildRight USA", html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px"><div style="background:#1a1a2e;padding:20px;text-align:center"><h1 style="color:#f5a623;margin:0;font-size:22px">BuildRight USA</h1></div><div style="padding:24px 20px;color:#222;line-height:1.6;font-size:15px"><p>Hi ${lead.name || "there"},</p><p>Thank you for contacting BuildRight USA.</p><p>We have received your request and our team will review the details shortly.</p><p><strong>Project details:</strong><br/>Service: ${lead.service || "—"}<br/>Area: ${lead.service_area || "—"}<br/>ZIP Code: ${lead.zip || "—"}</p><p>A member of our team will contact you soon to better understand your project and help match you with the right contractor.</p><p>If you need to add more details, you can simply reply to this email.</p><p style="margin-top:24px">Best regards,<br/>BuildRight USA Team<br/><a href="mailto:estimate@buildright-usa.com" style="color:#f5a623">estimate@buildright-usa.com</a></p></div></div>` }), }); } catch (custErr) { console.warn("Customer confirmation email failed", custErr); } } // Log notification event
    await supabase.from("event_log").insert({
      event_type: "lead_email_sent",
      zip: lead.zip,
      city: lead.service_area,
    });

    return new Response(
      JSON.stringify({ success: true, email_id: resendData.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("notify-lead error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
