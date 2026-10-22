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
  "/sq/blog/kur-duhet-website-i-ri",
  "/en/blog/kur-duhet-website-i-ri",
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

// <html lang> duhet të vijë nga serveri sipas gjuhës (components/RootDocument) —
// para 2026-10-03 ishte "sq" e fiksuar edhe për /en.
const LANG_CHECKS = [
  [".next/server/app/sq.html", "sq"],
  [".next/server/app/en.html", "en"],
  [".next/server/app/en/blog/seo-tirane.html", "en"],
];
const wrongLang = LANG_CHECKS.filter(([file, lang]) => {
  const html = readFileSync(file, "utf8");
  return !new RegExp(`<html[^>]*\\slang="${lang}"`).test(html);
});

if (wrongLang.length) {
  console.error(`✗ <html lang> i gabuar në:\n  ${wrongLang.map(([f, l]) => `${f} (pritej "${l}")`).join("\n  ")}`);
  process.exit(1);
}

console.log(`✓ <html lang> i saktë për sq/en.`);
