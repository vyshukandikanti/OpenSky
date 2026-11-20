/**
 * OpenSky Community Shield & Operational Intelligence Engine
 * Handles neighborhood collective emission reduction, public stadium protocols,
 * and volunteer network coordination.
 */

export interface CommunityReductionParams {
  participatingHouseholds: number;  // Number of homes participating
  generatorReductionPct: number;    // % reduction in diesel genset usage
  curbWasteBurningPct: number;      // % reduction in local garden/waste burning
  radiusKm: number;                 // Radius of collective bubble
}

export interface StadiumProtocolParams {
  currentAqi: number;
  expectedAttendance: number;
  venueType: "OPEN_AIR_STADIUM" | "COVERED_ARENA" | "COMMUNITY_GROUND";
}

/**
 * Calculates localized atmospheric PM2.5 reduction within the neighborhood cluster.
 */
export function calculateCommunityImpact(params: CommunityReductionParams) {
  // Baseline: In Delhi residential clusters, localized diesel generators contribute ~22%
  // and local biomass/waste burning contributes ~18% to ground-level PM2.5 within 1 km.
  const gensetContribution = 0.22 * (params.generatorReductionPct / 100);
  const wasteBurningContribution = 0.18 * (params.curbWasteBurningPct / 100);
  const householdScale = Math.min(1.0, params.participatingHouseholds / 250);

  const localPm25DropPct = Math.min(42, Math.round((gensetContribution + wasteBurningContribution) * householdScale * 100));
  const estimatedDieselSavedLiters = Math.round(params.participatingHouseholds * (params.generatorReductionPct / 100) * 4.2);
  const co2PreventedKg = Math.round(estimatedDieselSavedLiters * 2.68);

  return {
    localPm25DropPct,
    estimatedDieselSavedLiters,
    co2PreventedKg,
    participatingHouseholds: params.participatingHouseholds,
    statusMessage: localPm25DropPct > 20
      ? `Active Shield: Local PM2.5 reduced by ~${localPm25DropPct}% in your 1-km neighborhood cluster!`
      : `Emerging Shield: Local PM2.5 reduced by ~${localPm25DropPct}%. Encourage more neighbors to switch from diesel.`
  };
}

/**
 * Generates operational safety protocols for high-density crowds and stadium venues.
 */
export function evaluateStadiumCrowdProtocols(params: StadiumProtocolParams) {
  if (params.currentAqi >= 300) {
    return {
      alertLevel: "CRITICAL_HAZARD",
      recommendation: "POSTPONE_OR_ENCLOSE",
      protocol: "Mandatory mist-cannon deployment around spectator stands. Distribute N95 respirators at all turnstiles.",
      crowdSafetyGuidelines: [
        "Reduce high-exertion athletic activities to intervals under 20 minutes.",
        "Activate indoor pressurized clean-air relief shelters inside concourse zones.",
        "Deploy mobile paramedic units equipped with nebulizers at all stadium gates.",
        "Prohibit diesel idling for team coaches and spectator transit shuttles."
      ]
    };
  } else if (params.currentAqi >= 200) {
    return {
      alertLevel: "HIGH_SMOG_ADVISORY",
      recommendation: "RESTRICTED_ATTENDANCE",
      protocol: "Deploy static air scrubbing filtration fans in player dugouts and high-density seating areas.",
      crowdSafetyGuidelines: [
        "Advise asthmatic and elderly spectators to view from ventilated hospitality suites.",
        "Broadcast air safety advisories every 30 minutes on stadium digital displays.",
        "Provide hydration stations with respiratory relief signage."
      ]
    };
  } else {
    return {
      alertLevel: "MODERATE_CAUTION",
      recommendation: "NORMAL_WITH_MONITORING",
      protocol: "Continuous real-time optical particle counter monitoring across stadium zones.",
      crowdSafetyGuidelines: [
        "Standard event safety precautions apply.",
        "Maintain clean-air corridor ventilation."
      ]
    };
  }
}
