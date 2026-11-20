/**
 * Crowd risk protocol levels for public gathering venues and stadiums.
 */
export type CrowdSafetyProtocol =
  | 'NORMAL_MONITORING'
  | 'MISTING_AND_MASKS'
  | 'ACCESS_CURTAILMENT'
  | 'SUSPEND_OUTDOOR_FIXTURES';

/**
 * Community diesel generator curtailment metrics.
 */
export interface CommunityShieldStatus {
  readonly gensetsReported: number;
  readonly curtailmentPercentage: number;
  readonly cleanGridContributionKw: number;
  readonly activeVolunteers: number;
  readonly protocol: CrowdSafetyProtocol;
}
