/**
 * Pricing Service — isolated from AI provider
 * Can be replaced with API-driven pricing in the future.
 */

import type { PriceRange } from "./types";

const PRICE_RANGES: Record<string, Record<string, [number, number]>> = {
  kitchen:        { "budget-friendly": [8000, 15000], "clean-minimal": [12000, 22000], modern: [18000, 32000], contemporary: [22000, 38000], luxury: [35000, 65000] },
  "living-room":  { "budget-friendly": [5000, 10000], "clean-minimal": [8000, 16000], modern: [12000, 24000], contemporary: [16000, 30000], luxury: [25000, 50000] },
  bathroom:       { "budget-friendly": [6000, 12000], "clean-minimal": [10000, 18000], modern: [15000, 28000], contemporary: [18000, 32000], luxury: [28000, 55000] },
  roofing:        { "budget-friendly": [5000, 10000], "clean-minimal": [8000, 15000], modern: [12000, 22000], contemporary: [12000, 22000], luxury: [18000, 35000] },
  bedroom:        { "budget-friendly": [4000, 8000],  "clean-minimal": [6000, 12000], modern: [10000, 20000], contemporary: [12000, 24000], luxury: [20000, 40000] },
  exterior:       { "budget-friendly": [8000, 16000], "clean-minimal": [12000, 22000], modern: [18000, 35000], contemporary: [20000, 38000], luxury: [30000, 60000] },
  "full-remodel": { "budget-friendly": [15000, 30000], "clean-minimal": [25000, 45000], modern: [35000, 60000], contemporary: [40000, 70000], luxury: [55000, 120000] },
};

export function getEstimatedPriceRange(projectType: string, style: string): PriceRange {
  const range = PRICE_RANGES[projectType]?.[style] || [10000, 30000];
  return { low: range[0], high: range[1] };
}
