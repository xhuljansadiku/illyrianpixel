// Artikujt me dosjen e vet te app/[locale]/blog/<slug>/ — s'duhen prerenderuar edhe këtu.
// 2026-10-22: mungonin 10 prej tyre, kështu i njëjti URL gjenerohej dy herë dhe build-i
// mund të shkruante versionin e vjetër nga lib/blogPosts.* mbi artikullin e plotë (lokalisht
// ndodhi te 7 artikuj). lib/blogDedicatedSlugs.test.ts kontrollon që lista përputhet me dosjet.
export const DEDICATED_BLOG_SLUGS = new Set([
  "si-te-rrisesh-klientet-online",
  "gabimet-kryesore-ne-website",
  "pse-seo-eshte-kritik",
  "google-ads-vs-seo",
  "pse-ecommerce-eshte-i-rendesishem",
  "cfare-eshte-branding",
  "sa-kushton-website-shqiperi",
  "sa-kushton-website-kosove",
  "seo-tirane",
  "dyqan-online-shqiperi",
  "google-ads-shqiperi",
  "web-design-tirane",
  "social-media-menaxhim-shqiperi",
  "menaxho-biznesin-nga-diaspora",
  "website-dygjuhesh-biznes-diaspore",
  "si-te-gjejne-klientet-shqiptare-biznesin-tend",
]);
