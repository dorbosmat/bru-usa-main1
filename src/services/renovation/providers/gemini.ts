/**
 * Gemini Provider — calls the ai-renovation edge function
 * which internally uses Google Gemini via the Lovable AI Gateway.
 */

import { supabase } from "@/integrations/supabase/client";
import type { RenovationServiceProvider, RenovationRequest, RenovationResult } from "../types";

export const geminiProvider: RenovationServiceProvider = {
  id: "gemini",
  name: "Google Gemini",

  async generatePreview(request: RenovationRequest): Promise<RenovationResult> {
    const { data, error } = await supabase.functions.invoke("ai-renovation", {
      body: {
        imageUrl: request.imageUrl,
        projectType: request.projectType,
        style: request.style,
      },
    });

    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    if (!data?.renovatedImage) throw new Error("No image generated");

    return {
      renovatedImage: data.renovatedImage,
      description: data.description || "",
    };
  },
};
