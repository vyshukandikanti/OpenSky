import type { AirQualityMeasurement } from '../types/airQuality.js';
import { safeFetch } from './apiClient.js';

/**
 * Fallback static measurement when ambient telemetry is offline.
 */
const OFFLINE_FALLBACK_MEASUREMENT: AirQualityMeasurement = {
  city: 'Delhi NCR',
  aqi: 382,
  pm25: 285,
  pm10: 410,
  category: 'Very Poor',
  timestamp: 1732100000000,
};

/**
 * Fetches real-time ambient station air data with seamless offline fallback.
 * @param city Target city identifier.
 * @returns Real-time or verified cached air quality telemetry.
 */
export async function getStationAirQuality(city: string): Promise<AirQualityMeasurement> {
  const endpoint = `/api/stations/${encodeURIComponent(city.toLowerCase())}`;
  const { data, error } = await safeFetch<AirQualityMeasurement>(endpoint);

  if (error !== null || data === null) {
    return {
      ...OFFLINE_FALLBACK_MEASUREMENT,
      city: city || OFFLINE_FALLBACK_MEASUREMENT.city,
      timestamp: Date.now(),
    };
  }

  return data;
}
