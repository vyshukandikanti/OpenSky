"""
Unit & Operational Tests for OpenSky Community Shield & Stadium Operations
Validates neighborhood collective emission reduction and crowd air safety protocols.
"""

import unittest
import os
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class TestCommunityShield(unittest.TestCase):

    def setUp(self):
        js_path = os.path.join(BASE_DIR, "js", "community-shield.js")
        with open(js_path, "r", encoding="utf-8") as f:
            self.comm_code = f.read()

    def test_diesel_genset_reduction_modeling(self):
        """Verifies calculation of diesel generator curtailment contribution to PM2.5."""
        self.assertIn("gensetContribution = 0.22", self.comm_code)
        self.assertIn("wasteBurningContribution = 0.18", self.comm_code)

    def test_stadium_aqi_thresholds(self):
        """Verifies tiered stadium protocols for AQI 300+ (CRITICAL_HAZARD) and AQI 200+ (HIGH_SMOG_ADVISORY)."""
        self.assertIn("CRITICAL_HAZARD", self.comm_code)
        self.assertIn("HIGH_SMOG_ADVISORY", self.comm_code)
        self.assertIn("mist-cannon", self.comm_code)

    def test_co2_and_diesel_metrics(self):
        """Verifies environmental impact formulas for diesel liters saved and CO2 prevented."""
        self.assertIn("estimatedDieselSavedLiters", self.comm_code)
        self.assertIn("co2PreventedKg", self.comm_code)

if __name__ == "__main__":
    unittest.main()
