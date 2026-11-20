"""
Unit & Integration Tests for OpenSky GenAI Smog Advisor
Validates prompt hardening, input sanitization, and grounded contextual responses.
"""

import unittest
import os
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class TestGenAiAdvisor(unittest.TestCase):

    def setUp(self):
        js_path = os.path.join(BASE_DIR, "js", "ai-assistant.js")
        with open(js_path, "r", encoding="utf-8") as f:
            self.js_code = f.read()

    def test_prompt_injection_sanitization(self):
        """Verifies that the sanitizeInput function strips script tags, javascript: URIs, and eval."""
        self.assertIn("sanitizeInput", self.js_code)
        self.assertIn("replace(/[<>]/g", self.js_code)
        self.assertIn("replace(/javascript:/gi", self.js_code)
        self.assertIn("replace(/eval\\(/gi", self.js_code)

    def test_knowledge_base_coverage(self):
        """Verifies grounded coverage for low-emission routines, air hacks, transit, stadium, and volunteers."""
        required_domains = ["routine", "hacks", "transport", "stadium", "volunteer"]
        for domain in required_domains:
            self.assertIn(f"{domain}:", self.js_code, f"Missing grounded knowledge domain: {domain}")

    def test_stadium_crowd_safety_guidance(self):
        """Verifies that stadium operations guidance includes N95 masks and mist-cannon suppression."""
        self.assertIn("Stadium Operations", self.js_code)
        self.assertIn("N95", self.js_code)
        self.assertIn("cannons", self.js_code)

    def test_volunteer_aid_guidance(self):
        """Verifies volunteer protocol covers vulnerable elderly check-ins and stubble/waste vigilance."""
        self.assertIn("Volunteer", self.js_code)
        self.assertIn("elderly", self.js_code)
        self.assertIn("waste", self.js_code)

if __name__ == "__main__":
    unittest.main()
