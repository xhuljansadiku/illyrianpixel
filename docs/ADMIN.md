# 📘 Dokumentacioni i Admin Panelit — Illyrian Pixel

> Udhëzues i plotë për panelin `/admin`. Kthehu këtu sa herë nuk kupton diçka.
> Përditësuar: Qershor 2026 (Admin v4).

---

## Përmbajtja

1. [Hyrja & Siguria](#1-hyrja--siguria)
2. [Struktura e panelit](#2-struktura-e-panelit)
3. [Tab: Përmbledhje](#3-tab-përmbledhje-)
4. [Tab: Kontaktet (CRM)](#4-tab-kontaktet-)
5. [Tab: Oferta & Fatura](#5-tab-oferta--fatura-)
6. [Faqja publike e ofertës](#6-faqja-publike-e-ofertës)
7. [Tab: Projektet](#7-tab-projektet-)
8. [Tab: Newsletter](#8-tab-newsletter-️)
9. [Tab: Blog](#9-tab-blog-)
10. [Tab: Përmbajtja](#10-tab-përmbajtja-)
11. [Tab: Analitika](#11-tab-analitika-)
12. [Tab: Cilësimet](#12-tab-cilësimet-️)
13. [Automatizimet (cron)](#13-automatizimet-cron-)
14. [Njoftimet Telegram](#14-njoftimet-telegram-)
15. [Variablat e mjedisit (env)](#15-variablat-e-mjedisit-env)
16. [Databaza — tabelat](#16-databaza--tabelat)
17. [Harta e skedarëve](#17-harta-e-skedarëve)
18. [Zgjidhja e problemeve](#18-zgjidhja-e-problemeve-)

---

## 1. Hyrja & Siguria

**URL:** `illyrianpixel.com/admin` → të çon te `/admin/login`.

| Mbrojtja | Si funksionon |
|---|---|
| Fjalëkalimi | Kontrollohet te `/api/admin/login`; krijon session cookie |
| 2FA (TOTP) | Opsionale — aktivizohet te **Cilësimet → 2FA**. Skano QR-në me Google Authenticator; pas kësaj login-i kërkon edhe kodin 6-shifror |
| Bllokim IP | Pas disa tentativave të dështuara, IP-ja bllokohet përkohësisht |
| Log hyrjesh | Çdo hyrje (e suksesshme ose jo) regjistrohet me IP e datë — i sheh te Cilësimet |
| Middleware | `middleware.ts` mbron `/admin/*` dhe `/api/admin/*`; pa cookie të vlefshme → redirect në login ose 401 |

**Dalja:** butoni "Dil" poshtë sidebar-it.

---

## 2. Struktura e panelit

- **Sidebar majtas** (desktop) — 9 tab-e me numërues. Paloset me butonin `«`. Në mobile bëhet rresht tab-esh horizontale.
- **Kërkimi global** 🔍 — lart në sidebar; kërkon njëkohësisht në kontakte, abonentë dhe artikuj blogu; klikimi të çon direkt aty.
- **Tema** ☀/☾ — light/dark mode, ruhet në browser.
- **Badge alarmi** 🔴 te "Kontaktet" — numri i kontakteve me follow-up të vonuar ose për sot.
- **Njoftime live** — çdo 45 sekonda paneli kontrollon për kontakte të reja; kur vjen një, del toast 🔔 + tingull.

---

## 3. Tab: Përmbledhje 🏠

Pamja e parë kur hap panelin: kontaktet më të fundit, statistika javore, hyrjet e fundit në admin. Klik mbi një kontakt → të çon te tab-i Kontaktet me atë të hapur.

---

## 4. Tab: Kontaktet 📇

CRM-ja kryesore. Çdo formular i plotësuar në faqe bëhet kontakt këtu.

### Statistikat lart
Kontakte gjithsej · kjo javë · subscriber-a · me kod zbritjeje + **grafik i kontakteve në kohë**.

### Kanban (drag & drop)
Tre kolona: **I ri → Në proces → Mbyllur**. Tërhiq kartën nga njëra kolonë te tjetra — statusi ruhet vetë dhe regjistrohet në historik.

### Për çdo kontakt mund të:
| Veprim | Shpjegim |
|---|---|
| 🏷 Tags | Etiketa të lira (p.sh. "i nxehtë", "referim") |
| 💶 Vlerë | Vlera e mundshme e projektit në € — përdoret në analitikë |
| 👤 Caktim | Kujt i është caktuar lead-i |
| 📅 Follow-up | Datë ndjekjeje — kur kalon, del alarm i kuq në sidebar + email kujtues çdo mëngjes |
| 📝 Shënime | Shënime private me historik |
| ✉️ Përgjigju | Email direkt nga paneli me 3 template: *Falënderim*, *Dërgim oferte*, *Follow-up i sjellshëm* — i brenduar automatikisht |
| 📱 WhatsApp | Hap bisedë direkt me numrin e kontaktit |
| 🔥 Lead score | Llogaritet vetë: i nxehtë / i ngrohtë / i ftohtë (bazuar në buxhet, afat, kod zbritjeje) |

### Eksporte
- **CSV** — të gjitha kontaktet me kolonat kryesore
- **Raport mujor PDF** — statistika + lista e kontakteve të muajit (hap dritare printimi)

---

## 5. Tab: Oferta & Fatura 🧾

Dy nën-seksione: **Dokumentet** dhe **🔁 Të rikurrueshme**.

### Dokumentet

**Krijimi:** buton "＋ Ofertë / Faturë e re".
- **Lloji:** Ofertë (numërohet OF-2026-001…) ose Faturë (FA-2026-001…) — numri jepet vetë
- **⚡ Nga shablloni…** — dropdown që mbush artikujt + shënimet me një klik. 5 shabllone të gatshme: Website Premium, Dyqan Online, SEO Mujore, Mirëmbajtje Mujore, Branding & Logo. *Çmimet e shablloneve ndryshohen te `lib/quoteTemplates.ts`.*
- **Plotëso nga kontakti** — zgjedh kontaktin dhe emri/email/biznesi mbushen vetë
- Artikuj me sasi e çmim, zbritje (€), TVSH (%), datë lëshimi, afat, shënime

**Statuset:** `Draft → Dërguar → Pranuar / Refuzuar → Paguar` — i ndryshon me dropdown-in te çdo kartë.

**Butonat te çdo dokument:**
| Buton | Çfarë bën |
|---|---|
| 🖨 PDF | Hap version printimi të pastër (Save as PDF nga browser-i) |
| ✉️ Dërgo me email | I dërgon klientit email të brenduar me tabelën e plotë + buton "Shiko & prano ofertën". Statusi Draft → Dërguar |
| 🔗 Lidhja publike | Kopjon linkun `illyrianpixel.com/oferta/[token]` — dërgoje me WhatsApp nëse klienti s'ka email |
| Edito / Fshi | Vetëkuptohet |

**Badge 👁 "Parë":** kur klienti hap lidhjen publike, te dokumenti del *"👁 Parë 2× · 11/06 21:30"*. **Ky është sinjali për t'i rënë në telefon** — klienti po e shqyrton ofertën pikërisht atëherë.

### 🔁 Të rikurrueshme

Për klientët me **mirëmbajtje mujore**: krijon një "profil fature" me artikuj + ditën e muajit (1–28). Çdo muaj, atë ditë, **fatura krijohet dhe i dërgohet klientit vetë** — ti s'bën asgjë.

- Lart sheh **totalin mujor të të ardhurave rekurente**
- ⏸ Ndalo / ▶ Aktivizo — pa e fshirë profilin
- Fatura e gjeneruar shfaqet normalisht te "Dokumentet" (me afat pagese +14 ditë)

---

## 6. Faqja publike e ofertës

**URL:** `illyrianpixel.com/oferta/[token]` — token unik për çdo dokument, i pamundur për t'u gjetur me hamendje.

**Çfarë sheh klienti:** ofertën e plotë të brenduar (artikuj, totale, shënime) + dy butona:
- **"Pranoj ofertën ✓"** → statusi bëhet *Pranuar*, ty të vjen email + Telegram 💰
- **"Refuzoj"** → i kërkohet arsyeja (opsionale), statusi bëhet *Refuzuar*, ty të vjen njoftim

Pas përgjigjes, butonat zhduken — klienti s'mund ta ndryshojë përgjigjen (anti-dyklikim). Faturat shfaqen vetëm për lexim, pa butona pranimi.

Faqja është `noindex` — nuk del në Google.

---

## 7. Tab: Projektet 📁

Ndjekja e punës pas mbylljes së shitjes.

- **5 fazat** shfaqen si pilula të klikueshme: `Zbulim → Dizajn → Zhvillim → Rishikim → Lansim`. Kliko fazën ku ndodhesh — të mëparshmet marrin ✓.
- **Statuset:** Aktiv / Në pauzë / Përfunduar (dropdown).
- **Detyrat:** checklist me checkbox — shkruaj te "＋ Detyrë e re…" dhe shtyp **Enter**. Progres-bar ari tregon % e kryer.
- **Afati** i projektit + lidhje me kontaktin (opsionale).

---

## 8. Tab: Newsletter ✉️

- **Abonentët:** lista me kërkim, ç'regjistrim manual, eksport CSV.
- **Broadcast:** shkruan subjekt + përmbajtje → u dërgohet të gjithë abonentëve aktivë me dizajnin e brendit.
- **Statistikat për çdo broadcast:** sa u dërguan, **sa e hapën** (unike), **sa klikuan** — gjurmimi bëhet me pixel + redirect linqesh.

---

## 9. Tab: Blog 📝

- Krijim/editim artikujsh direkt nga paneli (titull, kategori, përmbledhje, paragrafë).
- **Publikim i planifikuar:** cakto datë në të ardhmen → artikulli publikohet **vetë** atë mëngjes (cron-i i automatizimeve).
- Artikujt e vjetër statikë (të shkruar në kod) shfaqen krahas atyre nga databaza, me shenjë dalluese.

---

## 10. Tab: Përmbajtja 🎨

Gjithçka këtu del **live në faqe pa deploy** (faqja rifreskohet brenda ~5 minutash).

| Seksion | Çfarë menaxhon |
|---|---|
| 💬 Testimoniale | Citim, emër, kompani, rezultat, logo. Fshih/shfaq, rendit |
| 🖼️ Portofoli | Projekte me **upload fotoje**, kategori, tags, link live |
| 💶 Çmimet | Mbishkruan çmimet e paketave të faqes `/cmimet` — vendos çmim të ri ose shënim ("nga €X"), pa prekur kodin |
| ❓ FAQ | Pyetjet e seksionit FAQ në faqen kryesore. Shto/edito/fshih, rendit me ↑↓. Rresht i ri në përgjigje = paragraf i ri |

> ℹ️ Nëse tabela FAQ në databazë është bosh, faqja tregon 6 pyetjet e vjetra të ngulitura në kod (fallback).

---

## 11. Tab: Analitika 📊

- **Funnel-i (30 ditët e fundit):** Vizitorë → Kontakte → Oferta të dërguara → Fituar. Sheh saktësisht ku po humbet njerëz.
- Norma e konvertimit, ditë mesatare deri në mbyllje të lead-it.
- Shërbimet më të kërkuara + burimet e kontakteve (nga cila faqe erdhën — `source_path`).
- Vizitorët numërohen nga `PageViewTracker` (pa cookies, pa GDPR-problem).

---

## 12. Tab: Cilësimet ⚙️

| Karta | Çfarë kontrollon |
|---|---|
| **Cilësime të faqes** | Kodi i zbritjes së newsletter-it (default `ILLYRIAN10`) + numri WhatsApp — përdoren në email-e |
| **Popup exit-intent** | Ndiz/fik me checkbox + 4 tekstet (mbititull, titull, tekst, CTA). Popup-i del kur vizitori çon mausin të mbyllë faqen, **një herë për sesion**, pas të paktën 5 sekondash në faqe. Ndryshimet hyjnë në fuqi brenda ~5 min (cache) |
| **2FA** | Aktivizim/çaktivizim me QR + kod verifikimi |
| **Hyrjet në admin** | 20 hyrjet e fundit me IP e status |

---

## 13. Automatizimet (cron) 🤖

Dy cron-e në Vercel (maksimumi i planit Hobby), të dyja çdo mëngjes:

### `/api/cron/daily-automations` — ora 5:00 UTC
| # | Çfarë bën | Rregullat |
|---|---|---|
| 1 | **Publikon artikujt** e planifikuar | Të gjithë me `scheduled_for` ≤ tani |
| 2 | **Kujtues ofertash** — email i sjellshëm klientit që s'ka përgjigjur | Vetëm oferta *Dërguar* me email; **max 2 kujtues**, jo më shpesh se çdo **3 ditë** |
| 3 | **Kujtues pagese** — për fatura të vonuara | Vetëm fatura *Dërguar* me afat të kaluar; **max 3 kujtues**, çdo **4 ditë** |
| 4 | **Gjeneron faturat e rikurruese** | Ato aktive që u ka ardhur dita e muajit dhe s'janë gjeneruar këtë muaj; dërgohen vetë me email |
| 5 | **Përmbledhje për ty** | Email "Përmbledhja e automatizimeve" — **vetëm kur ka ndodhur diçka** (s'të mbush inbox-in kot) |

### `/api/cron/follow-up-reminders` — ora 6:00 UTC
Të dërgon listën e kontakteve me follow-up për sot/nesër (ato që s'janë mbyllur ende).

> ⚠️ Cron-et thirren nga Vercel me `Authorization: Bearer CRON_SECRET`. Pa këtë env var, kthejnë 401.
> ℹ️ Route-i i vjetër `/api/cron/publish-scheduled` ekziston ende por **s'thirret më** — publikimi bëhet nga daily-automations.

---

## 14. Njoftimet Telegram 📱

Mesazh instant në telefonin tënd për:
- **📥 Kontakt i ri** — emri, biznesi, shërbimi, buxheti, telefoni, mesazhi (🔥 PRIORITET për buxhete të larta)
- **💰 Oferta u pranua / ✖️ u refuzua** — me numrin, klientin, vlerën dhe shënimin

### Konfigurimi (një herë, 5 minuta)
1. Hap **@BotFather** në Telegram → `/newbot` → jepi emër → **kopjo token-in**
2. Dërgoi botit tënd të ri një mesazh çfarëdo (p.sh. "hi")
3. Hap në browser: `https://api.telegram.org/bot<TOKEN>/getUpdates` → gjej `"chat":{"id":123456789}` — ky është **chat ID**
4. Në **Vercel → Settings → Environment Variables** shto të dyja (shih tabelën më poshtë) dhe bëj redeploy

Pa këto, gjithçka punon normalisht — thjesht s'vijnë njoftimet. Telegram-i është *best-effort*: po dështoi, asgjë s'bllokohet.

---

## 15. Variablat e mjedisit (env)

| Variabla | Detyrueshme | Përdorimi |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Lidhja me databazën |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Çelësi i serverit (mos e ekspozo kurrë në klient!) |
| `RESEND_API_KEY` | ✅ | Dërgimi i të gjithë email-eve |
| `CONTACT_TO_EMAIL` | ✅ | Ku të vijnë njoftimet (email-i yt) |
| `CRON_SECRET` | ✅ | Autorizimi i cron-eve të Vercel |
| `TELEGRAM_BOT_TOKEN` | opsionale | Njoftimet Telegram |
| `TELEGRAM_CHAT_ID` | opsionale | Njoftimet Telegram |

---

## 16. Databaza — tabelat

Migrimet janë te `supabase/migrations/` — ekzekutohen **një herë** në Supabase SQL Editor (janë të riekzekutueshme pa dëm).

| Tabela | Çfarë mban |
|---|---|
| `contacts` | Lead-et nga formulari + statusi, tags, vlera, follow-up |
| `contact_logs` / `contact_notes` | Historiku i veprimeve dhe shënimet |
| `quotes` | Ofertat & faturat — përfshirë `public_token`, `viewed_at`, `view_count`, `reminders_sent` |
| `recurring_invoices` | Profilet e faturave mujore |
| `projects` / `project_tasks` | Projektet me fazat + detyrat |
| `faqs` | Pyetjet e faqes kryesore |
| `testimonials` / `portfolio_items` / `pricing_overrides` | Përmbajtja e menaxhueshme |
| `blog_posts` | Artikujt e blogut nga paneli |
| `newsletter_subscribers` / `newsletter_broadcasts` / `newsletter_events` | Newsletter + statistikat open/click |
| `site_settings` | Çifte key/value: kodi i zbritjes, WhatsApp, popup_* |
| `admin_logins` / `rate_limits` | Siguria |
| `page_views` | Numërimi i vizitorëve |

Të gjitha tabelat kanë **RLS "service role only"** — qasen vetëm nga serveri, kurrë direkt nga browser-i.

---

## 17. Harta e skedarëve

```
app/
  admin/page.tsx                  ← ngarkon të gjitha të dhënat, i jep AdminDashboard-it
  oferta/[token]/page.tsx         ← faqja publike e ofertës (+ regjistron shikimin)
  api/
    admin/...                     ← API-të e panelit (të mbrojtura nga middleware)
      quotes/ recurring/ projects/ project-tasks/ faqs/
      testimonials/ portfolio/ pricing/ contacts/ blog/
      settings/ 2fa/ login/ logout/
    oferta/[token]/route.ts       ← pranimi/refuzimi publik i ofertës
    popup/route.ts                ← cilësimet publike të popup-it
    contact/route.ts              ← formulari publik (+ Telegram + email-e)
    cron/daily-automations/       ← automatizimet ditore
    cron/follow-up-reminders/     ← kujtuesit e follow-up-eve

components/
  AdminDashboard.tsx              ← korniza: sidebar, tabs, Overview/Contacts/
                                     Subscribers/Blog/Analytics/Settings
  admin/QuotesTab.tsx             ← oferta & fatura + shabllonet + lidhja publike
  admin/RecurringInvoices.tsx     ← faturat e rikurruese
  admin/ProjectsTab.tsx           ← projektet & detyrat
  admin/ContentTab.tsx            ← testimoniale / portofol / çmime / FAQ
  admin/FaqManager.tsx            ← menaxheri i FAQ-ve
  QuotePublicView.tsx             ← pamja publike e ofertës
  ExitIntentPopup.tsx             ← popup-i (lexon /api/popup)
  FAQ.tsx                         ← FAQ publike (DB + fallback)

lib/
  quotes.ts                       ← tipet + llogaritjet e ofertave
  quotesServer.ts                 ← krijimi i ofertës me numër automatik
  quoteTemplates.ts               ← ⚡ SHABLLONET — ndrysho çmimet këtu
  adminEmails.ts                  ← të gjitha template-t e email-eve
  projects.ts                     ← tipet e projekteve
  telegram.ts                     ← njoftimet Telegram
  siteSettings.ts                 ← leximi i site_settings (+ defaults)
  publicContent.ts                ← leximi publik (testimoniale, FAQ, çmime)
  leadScore.ts                    ← llogaritja e lead score
  totp.ts                         ← 2FA

supabase/migrations/              ← SQL-të — ekzekuto në Supabase SQL Editor
vercel.json                       ← cron-et + redirects + headers
middleware.ts                     ← mbrojtja e /admin dhe /api/admin
```

---

## 18. Zgjidhja e problemeve 🔧

| Problemi | Shkaku më i mundshëm | Zgjidhja |
|---|---|---|
| Tab-et Projektet / Të rikurrueshme / FAQ janë **bosh** ose japin gabim | Migrimi v4 s'është ekzekutuar | Ekzekuto `supabase/migrations/20260611_admin_v4_features.sql` në Supabase SQL Editor |
| Lidhja publike e ofertës thotë "nuk është e vlefshme" | Migrimi s'është ekzekutuar (mungon `public_token`) ose dokumenti u fshi | Ekzekuto migrimin; kontrollo që dokumenti ekziston |
| Email-et s'shkojnë | `RESEND_API_KEY` mungon/skadoi, ose klienti s'ka email | Kontrollo env në Vercel + fushën email të klientit |
| Njoftimet Telegram s'vijnë | Env vars mungojnë ose chat ID i gabuar | Rishiko hapat te [seksioni 14](#14-njoftimet-telegram-); testo URL-në getUpdates |
| Popup-i s'po ndryshon pas editimit | Cache 5-minutëshe e `/api/popup` | Prit 5 min; gjithashtu popup-i del vetëm 1 herë për sesion — hap dritare incognito për test |
| FAQ / testimonialet e reja s'dalin në faqe | Cache e faqes (revalidate 300s) | Prit deri në 5 min |
| Kujtuesit automatikë s'po dërgohen | `CRON_SECRET` mungon, ose oferta s'është në statusin *Dërguar*, ose s'kanë kaluar 3 ditë | Kontrollo env; kujtuesit dërgohen vetëm për statusin "Dërguar" me email klienti |
| Fatura e rikurruese s'u gjenerua | Profili është ⏸ i ndalur, ose dita e muajit s'ka ardhur ende, ose u gjenerua tashmë këtë muaj | Kontrollo kolonën "e fundit: YYYY-MM" te karta |
| "Parë nga klienti" s'po shfaqet | Klienti s'e ka hapur lidhjen ende, ose migrimi pa seksionin 5 | Ekzekuto migrimin e plotë v4 |
| U bllokova nga 2FA / humba telefonin | Kodet janë në tabelën e DB-së | Në Supabase: `update site_settings ...` ose fshi rreshtin e 2FA te tabela përkatëse — pastaj hyr vetëm me fjalëkalim |
| Vercel ankohet për cron-et | Plani Hobby lejon vetëm 2 cron-e | Tashmë jemi në 2 — mos shto të tretin pa upgrade |

---

*Gjeneruar me Claude Code · Qershor 2026*
