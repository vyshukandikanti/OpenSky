/**
 * Crowd management protocols and air safety trigger levels for large stadiums and public venues.
 * Source: Graded Response Action Plan (GRAP-IV) & Sports Authority Health Guidelines.
 */
export const STADIUM_SAFETY_LIMITS = {
  // Public gathering safety trigger AQI threshold (NAQI index)
  MISTING_TRIGGER_AQI: 250,
  // High-risk capacity reduction trigger AQI threshold (NAQI index)
  RESTRICTION_TRIGGER_AQI: 350,
  // Event postponement recommendation threshold (NAQI index)
  SUSPENSION_TRIGGER_AQI: 425,
  // Average attendee inhalation rate during active cheering (m3 / hour)
  EXERTION_INHALATION_RATE_M3H: 1.8,
} as const;
