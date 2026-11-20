/**
 * OpenSky Microclimate Simulation Engine
 * Mathematical modeling of indoor PM2.5 decay and cross-ventilation dynamics.
 * Derived from Lawrence Berkeley National Laboratory indoor air mass-balance equations.
 */

export interface SimulationParams {
  outdoorAqi: number;        // Outdoor AQI (e.g. 312)
  outdoorPm25: number;       // Outdoor PM2.5 in µg/m³ (e.g. 245)
  roomVolumeM3: number;      // Room volume in cubic meters (e.g. 45 m³)
  hepaCadrM3h: number;       // Purifier Clean Air Delivery Rate in m³/h (e.g. 350)
  weatherstripSealed: boolean; // Balcony sealing active
  ventilationActive: boolean;  // Cross-ventilation open window
  airConditionerActive: boolean;
}

export interface SimulationResult {
  indoorPm25: number;
  indoorAqi: number;
  percentageDrop: number;
  safetyTier: string;
  whoExceedanceRatio: number;
  recommendation: string;
}

/**
 * Calculates steady-state indoor PM2.5 concentration using mass-balance differential modeling.
 */
export function calculateIndoorAirQuality(params: SimulationParams): SimulationResult {
  // Penetration factor (P): fraction of outdoor particles entering through leaks
  const P = params.weatherstripSealed ? 0.22 : 0.68;

  // Air exchange rate (a) in h^-1
  const a = params.ventilationActive ? 1.85 : (params.weatherstripSealed ? 0.25 : 0.65);

  // Deposition decay rate (k_dep) in h^-1 (natural settling on walls/floors)
  const k_dep = 0.15;

  // Purifier filtration rate (k_filt) in h^-1
  const k_filt = params.hepaCadrM3h > 0 ? (params.hepaCadrM3h / params.roomVolumeM3) : 0;

  // Total removal rate
  const totalDecay = a + k_dep + k_filt;

  // Steady-state indoor concentration: C_in = C_out * (P * a) / (a + k_dep + k_filt)
  const indoorPm25Raw = (params.outdoorPm25 * P * a) / totalDecay;
  const indoorPm25 = Math.max(8, Math.round(indoorPm25Raw));

  // AQI conversion heuristic for IN-NAAQI standard
  let indoorAqi = Math.round(indoorPm25 * 1.25);
  if (indoorPm25 <= 30) indoorAqi = Math.round(indoorPm25 * 1.6);
  else if (indoorPm25 <= 60) indoorAqi = 50 + Math.round((indoorPm25 - 30) * 1.6);
  else if (indoorPm25 <= 90) indoorAqi = 100 + Math.round((indoorPm25 - 60) * 3.3);
  else if (indoorPm25 <= 120) indoorAqi = 200 + Math.round((indoorPm25 - 90) * 3.3);
  else indoorAqi = Math.min(500, 300 + Math.round((indoorPm25 - 120) * 1.5));

  const percentageDrop = Math.max(0, Math.round(((params.outdoorPm25 - indoorPm25) / params.outdoorPm25) * 100));
  const whoExceedanceRatio = +(indoorPm25 / 15.0).toFixed(1); // WHO 24-hr guideline: 15 µg/m³

  let safetyTier = "Safe Sanctuary (Good)";
  let recommendation = "Air quality is pristine. Normal domestic activities permitted.";

  if (indoorPm25 > 90) {
    safetyTier = "Unhealthy / Critical";
    recommendation = "Seal balcony doors immediately and switch HEPA air purifier to Maximum CADR Boost.";
  } else if (indoorPm25 > 60) {
    safetyTier = "Moderate Risk";
    recommendation = "Run purifier on Medium speed. Postpone high-intensity indoor exercises.";
  } else if (indoorPm25 > 30) {
    safetyTier = "Acceptable Shield";
    recommendation = "Purifier maintaining safe baseline. Safe for infants and asthmatic children.";
  }

  return {
    indoorPm25,
    indoorAqi,
    percentageDrop,
    safetyTier,
    whoExceedanceRatio,
    recommendation
  };
}
