# Plani i zbatimit — Illyrian Pixel

> Krijuar: 2026-10-21 · Burimi: `docs/ILLYRIAN_PIXEL_AUDIT.md`
> **Rregullat e punës:**
> - Çdo fazë bëhet në degën e vet → `lint` + `tsc` + `test` + `build` → preview në Vercel → merge në `main` **vetëm me miratimin e pronarit**.
> - Veçoritë që hiqen komentohen, nuk fshihen.
> - Asnjë faqe e re pa kërkesë të qartë.
>
> Statuset: `NOT STARTED` · `IN PROGRESS` · `BLOCKED` · `IN REVIEW` · `DONE` · `NOT APPLICABLE`.
> Një detyrë është `DONE` vetëm pasi kriteri i pranimit është verifikuar.

---

## Faza 0 — Dokumentet bazë

| ID | P | Ku | Problemi | Zgjidhja | Kriteri i pranimit | Varësi | Statusi |
|---|---|---|---|---|---|---|---|
| F0-1 | P1 | `docs/` | S'ka auditim të shkruar | `ILLYRIAN_PIXEL_AUDIT.md`, `IMPLEMENTATION_PLAN.md`, `OPEN_QUESTIONS.md`, `QA_CHECKLIST.md` | Dokumentet ekzistojnë dhe dallojnë të verifikuarat nga supozimet | — | IN REVIEW |

## Faza 1 — Premtimet e pambështetura (vetëm tekst, sq + en)

| ID | P | Ku | Problemi | Zgjidhja | Kriteri i pranimit | Varësi | Statusi |
|---|---|---|---|---|---|---|---|
| F1-1 | P1 | `messages/*/home.json` `hero.paragraph1` | "dominojmë Google" | Fjali konkrete për atë që bëjmë (p.sh. "SEO që ju ndihmon të gjendeni në Google") | `grep -i domin` = 0 në tekstet publike | — | IN REVIEW |
| F1-2 | P1 | `services/google-ads` Pro | "Dominoni Google para konkurrencës" | Përshkrim i konkretë i paketës | si më sipër | — | IN REVIEW |
| F1-3 | P1 | `services/seo` | "Rezultate brenda 90 ditëve", "dominim organik" | "Raport i parë i progresit pas 30 ditësh; SEO zakonisht kërkon 3–6 muaj" (formulim pa garanci) | S'mbetet asnjë afat i garantuar për renditje | — | IN REVIEW |
| F1-4 | P1 | Meta e `/projektet` | "ROI të Matshëm" | Titull pa pretendim ROI | Titulli live s'përmend ROI | — | IN REVIEW |
| F1-5 | P1 | Mirëmbajtja, e-commerce, kartat | "24/7 monitorim", "reagim i menjëhershëm", "mbështetje 24/7" | Pas krijimit të monitorit: "Monitorim automatik çdo 5 minuta" + afat reagimi real | Çdo premtim 24/7 ka mjet ose proces pas vetes | Q-01 ✅ (24 orë); para merge: UptimeRobot aktiv; Q-12 për 4h/1h/pa limit | IN REVIEW |
| F1-6 | P2 | Kreu, `/contact`, diaspora | "Plan brenda 24h" | Plan / strategji / ofertë → "24–48 orë"; "përgjigje brenda 24h" mbetet | I konfirmuar ose i zbutur | Q-02 ✅ | IN REVIEW |

## Faza 2 — Çmimet

