import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const idx = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

const navRe =
  /<!-- ========== NAVBAR[\s\S]*?<\/nav>\s*\n<!-- ========== \/NAVBAR ========== -->/;
const footRe = /<!-- FOOTER -->[\s\S]*?<\/footer>/;

const NAV_INDEX = idx.match(navRe)?.[0];
if (!NAV_INDEX) throw new Error("nav block not found");
const NAV_INNER = NAV_INDEX.replace(
  'href="#top" aria-label="Illyrian Pixel – Kryefaqja"',
  'href="index.html" aria-label="Illyrian Pixel – Kryefaqja"',
  1
);
const FOOTER = `${idx.match(footRe)?.[0] ?? ""}\n`;
if (!FOOTER.trim()) throw new Error("footer block not found");

const navPat = /<nav class="navbar[\s\S]*?<\/nav>\s*/;
const footPat =
  /(?:<!-- FOOTER -->\s*)?<footer class="footer ip-footer[^"]*"[\s\S]*?<\/footer>\s*/;

for (const f of fs.readdirSync(ROOT)) {
  if (!f.endsWith(".html") || f === "index.html") continue;
  const p = path.join(ROOT, f);
  let s = fs.readFileSync(p, "utf8");
  const s2 = s.replace(navPat, `${NAV_INNER}\n`);
  if (s2 === s) {
    console.error("NAV FAIL", f);
    continue;
  }
  /* Replace footer when the block matches; if it already matches index, replace is a no-op but we still must persist the new nav. */
  const hasFooter = footPat.test(s2);
  const s3 = hasFooter ? s2.replace(footPat, FOOTER) : s2;
  if (!hasFooter) console.warn("FOOT SKIP (no match)", f);
  fs.writeFileSync(p, s3);
  console.log("OK", f);
}
