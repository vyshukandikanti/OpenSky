import { FILTRATION_EFFICIENCY } from '../config/impactCoefficients.js';
import { PM25_STANDARDS } from '../config/aqiBands.js';
import type { SimulationInput, SimulationResult } from '../types/simulation.js';

/**
 * Computes baseline indoor penetration ratio based on sealing hacks.
 * @param draftSealsApplied Whether magnetic draft seals are applied to windows.
 * @returns Infiltration coefficient ratio (0.0 to 1.0).
 */
export function calculatePenetrationFactor(draftSealsApplied: boolean): number {
  const baselineInfiltration = 0.65;
  if (draftSealsApplied) {
    return baselineInfiltration * (1.0 - FILTRATION_EFFICIENCY.DRAFT_SEAL_RATIO);
  }
  return baselineInfiltration;
}

/**
 * Computes particulate removal rate from active filtration and botanical units.
 * @param purifierActive Whether mechanical HEPA purifier is operational.
 * @param plantsCount Number of NASA-certified indoor plants.
 * @returns Clean air decay rate multiplier (0.0 to 1.0).
 */
export function calculateRemovalEfficiency(purifierActive: boolean, plantsCount: number): number {
  let rate = 0.05;
  if (purifierActive) {
    rate += FILTRATION_EFFICIENCY.TRUE_HEPA_RATIO;
  }
  const plantContribution = Math.min(plantsCount * 0.015, 0.15);
  return Math.min(rate + plantContribution, 0.95);
}

function getSafeExposureHours(indoorPm25: number): number {
  if (indoorPm25 > 150) {
    return 2;
  }
  if (indoorPm25 > 60) {
    return 6;
  }
  return 24;
}

/**
 * Executes mass-balance steady-state calculation of indoor particulate exposure.
 * @param input Simulation input parameters.
 * @returns Detailed simulation response with PM2.5 and classification.
 * @example
 * ```ts
 * const res = simulateIndoorPm25({ outdoorPm25: 350, airPurifierActive: true, draftSealsApplied: true, plantsCount: 4 });
 * ```
 */
export function simulateIndoorPm25(input: SimulationInput): SimulationResult {
  const penetration = calculatePenetrationFactor(input.draftSealsApplied);
  const removal = calculateRemovalEfficiency(input.airPurifierActive, input.plantsCount);
  
  const rawIndoor = input.outdoorPm25 * penetration * (1.0 - removal);
  const indoorPm25 = Math.max(Math.round(rawIndoor), 8);
  const reduction = Math.max(0, Math.round(((input.outdoorPm25 - indoorPm25) / input.outdoorPm25) * 100));

  let safety: 'Safe' | 'Moderate' | 'Hazardous' = 'Hazardous';
  if (indoorPm25 <= PM25_STANDARDS.WHO_SAFE_DAILY) {
    safety = 'Safe';
  } else if (indoorPm25 <= PM25_STANDARDS.WHO_TARGET_1) {
    safety = 'Moderate';
  }

  const safeExposureHours = getSafeExposureHours(indoorPm25);

  return {
    indoorPm25,
    percentReduction: reduction,
    safeExposureHours,
    safetyClassification: safety,
  };
}
