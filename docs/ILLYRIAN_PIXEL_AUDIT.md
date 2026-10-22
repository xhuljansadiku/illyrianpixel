# Auditimi i plotë — Illyrian Pixel

> Data: 2026-10-21 · Baza: `main` @ `04870b2` · Faqja live: https://illyrianpixel.com
> Ky dokument dallon qartë **✅ të verifikuarat** (të kontrolluara në kod ose live sot) nga
> **❓ të paverifikuarat** (kërkojnë kontroll ose përgjigje nga pronari).

---

## 1. Përmbledhje ekzekutive

Faqja është teknikisht e shëndetshme. Build-i, tipet, lint-i dhe testet kalojnë. Të 95 URL-të e sitemap-it kthejnë 200. Canonical/hreflang janë të sakta dhe pëlqimi për cookies bllokon GA/Clarity para pranimit.
Auditimet e mëparshme (2026-09-23, 2026-10-02) kanë rregulluar tashmë pjesën më të madhe të problemeve teknike.

Rreziqet kryesore tani janë **komerciale dhe të besueshmërisë**, jo teknike:

1. **Çmimet e SEO/Google Ads bien ndesh** mes tri faqeve.
2. Disa **premtime live s'mund të mbështeten**: "dominojmë Google", "rezultate brenda 90 ditëve", "ROI i matshëm", "24/7".
3. **Formulari i kontaktit parazgjedh buxhetin**, gjë që shtrembëron vlerësimin e lead-eve.
4. **Klikimet në WhatsApp, telefon dhe email nuk maten.** Ky është kanali kryesor i kontaktit.
5. **`www` → domeni kryesor bëhet me 307 (i përkohshëm)** në vend të 301/308.

Asnjë problem P0 që e prish faqen nuk u gjet.

---

## 2. Problemet e verifikuara

