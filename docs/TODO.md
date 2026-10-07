# 🗺 TODO / Roadmap — Illyrian Pixel

> Lista e veçorive për të ardhmen. **Rregulli i artë:** shto një veçori vetëm kur
> të ka bezdisur e njëjta gjë manualisht 5+ herë — jo se "do ishte mirë ta kishim".
> Përditësuar: Qershor 2026.

---

## PJESA 1 — Admin Paneli (e ardhmja e afërt)

### 💰 Prioritet i lartë — sjellin para direkt

- [ ] **Pagesa online në faqen e ofertës** (Stripe ose Paddle)
  Klienti pranon ofertën dhe paguan paradhënien 50% aty për aty me kartë.
  E mbyll shitjen në momentin e entuziazmit, pa pritur transfertë bankare.
  *Madhësia: e mesme · Kërkon: llogari Stripe/Paddle + webhook + status "paguar pjesërisht"*

- [ ] **Sekuenca follow-up automatike për lead-et**
  Kontakt i ri → pas 1 dite "a keni pyetje?" → pas 4 ditësh rast studimi →
  pas 7 ditësh oferta e fundit. Lead-et e ftohta ngrohen vetë.
  *Madhësia: e mesme · Shfrytëzon: cron-in ekzistues daily-automations + tabelë sekuencash*

- [ ] **Recension në Google pas pagesës**
  Kur fatura bëhet "Paguar" → pas 3 ditësh email automatik klientit me link
  direkt për review në Google Maps. Çdo review = lead-e të reja falas.
  *Madhësia: e vogël*

- [ ] **Email falënderimi kur fatura bëhet "Paguar"**
  Konfirmim pagese + falënderim automatik. Profesionale, zero përpjekje.
  *Madhësia: shumë e vogël*

### 📈 Marketing & konvertim

- [ ] **UTM tracking i plotë**
  Të shohësh në Analitikë cilat fushata (Instagram, Google Ads, organik)
  sjellin lead-et që *paguajnë*, jo vetëm që klikojnë.
  *Madhësia: e vogël · Shfrytëzon: source_path ekzistues + parametrat utm_**

- [ ] **A/B test i popup-it dhe CTA-ve**
  Dy variante teksti, paneli tregon cili konverton më shumë.
  *Madhësia: e mesme*

- [ ] **Llogaritës çmimi publik i lidhur me CRM**
  Vizitori zgjedh çfarë do (website + SEO + logo), sheh çmim orientues,
  dërgohet si lead me vlerë të parallogaritur.
  *Madhësia: e mesme · Ekziston PriceEstimator — duhet lidhur me /api/contact*

### 🛠 Cilësi jete në panel

- [ ] **Shabllon detyrash për projekte manuale**
  Buton "Mbush me detyrat standarde" te projekti i ri (auto-krijimi e ka tashmë).
  *Madhësia: shumë e vogël*

- [ ] **Email inbox i integruar**
  Përgjigjet e klientëve ndaj email-eve të tua të shfaqen brenda kontaktit
  (Resend inbound webhooks), jo vetëm në Gmail.
  *Madhësia: e madhe*

- [ ] **Kontrata me nënshkrim elektronik**
  Pas pranimit të ofertës → kontrata nga template → klienti e nënshkruan online
  (në të njëjtën faqe publike si oferta).
  *Madhësia: e madhe*

- [ ] **Backup automatik javor i databazës**
  Eksport CSV/SQL i tabelave kryesore çdo javë me email ose në storage.
  *Madhësia: e vogël · Shfrytëzon: cron-in ekzistues*

- [ ] **Statistika të ardhurash mujore në Analitikë**
  Grafik: të ardhurat e faturuara/paguara muaj pas muaji + rekurrentet.
  *Madhësia: e vogël · Të dhënat ekzistojnë te quotes*

### 🤖 Me AI (Claude API)

- [ ] **Draft automatik përgjigjesh për kontakte**
  Lead i ri → AI lexon mesazhin → përgatit draft të personalizuar →
  ti vetëm e rishikon dhe e dërgon nga paneli.
  *Madhësia: e mesme*

- [ ] **Gjenerator artikujsh blogu**
  Jep temën → merr draft të plotë SEO në shqip direkt te tab-i Blog.
  *Madhësia: e mesme*

- [ ] **Përmbledhje javore inteligjente**
  Çdo të hënë email: "Javën e kaluar: X lead-e, Y oferta, Z € të faturuara.
  Lead-et që duhen ndjekur sot: …" — e shkruar nga AI me kontekst.
  *Madhësia: e vogël-mesme*

---

## PJESA 2 — Dashboard për punonjësit (kur të ketë ekip)

