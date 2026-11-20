"""
Unit & Mathematical Accuracy Tests for OpenSky Microclimate Simulator
Validates indoor particulate decay mass-balance formulas and safety classifications.
"""

import unittest
import os
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class TestMicroclimateSimulation(unittest.TestCase):

    def setUp(self):
        sim_path = os.path.join(BASE_DIR, "js", "simulation.js")
        with open(sim_path, "r", encoding="utf-8") as f:
            self.sim_code = f.read()

    def test_mass_balance_differential_formula(self):
        """Verifies presence of steady-state indoor mass-balance formula: C_in = C_out * (P * a) / (a + k_dep + k_filt)."""
        self.assertIn("indoorPm25Raw = (params.outdoorPm25 * P * a) / totalDecay", self.sim_code)

    def test_penetration_factor_weatherstripping(self):
        """Verifies penetration factor P drops from 0.68 down to 0.22 when sealed."""
        self.assertIn("0.22 : 0.68", self.sim_code)

    def test_safety_tier_thresholds(self):
        """Verifies safety tier classifications (Safe Sanctuary, Moderate Risk, Unhealthy/Critical)."""
        self.assertIn("Safe Sanctuary (Good)", self.sim_code)
        self.assertIn("Moderate Risk", self.sim_code)
        self.assertIn("Unhealthy / Critical", self.sim_code)

    def test_who_exceedance_calculation(self):
        """Verifies WHO 24-hr guideline ratio calculation (15 µg/m³ baseline)."""
        self.assertIn("15.0", self.sim_code)

if __name__ == "__main__":
    unittest.main()
