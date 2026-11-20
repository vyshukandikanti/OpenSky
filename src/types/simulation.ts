/**
 * Input parameters for single-zone indoor PM2.5 decay modeling.
 */
export interface SimulationInput {
  readonly outdoorPm25: number;
  readonly airPurifierActive: boolean;
  readonly draftSealsApplied: boolean;
  readonly plantsCount: number;
}

/**
 * Calculated indoor microclimate response.
 */
export interface SimulationResult {
  readonly indoorPm25: number;
  readonly percentReduction: number;
  readonly safeExposureHours: number;
  readonly safetyClassification: 'Safe' | 'Moderate' | 'Hazardous';
}
