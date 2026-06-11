import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { checkRateLimit, logAbuse } from "../_shared/rate-limit.ts";
import { verifyTurnstile } from "../_shared/turnstile.ts";

// CORS-TODO: shared origin allowlist (mirrors the other edge functions —
// chat, submit-lead, notify-lead, distribute-lead, ai-renovation). Reflects
// the request origin when allowlisted, else falls back to the canonical www.
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
    // V1.2: include x-turnstile-token — the frontend (T9) sends it on the
    // generate-renovation request, so the preflight must allow it or the POST
    // is blocked even on allowlisted production origins.
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-turnstile-token",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

// IP extraction — mirrors chat/submit-lead. Used as the rate-limit + abuse key.
function getClientIP(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

// ─── T5: server-side image validation (defense-in-depth) ───
// Backstops the client-side guard (T3). These checks run BEFORE any paid
// OpenAI/Gemini call so malformed or oversized payloads cost nothing.
const ALLOWED_IMAGE_MIME = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_DECODED_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB ceiling (client targets ~2 MB)

// Estimate decoded byte size from a base64 string WITHOUT allocating/decoding
// the whole payload — a cheap guard to run before any external API call.
function approxBase64Bytes(b64: string): number {
  const raw = b64.includes(",") ? b64.slice(b64.lastIndexOf(",") + 1) : b64;
  const len = raw.length;
  if (len === 0) return 0;
  const padding = raw.endsWith("==") ? 2 : raw.endsWith("=") ? 1 : 0;
  return Math.floor((len * 3) / 4) - padding;
}

// ─── T7: external-call timeouts + bounded retry ───
// Every outbound OpenAI/Gemini fetch goes through fetchWithRetry so a slow or
// hung upstream can never stall the function indefinitely. AbortController
// enforces a per-attempt timeout; transient failures (429 / 5xx / network /
// timeout) are retried up to `retries` times with linear backoff. On the final
// attempt the response is returned as-is so existing downstream handling
// (e.g. `if (!resp.ok)`) still applies; only network/timeout exhaustion throws.
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  opts: { label: string; timeoutMs: number; retries: number; backoffMs: number },
): Promise<Response> {
  let lastError: unknown = null;
  for (let attempt = 0; attempt <= opts.retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), opts.timeoutMs);
    try {
      const resp = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timer);
      // Retry transient upstream failures (rate limit / server error) when attempts remain.
      if ((resp.status === 429 || resp.status >= 500) && attempt < opts.retries) {
        await sleep(opts.backoffMs * (attempt + 1));
        continue;
      }
      return resp;
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      if (attempt < opts.retries) {
        await sleep(opts.backoffMs * (attempt + 1));
        continue;
      }
    }
  }
  const msg = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`${opts.label} request failed after ${opts.retries + 1} attempt(s): ${msg}`);
}

// ---------------------------------------------------------------------------
// Helpers: project-type normalization + negative-request parsing
// ---------------------------------------------------------------------------

type SpaceCategory =
  | "living_room"
  | "kitchen"
  | "bathroom"
  | "bedroom"
  | "dining_room"
  | "office"
  | "hallway"
  | "exterior"
  | "roof"
  | "yard"
  | "garage"
  | "basement"
  | "commercial"
  | "unknown";

function normalizeSpaceLabel(input: string): SpaceCategory {
  const s = (input || "").toLowerCase().trim();
  if (!s) return "unknown";
  if (/(bath|toilet|restroom|wc|shower|powder)/.test(s)) return "bathroom";
  if (/(kitchen|kitchenette)/.test(s)) return "kitchen";
  if (/(living|lounge|family\s*room|den)/.test(s)) return "living_room";
  if (/(bed\s*room|bedroom|master\s*bed)/.test(s)) return "bedroom";
  if (/(dining)/.test(s)) return "dining_room";
  if (/(office|study|work\s*room)/.test(s)) return "office";
  if (/(hall|corridor|entry|foyer|stair)/.test(s)) return "hallway";
  if (/(exterior|facade|front\s*of\s*house|outside|outdoor)/.test(s)) return "exterior";
  if (/(roof|attic|skylight)/.test(s)) return "roof";
  if (/(yard|garden|landscape|backyard|patio|deck|porch)/.test(s)) return "yard";
  if (/(garage|carport)/.test(s)) return "garage";
  if (/(basement|cellar)/.test(s)) return "basement";
  if (/(office\s*building|store|shop|retail|restaurant|commercial)/.test(s)) return "commercial";
  if (/(remodel|renovation|interior)/.test(s)) return "unknown";
  return "unknown";
}

