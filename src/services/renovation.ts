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

// ─── T3: client-side image guard + downscale ───
// We validate the mime type, downscale oversized phone photos, and re-encode
// to JPEG before the image ever leaves the browser. This protects the edge
// function from huge payloads and keeps generation fast/cheap. Pure client
// work — no Supabase, edge function, or config involved.
const ALLOWED_IMAGE_MIME = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_EDGE_PX = 1600;                 // longest side, in pixels
const TARGET_BYTES = 2 * 1024 * 1024;     // ~2MB target after re-encode

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
    onProgress?: (status: string) => void,
    turnstileToken?: string | null,
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
    // T3: validate + downscale + re-encode before sending. Throws a friendly
    // Error if the image can't be processed; the caller's catch surfaces the
    // message to the user via a toast.
    const { base64, mimeType: imageType } = await processImageForUpload(safe.imageFile);

  onProgress?.("Generating your renovation preview...");

  try {
        const headers: Record<string, string> = {
                  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                  apikey: SUPABASE_ANON_KEY,
                  "Content-Type": "application/json",
        };
        // T9: forward the Turnstile token (action "generate-renovation") as the
        // x-turnstile-token header to match the edge function (T8). Single-use.
        if (turnstileToken) headers["x-turnstile-token"] = turnstileToken;

        const { data, error } = await supabase.functions.invoke("generate-renovation", {
                headers,
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

/**
 * T3 — Validate, downscale, and re-encode an image entirely in the browser.
 * Returns base64 (no data: prefix) plus the output mime type ("image/jpeg").
 * Throws a friendly Error when the image cannot be processed; the caller's
 * catch surfaces err.message to the user.
 */
async function processImageForUpload(file: File): Promise<{ base64: string; mimeType: string }> {
    // 1. Validate mime BEFORE any decoding/encoding work.
    const type = (file?.type || "").toLowerCase();
    if (!type.startsWith("image/") || !ALLOWED_IMAGE_MIME.includes(type)) {
          if (/heic|heif/.test(type) || /\.hei[cf]$/i.test(file?.name || "")) {
                  throw new Error(
                          "That looks like an Apple HEIC photo, which browsers can't read. " +
                          "Please upload a JPG or PNG — on iPhone, set Camera → Formats to " +
                          "“Most Compatible,” or share/screenshot the photo first."
                  );
          }
          throw new Error("Please upload a photo in JPG, PNG, or WebP format.");
    }

    // 2. Decode, respecting EXIF orientation where the browser supports it.
    let source: CanvasImageSource;
    try {
          if (typeof createImageBitmap === "function") {
                  source = await createImageBitmap(file, { imageOrientation: "from-image" } as ImageBitmapOptions);
          } else {
                  source = await loadImageElement(file);
          }
    } catch {
          throw new Error("We couldn't read that image. Please try a different photo (JPG or PNG).");
    }

    const srcW = (source as HTMLImageElement).naturalWidth || (source as ImageBitmap).width;
    const srcH = (source as HTMLImageElement).naturalHeight || (source as ImageBitmap).height;
    if (!srcW || !srcH) {
          throw new Error("We couldn't read that image. Please try a different photo (JPG or PNG).");
    }

    // 3. Downscale so the longest side is at most MAX_EDGE_PX.
    const longest = Math.max(srcW, srcH);
    const scale = longest > MAX_EDGE_PX ? MAX_EDGE_PX / longest : 1;
    const outW = Math.max(1, Math.round(srcW * scale));
    const outH = Math.max(1, Math.round(srcH * scale));

    // 4. Draw to a canvas at the target size.
    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
          throw new Error("Your browser couldn't process this image. Please try a different device or photo.");
    }
    ctx.drawImage(source, 0, 0, outW, outH);
    if ("close" in source && typeof (source as ImageBitmap).close === "function") {
          (source as ImageBitmap).close();
    }

    // 5. Re-encode to JPEG, stepping quality down toward the ~2MB target.
    const qualities = [0.9, 0.82, 0.74, 0.66, 0.6];
    let blob: Blob | null = null;
    for (const q of qualities) {
          blob = await canvasToBlob(canvas, "image/jpeg", q);
          if (!blob) break;
          if (blob.size <= TARGET_BYTES) break; // good enough; stop shrinking
    }
    if (!blob) {
          throw new Error("We couldn't process that image. Please try a different photo.");
    }

    const base64 = await blobToBase64(blob);
    return { base64, mimeType: "image/jpeg" };
}

// Fallback decoder for browsers without createImageBitmap.
function loadImageElement(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
          const url = URL.createObjectURL(file);
          const img = new Image();
          img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
          img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("image-load-failed")); };
          img.src = url;
    });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
    return new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, quality));
}

// Read any Blob/File into base64 (without the data: prefix).
function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
                  const result = reader.result as string;
                  const base64 = result && result.includes(",") ? result.split(",")[1] : (result || "");
                  resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
    });
}
