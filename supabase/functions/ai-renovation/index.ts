import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version",
};

// ─── Provider Interface ───
// Each provider implements this shape. To add a new provider,
// create a new object matching AIProvider and register it in PROVIDERS.
interface AIProviderResult {
  renovatedImage: string; // base64 data URL or HTTPS URL
  description: string;    // text summary / recommendations
}

interface AIProvider {
  id: string;
  name: string;
  generate(params: {
    imageUrl: string;
    projectType: string;
    style: string;
    budget: string;
    region: string;
    clientType: string;
    personalRequest: string;
  }): Promise<AIProviderResult>;
}

// ─── Gemini Provider (via Lovable AI Gateway) ───
function buildPrompt(
  projectType: string,
  style: string,
  budget: string = "Mid-Range",
  region: string = "General US",
  clientType: string = "Homeowner",
  personalRequest: string = ""
): string {
  return `You are a world-class renovation visualization AI.
Your job is to transform the given image into a realistic "after renovation" version.

PROJECT TYPE: ${projectType}
STYLE: ${style}
BUDGET LEVEL: ${budget}
US REGION: ${region}
CLIENT TYPE: ${clientType}
${personalRequest ? `\nUSER PREFERENCES:\n- ${personalRequest}` : ""}

STRICT RULES:
- Keep the exact same structure, layout, walls, and camera angle
- Do NOT invent a new room
- Do NOT change proportions
- This must look like a real renovation, not fantasy
- The result must be achievable in real life

STYLE GUIDELINES:
${style === "Modern" ? "- Clean lines, neutral colors, bright natural lighting, minimal clutter" : ""}
${style === "Luxury" ? "- Premium materials (marble, wood), elegant lighting, high-end finishes" : ""}
${style === "Contemporary" ? "- Trendy design, bold accents, modern textures" : ""}
${style === "Budget-Friendly" ? "- Simple upgrades, affordable materials, realistic improvements" : ""}
${style === "Clean Minimal" ? "- Very minimal, open space, calm tones, almost empty feeling" : ""}

PROJECT FOCUS:
${projectType === "Kitchen" ? "- Upgrade cabinets, countertops, backsplash, lighting" : ""}
${projectType === "Bathroom" ? "- Upgrade tiles, shower, vanity, mirrors" : ""}
${projectType === "Living Room" ? "- Improve layout, furniture, lighting, flooring" : ""}
${projectType === "Bedroom" ? "- Improve comfort, lighting, calm design" : ""}
${projectType === "Roofing" ? "- Improve roof materials, structure, realism" : ""}
${projectType === "Exterior" ? "- Improve facade, paint, landscaping, curb appeal" : ""}
${projectType === "Full Room Remodel" ? "- Full transformation but still realistic and buildable" : ""}

BUDGET STRATEGY:
${budget === "Budget-Friendly" || budget === "Low" ? "- Use affordable materials, smart cosmetic upgrades, fresh paint, improved lighting, and realistic cost-effective changes." : ""}
${budget === "Mid-Range" ? "- Balance premium appearance with practical materials, durable finishes, and realistic homeowner investments." : ""}
${budget === "High-End" || budget === "Luxury" ? "- Use premium materials, custom finishes, designer lighting, upscale textures, and elevated craftsmanship." : ""}

CLIENT TYPE STRATEGY:
${clientType === "Investor" ? "- Prioritize resale value, broad market appeal, cost-effective improvements, durability, and clean neutral design." : ""}
${clientType === "Homeowner" ? "- Prioritize comfort, warmth, personal enjoyment, practical daily use, and an emotional feeling of home." : ""}
${clientType === "Luxury buyer" || clientType === "Luxury Buyer" ? "- Prioritize prestige, elegance, premium finishes, high-end materials, dramatic lighting, and a sophisticated atmosphere." : ""}

US REGION STRATEGY:
${region === "Florida" ? "- Use bright, airy, coastal-inspired design, humidity-friendly materials, light colors, tropical curb appeal." : ""}
${region === "California" ? "- Use modern warm minimalism, natural wood, large open spaces, indoor-outdoor flow, premium contemporary finishes." : ""}
${region === "Texas" ? "- Use spacious layouts, warm materials, bold but elegant finishes, practical durability, strong curb appeal." : ""}
${region === "General US" ? "- Use a broadly appealing American renovation style suitable for most homeowners." : ""}

MARKET QUALITY:
- The result should feel polished enough for a Houzz or Zillow-style listing.
- Make the renovation look investor-ready, presentation-ready, and commercially attractive.
- The image should help a homeowner immediately imagine the value of the renovation.

EMOTIONAL GOAL:
The homeowner should feel: "This is exactly what I imagined for my home."
Generate a highly realistic, professional renovation result.`;
}