function humanizeCategory(cat: SpaceCategory): string {
  switch (cat) {
    case "living_room": return "living room";
    case "dining_room": return "dining room";
    default: return cat.replace(/_/g, " ");
  }
}

function parseNegativeRequests(text: string): string[] {
  if (!text) return [];
  const found = new Set<string>();
  const patterns: RegExp[] = [
    /\bwithout\s+(?:a\s+|an\s+|the\s+|any\s+)?([a-zA-Z][a-zA-Z\s\-]{1,40}?)(?=[,.;!?]|$|\sand\s|\sbut\s|\swith\s)/gi,
    /\bno\s+(?:more\s+)?([a-zA-Z][a-zA-Z\s\-]{1,40}?)(?=[,.;!?]|$|\sand\s|\sbut\s|\swith\s)/gi,
    /\bremove\s+(?:the\s+|all\s+|any\s+)?([a-zA-Z][a-zA-Z\s\-]{1,40}?)(?=[,.;!?]|$|\sand\s|\sbut\s|\swith\s)/gi,
    /\bexclude\s+(?:the\s+|all\s+|any\s+)?([a-zA-Z][a-zA-Z\s\-]{1,40}?)(?=[,.;!?]|$|\sand\s|\sbut\s|\swith\s)/gi,
    /\bdon'?t\s+(?:include|add|put|use)\s+(?:a\s+|an\s+|the\s+|any\s+)?([a-zA-Z][a-zA-Z\s\-]{1,40}?)(?=[,.;!?]|$|\sand\s|\sbut\s|\swith\s)/gi,
    /\bdo\s+not\s+(?:include|add|put|use)\s+(?:a\s+|an\s+|the\s+|any\s+)?([a-zA-Z][a-zA-Z\s\-]{1,40}?)(?=[,.;!?]|$|\sand\s|\sbut\s|\swith\s)/gi,
    /\bavoid\s+(?:the\s+|all\s+|any\s+)?([a-zA-Z][a-zA-Z\s\-]{1,40}?)(?=[,.;!?]|$|\sand\s|\sbut\s|\swith\s)/gi,
  ];
  for (const re of patterns) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const phrase = (m[1] || "").trim().replace(/\s+/g, " ");
      if (phrase && phrase.length >= 2 && phrase.length <= 40) {
        found.add(phrase.toLowerCase());
      }
    }
  }
  return Array.from(found);
}

