// Ekzekutohet pas `next build`: dështon nëse faqet kryesore s'janë më statike.
// `next build` del me sukses edhe kur një faqe bëhet dinamike (p.sh. një
// headers() i fshehur te not-found.tsx e bëri gjithë sajtin dinamik më
// 2026-09-27 pa asnjë gabim) — ky kontroll e kap atë rregresion.
import { readFileSync } from "node:fs";

const REQUIRED = [
  "/sq",
  "/en",
  "/sq/sherbimet",
  "/sq/cmimet",
  "/sq/contact",
  "/sq/projektet",
  "/sq/blog",
  "/sq/blog/seo-tirane",
  "/en/blog/seo-tirane",
  "/sq/privacy",
];

const manifest = JSON.parse(readFileSync(".next/prerender-manifest.json", "utf8"));
const routes = new Set(Object.keys(manifest.routes));
const missing = REQUIRED.filter((route) => !routes.has(route));

if (missing.length) {
  console.error(`✗ Këto faqe s'u prerenderuan (u bënë dinamike):\n  ${missing.join("\n  ")}`);
  console.error("Kërko për headers()/cookies() ose një Server Component jashtë [locale] që i thërret ato.");
  process.exit(1);
}

console.log(`✓ ${REQUIRED.length} faqet kryesore janë statike (${routes.size} rrugë të prerenderuara gjithsej).`);
