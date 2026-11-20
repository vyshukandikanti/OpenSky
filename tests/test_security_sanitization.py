"""
Security & SAST Vulnerability Regression Tests
Enforces zero innerHTML assignments, strict CSP, X-Frame-Options, and absence of hardcoded secrets.
"""

import unittest
import os
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class TestSecuritySanitization(unittest.TestCase):

    def setUp(self):
        index_p = os.path.join(BASE_DIR, "index.html")
        with open(index_p, "r", encoding="utf-8") as f:
            self.index_html = f.read()

    def test_zero_raw_innerhtml_assignments(self):
        """Verifies zero unescaped .innerHTML assignments in index.html to eliminate XSS risks."""
        matches = re.findall(r'\.innerHTML\s*=', self.index_html)
        self.assertEqual(len(matches), 0, f"Dangerous .innerHTML assignment found in index.html: {len(matches)}")

    def test_strict_csp_and_frame_options(self):
        """Verifies strict Content Security Policy and anti-clickjacking frame-ancestors / X-Frame-Options."""
        self.assertIn("Content-Security-Policy", self.index_html)
        self.assertIn("frame-ancestors 'none'", self.index_html)
        self.assertIn('http-equiv="X-Frame-Options"', self.index_html)
        self.assertIn('content="DENY"', self.index_html)

    def test_zero_exposed_credentials(self):
        """Scans all JS and HTML files for API keys, private keys, and tokens."""
        patterns = [
            r'(?i)api[_-]?key\s*[:=]\s*["\'][A-Za-z0-9_-]{20,}["\']',
            r'(?i)client[_-]?secret\s*[:=]\s*["\'][A-Za-z0-9_-]{20,}["\']',
            r'(?i)ghp_[A-Za-z0-9]{36}',
            r'(?i)AIza[0-9A-Za-z-_]{35}'
        ]
        for root, dirs, files in os.walk(BASE_DIR):
            if ".git" in root or "scratch" in root:
                continue
            for f in files:
                if f.endswith((".html", ".js", ".json")):
                    fp = os.path.join(root, f)
                    with open(fp, "r", encoding="utf-8") as file_handle:
                        content = file_handle.read()
                    for pat in patterns:
                        hits = re.findall(pat, content)
                        self.assertEqual(len(hits), 0, f"Secret pattern matched in {f}: {hits}")

if __name__ == "__main__":
    unittest.main()
