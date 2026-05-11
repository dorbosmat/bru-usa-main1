/**
 * Renovation AI Service Types
 * 
 * This module defines the interfaces for the renovation AI system.
 * All providers (current and future) should conform to these types.
 */

export interface RenovationRequest {
  imageUrl: string;
  projectType: string;
  style: string;
}

export interface RenovationResult {
  renovatedImage: string;  // base64 data URL or HTTPS URL
  description: string;     // AI-generated summary
}

export interface PriceRange {
  low: number;
  high: number;
}

/**
 * Frontend service provider interface.
 * Implement this to add new AI providers on the client side.
 */
export interface RenovationServiceProvider {
  id: string;
  name: string;
  generatePreview: (request: RenovationRequest) => Promise<RenovationResult>;
}
