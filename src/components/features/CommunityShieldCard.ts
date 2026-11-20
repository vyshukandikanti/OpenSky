import { calculateCommunityShield } from '../../engine/communityEngine.js';

export function renderCommunityShieldMetrics(): void {
  const container = document.getElementById('community-metrics-container');
  if (!container) {
    return;
  }
  const shield = calculateCommunityShield(150, 110);
  const metricText = `Gensets Curtailed: ${shield.curtailmentPercentage}% | Clean Storage: ${shield.cleanGridContributionKw} kW`;
  container.textContent = metricText;
}
