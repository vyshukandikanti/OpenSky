import { appStore } from '../store/appStore.js';
import { getStationAirQuality } from '../services/aqiStationService.js';

/**
 * Refreshes ambient air telemetry and persists to reactive store.
 * @param city Target monitoring city.
 */
export async function refreshAirQuality(city: string): Promise<void> {
  const telemetry = await getStationAirQuality(city);
  appStore.update({ telemetry });
}
