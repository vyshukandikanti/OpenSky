import { z } from 'zod';

/**
 * Household vulnerability classification schema.
 */
export const HouseholdTypeSchema = z.enum([
  'child_asthma',
  'elderly_respiratory',
  'active_commuters',
  'general_household',
]);

export type HouseholdType = z.infer<typeof HouseholdTypeSchema>;

/**
 * User profile configuration for tailored smog risk reduction.
 */
export interface UserProfile {
  readonly householdType: HouseholdType;
  readonly city: string;
  readonly hasAirPurifier: boolean;
  readonly cleanTransitUser: boolean;
  readonly volunteerEnrolled: boolean;
}
