import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const idx = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

const navRe =
  /<!-- ========== NAVBAR \(premium[\s\S]*?<\/nav>\n<!-- ========== \/NAVBAR ========== -->/;
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
  /(?:<!-- FOOTER -->\s*)?<footer class="footer ip-footer"[\s\S]*?<\/footer>\s*/;

for (const f of fs.readdirSync(ROOT)) {
  if (!f.endsWith(".html") || f === "index.html") continue;
  const p = path.join(ROOT, f);
  let s = fs.readFileSync(p, "utf8");
  const s2 = s.replace(navPat, `${NAV_INNER}\n`);
  if (s2 === s) {
    console.error("NAV FAIL", f);
    continue;
  }
  const s3 = s2.replace(footPat, FOOTER);
  if (s3 === s2) {
    console.error("FOOT FAIL", f);
    continue;
  }
  fs.writeFileSync(p, s3);
  console.log("OK", f);
}