| ID | P | Ku | Problemi | Zgjidhja | Kriteri i pranimit | Varësi | Statusi |
|---|---|---|---|---|---|---|---|
| F2-1 | P1 | `serviceCategories.*`, `services/seo`, `services/google-ads` | Tri grupe çmimesh që bien ndesh (V-01) | Çmimet e reja sipas vendimit të pronarit | Asnjë faqe s'tregon çmim tjetër për të njëjtën paketë | Q-03 ✅ (A) | IN REVIEW: SEO €99/199/299 · Ads €120/250/400 · SEO+Ads €189/379/599 (kursen €30/70/100, i shfaqur te karta) |
| F2-2 | P1 | `services/seo`, `services/google-ads` | Çmimet hardcoded, jashtë override-it nga admini | Paketat lëvizin te `lib/serviceCategories.*` (ose një modul i përbashkët) dhe kalojnë nga `applyOverridesToPackages` | Ndryshimi i çmimit në admin shfaqet në të gjitha faqet | F2-1 | IN REVIEW: burim i vetëm në kod `lib/seoAdsPricing.ts` + test që bundle < shuma dhe > çdo shërbim më vete. Kufizim: një override nga admini për paketën SEO+Ads s'e përditëson rreshtin "Kursen €X" (llogaritet nga kodi) |
| F2-3 | P1 | `/cmimet`, `/services/seo-google-ads` | Buxheti i reklamave: duhet të jetë qartë i ndarë te paketa e kombinuar | Rresht "Buxheti i reklamave paguhet direkt te Google, nuk përfshihet" | Vizitori dallon tarifën tonë nga buxheti i Google | — | IN REVIEW: "Buxheti i reklamave (e paguani ju, direkt te Google)" si "nuk përfshihet" në çdo kartë SEO+Ads; kalkulatori e thotë veç |
| F2-4 | P1 | `PricingCalculator` | Formula s'ka teste të veta; "vlera e klientit" ngatërronte shitjen me fitimin; fusha bosh jepte "599 klientë" | Formula → `lib/pricingCalculator.ts` + 8 teste; pyetja tani kërkon **fitim (jo shitje)**; hiqet "çdo klient mbi këtë është fitim"; kartat tregojnë supozimin "(€300 fitim secili)" | Testet kalojnë me vlera të llogaritura veçmas | — | IN REVIEW |
| F2-5 | P2 | KingGenti, blog, FAQ | Çmime të përmendura në tekst ("nga €299" etj.) | Kontroll pas F2-1 | `grep €` pa mospërputhje | F2-1 | DONE: s'ka çmim SEO/Ads jashtë `serviceCategories` + 2 faqeve; 7 FAQ-të në Supabase pa konflikt; override-i i vetëm në DB është `website/Basic €349` (= standardi) |

## Faza 3 — Formulari dhe lead-et

