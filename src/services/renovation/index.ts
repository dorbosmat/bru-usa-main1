/**
 * Renovation Service — Modular AI provider layer
 * 
 * Swap the active provider by changing the import below.
 * Future providers (OpenAI, Replicate, custom) just need to
 * implement RenovationServiceProvider and be registered here.
 */

export type { RenovationRequest, RenovationResult, PriceRange, RenovationServiceProvider } from "./types";

import { geminiProvider } from "./providers/gemini";
import type { RenovationServiceProvider } from "./types";

// ─── Provider Registry ───
const providers: Record<string, RenovationServiceProvider> = {
  gemini: geminiProvider,
  // openai: openaiProvider,       // future
  // replicate: replicateProvider,  // future
};

// Active provider — change this string to switch providers
const ACTIVE_PROVIDER = "gemini";

export function getProvider(): RenovationServiceProvider {
  const provider = providers[ACTIVE_PROVIDER];
  if (!provider) {
    throw new Error(`Unknown renovation provider: ${ACTIVE_PROVIDER}`);
  }
  return provider;
}

export function listProviders(): string[] {
  return Object.keys(providers);
}