// Convert a base64 string (without the data: prefix) to a Uint8Array.
function base64ToUint8Array(b64: string): Uint8Array {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeadersFor(req) });
  }

  // T6: per-request reflected CORS headers, reused by every response below.
  const cors = corsHeadersFor(req);

  // ── T8: abuse protection — runs BEFORE req.json() and before any paid
  //    OpenAI/Gemini call. SHADOW-WIRED: rate-limit `mode` is omitted so it
  //    follows the global ENFORCE_RATE_LIMIT secret (defaults to observe);
  //    the !allowed branch is ready but dormant until enforcement is enabled.
  //    Turnstile is log-only here — no hard reject yet (frontend token lands
  //    in T9, secret in T10). verifyTurnstile soft-passes until the secret is
  //    set, so this is a no-op in dev/preview.
  const ip = getClientIP(req);

  const rl = await checkRateLimit({
    endpoint: "generate-renovation:generate",
    ip,
    limit: 10,
    windowSeconds: 600,
    // mode omitted → inherits ENFORCE_RATE_LIMIT (defaults to "observe"/shadow)
  });
  if (!rl.allowed) {
    return new Response(
      JSON.stringify({
        success: false,
        errorCode: "RATE_LIMITED",
        message: "Too many requests. Please wait a moment and try again.",
        retryAfter: rl.resetAt,
      }),
      { status: 429, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }

  const turnstileToken = req.headers.get("x-turnstile-token");
  const turnstile = await verifyTurnstile(turnstileToken, {
    remoteIp: ip,
    expectedAction: "generate-renovation",
  });
  if (!turnstile.valid) {
    // Shadow mode: log only, do NOT reject yet.
    await logAbuse({
      event_type: "turnstile_observed_invalid",
      endpoint: "generate-renovation:generate",
      details: { reason: turnstile.reason },
    });
  }

  console.log("[generate-renovation] request received");

  try {
    const body = await req.json();
    console.log("[generate-renovation] body:", Object.keys(body || {}));
    console.log(
      "[generate-renovation] imageBase64 length:",
      body?.imageBase64?.length || 0,
    );
    const {
      imageBase64,
      imageType,
      projectType,
      style,
      budget,
      region,
      clientType,
      personalRequest,
    } = body || {};

    if (!imageBase64 || !projectType || !style) {
      console.log(
        "[generate-renovation] early return reason:",
        "missing required fields (imageBase64, projectType, style)",
      );
      return new Response(
        JSON.stringify({ error: "Missing required fields: imageBase64, projectType, style" }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    const mimeType = imageType || "image/jpeg";

    // ── T5: validate MIME + decoded size BEFORE any paid OpenAI/Gemini call ──
    const normalizedMime = String(mimeType).toLowerCase().trim();
    if (!ALLOWED_IMAGE_MIME.includes(normalizedMime)) {
      console.log(
        "[generate-renovation] early return reason:",
        "unsupported image mime",
        normalizedMime,
      );
      return new Response(
        JSON.stringify({
          success: false,
          errorCode: "UNSUPPORTED_IMAGE_TYPE",
          message: "Unsupported image type. Please upload a JPG, PNG, or WebP image.",
          received: normalizedMime,
        }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    const decodedBytes = approxBase64Bytes(imageBase64);
    if (decodedBytes > MAX_DECODED_IMAGE_BYTES) {
      console.log(
        "[generate-renovation] early return reason:",
        "image too large",
        decodedBytes,
      );
      return new Response(
        JSON.stringify({
          success: false,
          errorCode: "IMAGE_TOO_LARGE",
          message: "That image is too large. Please upload a photo under 8 MB.",
          maxBytes: MAX_DECODED_IMAGE_BYTES,
          receivedBytes: decodedBytes,
        }),
        { status: 413, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    const expectedCategory = normalizeSpaceLabel(projectType);

    // -----------------------------------------------------------------------
    // STEP 1: Vision-based GUARDRAIL
    // -----------------------------------------------------------------------
    const guardResp = await fetchWithRetry("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are an image classifier for a US construction renovation website. Classify the uploaded photo into ONE of these canonical categories ONLY: living_room, kitchen, bathroom, bedroom, dining_room, office, hallway, exterior, roof, yard, garage, basement, commercial, unknown. Use 'bathroom' for any toilet/restroom/powder room. Use 'living_room' for any lounge/family room/den. Use 'exterior' for any facade or outside-of-house view. Use 'unknown' if you truly cannot tell. Reply ONLY in strict JSON: {\"detectedType\": <category>, \"confidence\": <0..1>, \"reason\": <one short sentence>}",
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${imageBase64}`, detail: "high" },
              },
              {
                type: "text",
                text: `Classify this photo. The customer claims this is a "${projectType}" project. Be strict and honest — do not be polite. If the photo is clearly a different room type than "${projectType}", say so via the detectedType field.`,
              },
            ],
          },
        ],
        max_tokens: 150,
      }),
    }, { label: "OpenAI classifier", timeoutMs: 15000, retries: 1, backoffMs: 400 });

    const guardData = await guardResp.json();
    if (!guardResp.ok) {
      throw new Error(`Vision classifier error: ${JSON.stringify(guardData)}`);
    }

    let detectedCategory: SpaceCategory = "unknown";
    let detectedConfidence = 0;
    let detectedReason = "";
    try {
      const raw = guardData.choices?.[0]?.message?.content || "{}";
      const parsed = JSON.parse(raw);
      detectedCategory = normalizeSpaceLabel(String(parsed.detectedType || "unknown"));
      detectedConfidence = Number(parsed.confidence) || 0;
      detectedReason = String(parsed.reason || "");
    } catch (_e) {
      detectedCategory = "unknown";
    }

    const bothKnown = expectedCategory !== "unknown" && detectedCategory !== "unknown";
    const isMismatch = bothKnown && detectedCategory !== expectedCategory && detectedConfidence >= 0.6;

    if (isMismatch) {
      const expectedHuman = humanizeCategory(expectedCategory);
      const detectedHuman = humanizeCategory(detectedCategory);
      const message = `The uploaded image looks like a ${detectedHuman}, but you selected "${projectType}". Please upload a ${expectedHuman} image for this project type, or change the selected project type to ${detectedHuman}.`;

      if (Deno.env.get("ENVIRONMENT") !== "production") {
        console.log("[generate-renovation] Guardrail BLOCK:", {
          projectType,
          expectedCategory,
          detectedCategory,
          detectedConfidence,
          detectedReason,
        });
      }

      console.log(
        "[generate-renovation] early return reason:",
        "image-project type mismatch (guardrail)",
      );
      return new Response(
        JSON.stringify({
          success: false,
          errorCode: "IMAGE_PROJECT_TYPE_MISMATCH",
          message,
          detectedType: detectedHuman,
          expectedType: expectedHuman,
          confidence: detectedConfidence,
          reason: detectedReason,
        }),
        { status: 200, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    // -----------------------------------------------------------------------
    // STEP 2: Detailed room description
    // -----------------------------------------------------------------------
    const visionResp = await fetchWithRetry("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${imageBase64}`, detail: "high" },
              },
              {
                type: "text",
                text: `You are an expert contractor and surveyor inspecting a real existing ${projectType}. Describe the photo in detailed factual terms so another person could rebuild the same scene. Cover ALL of the following: (1) approximate room/area dimensions and proportions, (2) camera angle and viewpoint (eye-level, low, high, wide, etc.), (3) every visible wall, window, door, ceiling, floor, and their materials/colors, (4) all visible fixtures, furniture, appliances, cabinets, fittings, lighting, and their positions, (5) lighting conditions (natural/artificial, direction, warmth), (6) overall layout and spatial relationships, (7) any notable architectural features (beams, arches, trims, slopes). Be concrete and specific. 5-7 sentences. Do NOT suggest changes. Do NOT add anything that is not visible. This is a real existing space owned by a real customer and the renovation must preserve this exact space.`,
              },
            ],
          },
        ],
        max_tokens: 600,
      }),
    }, { label: "OpenAI describe", timeoutMs: 20000, retries: 1, backoffMs: 400 });

    const visionData = await visionResp.json();
    if (!visionResp.ok) {
      throw new Error(`Vision API error: ${JSON.stringify(visionData)}`);
    }
    const roomDescription = visionData.choices[0].message.content;

    // -----------------------------------------------------------------------
    // STEP 3: Build the structured prompt and call the Gemini image-edit model
    //         (model id resolved from GEMINI_IMAGE_MODEL env at runtime) for direct image-to-image editing.
    // -----------------------------------------------------------------------
    const safeBudget = budget || "Mid-Range";
    const safeRegion = region || "General US";
    const safeClientType = clientType || "Homeowner";
    const safePersonalRequest = (personalRequest && String(personalRequest).trim()) || "(no specific free-text request provided)";
    const safeStyle = style || "modern";
    const hasPersonalRequest = safePersonalRequest !== "(no specific free-text request provided)";

    const exclusions = parseNegativeRequests(safePersonalRequest);
    const exclusionsBlockLines: string[] = [];
    exclusionsBlockLines.push("HARD DO-NOT-INCLUDE LIST (ABSOLUTE — OUTPUT MUST NOT CONTAIN ANY OF THESE):");
    if (exclusions.length > 0) {
      for (const item of exclusions) {
        exclusionsBlockLines.push(`- NO ${item}. The output image MUST NOT contain any ${item}, even partially or in the background.`);
      }
    } else {
      exclusionsBlockLines.push("- (No specific exclusions parsed from the customer request.)");
    }

    const editPrompt = [
      "Edit the provided image. Do NOT recreate it.",
      "",
      "CORE PRINCIPLE:",
      "This is a real-world renovation preview. The result must look like the same physical room after renovation.",
      "",
      "STRUCTURAL ELEMENTS (MUST NOT CHANGE):",
      "- Walls (position, height, orientation, shape)",
      "- Ceiling (height, structure)",
      "- Windows (position, size)",
      "- Doors (position, size)",
      "- Floor boundaries (room size and layout)",
      "- Camera angle and perspective",
      "These define the real geometry of the room and must remain EXACTLY the same.",
      "",
      "EDITABLE ELEMENTS:",
      "- Wall finishes (paint, panels, textures)",
      "- Flooring material (carpet → wood, tile, etc.)",
      "- Furniture (style, material, color, but keep scale and placement logic)",
      "- Lighting fixtures (same position, updated style)",
      "- Decorations and accessories",
      "- Colors and materials",
      "",
      "ABSOLUTE RULES:",
      "- Do NOT change room size",
      "- Do NOT move walls",
      "- Do NOT add or remove windows",
      "- Do NOT change ceiling height",
      "- Do NOT change camera angle",
      "- Do NOT create a new room",
      "- Do NOT create a showroom or luxury fantasy unless explicitly requested",
      "- Do NOT redesign layout completely",
      "",
      "PRIMARY CONTROL:",
      "The customer's free-text request is the main instruction for the edit.",
      "Apply all customer instructions exactly, as long as they do not break structural rules.",
      "If the customer excludes something (e.g., 'without TV'), it MUST NOT appear.",
      "If the customer does not mention something, keep it natural and realistic.",
      "Only remove or exclude elements explicitly requested by the customer.",
      "",
      "RENOVATION STYLE LOGIC:",
      "If the customer style is vague (e.g., 'modern'), perform a conservative, realistic renovation:",
      "- improve materials",
      "- clean and refresh space",
      "- upgrade furniture modestly",
      "- do not over-design or exaggerate",
      "",
      ...exclusionsBlockLines,
      "",
      "HIGH-PRIORITY CUSTOMER REQUEST (READ FIRST, MUST BE REFLECTED IN OUTPUT):",
      hasPersonalRequest
        ? `The customer specifically requested: "${safePersonalRequest}". This request is the single most important instruction. The output image MUST clearly show this request applied to the existing space. Do not ignore, soften, or generalize it. If the request includes negatives (without X, no X, remove X), the output MUST NOT contain X.`
        : "(The customer did not provide a specific free-text request. Follow the form data and the original space below.)",
      "",
      "STRICT REALISM RULES (NON-NEGOTIABLE):",
      "- Preserve the original room proportions exactly.",
      "- Preserve the camera angle and viewpoint exactly.",
      "- Preserve wall positions exactly.",
      "- Preserve window positions and door positions exactly.",
      "- Preserve ceiling height exactly.",
      "- Do NOT expand the room.",
      "- Do NOT make the room larger or more spacious than the original.",
      "- Do NOT create luxury fantasy / showroom designs unless explicitly requested.",
      "- Do NOT add unrelated objects.",
      "- Do NOT add a TV unless the customer explicitly requested one.",
      "- Do NOT change the room type.",
      "- Do NOT replace the room with a different room.",
      "",
      "SYSTEM / STYLE RULES:",
      "You are editing the provided photo to show a realistic, buildable contractor renovation, not a fantasy concept.",
      "Only modify the renovation elements that are explicitly requested by the customer or implied by the project type and style.",
      "Respect the customer's exact request above all stylistic defaults.",
      "",
      "ORIGINAL SPACE (from photo analysis, this is the same real existing space shown in the input image — the output MUST be the same space, same angle, same proportions):",
      roomDescription,
      "",
      "CUSTOMER FORM DATA (every field below MUST be reflected in the output):",
      `- Project type: ${projectType}`,
      `- Preferred style: ${safeStyle}`,
      `- Budget range: ${safeBudget}`,
      `- Region: ${safeRegion}`,
      `- Client type: ${safeClientType}`,
      `- Customer free-text request: ${safePersonalRequest}`,
      "",
      "PRIORITY RULES (in this exact order):",
      "1. Edit the provided image (do not recreate). Preserve structure, proportions, layout, camera angle.",
      "2. HARD DO-NOT-INCLUDE LIST (absolute exclusions).",
      "3. Customer free-text request (must be visible in the output).",
      "4. Project type and preferred style (guide the visual treatment).",
      "5. Budget range (controls realism of materials and finishes).",
      "6. Region and client type (subtle context).",
      "7. Lowest priority: generic beautification.",
      "",
      "NEGATIVE INSTRUCTIONS:",
      "Do not create an unrealistic luxury render.",
      "Do not change the building into a mansion.",
      "Do not add elements the customer did not request.",
      "Do not change architecture drastically.",
      "Do not add pools, luxury cars, extreme landscaping, giant glass walls, marble everywhere, gold accents, or fantasy lighting unless explicitly requested.",
      "Do not change room size, layout, camera angle, walls, windows, doors, or major architecture.",
      "Do not ignore the customer's free-text request.",
      "Do not produce a generic stock renovation that ignores the uploaded space.",
      "",
      "OUTPUT GOAL:",
      `A realistic edited version of the SAME ${projectType} shown in the provided image, viewed from the SAME camera angle, with the customer's free-text request clearly applied, in a ${safeStyle} style, using materials and finishes that fit a ${safeBudget} budget for a ${safeClientType} in ${safeRegion}. Photorealistic, natural lighting, no people. Practical, buildable, contractor-style result that a real US contractor could actually build. Strictly honor the HARD DO-NOT-INCLUDE LIST above. Edit the provided image only — do not invent a new room.`,
      "",
      "If the result looks like a different room, it is incorrect. The output must be the same room after renovation.",
    ].join("\n");

    if (Deno.env.get("ENVIRONMENT") !== "production") {
      console.log("[generate-renovation] Guardrail PASS:", {
        projectType,
        expectedCategory,
        detectedCategory,
        detectedConfidence,
      });
      console.log("[generate-renovation] Final prompt object:", {
        projectType,
        style: safeStyle,
        budget: safeBudget,
        region: safeRegion,
        clientType: safeClientType,
        personalRequest: safePersonalRequest,
        hasPersonalRequest,
        exclusions,
      });
      console.log("[generate-renovation] Final prompt string:\n" + editPrompt);
    }

    // -----------------------------------------------------------------------
    // STEP 4: Call the Gemini image-edit model (image-to-image edit, no mask).
    //         Gemini natively edits the provided image while honoring the
    //         structural-preservation prompt above. No segmentation step.
    // -----------------------------------------------------------------------
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";
    if (!GEMINI_API_KEY) {
      console.log(
        "[generate-renovation] early return reason:",
        "GEMINI_API_KEY not configured",
      );
      return new Response(
        JSON.stringify({
          success: false,
          errorCode: "GEMINI_NOT_CONFIGURED",
          message:
            "Image generation service is not configured. Please contact support.",
        }),
        { status: 200, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    const geminiModel = Deno.env.get("GEMINI_IMAGE_MODEL") ?? "gemini-2.0-flash-exp-image-generation";
    const geminiUrl =
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${GEMINI_API_KEY}`;

    console.log(
      "[generate-renovation] Calling Gemini:",
      geminiModel,
      "prompt length:",
      editPrompt.length,
      "image bytes (base64):",
      imageBase64.length,
    );

    let geminiResp: Response;
    try {
      geminiResp = await fetchWithRetry(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: editPrompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            // Ask Gemini to return an image modality.
            responseModalities: ["IMAGE"],
            temperature: 0.4,
          },
        }),
      }, { label: "Gemini", timeoutMs: 60000, retries: 0, backoffMs: 0 });
    } catch (fetchErr) {
      console.error("[generate-renovation] Gemini fetch threw:", fetchErr);
      return new Response(
        JSON.stringify({
          success: false,
          errorCode: "GEMINI_GENERATION_FAILED",
          message:
            "We could not generate your renovation preview right now. Please try again in a moment.",
          reason: String(fetchErr).slice(0, 300),
        }),
        { status: 200, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    if (!geminiResp.ok) {
      const errText = await geminiResp.text().catch(() => "");
      console.error(
        "[generate-renovation] Gemini non-OK:",
        geminiResp.status,
        errText.slice(0, 500),
      );
      return new Response(
        JSON.stringify({
          success: false,
          errorCode: "GEMINI_GENERATION_FAILED",
          message:
            "We could not generate your renovation preview right now. Please try again in a moment.",
          reason: `Gemini HTTP ${geminiResp.status}: ${errText.slice(0, 300)}`,
        }),
        { status: 200, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    const geminiData = await geminiResp.json();

    // Walk candidates[*].content.parts[*] to find an inline_data image part.
    let geminiB64: string | null = null;
    let geminiMime: string = "image/png";
    const candidates = Array.isArray(geminiData?.candidates) ? geminiData.candidates : [];
    for (const cand of candidates) {
      const parts = cand?.content?.parts;
      if (!Array.isArray(parts)) continue;
      for (const part of parts) {
        const inline = part?.inline_data || part?.inlineData;
        if (inline && typeof inline.data === "string" && inline.data.length > 0) {
          geminiB64 = inline.data;
          if (typeof (inline.mime_type || inline.mimeType) === "string") {
            geminiMime = inline.mime_type || inline.mimeType;
          }
          break;
        }
      }
      if (geminiB64) break;
    }

    if (!geminiB64) {
      const blockReason =
        geminiData?.promptFeedback?.blockReason ||
        candidates?.[0]?.finishReason ||
        "no inline_data in response";
      console.error(
        "[generate-renovation] Gemini returned no image. Reason:",
        blockReason,
        "Raw keys:",
        Object.keys(geminiData || {}),
      );
      return new Response(
        JSON.stringify({
          success: false,
          errorCode: "GEMINI_GENERATION_FAILED",
          message:
            "We could not generate your renovation preview right now. Please try a different photo or request.",
          reason: String(blockReason).slice(0, 300),
        }),
        { status: 200, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    console.log(
      "[generate-renovation] Gemini image received. mime:",
      geminiMime,
      "base64 length:",
      geminiB64.length,
    );

    // Build a data URL so the existing frontend (which expects imageUrl as a
    // string it can drop into <img src>) keeps working without any changes.
    const generatedImageUrl = `data:${geminiMime};base64,${geminiB64}`;
    // Gemini does not echo back a "revised prompt" the way OpenAI did; surface
    // the prompt we composed so the frontend / debug surface still has one.
    const revisedPrompt = editPrompt;

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: generatedImageUrl,
        roomAnalysis: roomDescription,
        revisedPrompt,
        detectedType: humanizeCategory(detectedCategory),
        exclusions,
      }),
      { status: 200, headers: { ...cors, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("generate-renovation error:", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errMsg || "Internal server error" }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
});
