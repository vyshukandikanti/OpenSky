import { simulateIndoorPm25 } from '../../engine/physics.js';

export function bindWhatIfSliders(): void {
  const slider = document.getElementById('outdoor-pm25-slider') as HTMLInputElement | null;
  const output = document.getElementById('simulated-indoor-pm25');

  slider?.addEventListener('input', () => {
    const val = parseInt(slider.value, 10) || 250;
    const res = simulateIndoorPm25({
      outdoorPm25: val,
      airPurifierActive: true,
      draftSealsApplied: true,
      plantsCount: 4,
    });
    if (output) {
      output.textContent = `${res.indoorPm25} ug/m3`;
    }
  });
}
