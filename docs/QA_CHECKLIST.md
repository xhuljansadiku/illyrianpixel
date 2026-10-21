# Lista e kontrollit QA

> Përdoret para çdo merge në `main`. Shëno `[x]` vetëm pasi testi është **ekzekutuar**,
> dhe shkruaj datën ose rezultatin. Një test që dështon hetohet, nuk fshihet.

## 1. Kontrollet statike (çdo fazë)

- [ ] `npx next lint`: 0 gabime (Vercel bie nga lint-i)
- [ ] `npx tsc --noEmit`: 0 gabime
- [ ] `npm test`: të gjitha kalojnë
- [ ] `npm run build`: sukses
- [ ] `node scripts/check-static.mjs`: faqet marketing mbeten statike
- [ ] Preview në Vercel hapet pa gabime në console

Baza 2026-10-21: lint ✅ · tsc ✅ · 101/101 teste ✅ · build ✅.

## 2. Formulari i kontaktit (`/contact`, sq + en)

Ekzekutuar 2026-10-21 (Faza 3): `app/api/contact/route.test.ts` (12 teste, mock-e, pa prodhim) +
Playwright 1.62 kundër `next start` lokal me 2 dërgime **reale** "TEST Claude" (sq desktop, en mobile),
të fshira pas testit nga `contacts` dhe `admin_activity`.

| # | Rasti | Pritet | Rezultati |
|---|---|---|---|
| 1 | Dërgim i vlefshëm | Mesazh suksesi; rresht në `contacts`; email te admini + konfirmim te klienti; `generate_lead` vetëm pas pëlqimit | ✅ 200 sq + en reale; rreshti me telefon/buxhet/afat bosh kur s'zgjidhen; konfirmimi EN/SQ sipas `sourcePath` (test) |
| 2 | Fushë e detyrueshme bosh | Gabim i qartë pranë fushës; asgjë s'dërgohet | ✅ butoni joaktiv (shfletues); 400 për emër/email/mesazh bosh (test) |
| 3 | Email i pavlefshëm | 400 nga serveri; mesazh gabimi | ✅ butoni joaktiv; 400 nga serveri |
| 4 | Gabim në DB (500) | Mesazh gabimi; **asnjë** mesazh suksesi; asnjë `generate_lead` | ✅ 500 + `success:false`; në shfletues `role="alert"`, pa sukses. Edhe rrjeti që bie → "Nuk u dërgua" |
| 5 | Resend dështon | Kontakti ruhet; suksesi shfaqet (projektuar kështu: lead-i s'humbet) | ✅ (test) |
| 6 | Spam / honeypot `website` i mbushur | `success: true` i rremë; asnjë rresht në DB | ✅ (test) |
| 7 | Dërgim i dyfishtë (klik i shpejtë ×2) | Butoni çaktivizohet gjatë dërgimit; 1 rresht | ✅ dblclick → 1 POST |
| 8 | Vetëm tastierë | Tab rendit fushat logjikisht; fokusi i dukshëm; Enter dërgon | ✅ radha emër → email → telefon → biznes → shërbim → buxhet → afat; kufi ari në fokus; dropdown me Enter/↓/Enter |
| 9 | Mobile 375px | Pa scroll horizontal; tastiera s'mbulon butonin | ✅ 320/375/390px pa overflow; butoni 51px i lartë. Mbulimi nga tastiera virtuale **s'u testua** (s'ka pajisje reale) |
| 10 | Konfirmimi | Mesazhi i suksesit lexohet nga screen reader (`role="status"` / `aria-live`) | ✅ `role="status"` te suksesi, `role="alert"` te gabimi (shtuar në Fazën 3) |
| 11 | Rate limit (4 dërgime/orë) | 429 + mesazh i qartë | ✅ (test) |

## 3. Ekranet (rrugët kryesore: `/`, `/cmimet`, `/contact`, `/services/website`, `/projektet`)

| Gjerësia | Pa scroll horizontal | Navigimi punon | CTA e dukshme | Rezultati |
|---|---|---|---|---|
| 320px | | | | |
| 375px | | | | |
| 390px | | | | |
| 768px | | | | |
| 1024px | | | | |
| 1440px | | | | |

## 4. Aksesueshmëria

- [ ] Skip link "Kalo te përmbajtja" punon
- [ ] Menuja mobile: hapet/mbyllet me tastierë; Esc e mbyll; fokusi kthehet te butoni
- [ ] Modalet (newsletter, exit-intent, King Genti): fokusi brenda; Esc mbyll
- [ ] Fokusi i dukshëm në çdo element interaktiv
- [ ] Kontrasti AA te butonat ari dhe teksti i zbehtë (`text-white/45` etj.)
- [ ] Një `<h1>` për faqe; hierarki logjike e titujve
- [ ] `prefers-reduced-motion`: animacionet ndalen ose zbuten
- [ ] Zmadhim 200%: asnjë përmbajtje e prerë
- [ ] Skanim axe pa probleme kritike

> Skanimi automatik nuk vërteton përputhshmëri të plotë me WCAG.

## 5. SEO (pas çdo ndryshimi teksti ose rruge)

- [ ] Çdo URL e sitemap-it kthen 200 (crawl)
- [ ] Canonical = URL e vetë faqes; hreflang reciprok sq ↔ en
- [ ] `<html lang>` korrekt (`sq` / `en`)
- [ ] Titujt dhe përshkrimet unikë
- [ ] Schema validohet (Rich Results Test); asnjë vlerësim, adresë ose çmim i rremë
- [ ] Ridrejtimet e vjetra (`/work`, `/services/websites` …) japin ende 308

## 6. Pëlqimi dhe analitika

- [ ] Para pëlqimit: s'ka `_ga` ose cookies të Clarity; `gcs=G100`
- [ ] Pas pranimit: `gcs=G111`; ngjarjet arrijnë në GA4 DebugView
- [ ] Pas refuzimit: asnjë cookie analitike
- [ ] Pëlqimi mund të ndryshohet më vonë (lidhja në footer)
- [ ] Asnjë ngjarje s'përmban emër, email ose telefon
- [ ] Forma e dështuar s'regjistron `generate_lead`
- [ ] Çdo ngjarje fiket një herë për veprim

## 7. Çmimet (pas Fazës 2)

- [ ] I njëjti çmim për të njëjtën paketë në `/cmimet`, faqet e shërbimeve, kartat, FAQ, King Genti, blog
- [ ] Ndryshimi i çmimit nga admini shfaqet kudo
- [ ] Testet e kalkulatorit kalojnë me vlera të llogaritura veçmas
- [ ] Njëherëshe kundrejt mujore: e qartë në çdo kartë

## 8. Para publikimit

- [ ] Diff-i i fundit i rishikuar; dega e saktë
- [ ] Variablat e mjedisit në Vercel ekzistojnë (pa i shfaqur vlerat)
- [ ] Miratimi i pronarit për merge
- [ ] Pas deploy: kreu, `/contact` (dërgim real testues), `/cmimet`, `/en` live; console pa gabime
- [ ] Rikthimi: `git revert <merge-commit>` + push, ose "Promote" i deploy-it të mëparshëm në Vercel