const geminiProvider: AIProvider = {
  id: "gemini",
  name: "Google Gemini (via Lovable AI Gateway)",
  async generate({ imageUrl, projectType, style, budget, region, clientType, personalRequest }) {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: buildPrompt(projectType, style, budget, region, clientType, personalRequest),
              },
              {
                type: "image_url",
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (response.status === 429) throw new RateLimitError();
    if (response.status === 402) throw new PaymentError();
    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini gateway error:", response.status, errText);
      throw new Error("AI generation failed");
    }

    const data = await response.json();
    const renovatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const description = data.choices?.[0]?.message?.content;

    if (!renovatedImage) throw new Error("No image was generated");

    return { renovatedImage, description };
  },
};

// ─── Future Provider Template ───
// Uncomment and implement when ready to add a new provider:
// const openaiProvider: AIProvider = {
//   id: "openai",
//   name: "OpenAI DALL-E / GPT Vision",
//   async generate({ imageUrl, projectType, style, budget, region, clientType, personalRequest }) {
//     // Use OPENAI_API_KEY from env
//     // Call OpenAI API
//     // Return { renovatedImage, description }
//     throw new Error("OpenAI provider not yet implemented");
//   },
// };
// const replicateProvider: AIProvider = {
//   id: "replicate",
//   name: "Replicate (Stable Diffusion)",
//   async generate({ imageUrl, projectType, style, budget, region, clientType, personalRequest }) {
//     throw new Error("Replicate provider not yet implemented");
//   },
// };

// ─── Provider Registry ───
const PROVIDERS: Record<string, AIProvider> = {
  gemini: geminiProvider,
  // openai: openaiProvider,
  // replicate: replicateProvider,
};

function getActiveProvider(): AIProvider {
  const providerId = Deno.env.get("AI_RENOVATION_PROVIDER") ?? "gemini";
  const provider = PROVIDERS[providerId];
  if (!provider) {
    throw new Error(`Unknown AI provider: ${providerId}. Available: ${Object.keys(PROVIDERS).join(", ")}`);
  }
  return provider;
}

// ─── Custom Error Types ───
class RateLimitError extends Error {
  constructor() { super("Rate limited. Please try again in a moment."); }
}
class PaymentError extends Error {
  constructor() { super("Service temporarily unavailable."); }
}

// ─── HTTP Handler ───
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, projectType, style, budget, region, clientType, personalRequest } = await req.json();

    if (!imageUrl) throw new Error("imageUrl is required");

    const provider = getActiveProvider();
    console.log(`Using AI provider: ${provider.name}`);

    const result = await provider.generate({
      imageUrl,
      projectType,
      style,
      budget: budget ?? "Mid-Range",
      region: region ?? "General US",
      clientType: clientType ?? "Homeowner",
      personalRequest: personalRequest ?? "",
    });

    return new Response(
      JSON.stringify({ renovatedImage: result.renovatedImage, description: result.description }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("ai-renovation error:", err);
    if (err instanceof RateLimitError) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (err instanceof PaymentError) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
