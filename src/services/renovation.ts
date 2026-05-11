import { supabase, SUPABASE_PUBLISHABLE_KEY } from "@/integrations/supabase/client";

// Public anon key for the Supabase project. This is the same value the
// generated supabase client already uses; we read it explicitly here so that
// every Edge Function call carries explicit Authorization + apikey headers.
// NEVER put the service_role key here.
// Reuse the same public anon/publishable key the generated Supabase client uses.
// This guarantees the value is never empty at runtime, regardless of build-time env.
const SUPABASE_ANON_KEY = SUPABASE_PUBLISHABLE_KEY;

// Temporary debug log (does NOT log the key value, only whether it is set).
console.log("Has Supabase key:", Boolean(SUPABASE_ANON_KEY));

export interface RenovationConfig {
    projectType: string;
    style: string;
    imageFile: File;
    budget?: string;
    region?: string;
    clientType?: string;
    personalRequest?: string;
}

export interface RenovationResult {
    imageUrl: string;
    roomAnalysis: string;
}

export async function getProvider(): Promise<string> {
    return "openai-dalle3";
}

/**
 * Generate a renovation preview by calling the Supabase Edge Function.
 * Always returns a usable result. If the AI provider fails, returns a
 * graceful placeholder so the UI never crashes or white-screens.
 */
export async function generateRenovation(
    config: RenovationConfig,
    onProgress?: (status: string) => void
  ): Promise<RenovationResult> {
    const safe = {
          projectType: config?.projectType ?? "",
          style: config?.style ?? "",
          imageFile: config?.imageFile,
          budget: config?.budget ?? "",
          region: config?.region ?? "",
          clientType: config?.clientType ?? "",
          personalRequest: config?.personalRequest ?? "",
    };

  if (!safe.imageFile) {
        throw new Error("No image file provided");
  }

  onProgress?.("Analyzing your space...");
    const base64 = await fileToBase64(safe.imageFile);
    const imageType = safe.imageFile.type || "image/jpeg";

  onProgress?.("Generating your renovation preview...");

  try {
        const { data, error } = await supabase.functions.invoke("generate-renovation", {
                headers: {
                          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                          apikey: SUPABASE_ANON_KEY,
                          "Content-Type": "application/json",
                },
                body: {
                          imageBase64: base64,
                          imageType,
                          projectType: safe.projectType,
                          style: safe.style,
                          budget: safe.budget,
                          region: safe.region,
                          clientType: safe.clientType,
                          personalRequest: safe.personalRequest,
                },
        });

      if (error) {
              console.warn("[generateRenovation] edge function error:", error);
              return placeholderResult(safe);
      }

      const imageUrl = data?.imageUrl ?? data?.renovatedImage ?? "";
        const roomAnalysis = data?.roomAnalysis ?? data?.description ?? "";

      if (!imageUrl) {
              console.warn("[generateRenovation] no imageUrl in response, returning placeholder");
              return placeholderResult(safe);
      }

      return { imageUrl, roomAnalysis };
  } catch (err) {
        console.warn("[generateRenovation] unexpected error, returning placeholder:", err);
        return placeholderResult(safe);
  }
}

function placeholderResult(safe: { projectType: string; style: string }): RenovationResult {
    return {
          imageUrl: "",
          roomAnalysis:
                  "Your " + (safe.style || "renovated") + " " + (safe.projectType || "space") + " preview is being prepared. " +
                  "A licensed contractor will reach out shortly with personalized recommendations and a detailed quote.",
    };
}

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
                  const result = reader.result as string;
                  const base64 = result && result.includes(",") ? result.split(",")[1] : (result || "");
                  resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
    });
}
