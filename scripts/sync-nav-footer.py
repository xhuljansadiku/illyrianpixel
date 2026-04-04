# -*- coding: utf-8 -*-
"""Sync navbar + footer from index.html to all other *.html in repo root."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"

text = INDEX.read_text(encoding="utf-8")

nav_m = re.search(
    r"<!-- ========== NAVBAR \(premium.*?</nav>\n<!-- ========== /NAVBAR ========== -->",
    text,
    re.DOTALL,
)
if not nav_m:
    raise SystemExit("Could not find NAVBAR block in index.html")

NAV_INDEX = nav_m.group(0)
NAV_INNER = NAV_INDEX.replace(
    'href="#top" aria-label="Illyrian Pixel – Kryefaqja"',
    'href="index.html" aria-label="Illyrian Pixel – Kryefaqja"',
    1,
)

foot_m = re.search(r"<!-- FOOTER -->.*?</footer>", text, re.DOTALL)
if not foot_m:
    raise SystemExit("Could not find FOOTER block in index.html")
FOOTER = foot_m.group(0) + "\n"

nav_pat = re.compile(r"<nav class=\"navbar.*?</nav>\s*", re.DOTALL)
foot_pat = re.compile(
    r"(?:<!-- FOOTER -->\s*)?<footer class=\"footer ip-footer\".*?</footer>\s*",
    re.DOTALL,
)

for path in sorted(ROOT.glob("*.html")):
    if path.name == "index.html":
        continue
    s = path.read_text(encoding="utf-8")
    s2, n_nav = nav_pat.subn(NAV_INNER + "\n", s, count=1)
    if n_nav != 1:
        print(f"SKIP nav {path.name}: replaced {n_nav}")
        continue
    s3, n_foot = foot_pat.subn(FOOTER, s2, count=1)
    if n_foot != 1:
        print(f"SKIP footer {path.name}: replaced {n_foot}")
        continue
    path.write_text(s3, encoding="utf-8")
    print(f"OK {path.name}")

print("Done.")
