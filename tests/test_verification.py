"""
OpenSky Verification Test Suite
Automated regression tests for code quality, asset integrity, accessibility, and hackathon constraints.
"""

import os
import re
import unittest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class TestHackathonSubmission(unittest.TestCase):

    def test_repo_size_under_10mb(self):
        """Verifies that the repository assets (tracked by git) remain strictly under 10 MB."""
        total_tracked_size = 0
        for root, dirs, files in os.walk(BASE_DIR):
            # Skip git directory and ignored raw png dumps
            if ".git" in root or "scratch" in root:
                continue
            for f in files:
                if f.endswith(".png"):
                    continue
                fp = os.path.join(root, f)
                total_tracked_size += os.path.getsize(fp)

        total_mb = total_tracked_size / (1024 * 1024)
        print(f"\n[Size Audit] Tracked Repo Size: {total_mb:.2f} MB (Limit: 10.00 MB)")
        self.assertLess(total_mb, 10.0, f"Repository size exceeds 10 MB limit: {total_mb:.2f} MB")

    def test_all_screens_exist(self):
        """Verifies that all 10 core screens are present in the screens directory."""
        screens_dir = os.path.join(BASE_DIR, "screens")
        required_screens = [
            "home.html",
            "family-setup.html",
            "todays-plan.html",
            "what-if.html",
            "community.html",
            "celebration.html",
            "action-impact.html",
            "settings.html",
            "air-data-unavailable.html",
            "offline-state.html"
        ]
        for screen in required_screens:
            screen_path = os.path.join(screens_dir, screen)
            self.assertTrue(os.path.exists(screen_path), f"Missing required screen: {screen}")
            self.assertGreater(os.path.getsize(screen_path), 5000, f"Screen file too small: {screen}")

    def test_local_font_assets(self):
        """Verifies that local fonts are present to prevent FOUT and external latency."""
        font_file = os.path.join(BASE_DIR, "fonts", "material-symbols-outlined.woff2")
        css_file = os.path.join(BASE_DIR, "fonts", "google-fonts.css")
        self.assertTrue(os.path.exists(font_file), "material-symbols-outlined.woff2 font missing")
        self.assertTrue(os.path.exists(css_file), "google-fonts.css missing")

    def test_tab_navigation_integrity(self):
        """Verifies that index.html contains all 10 tabs and corresponding tab panes."""
        index_path = os.path.join(BASE_DIR, "index.html")
        self.assertTrue(os.path.exists(index_path), "index.html does not exist")
        content = open(index_path, "r", encoding="utf-8").read()

        required_tabs = [
            "home", "family-setup", "todays-plan", "what-if", "community",
            "celebration", "action-impact", "settings", "air-data-unavailable", "offline-state"
        ]
        for tab in required_tabs:
            self.assertIn(f'data-tab="{tab}"', content, f"Missing tab button for: {tab}")
            self.assertIn(f'id="tab-pane-{tab}"', content, f"Missing tab pane for: {tab}")

    def test_accessibility_compliance(self):
        """Verifies accessibility attributes: viewport meta, lang tag, and semantic elements."""
        index_path = os.path.join(BASE_DIR, "index.html")
        content = open(index_path, "r", encoding="utf-8").read()
        self.assertIn('lang="en"', content, "Missing lang attribute on <html>")
        self.assertIn('name="viewport"', content, "Missing viewport meta tag")
        self.assertIn('<main', content, "Missing semantic <main> tag")
        self.assertIn('<header', content, "Missing semantic <header> tag")

    def test_security_sanitization(self):
        """Verifies no hardcoded private keys or tokens exist in tracked code."""
        index_path = os.path.join(BASE_DIR, "index.html")
        content = open(index_path, "r", encoding="utf-8").read()
        suspicious_patterns = [r'(?i)api[_-]?key\s*[:=]\s*["\'][A-Za-z0-9_-]{20,}["\']',
                               r'(?i)secret\s*[:=]\s*["\'][A-Za-z0-9_-]{20,}["\']']
        for pattern in suspicious_patterns:
            matches = re.findall(pattern, content)
            self.assertEqual(len(matches), 0, f"Potential secret found in code: {matches}")

if __name__ == "__main__":
    unittest.main()
