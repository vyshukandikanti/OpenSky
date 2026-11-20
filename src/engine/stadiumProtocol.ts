import { STADIUM_SAFETY_LIMITS } from '../config/stadiumConstants.js';
import type { CrowdSafetyProtocol } from '../types/community.js';

/**
 * Determines operational crowd protocol for stadium and public venues based on AQI.
 * @param aqi Current Indian National AQI index value.
 * @returns Standard operational directive for crowd safety.
 * @example
 * ```ts
 * const action = getStadiumCrowdProtocol(380);
 * ```
 */
export function getStadiumCrowdProtocol(aqi: number): CrowdSafetyProtocol {
  if (aqi >= STADIUM_SAFETY_LIMITS.SUSPENSION_TRIGGER_AQI) {
    return 'SUSPEND_OUTDOOR_FIXTURES';
  }
  if (aqi >= STADIUM_SAFETY_LIMITS.RESTRICTION_TRIGGER_AQI) {
    return 'ACCESS_CURTAILMENT';
  }
  if (aqi >= STADIUM_SAFETY_LIMITS.MISTING_TRIGGER_AQI) {
    return 'MISTING_AND_MASKS';
  }
  return 'NORMAL_MONITORING';
}

/**
 * Returns human-readable actionable protocol instructions for stadium stewards.
 * @param protocol Current operational protocol level.
 * @returns Localized operational directive string.
 */
export function getProtocolDirective(protocol: CrowdSafetyProtocol): string {
  switch (protocol) {
    case 'SUSPEND_OUTDOOR_FIXTURES':
      return 'Halt intense aerobic outdoor activities; divert attendees to indoor filtered arenas.';
    case 'ACCESS_CURTAILMENT':
      return 'Cap stadium capacity to 50%; activate misting fans and mandatory N95 distribution.';
    case 'MISTING_AND_MASKS':
      return 'Deploy anti-smog misting cannons at crowd perimeter and hand out N95 masks.';
    case 'NORMAL_MONITORING':
      return 'Air quality manageable. Maintain continuous station telemetry.';
  }
}
