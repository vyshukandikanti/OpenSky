/**
 * Avoided greenhouse gas and particulate emission factors per routine alternative.
 * Source: Bureau of Energy Efficiency (BEE) & TERI Urban Mobility Reports.
 */
export const EMISSION_REDUCTION_FACTORS = {
  // Electric bus / Metro commuter savings per 10km trip (kg CO2e)
  METRO_COMMUTE_CO2_SAVINGS_KG: 1.85,
  // Shifting from personal 2-wheeler to public transit per day (kg CO2e)
  TRANSIT_SHIFT_CO2_SAVINGS_KG: 2.4,
  // 1 hour curtailment of 50kVA diesel generator (liters diesel avoided)
  DIESEL_GENSET_HOURLY_LITERS: 9.5,
  // Carbon intensity per liter of combusted high-speed diesel (kg CO2 / L)
  DIESEL_CO2_PER_LITER_KG: 2.68,
} as const;

/**
 * Air filtration removal efficiencies for indoor mitigation hacks.
 * Source: ASHRAE 52.2 / EPA Indoor Air Evaluation Studies.
 */
export const FILTRATION_EFFICIENCY = {
  // True HEPA purifier continuous filtration fraction (unitless ratio 0-1)
  TRUE_HEPA_RATIO: 0.85,
  // Magnetic window weather-stripping draft sealing (unitless ratio 0-1)
  DRAFT_SEAL_RATIO: 0.45,
  // Certified N95 particulate mask penetration reduction (unitless ratio 0-1)
  N95_MASK_PROTECTION_RATIO: 0.95,
} as const;
