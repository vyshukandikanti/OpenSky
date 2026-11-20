import { describe, it, expect } from 'vitest';
import {
  simulateIndoorPm25,
  calculatePenetrationFactor,
  calculateRemovalEfficiency,
} from '../../src/engine/physics.js';
import {
  calculateAvoidedEmissions,
  calculateEffectiveInhalation,
} from '../../src/engine/impactCalculator.js';
import {
  calculateCommunityShield,
} from '../../src/engine/communityEngine.js';
import {
  getStadiumCrowdProtocol,
  getProtocolDirective,
} from '../../src/engine/stadiumProtocol.js';

describe('Physics & Simulation Engine', () => {
  it('should reduce penetration when draft seals are applied', () => {
    const unsealed = calculatePenetrationFactor(false);
    const sealed = calculatePenetrationFactor(true);
    expect(sealed).toBeLessThan(unsealed);
  });

  it('should boost removal efficiency when purifier is active', () => {
    const base = calculateRemovalEfficiency(false, 0);
    const withPurifier = calculateRemovalEfficiency(true, 4);
    expect(withPurifier).toBeGreaterThan(base);
  });

  it('should classify environment as Safe when indoor PM2.5 is at or below 15', () => {
    const result = simulateIndoorPm25({
      outdoorPm25: 40,
      airPurifierActive: true,
      draftSealsApplied: true,
      plantsCount: 5,
    });
    expect(result.safetyClassification).toBe('Safe');
    expect(result.safeExposureHours).toBe(24);
  });

  it('should classify environment as Moderate when PM2.5 is between safe and target 1', () => {
    const result = simulateIndoorPm25({
      outdoorPm25: 200,
      airPurifierActive: false,
      draftSealsApplied: true,
      plantsCount: 0,
    });
    expect(result.safetyClassification).toBe('Moderate');
    expect(result.safeExposureHours).toBe(6);
  });
});

describe('Impact Calculator', () => {
  it('should compute positive avoided CO2 when transit trips and diesel curtailment occur', () => {
    const avoided = calculateAvoidedEmissions(3, 5);
    expect(avoided).toBeGreaterThan(0);
  });

  it('should filter 95% of particulates when wearing N95 respirator', () => {
    const ambientPm25 = 300;
    const inhaled = calculateEffectiveInhalation(ambientPm25, true);
    expect(inhaled).toBe(15);
  });

  it('should return unattenuated outdoor PM2.5 when not wearing mask', () => {
    const ambientPm25 = 260;
    const inhaled = calculateEffectiveInhalation(ambientPm25, false);
    expect(inhaled).toBe(260);
  });
});

describe('Community Shield & Stadium Protocols', () => {
  it('should return high curtailment percentage when battery backups match apartments', () => {
    const stats = calculateCommunityShield(100, 95);
    expect(stats.curtailmentPercentage).toBe(95);
    expect(stats.protocol).toBe('NORMAL_MONITORING');
  });

  it('should trigger SUSPEND_OUTDOOR_FIXTURES when curtailment is below 30%', () => {
    const stats = calculateCommunityShield(100, 20);
    expect(stats.protocol).toBe('SUSPEND_OUTDOOR_FIXTURES');
  });

  it('should trigger ACCESS_CURTAILMENT when curtailment is between 30% and 60%', () => {
    const stats = calculateCommunityShield(100, 45);
    expect(stats.protocol).toBe('ACCESS_CURTAILMENT');
  });

  it('should return all stadium protocols correctly based on AQI bands', () => {
    expect(getStadiumCrowdProtocol(450)).toBe('SUSPEND_OUTDOOR_FIXTURES');
    expect(getStadiumCrowdProtocol(380)).toBe('ACCESS_CURTAILMENT');
    expect(getStadiumCrowdProtocol(280)).toBe('MISTING_AND_MASKS');
    expect(getStadiumCrowdProtocol(120)).toBe('NORMAL_MONITORING');

    expect(getProtocolDirective('ACCESS_CURTAILMENT')).toContain('Cap stadium capacity');
    expect(getProtocolDirective('MISTING_AND_MASKS')).toContain('Deploy anti-smog misting');
    expect(getProtocolDirective('NORMAL_MONITORING')).toContain('Maintain continuous');
  });
});
