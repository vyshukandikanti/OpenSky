import { z } from 'zod';

/**
 * Zod schema defining valid Indian AQI categories per CPCB standards.
 */
export const AqiCategorySchema = z.enum([
  'Good',
  'Satisfactory',
  'Moderate',
  'Poor',
  'Very Poor',
  'Severe',
]);

export type AqiCategory = z.infer<typeof AqiCategorySchema>;

/**
 * Structured ambient air quality measurement payload.
 */
export interface AirQualityMeasurement {
  readonly city: string;
  readonly aqi: number;
  readonly pm25: number;
  readonly pm10: number;
  readonly category: AqiCategory;
  readonly timestamp: number;
}
