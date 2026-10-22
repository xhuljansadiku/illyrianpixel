# Plani SEO — Illyrian Pixel

> 2026-10-22. Bazuar në kodin dhe faqen live; **pa** qasje në Google Search Console (s'u kontrollua).
> Pa premtime renditjeje: ky plan heq pengesat dhe ndërton përmbajtje të dobishme, renditja s'garantohet.

## 1. Gjendja teknike (e verifikuar)

| Tema | Gjendja | Burimi |
|---|---|---|
| Statusi i URL-ve | 95 URL në sitemap, të gjitha 200 | crawl live 2026-10-21 |
| Canonical | çdo faqe → vetvetja; `/en/...` → `/en/...` | head live |
| hreflang | `sq`, `sq-AL`, `en` reciprok; `x-default` te kreu | head live |
| `<html lang>` | `sq` / `en` sipas faqes | `scripts/check-static.mjs` (CI) |
| robots.txt | lejon gjithçka përveç `/api/`, `/admin/`, `*.json`; bllokon GPTBot, ClaudeBot, CCBot, Google-Extended | live |
| Faqe private | `noindex,nofollow` + pa canonical të trashëguar: admin, oferta, klienti, feedback (Faza 5) | build |
| `<h1>` | 1 për faqe (rregulluar te `/cmimet`, `/sherbimet`) | build |
| Schema | Organization, LocalBusiness, WebSite, FAQPage, BreadcrumbList, Service; `areaServed` = 9 vende; pa vlerësime/çmime të rreme | `lib/seo.ts` |
| Ridrejtime | 308 për URL-të e vjetra; **`www` → apex është 307** | live |
| Blogu | **u rregullua një dublikim i fshehur**: 10 artikuj prerenderoheshin dy herë (Faza 7) | build |

**Mbetur:** F5-1 (`www` 308, në Vercel), Rich Results Test pas publikimit, Search Console (pronari).

## 2. Harta e faqeve dhe qëllimi i kërkimit

| Faqja | Qëllimi i kërkimit | Fjalë kyçe kryesore (sq) | Shënim |
|---|---|---|---|
| `/` | navigim + "agjenci web" | web design, agjenci dixhitale | titulli thekson Europë/SHBA/Shqipëri |
| `/services/website` | transaksional | website për biznes, krijim website | pret Q-05 për "çfarë përfshihet" |
| `/services/ecommerce` | transaksional | dyqan online, krijim e-commerce | |
| `/services/seo` | transaksional | SEO Tiranë, shërbime SEO | **pa "dominim", pa afat 90 ditësh** (Faza 1) |
| `/services/google-ads` | transaksional | Google Ads Shqipëri | tarifa e ndarë nga buxheti ✅ |
| `/services/seo-google-ads` | transaksional | SEO + Google Ads | paketa e kombinuar, kursimi i dukshëm |
| `/cmimet` | komercial | çmime website, sa kushton website | |
| `/blog/sa-kushton-website-*` | informativ → komercial | sa kushton website Shqipëri/Kosovë | lidhje te `/cmimet` ✅ (Kosova ❌) |
| `/diaspora/*` | komercial lokal | website për biznes shqiptar në Gjermani… | faqe me përmbajtje të ndryshme për vend ✅ |

**Kanibalizim i mundshëm:** `/services/seo`, `/services/google-ads` dhe `/services/seo-google-ads` synojnë fjalë të afërta. Mbahen të treja, sepse kanë qëllime të ndryshme (vetëm SEO, vetëm Ads, të dyja) dhe lidhen mes tyre ("Shiko edhe"). Kontrollohet në Search Console pas 2–3 muajsh: nëse dy faqe shkëmbejnë vendin për të njëjtën fjalë, bashkohen.

## 3. Inventari i blogut (16 artikuj)

Fjalët numërohen vetëm brenda `<article>` (pa artikujt e ngjashëm dhe CTA-në). "Shërbime" = lidhje brenda tekstit drejt `/services`, `/sherbimet` ose `/cmimet`.

| Slug | Data | Fjalë | H2 | Lidhje te shërbimet | Vendimi |
|---|---|---|---|---|---|
| si-te-rrisesh-klientet-online | 2026-04-10 | 372 | 7 | — | **Përditëso**: shto lidhje te `/services/website` |
| gabimet-kryesore-ne-website | 2026-04-15 | 297 | 7 | — | **Përditëso**: i shkurtër; zgjeroje |
| pse-seo-eshte-kritik | 2026-04-20 | 319 | 7 | — | **Përditëso**: lidhje te `/services/seo` |
| google-ads-vs-seo | 2026-05-05 | 609 | 7 | — | **Mbaj** + lidhje te `/services/seo-google-ads` |
| pse-ecommerce-eshte-i-rendesishem | 2026-05-10 | 509 | 6 | — | **Mbaj** + lidhje te `/services/ecommerce` |
| cfare-eshte-branding | 2026-05-15 | 541 | 7 | — | **Mbaj** + lidhje te `/services/branding-content` |
| sa-kushton-website-shqiperi | 2026-05-20 | 327 | 4 | `/cmimet` | **Mbaj** |
| seo-tirane | 2026-05-22 | 380 | 4 | `/services/seo-google-ads` | **Përditëso titullin**: "Si dilni i pari" → pa premtim renditjeje |
| dyqan-online-shqiperi | 2026-05-24 | 214 | 4 | — | **Përditëso**: më i shkurtri; lidhje te `/services/ecommerce` |
| google-ads-shqiperi | 2026-05-26 | 272 | 4 | `/services/seo-google-ads` | **Mbaj** |
| web-design-tirane | 2026-05-28 | 302 | 4 | `/services/website` | **Mbaj** |
| social-media-menaxhim-shqiperi | 2026-05-30 | 311 | 4 | branding, seo-google-ads | **Përditëso**: lidhje te `/services/smm` (mungon!) |
| menaxho-biznesin-nga-diaspora | 2026-07-25 | 411 | 4 | — | **Mbaj** + lidhje te `/diaspora` |
| website-dygjuhesh-biznes-diaspore | 2026-07-25 | 394 | 5 | — | **Mbaj** + lidhje te `/diaspora` |
| si-te-gjejne-klientet-shqiptare-biznesin-tend | 2026-07-25 | 427 | 5 | — | **Mbaj** + lidhje te `/services/seo` |
| sa-kushton-website-kosove | 2026-07-29 | 318 | 4 | — | **Mbaj** + lidhje te `/cmimet` |

**Asnjë artikull për fshirje ose bashkim**: secili ka qëllim të vetin. Çiftet më të afërta (Shqipëri ↔ Kosovë për çmimet) synojnë tregje të ndryshme. Asnjë s'u hoq: pa të dhëna nga Search Console, fshirja do rrezikonte trafik ekzistues.

**Model i përbashkët:** asnjë artikull s'lidhet me një artikull tjetër brenda tekstit; lidhjet vijnë vetëm nga kutia "Artikuj të ngjashëm" poshtë. Çdo artikull i ri ka të paktën 1 lidhje te shërbimi dhe 1–2 te artikuj të tjerë brenda tekstit.

## 4. Artikujt e rinj (10, shkruar 2026-10-22, dega `content/blog-10`)

Zgjedhur sipas pyetjeve reale të klientëve, pa dublikuar temat ekzistuese:

| # | Tema | Pse | Lidhet me |
|---|---|---|---|
| 1 | Kur i duhet biznesit një website i ri (shenjat) | vendimi para blerjes | `/services/website`, gabimet-kryesore |
| 2 | Basic, Business apo Premium: si të zgjedhësh paketën | pyetja më e shpeshtë pas çmimit | `/cmimet`, sa-kushton-website |
| 3 | 12 pyetje para se të paguash për një website (domain, pronësia, hosting) | mbron klientin; ndërton besim | `/contact`, web-design-tirane |
| 4 | Mirëmbajtja e website-it: çfarë bëhet çdo muaj | shërbimi mujor (roadmap #4) | `/services/mirembajtja` |
| 5 | Google Business Profile: udhëzim për bizneset lokale | SEO lokal; s'kemi asnjë artikull | `/services/seo`, seo-tirane |
| 6 | Landing page që sjell kërkesa: parimet | konvertimi; lidhet me Ads | `/services/seo-google-ads`, google-ads-vs-seo |
| 7 | Shpejtësia e website-it pa zhargon (Core Web Vitals) | cilësi teknike, e matshme | `/services/website`, `/services/mirembajtja` |
| 8 | Domain dhe email profesional: pse info@biznesi.com | hapi i parë i besimit online | `/services/website` |
| 9 | WhatsApp Business + website: si punojnë bashkë | kanali kryesor i tregut | `/contact`, menaxho-biznesin-nga-diaspora |
| 10 | Fotot e produkteve me telefon: udhëzim për dyqanet e vogla | e-commerce praktik | `/services/ecommerce`, dyqan-online-shqiperi |

Rregullat: ton njerëzor dhe konkret, shembuj nga tregu shqiptar, pa statistika të shpikura (kur përmendet një numër, ose ka burim publik, ose paraqitet si vlerësim i përafërt), pa garanci rezultati, sq + en.

Slug-et (në rendin e tabelës): `kur-duhet-website-i-ri`, `si-te-zgjedhesh-paketen-e-website`, `pyetje-para-se-te-paguash-per-website`, `mirembajtja-e-website-it`, `google-business-profile-udhezues`, `landing-page-qe-sjell-kerkesa`, `shpejtesia-e-website-it`, `domain-dhe-email-profesional`, `whatsapp-business-dhe-website`, `foto-produktesh-me-telefon`. Artikull i ri i këtij lloji: skedar te `lib/blogArticles/` + `index.ts` + dosje te `app/[locale]/blog/` + `DEDICATED_BLOG_SLUGS` + hyrje te `lib/blogPosts.sq/en`; `lib/blogArticles/blogArticles.test.ts` dështon nëse mungon ndonjë hap.

## 5. Shumëgjuhësia

- Çdo artikull i ri ka version anglisht → hreflang reciprok automatik nga `buildMetadata`.
- `/en/blog/si-te-rrisesh-klientet-online` mbetet vetëm shqip (canonical te sq, s'del në sitemap-in EN): kështu është projektuar.
- S'ka ridrejtim automatik sipas gjuhës (`localeDetection: false`): vizitori zgjedh vetë.

## 6. Pas publikimit (pronari, ~30 min)

1. Search Console: dërgo `sitemap.xml` sërish; "URL Inspection" për 3–4 artikujt e rinj.
2. Rich Results Test për kreun dhe një faqe shërbimi.
3. Pas 4–6 javësh: raporti "Pages" (indeksimi) + "Performance" (pyetjet për çdo faqe) → vendimet e radhës (bashkime, përditësime).
