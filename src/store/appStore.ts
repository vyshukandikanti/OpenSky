import type { UserProfile } from '../types/userProfile.js';
import type { AirQualityMeasurement } from '../types/airQuality.js';

/**
 * State store shape for the OpenSky resilient application.
 */
export interface AppState {
  readonly activeTab: string;
  readonly language: 'en' | 'hi';
  readonly isAiModalOpen: boolean;
  readonly isOffline: boolean;
  readonly profile: UserProfile;
  readonly telemetry: AirQualityMeasurement;
}

const initialProfile: UserProfile = {
  householdType: 'general_household',
  city: 'Delhi NCR',
  hasAirPurifier: true,
  cleanTransitUser: true,
  volunteerEnrolled: false,
};

const initialTelemetry: AirQualityMeasurement = {
  city: 'Delhi NCR',
  aqi: 382,
  pm25: 285,
  pm10: 410,
  category: 'Very Poor',
  timestamp: Date.now(),
};

/**
 * In-memory observable reactive store for application state.
 */
class StateStore {
  private state: AppState = {
    activeTab: 'home',
    language: 'en',
    isAiModalOpen: false,
    isOffline: false,
    profile: initialProfile,
    telemetry: initialTelemetry,
  };

  private readonly listeners = new Set<(state: AppState) => void>();

  public getState(): AppState {
    return this.state;
  }

  public update(patch: Partial<AppState>): void {
    this.state = { ...this.state, ...patch };
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  public subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const appStore = new StateStore();
