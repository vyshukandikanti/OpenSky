import { EMISSION_REDUCTION_FACTORS } from '../config/impactCoefficients.js';

/**
 * Calculates total avoided CO2 kilograms from low-emission commute and energy choices.
 * @param metroTrips Number of 10km public transit trips replacing private vehicles.
 * @param dieselHoursCurtailed Total hours of 50kVA diesel genset operation avoided.
 * @returns Total avoided CO2 emissions in kilograms (kg CO2e).
 * @example
 * ```ts
 * const co2 = calculateAvoidedEmissions(2, 4);
 * ```
 */
export function calculateAvoidedEmissions(metroTrips: number, dieselHoursCurtailed: number): number {
  const transitSavings = metroTrips * EMISSION_REDUCTION_FACTORS.METRO_COMMUTE_CO2_SAVINGS_KG;
  const dieselSavings =
    dieselHoursCurtailed *
    EMISSION_REDUCTION_FACTORS.DIESEL_GENSET_HOURLY_LITERS *
    EMISSION_REDUCTION_FACTORS.DIESEL_CO2_PER_LITER_KG;
  
  return Number((transitSavings + dieselSavings).toFixed(2));
}

/**
 * Calculates particulate inhalation reduction factor when wearing certified N95 masks.
 * @param outdoorPm25 Ambient particulate concentration in ug/m3.
 * @param isWearingN95 Mask usage boolean flag.
 * @returns Effective inhaled PM2.5 concentration in ug/m3.
 */
export function calculateEffectiveInhalation(outdoorPm25: number, isWearingN95: boolean): number {
  if (!isWearingN95) {
    return outdoorPm25;
  }
  // 95% particulate filtration efficiency
  return Math.round(outdoorPm25 * 0.05);
}
