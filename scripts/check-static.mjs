// Runs after `next build`: fails if key pages are no longer statically
// prerendered or render the wrong <html lang>. `next build` succeeds even when a
// page silently becomes dynamic (e.g. a stray headers() call), so this guards
// against that regression.
import { existsSync, readFileSync } from "node:fs";

const REQUIRED_ROUTES = [
  "/sv",
  "/en",
  "/sv/services",
  "/sv/services/web-development",
  "/en/services/maintenance-growth",
  "/sv/work",
  "/sv/about",
  "/sv/process",
  "/sv/insights",
  "/sv/insights/seo-eller-google-ads",
  "/en/insights/seo-or-google-ads",
  "/sv/contact",
  "/sv/privacy",
  "/en/cookies",
];

const manifest = JSON.parse(readFileSync(".next/prerender-manifest.json", "utf8"));
const prerendered = new Set(Object.keys(manifest.routes));
const missing = REQUIRED_ROUTES.filter((route) => !prerendered.has(route));

if (missing.length > 0) {
  console.error(`✗ These pages are no longer prerendered (they became dynamic):\n  ${missing.join("\n  ")}`);
  console.error("Look for headers()/cookies() or other dynamic APIs in pages, layouts or not-found.tsx.");
  process.exit(1);
}
console.log(`✓ ${REQUIRED_ROUTES.length} key pages are static (${prerendered.size} prerendered routes in total).`);

const LANG_CHECKS = [
  [".next/server/app/sv.html", "sv"],
  [".next/server/app/en.html", "en"],
  [".next/server/app/en/insights/seo-or-google-ads.html", "en"],
];

const wrongLang = LANG_CHECKS.filter(([file, lang]) => {
  if (!existsSync(file)) return true;
  return !new RegExp(`<html[^>]*\\slang="${lang}"`).test(readFileSync(file, "utf8"));
});

if (wrongLang.length > 0) {
  console.error(`✗ Wrong or missing <html lang> in:\n  ${wrongLang.map(([file, lang]) => `${file} (expected "${lang}")`).join("\n  ")}`);
  process.exit(1);
}
console.log("✓ <html lang> is correct for sv and en.");

// Placeholder case studies must never be indexable.
const placeholderPage = ".next/server/app/sv/work/client-a.html";
if (existsSync(placeholderPage) && !/<meta name="robots" content="noindex/.test(readFileSync(placeholderPage, "utf8"))) {
  console.error("✗ Placeholder case study is indexable — it must be noindex.");
  process.exit(1);
}
console.log("✓ Placeholder case studies are noindex.");
