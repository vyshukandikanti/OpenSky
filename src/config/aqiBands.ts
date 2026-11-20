/**
 * Indian National Air Quality Index (NAQI) breakpoints and categorization.
 * Source: Central Pollution Control Board (CPCB), Ministry of Environment, Forest & Climate Change.
 */
export const AQI_THRESHOLDS = {
  // Good category upper bound (AQI index units)
  GOOD_MAX: 50,
  // Satisfactory category upper bound (AQI index units)
  SATISFACTORY_MAX: 100,
  // Moderate category upper bound (AQI index units)
  MODERATE_MAX: 200,
  // Poor category upper bound (AQI index units)
  POOR_MAX: 300,
  // Very Poor category upper bound (AQI index units)
  VERY_POOR_MAX: 400,
  // Severe category maximum scale (AQI index units)
  SEVERE_MAX: 500,
} as const;

/**
 * 24-hour PM2.5 standard limits in micrograms per cubic meter (ug/m3).
 * Source: World Health Organization (WHO) 2021 Global Air Quality Guidelines.
 */
export const PM25_STANDARDS = {
  // WHO 24h recommended interim target 1 limit (ug/m3)
  WHO_TARGET_1: 75.0,
  // WHO 24h recommended guideline target (ug/m3)
  WHO_SAFE_DAILY: 15.0,
} as const;