> Sot paneli ka 1 përdorues (ti) me 1 fjalëkalim. Kur të vijë punonjësi i parë,
> këto duhen bërë **me këtë radhë** — pa pikën 1 asgjë tjetër s'ka kuptim.

### Faza A — Themelet (bëhen të parat, bashkë)

- [ ] **Llogari individuale për çdo punonjës**
  Tabela `users` (emër, email, fjalëkalim i hash-uar, rol, aktiv) +
  login me email/fjalëkalim në vend të fjalëkalimit të vetëm.
  2FA opsionale për secilin.
  *Madhësia: e madhe · Themeli i gjithçkaje më poshtë*

- [ ] **Role & leje**
  - **Admin (ti):** sheh gjithçka — para, cilësime, fshirje
  - **Menaxher:** kontakte + oferta + projekte, pa cilësimet
  - **Punonjës:** vetëm projektet/detyrat e veta + kontaktet e caktuara
  - Punonjësit NUK shohin: të ardhurat totale, cilësimet, listën e plotë të lead-eve
  *Madhësia: e mesme (pasi ekziston tabela users)*

- [ ] **Gjurmë auditimi (audit log)**
  Kush bëri çfarë: "Aldo ndryshoi statusin e OF-2026-014 → Paguar, 14:32".
  Ekziston gjysmë (contact_logs) — zgjerohet me user_id + për oferta/projekte.
  *Madhësia: e vogël-mesme*

### Faza B — Puna e përditshme e punonjësit

- [ ] **"Detyrat e mia" — pamja kryesore e punonjësit**
  Kur hap panelin, punonjësi sheh VETËM: detyrat e tij të sotme nëpër projekte,
  kontaktet e caktuara atij me follow-up sot, dhe asgjë tjetër.
  *Madhësia: e mesme*

- [ ] **Caktim detyrash me person**
  `project_tasks.assigned_to` → dropdown me punonjësit te çdo detyrë.
  Fusha `assigned_to` te kontaktet tashmë ekziston — lidhet me users.
  *Madhësia: e vogël*

- [ ] **Njoftime për punonjësit**
  "T'u caktua detyra X në projektin Y" — me email ose Telegram (bot i njëjtë,
  chat ID për secilin punonjës).
  *Madhësia: e vogël · Shfrytëzon: lib/telegram.ts ekzistues*

- [ ] **Komente te kontaktet & projektet**
  Diskutim i brendshëm: "@Aldo klienti kërkoi ndryshim logoje" — që muhabeti
  i punës të mos shpërndahet nëpër WhatsApp.
  *Madhësia: e mesme*

### Faza C — Menaxhimi i ekipit

- [ ] **Raport produktiviteti për punonjës**
  Sa detyra mbylli secili këtë javë/muaj, sa lead-e ktheu në klientë,
  koha mesatare e përgjigjes ndaj lead-it.
  *Madhësia: e mesme*

- [ ] **Regjistrim orësh pune për projekt (time tracking)**
  Start/stop te detyra ose orë manuale → sheh sa orë hëngri projekti real
  kundrejt çmimit të ofertës → çmime më të sakta në të ardhmen.
  *Madhësia: e mesme*

- [ ] **Kalendari i ekipit**
  Pamje javore: kush çfarë ka — afate projektesh, follow-up-e, pushime.
  *Madhësia: e mesme*

- [ ] **Caktim automatik i lead-eve (round-robin)**
  Lead i ri i caktohet vetë punonjësit të radhës (ose sipas shërbimit:
  SEO → X, dizajn → Y).
  *Madhësia: e vogël (pasi ka users)*

### Faza D — Më vonë, nëse rritet shumë

- [ ] Portal klienti i plotë (klienti sheh projektin e vet, faturat, dorëzimet)
- [ ] Chat i brendshëm i ekipit në panel
- [ ] Pagat/komisionet e punonjësve të llogaritura nga projektet e mbyllura
- [ ] Aplikacion mobile (ose thjesht PWA e panelit ekzistues)

---

## Si të përdoret kjo listë

1. Mos fillo asgjë nga Pjesa 2 para se të kesh punonjësin e parë real.
2. Nga Pjesa 1, zgjidh **një** veçori, mbaroje plotësisht, testoje, pastaj tjetrën.
3. Para çdo veçorie të re pyet: *"Sa herë më ka bezdisur kjo javën e kaluar?"*
   Nëse përgjigja është 0–2 herë → mos e bëj akoma.
4. Kur nis një pikë, shëno `[x]` dhe shto datën — kjo listë është historiku yt.

*Gjeneruar me Claude Code · Qershor 2026*