| ID | Prioriteti | Ku | Problemi | Evidenca |
|---|---|---|---|---|
| V-01 | **P1** | `/cmimet`, `/services/seo-google-ads`, `/services/seo`, `/services/google-ads` | Tri grupe çmimesh që bien ndesh. Paketa SEO+Ads Growth €249 (2–3 fushata + SEO i plotë) kushton **më pak** se Google Ads Growth vetëm €250 (2–3 fushata). | `lib/serviceCategories.sq.ts:280-309` (€149/249/399); `app/[locale]/services/google-ads/page.tsx:86-117` (€120/250/400); `app/[locale]/services/seo/page.tsx:64-95` (€99/199/299) |
| V-02 | **P1** | Kreu (hero) | "dominojmë Google me SEO" / "dominate Google with SEO": premtim i paqartë dhe i pambështetur. **Live**. | `messages/sq/home.json:7`, `messages/en/home.json:7`, rendet nga `components/ParticleCloudHero.tsx:209` |
| V-03 | **P1** | `/services/google-ads` | Paketa Pro: "Dominoni Google para konkurrencës". | `app/[locale]/services/google-ads/page.tsx:120` |
| V-04 | **P1** | `/services/seo` | "Rezultate brenda 90 ditëve" (afat i garantuar) dhe "Autoritet dhe dominim organik". | `app/[locale]/services/seo/page.tsx:53, 97` (+ EN) |
| V-05 | **P1** | `/projektet` (meta title) | "Raste Reale me ROI të Matshëm", por asnjë rast studimi s'ka numra ROI. | live `<title>`; `lib/caseStudies.sq.ts` pa metrika |
| V-06 | **P1** | `/services/mirembajtja`, `/services/ecommerce`, kartat e shërbimeve | "Monitorim 24/7 dhe reagim i menjëhershëm", "Siguri dhe mbështetje 24/7". **Nuk ekziston monitor uptime** (konfirmuar nga pronari 2026-10-21). | `lib/maintenanceConversionContent.*.ts:43,83`; `lib/ecommerceConversionContent.*.ts:73`; `lib/serviceCategories.*.ts` (paketat e mirëmbajtjes); `lib/serviceOverviewCards.*.ts` |
| V-07 | **P1** | `/contact` | Buxheti parazgjidhet ("€1,000 – €3,000") dhe afati parazgjidhet. S'ka opsion "Nuk e di ende". Lead-et që s'e prekin fushën dalin me buxhet të rremë, që hyn në `leadScore`. | `components/ContactPageClient.tsx:78, 174` |
| V-08 | **P1** | Gjithë faqja | Klikimet `wa.me`, `tel:`, `mailto:` nuk dërgojnë asnjë ngjarje analitike. Maten vetëm `generate_lead` (vetëm `/contact`), `pricing_goal`, `select_package`. | `grep trackEvent`; `components/WhatsAppButton.tsx`, `Footer.tsx`, `MobileMenu.tsx`, `HomeFinalCta.tsx` |
| V-09 | **P1** | DNS / Vercel | `https://www.illyrianpixel.com/` → **307** → apex. Duhet 308/301. Ridrejtimi vjen nga Vercel Domains, jo nga `next.config.mjs`. | `curl -I` live, `Server: Vercel` |
| V-10 | P2 | `/admin/login` | `robots: index, follow` + canonical te kreu. `robots.txt` e bllokon `/admin/`, kështu rreziku është i ulët. | live head |
| V-11 | P2 | `/oferta/*`, `/klienti/*`, `/feedback/*` | `noindex` ✅, por trashëgojnë canonical dhe hreflang të kreut (sinjale kontradiktore). | live head |
| V-12 | P2 | `/cmimet`, `/sherbimet` | Dy `<h1>` në faqe (titulli është ndarë në dy elemente `h1`). | live HTML |
| V-13 | P2 | Gjithë faqja | `InquiryModal` montohet në çdo faqe, por **asgjë s'e hap** (s'ka `open-inquiry-modal` dispatcher). Dërgon te `formsubmit.co`, që CSP `connect-src` e bllokon, dhe e anashkalon CRM-në. Kod i vdekur që shkarkohet gjithsesi. | `components/MarketingChrome.tsx:89`; `components/InquiryModal.tsx:68` |
| V-14 | P2 | `/contact` | Telefoni është i detyrueshëm (klient + server). Shton fërkim te diaspora, që shpesh preferon email. | `app/api/contact/route.ts:69` |
| V-15 | P2 | Schema `Service` | `areaServed` fiks `["Albania","Kosovo","Germany","Europe"]` në çdo shërbim. Mungojnë UK/SE/US/IT që përmend faqja. | `lib/seo.ts` `buildServiceSchema` |
| V-16 | P3 | `vitest.config.ts` | Paralajmërim Vite për ESM në skedar CommonJS (s'prish asgjë). | output i `vitest run` |

## 3. Problemet që duan verifikim (❓)

| ID | Çfarë | Pse |
|---|---|---|
| U-01 | Dëshmitë (testimonials) në Supabase: a janë të gjitha reale dhe të autorizuara? | S'mund të verifikohet nga kodi. |
| U-02 | "Plan konkret brenda 24 orësh" (kreu, `/contact`, diaspora): a mbahet realisht me punë full-time? | Premtim operacional. |
| U-03 | Link building "5–10" / "15–20 backlinks/muaj" te `/services/seo`: a ofrohet vërtet? | Detyrim mujor i matshëm. |
| U-04 | "30 ditë rregullime falas", "3 muaj mirëmbajtje falas", garancia e dizajnit: të konfirmuara 2026-10-20/21. | ✅ i konfirmuar nga pronari, por **duhet nderuar për çdo klient**. |
| U-05 | Aplikacione mobile: çfarë teknologjie dhe a është dorëzuar ndonjë app në store? | Faqja shet shërbimin pa projekt në portofol. |
| U-06 | Performanca mobile: Lighthouse **nuk u rimat sot**. | Shih §12. |
| U-07 | Aksesueshmëria: s'u bë skanim automatik (axe) as test me tastierë sot. | Planifikuar në Fazën 8. |
| U-08 | Email-i i konfirmimit për klientin dërgohet vetëm në shqip, edhe kur forma plotësohet në `/en/contact`. | Për t'u kontrolluar në Fazën 3. |

---

## 4. Inventari i faqeve

Gjuhët: `sq` (pa prefiks) dhe `en` (`/en/...`). Të gjitha faqet marketing kanë të dyja versionet, përveç `blog/si-te-rrisesh-klientet-online` (vetëm sq; versioni EN ka canonical te sq, qëllimisht).

| URL (sq) | Qëllimi | Publiku | CTA kryesore | SEO | Teknik | Probleme / ndryshime | P |
|---|---|---|---|---|---|---|---|
| `/` | Pozicionimi + rruga drejt kontaktit | Biznese AL/XK + diaspora | Kontakt / WhatsApp | ✅ title/desc/canonical/hreflang, FAQ schema | ✅ statike | V-02 | P1 |
| `/sherbimet` | Përmbledhje shërbimesh | Të gjithë | Te shërbimi | ✅ | ✅ | V-12 | P2 |
| `/services/website` | Shërbimi kryesor | SME | Paketat / kontakt | ✅ | ✅ | Përfshirjet/përjashtimet (Faza 6) | P1 |
| `/services/ecommerce` | Dyqan online | Tregti | Paketat | ✅ | ✅ | V-06, kostot e palëve të treta (Faza 6) | P1 |
| `/services/seo-google-ads` | Paketa e kombinuar | SME | Paketat | ✅ | ✅ | V-01 | P1 |
| `/services/seo` | SEO më vete | SME | Paketat | ✅ | ✅ | V-01, V-04 | P1 |
| `/services/google-ads` | Ads më vete | SME | Paketat | ✅ | ✅ | V-01, V-03 | P1 |
| `/services/branding-content` | Branding | Biznese të reja | Paketat | ✅ | ✅ | Formatet e skedarëve/pronësia (Faza 6) | P2 |
| `/services/smm` | Social media | SME | Paketat | ✅ | ✅ | Volumi mujor/përjashtimet (Faza 6) | P2 |
| `/services/mirembajtja` | Mirëmbajtje mujore | Klientë ekzistues | Paketat | ✅ | ✅ | V-06 | P1 |
| `/services/aplikacione-mobile` | App mobile | — | "Ofertë" | ✅ | ✅ | U-05 | P2 |
| `/cmimet` | Çmimet + kalkulatori | Vendimmarrës | Zgjidh paketën | ✅ | ✅ | V-01, V-12 | P1 |
| `/projektet` | Portofoli | Të dyshuarit | Kontakt | ✅ | ✅ | V-05, statusi i projekteve (Faza 7) | P1 |
| `/projektet/[8 raste]` | Raste studimi | — | Shërbimi përkatës | ✅ | ✅ | Pa metrika (OK, por pa pretendime) | P2 |
| `/blog`, `/blog/[17]` | SEO informativ | Kërkues në Google | Shërbimi përkatës | ✅ | ✅ | Inventar mbaj/përditëso/bashko (Faza 7) | P2 |
| `/diaspora`, `/diaspora/[5]` | Tregjet e diasporës | Biznese shqiptare jashtë | Kontakt | ✅ | ✅ | `shba-kanada` ende "pa klient lokal" (klienti US është konfirmuar) | P2 |
| `/contact` | Konvertimi kryesor | Të gjithë | Dërgo formularin | ✅ | ✅ honeypot, rate-limit, validim në server | V-07, V-14, U-08 | P1 |
| `/newsletter` | Lead magnet (10%) | — | Abonohu | ✅ | ✅ | — | P3 |
| `/privacy`, `/terms` | Ligjore | — | — | ✅ | ✅ | Rishikim ligjor nga profesionist | P2 |
| `/oferta/[token]`, `/klienti/[token]`, `/feedback/[token]` | Dokumente klienti | Klientë | Prano ofertën | noindex ✅ | dinamike | V-11 | P2 |
| `/admin/*` | CRM i brendshëm | Pronari | — | V-10 | auth në middleware ✅ | — | P2 |

Ridrejtime ekzistuese (308): `/services/*` të vjetra, `/work` → `/projektet`, `/sherbimet/[slug]` → `/services/[slug]`, `/process` → `/sherbimet`.

## 5. Inventari i komponentëve (kryesorët)

| Grupi | Komponentët | Shënim |
|---|---|---|
| Layout | `RootDocument`, `MarketingChrome`, `Navbar`, `MobileMenu`, `Footer`, `LanguageSwitcher`/`LanguageToggle`, `CookieConsent` | `<html lang>` nga serveri; dekorimet vetëm ≥1024px |
| Hero | `ParticleCloudHero` → `HeroBrandBuilderLive` | 3D i komentuar (`// 3D:`) |
| Shërbime | `Services`, `ServiceCompactCard`, `ServiceBannerCard`, `ServiceCategoryDetailPage`, `ConversionLandingSections`, `ConversionTrustBar` | të dhënat nga `lib/serviceCategories.*`, `lib/*ConversionContent.*` |
| Çmime | `AllPackagesPageClient`, `ServicePackageCard`, `PricingCalculator`, `PricingExtras`, `PackageCarousel`, `CountUpPrice` | burimi: `lib/serviceCategories.*` + override nga admini (`lib/pricingOverrides.ts`). **Përjashtim:** `/services/seo` dhe `/services/google-ads` kanë çmime të shkruara direkt në faqe. |
| Prova | `ProjectBrowserCards`, `CaseStudyView`, `Testimonials`, `TrustedClients`, `ClientsShowcase`, `BeforeAfter` | të dhënat: `lib/caseStudies.*`, Supabase |
| Konvertim | `ContactPageClient`, `WhatsAppButton`, `HomeFinalCta`, `GlobalCTA`, `ExitIntentPopup`, `NewsletterPopup`, `KingGenti`, `InquiryModal` (i vdekur) | |
| FAQ | `FAQ` | nga admini ose fallback; schema ndërtohet nga e njëjta listë ✅ |
| Analitika | `Analytics`, `PageViewTracker`, `WebVitals`, `lib/track.ts`, `lib/consent.ts` | Consent Mode v2 |

## 6. Rreziqet teknike

- **Build-i i Vercel bie nga lint-i.** Kjo ka ndodhur më parë (870b2f7), prandaj lint + tsc ekzekutohen para çdo merge.
- **Çmimet hardcoded** në dy faqe, jashtë sistemit të override-ve nga admini: ndryshimi te admini s'i prek ato.
- **Shumë sisteme për një projekt anësor** (CRM, AI chat, newsletter, oferta, portal). Mirëmbajtja e tyre konkurron me kohën për klientë. S'shtohen sisteme të reja.
- `next lint` del nga përdorimi në Next 16. Migrimi te ESLint CLI bëhet para përditësimit.
- Dev vulns të mbetura (Tailwind 3 / eslint-config-next). Prod audit ishte 0 më 2026-10-04 dhe **nuk u ri-ekzekutua sot**.

## 7. Rreziqet SEO

- V-09 (307 te www), V-10, V-11, V-12, V-15.
- Mbivendosje e mundshme e fjalëve kyçe mes `/services/seo`, `/services/google-ads` dhe `/services/seo-google-ads`. Të treja janë të indeksueshme dhe kanë titull të ndryshëm. Lidhjet mes tyre ekzistojnë ("Shiko edhe"). Mbahen, por me çmime koherente.
- `robots.txt` bllokon GPTBot, ClaudeBot, CCBot dhe Google-Extended. Kjo është zgjedhje biznesi: faqja s'del si burim në përgjigjet e AI-së.
- ✅ Sitemap: 95 URL (48 sq + 47 en), të gjitha 200, pa URL admin/token.

## 8. Rreziqet UX dhe konvertimi

- V-02…V-06 dëmtojnë besueshmërinë te klienti që i lexon me kujdes.
- V-07: lead-et me buxhet të parazgjedhur s'mund të dallohen nga ata që e zgjodhën vetë.
- V-08: s'dihet sa kontakte vijnë nga WhatsApp, kanali më i përdorur.
- V-14: telefoni i detyrueshëm.
- V-01: klienti që krahason faqet sheh tri çmime për të njëjtën punë.

## 9. Aksesueshmëria

E verifikuar: çdo `<img>` në kreu ka `alt` (35 janë `alt=""`, dekorative), kreu ka 1 `<h1>`, skip link dhe kontrasti i butonit WhatsApp janë rregulluar më herët (`d99111b`). Problemi: V-12.
**Ende pa u testuar sot:** tastiera, fokusi në menunë mobile dhe modale, axe, zmadhimi 200%, reduced-motion (Faza 8).
Ky auditim **nuk** pretendon përputhshmëri me WCAG 2.2 AA.

## 10. Siguria dhe privatësia

✅ E verifikuar në kod:
- CSP pa `unsafe-eval` në prodhim; HSTS, nosniff, frame-ancestors.
- `/api/contact`: honeypot, validim në server, kufij gjatësie, `escapeHtml` në email, rate limit pas validimit; `success` kthehet vetëm pasi kontakti ruhet në DB.
- Admini mbrohet nga middleware me sesion + 2FA (TOTP).
- Pëlqimi: GA/Clarity me Consent Mode v2 "denied" si parazgjedhje (verifikuar live me Playwright më 2026-10-03).
- Kontaktet fshihen pas 2 vjetësh (`lib/contactRetention.ts`).

❓ Për Fazën 5/9: `npm audit --omit=dev` i ri, rishikim ligjor i `/privacy` dhe `/terms` (nga profesionist; ky auditim s'jep garanci ligjore).
`.env.local` ekziston lokalisht dhe është në `.gitignore`. Vlerat **nuk** u lexuan.

## 11. Rendi i rekomanduar

Shih `docs/IMPLEMENTATION_PLAN.md`. Shkurt: **1** premtimet → **2** çmimet → **3** formulari → **4** matja → **5** SEO teknik → **6** faqet e shërbimeve → **7** portofoli/blogu → **8** performanca/aksesueshmëria → **9** pozicionimi + mbyllja.

## 12. Matjet bazë

| Matja | Vlera | Burimi |
|---|---|---|
| `tsc --noEmit` | 0 gabime | ✅ ekzekutuar 2026-10-21 |
| `next lint` | 0 paralajmërime | ✅ 2026-10-21 |
| `vitest run` | 13 skedarë, 101/101 | ✅ 2026-10-21 |
| `next build` | sukses | ✅ 2026-10-21 |
| Sitemap | 95 URL, 0 jo-200 | ✅ crawl live 2026-10-21 |
| Lighthouse desktop kreu | ~96 / 100 / 100 / 100 | ❓ nga 2026-10-20, **jo i rimatur** |
| Lighthouse mobile kreu | ~65 / 100 / 100 / 100 | ❓ nga 2026-10-20, **jo i rimatur** (simulim laboratori, jo të dhëna fushe) |
| Lighthouse mobile `/cmimet` | ~62 | ❓ nga 2026-10-21 |
| Core Web Vitals (fushë) | s'ka të dhëna | Search Console, kontroll i planifikuar 2026-11-10 |

## 13. Informacioni që duhet nga pronari

Shih `docs/OPEN_QUESTIONS.md`.
