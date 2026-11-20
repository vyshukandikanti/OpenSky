import type { CommunityShieldStatus, CrowdSafetyProtocol } from '../types/community.js';

/**
 * Calculates collective community diesel generator curtailment metrics.
 * @param participatingApartments Count of enrolled residential complexes.
 * @param batteryBackupsActive Active community clean storage systems count.
 * @returns Aggregated community shield operational statistics.
 * @example
 * ```ts
 * const stats = calculateCommunityShield(120, 85);
 * ```
 */
export function calculateCommunityShield(
  participatingApartments: number,
  batteryBackupsActive: number,
): CommunityShieldStatus {
  const safeApartments = Math.max(1, participatingApartments);
  const ratio = Math.min(1.0, batteryBackupsActive / safeApartments);
  const curtailmentPercentage = Math.round(ratio * 100);
  const cleanGridContributionKw = Math.round(batteryBackupsActive * 12.5);
  const activeVolunteers = Math.round(participatingApartments * 3.4);

  let protocol: CrowdSafetyProtocol = 'NORMAL_MONITORING';
  if (curtailmentPercentage < 30) {
    protocol = 'SUSPEND_OUTDOOR_FIXTURES';
  } else if (curtailmentPercentage < 60) {
    protocol = 'ACCESS_CURTAILMENT';
  } else if (curtailmentPercentage < 90) {
    protocol = 'MISTING_AND_MASKS';
  }

  return {
    gensetsReported: safeApartments,
    curtailmentPercentage,
    cleanGridContributionKw,
    activeVolunteers,
    protocol,
  };
}
