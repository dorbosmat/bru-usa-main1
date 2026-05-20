import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRateLimit } from "../_shared/rate-limit.ts";

// CORS-TODO: shared origin allowlist. Move to a shared deno module once
// the edge-function count grows. Wildcard "*" is no longer accepted.
// SECURITY-TODO: distribute-lead uses service_role internally and trusts
// the caller-supplied lead_id. Before re-enabling lead submission, require
// the caller JWT to belong to the same user that submitted the lead, OR
// invoke this function only from a trusted server-side path (never the
// public client). Today the client invocation in LeadForm is commented
// out — keep it that way until the auth model is fixed.
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
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}

function getClientIP(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

Deno.serve(async (req) => {
  const corsHeaders = corsHeadersFor(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // SHADOW MODE — distribute-lead is wired but the client invocation is
  // commented out in LeadForm (Task 1). Observe-only counter here lets
  // us see if anything else hits the endpoint while the form is gated.
  await checkRateLimit({
    endpoint: "distribute-lead:invoke",
    ip: getClientIP(req),
    limit: 30,
    windowSeconds: 60,
  });

  try {
    const { lead_id } = await req.json();
    if (!lead_id) {
      return new Response(JSON.stringify({ error: "lead_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Get the lead
    const { data: lead, error: leadErr } = await supabase
      .from("leads")
      .select("id, zip, service")
      .eq("id", lead_id)
      .single();

    if (leadErr || !lead) {
      return new Response(JSON.stringify({ error: "Lead not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find active contractors whose zip_codes_served includes this ZIP
    const { data: contractors } = await supabase
      .from("contractors")
      .select("*")
      .eq("status", "active")
      .contains("zip_codes_served", [lead.zip]);

    if (!contractors || contractors.length === 0) {
      return new Response(
        JSON.stringify({ distributed: 0, message: "No contractors found for this ZIP" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Filter by service match and daily limit
    const today = new Date().toISOString().slice(0, 10);
    const eligible = [];

    for (const c of contractors) {
      // Check service match
      if (c.services_offered && c.services_offered.length > 0) {
        if (!c.services_offered.includes(lead.service)) continue;
      }

      // Check daily limit
      const { count } = await supabase
        .from("lead_distributions")
        .select("*", { count: "exact", head: true })
        .eq("contractor_id", c.id)
        .gte("sent_at", `${today}T00:00:00Z`);

      if ((count ?? 0) < c.max_leads_per_day) {
        eligible.push(c);
      }
    }

    // Select up to 3
    const selected = eligible.slice(0, 3);

    if (selected.length === 0) {
      return new Response(
        JSON.stringify({ distributed: 0, message: "All matching contractors at daily limit" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create distribution records
    const distributions = selected.map((c) => ({
      lead_id: lead.id,
      contractor_id: c.id,
      status: "sent",
    }));

    const { error: distErr } = await supabase
      .from("lead_distributions")
      .insert(distributions);

    if (distErr) {
      return new Response(JSON.stringify({ error: distErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mark lead as distributed
    await supabase
      .from("leads")
      .update({ status: "distributed" })
      .eq("id", lead.id);

    return new Response(
      JSON.stringify({
        distributed: selected.length,
        contractors: selected.map((c) => c.company_name),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