| ID | P | Ku | Problemi | Zgjidhja | Kriteri i pranimit | Varësi | Statusi |
|---|---|---|---|---|---|---|---|
| F3-1 | P1 | `ContactPageClient` | Buxheti dhe afati parazgjidhen (V-07) | Bosh si parazgjedhje + "Nuk e di ende"; `leadScore` e trajton si neutral | Lead pa zgjedhje → `budget` bosh ose "Nuk e di" në DB | — | IN REVIEW: verifikuar me dërgim real (budget/timeline bosh). Gamat e reja sipas paketave: Nën €500 · €500–1,000 · €1,000–2,000 · Mbi €2,000 · Nuk e di ende; vlerat në `lib/leadScore.ts`, të vjetrat ende vlerësohen; afati ruhet gjithmonë në shqip |
| F3-2 | P2 | `/contact`, `/api/contact` | Telefoni i detyrueshëm (V-14) | Opsional "(opsional, për përgjigje më të shpejtë)"; Telegram jep link email-i kur s'ka telefon | Formulari dërgohet pa telefon | Q-04 ✅ | IN REVIEW |
| F3-3 | P2 | `MarketingChrome` | `InquiryModal` i vdekur (V-13) | Komentohet montimi (`// InquiryModal:`), skedari mbetet | Bundle më i vogël; asnjë sjellje e ndryshuar | — | IN REVIEW |
| F3-4 | P2 | `/api/contact` | Email-i i konfirmimit vetëm në shqip (U-08) | Dërgohet në gjuhën e faqes (`sourcePath` fillon me `/en`) | Test: forma në `/en/contact` → email në anglisht | — | IN REVIEW (test kalon; inbox-i s'u kontrollua) |
| F3-5 | P1 | `/contact` | 10 rastet e testimit të formularit | Teste: valid, fusha mungon, email i gabuar, gabim serveri/DB, dështim i email-it, spam/honeypot, dyfishim, tastierë, mobile, mesazh suksesi | Të 10 të dokumentuara në `QA_CHECKLIST.md`; suksesi s'shfaqet kurrë pas dështimi | F3-1 | IN REVIEW: 11/11 ✅ (shih QA_CHECKLIST §2) |

## Faza 4 — Matja e konvertimeve

| ID | P | Ku | Problemi | Zgjidhja | Kriteri i pranimit | Varësi | Statusi |
|---|---|---|---|---|---|---|---|
| F4-1 | P1 | `WhatsAppButton`, `Footer`, `MobileMenu`, `HomeFinalCta`, `ContactPageClient`, `PricingCalculator` | Klikimet WhatsApp/tel/email s'maten (V-08) | `trackEvent("contact_click", { channel, location })` përmes `lib/track.ts` | Ngjarja shfaqet në GA4 DebugView **vetëm pas pëlqimit**; pa PII | — | NOT STARTED |
| F4-2 | P2 | `ContactPageClient` | `generate_lead` thirret direkt me `gtag` | Kalon nga `trackEvent`; fiket vetëm pas `success: true` | Forma e dështuar s'regjistron asnjë lead | — | NOT STARTED |
| F4-3 | P2 | GA4 (paneli) | Ngjarjet s'janë shënuar si konvertime | Udhëzim për pronarin: shëno `generate_lead` + `contact_click` si "Key events" | Pronari e konfirmon | F4-1 | NOT STARTED |

## Faza 5 — SEO teknik

| ID | P | Ku | Problemi | Zgjidhja | Kriteri i pranimit | Varësi | Statusi |
|---|---|---|---|---|---|---|---|
| F5-1 | P1 | Vercel → Domains | `www` → 307 (V-09) | Pronari: "Redirect to illyrianpixel.com" me **308 Permanent** | `curl -I https://www.illyrianpixel.com` → 308 | Pronari | NOT STARTED |
| F5-2 | P2 | `app/admin/layout` | `/admin/login` i indeksueshëm (V-10) | `robots: { index: false, follow: false }` | Head live: `noindex` | — | NOT STARTED |
| F5-3 | P2 | layout-et `oferta`/`klienti`/`feedback` | Canonical + hreflang i kreut (V-11) | `alternates: {}` (pa canonical/hreflang) në këto layout-e | Head pa canonical te kreu | — | NOT STARTED |
| F5-4 | P2 | `/cmimet`, `/sherbimet` | Dy `<h1>` (V-12) | Një `<h1>` me dy `<span>` | 1 `<h1>` në çdo faqe | — | NOT STARTED |
| F5-5 | P2 | `lib/seo.ts` | `areaServed` fiks (V-15) | Lista e vendeve reale (AL, XK, DE, IT, UK, SE, US) nga një konstante e vetme | Schema validohet me Rich Results Test | — | NOT STARTED |
| F5-6 | P2 | — | Prod audit i varësive | `npm audit --omit=dev` | 0 të larta/kritike, ose të dokumentuara | — | NOT STARTED |

## Faza 6 — Faqet e shërbimeve (8)

| ID | P | Ku | Zgjidhja | Kriteri i pranimit | Varësi | Statusi |
|---|---|---|---|---|---|---|
| F6-1 | P1 | `/services/website` | Seksion i shkurtër "Çfarë përfshihet / Çfarë s'përfshihet / Çfarë na duhet nga ju" (domain, hosting, tekstet, fotot, rishikimet, pronësia) | Klienti kupton fushën, procesin dhe hapin tjetër | Q-05 | NOT STARTED |
| F6-2 | P1 | `/services/ecommerce` | Platforma, pagesat, transporti, kostot mujore të palëve të treta | Kostot periodike të dukshme para blerjes | Q-05 | NOT STARTED |
| F6-3 | P1 | `/services/seo`, `/services/google-ads`, `/services/seo-google-ads` | Afatet reale, kufizimet, raportimi; tarifa vs buxheti | Pa garanci renditjeje; tarifa e ndarë nga buxheti | F1, F2 | NOT STARTED |
| F6-4 | P2 | `/services/branding-content` | Skedarët që dorëzohen, formatet, rishikimet, pronësia | Lista e saktë e dorëzimeve | Q-05 | NOT STARTED |
| F6-5 | P2 | `/services/smm` | Platformat, postimet/muaj, reels/stories, aprovimi, përjashtimi i buxhetit | Ngarkesa mujore e qartë | Q-05 | NOT STARTED |
| F6-6 | P1 | `/services/mirembajtja` | Përmbajtja reale e çdo pakete + afati i reagimit | Çdo premtim ka proces pas vetes | F1-5 | NOT STARTED |
| F6-7 | P2 | `/services/aplikacione-mobile` | Teknologjitë reale, store fees, mirëmbajtja | Pa teknologji të paverifikuara | Q-06 | NOT STARTED |

> Sipas rregullit "pa faqe ekstra": ndryshimet bëhen brenda seksioneve ekzistuese ose si një bllok i vetëm i shkurtër për faqe.

## Faza 7 — Portofoli dhe blogu

| ID | P | Ku | Zgjidhja | Kriteri i pranimit | Varësi | Statusi |
|---|---|---|---|---|---|---|
| F7-1 | P2 | `lib/caseStudies.*` | Statusi i çdo projekti (Live / I përfunduar / Në punë / Koncept) | Asnjë projekt i papërfunduar si "i përfunduar" | Q-07 | NOT STARTED |
| F7-2 | P2 | `/diaspora/shba-kanada` | Faqja tregon projekte nga DE/UK (`portfolioSlugs: suli-group-trockenbau, palushi-brothers`, `hasLocalCaseStudy: false`), ndonëse `roofon-nyc` (Nju Jork) është në portofol | Shtohet `roofon-nyc` dhe `hasLocalCaseStudy: true` (sq + en) | Faqja tregon rastin amerikan | — | NOT STARTED |
| F7-3 | P2 | `/blog` | Inventari i 17 artikujve: mbaj / përditëso / bashko | Tabelë në `docs/SEO_PLAN.md` | — | NOT STARTED |

## Faza 8 — Performanca dhe aksesueshmëria

| ID | P | Ku | Zgjidhja | Kriteri i pranimit | Varësi | Statusi |
|---|---|---|---|---|---|---|
| F8-1 | P1 | Kreu, `/cmimet` (mobile) | Matje bazë e re me PageSpeed; pastaj opsioni A (më pak animacione në mobile) | Matje para/pas në kushte të njëjta | Q-08 (A ose B) | BLOCKED |
| F8-2 | P1 | Rrugët kryesore | Test me tastierë: menuja mobile, modalet, formulari, fokusi i dukshëm | Rrjedhat kryesore të përdorshme pa maus | — | NOT STARTED |
| F8-3 | P2 | Rrugët kryesore | Skanim axe + 320/375/390/768/1024/1440px | 0 probleme kritike; pa scroll horizontal | — | NOT STARTED |

## Faza 9 — Pozicionimi dhe mbyllja

| ID | P | Ku | Zgjidhja | Kriteri i pranimit | Varësi | Statusi |
|---|---|---|---|---|---|---|
| F9-1 | P2 | `docs/POSITIONING_AND_MESSAGING.md` | Publiku, vlera, CTA-të; headline-i "Ktheje biznesin në BRAND." **mbetet** | Dokumenti i miratuar nga pronari | F1 | NOT STARTED |
| F9-2 | P2 | `docs/SEO_PLAN.md` | Hartë rrugësh, qëllimi i fjalëve kyçe, lidhjet e brendshme, inventari i blogut | — | F5, F7 | NOT STARTED |
| F9-3 | P1 | `docs/RELEASE_NOTES.md` + QA | Çfarë ndryshoi, testet, kufizimet, rikthimi (rollback) | Çdo kriter i kontrolluar | F1–F8 | NOT STARTED |
