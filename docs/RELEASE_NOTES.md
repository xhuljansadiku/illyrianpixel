# Shënimet e publikimit — auditimi 2026-10-21/22

> Gjendja: **asgjë s'është publikuar.** Degët janë lokale/në GitHub dhe presin miratimin e pronarit.
> Baza: `main` @ `04870b2`. Degët janë zinxhir, secila mbi të mëparshmen:
>
> `docs/audit-faza-0` → `fix/faza-1-premtimet` → `feat/faza-2-cmimet` → `fix/faza-3-formulari` →
> `feat/faza-4-matja` → `fix/faza-5-seo` → `fix/faza-6-sherbimet` → `fix/faza-7-portofoli` →
> `fix/faza-8-a11y` → `docs/faza-9` (→ blogu)
>
> Në GitHub (push i miratuar): `feat/faza-2-cmimet`, `fix/faza-3-formulari`. Të tjerat **vetëm lokale**.

## Çfarë ndryshoi, sipas fazës

| Faza | Commit | Çfarë | Faqet e prekura |
|---|---|---|---|
| 0 | `8769948` | Auditimi, plani, pyetjet, lista QA (`docs/`) | — |
| 1 | `c6c7a55`, `b6cde06` | Hiqen "dominojmë Google", "rezultate brenda 90 ditëve", "ROI i matshëm", "24/7 reagim i menjëhershëm", "mbështetje 24/7". Plani/oferta → **24–48 orë**. Mirëmbajtja: Pro 24h, Premium e njëjta ditë pune + deri 5 orë/muaj, DDoS "përmes Vercel ose Cloudflare" | kreu, `/contact`, `/cmimet`, `/services/*`, `/projektet`, `/diaspora/*` (sq + en) |
| 2 | `d7c66ff` | SEO+Ads **€189 / €379 / €599** (ishte €149/249/399, më lirë se Ads vetëm); kursimi te karta; buxheti i reklamave "nuk përfshihet"; kalkulatori pyet për **fitim**, jo shitje; "(€300 fitim secili)" te kartat | `/cmimet`, `/services/seo-google-ads`, `/services/seo`, `/services/google-ads`, blogu (CTA) |
| 3 | `a72b1ce` | Formulari: pa parazgjedhje, buxhet sipas paketave + "Nuk e di ende", telefon opsional, email konfirmimi në anglisht për `/en`, `role=alert/status`; `InquiryModal` i komentuar | `/contact`, `/en/contact`, `/api/contact`, admini (pikët e lead-it) |
| 4 | `195face` | `contact_click` {channel, location} për çdo WhatsApp/email/telefon; `generate_lead` vetëm pas suksesit | gjithë faqja publike |
| 5 | `59c51d3` | Noindex për admin/oferta/klienti/feedback; një `<h1>` te `/cmimet` dhe `/sherbimet`; schema me 9 vende; hiqet "TollFree"; `npm audit fix` (dev) | `/admin/login`, token pages, `/cmimet`, `/sherbimet`, schema |
| 6 | `8d81ef2` | Schema `availableLanguage` = shqip, anglisht, gjermanisht, kroatisht (si te FAQ); matrica e mungesave | schema; `docs/OPEN_QUESTIONS.md` |
| 7 | `8b5d88f` | **Gabim i fshehur:** 10 nga 16 artikujt e blogut prerenderoheshin dy herë → rrezik që build-i të shfaqte versionin e vjetër të shkurtër. Rregulluar + test. Roofon NYC te `/diaspora/shba-kanada` | `/blog/*`, `/diaspora/shba-kanada` |
| 8 | `38ceb4c` | Kontrast AA (12 butona WhatsApp, etiketa të vogla), menuja mobile me tastierë (Escape, fokus, Tab brenda), popup-et, footer h3 → h2 | gjithë faqja |
| 9 | (ky dokument) | `POSITIONING_AND_MESSAGING.md`, `SEO_PLAN.md`, `RELEASE_NOTES.md` | — |

Gjithsej (fazat 0–8): 76 skedarë, +1 488 / −385 rreshta.

## Testet e ekzekutuara

| Test | Rezultati |
|---|---|
| `next lint` | 0 gabime (pas çdo faze) |
| `tsc --noEmit` | 0 gabime |
| `vitest` | 101 → **136 teste**, të gjitha kalojnë (të reja: çmimet SEO/Ads, kalkulatori, `/api/contact` ×12, pikët e lead-it, `contact_click`, lista e artikujve të blogut) |
| `next build` + `check-static` | sukses; 118 rrugë statike; `<html lang>` i saktë |
| Formulari (Playwright, `next start`) | 11/11 raste; 2 dërgime reale "TEST Claude", **të fshira** nga `contacts` + `admin_activity` |
| Analitika (Playwright, hit-et GA të bllokuara) | 11/11: 1 klik = 1 ngjarje, pa PII, `G111` pas pëlqimit, 0 lead pas dështimit |
| axe WCAG 2.2 AA, 12 faqe × 1440/375 | 25 → 6 nyje; 6 të mbeturat = fals-pozitiv i verifikuar |
| Overflow 12 faqe × 320/375/390/768/1024/1440 | 0 |
| Lighthouse live (bazë, para publikimit) | mobile: kreu 61, `/cmimet` 64, `/contact` 73 · desktop kreu 96 |

## Kufizime të njohura

- **Faza 6 (faqet e shërbimeve) e bllokuar** derisa pronari të japë faktet (Q-05): hosting, domain, pronësia, rishikimet, platformat.
- **Performanca mobile e pandryshuar**; pret zgjedhjen A/B (Q-08). Ndryshimet e këtij auditimi janë neutrale në JS (+1 kB).
- **Para pëlqimit GA dërgon ping-e pa cookies** (Consent Mode "advanced"): pyetje ligjore (Q-13).
- **`www` → apex është ende 307** derisa pronari ta ndryshojë në Vercel (F5-1).
- **Premtimi "monitorim automatik 24/7"** kërkon që pronari të hapë UptimeRobot **para merge-it**.
- **Klientët që e kanë parë SEO+Ads me €149** do të shohin €189: vendim i pronarit (opsioni A).
- Email-i i konfirmimit në anglisht u verifikua me test, jo duke hapur inbox-in.
- Tastiera virtuale e telefonit (a mbulon butonin) s'u testua në pajisje reale.

## Para merge-it

1. Pronari teston preview-t (fazat 1–3 janë tashmë në GitHub; të tjerat pas push-it të miratuar).
2. UptimeRobot aktiv (Q-01).
3. `npm run lint && npx tsc --noEmit && npm test && npm run build` në degën e fundit.
4. Merge i degës së fundit në `main` (përmban të gjitha fazat), pas miratimit të qartë.

## Pas publikimit

1. Live: kreu, `/cmimet` (SEO+Ads €189…), `/contact` (një dërgim testues, pastaj fshirje), `/en`.
2. Console pa gabime; `curl -I` për `/admin/login` (noindex), `/work` (308), `/sitemap.xml`.
3. GA4 → Admin → Events: shëno `generate_lead` dhe `contact_click` si **Key events** (F4-3).
4. Lighthouse mobile në të njëjtat 3 faqe për krahasim me bazën më lart.

## Rikthimi (rollback)

- **Më e shpejta:** Vercel → Deployments → deploy-i i fundit para merge-it → **Promote to Production** (s'prek kodin).
- **Në kod:** `git revert -m 1 <merge-commit>` → push në `main`.
- Asnjë migrim databaze s'u bë; vlerat e reja të buxhetit ruhen si tekst, kontaktet e vjetra vlerësohen si më parë.
