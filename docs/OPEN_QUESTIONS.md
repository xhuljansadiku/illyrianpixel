# Pyetje të hapura për pronarin

> Përditësuar: 2026-10-21. Asnjë fakt biznesi nuk plotësohet me supozime.
> Kur jepet një përgjigje, shkruhet këtu me datën dhe detyra përkatëse zhbllokohet.

| ID | Pyetja | Blokon | Përgjigja |
|---|---|---|---|
| Q-01 | Monitor uptime + afati real i reagimit kur bie faqja e një klienti | F1-5, F6-6 | 2026-10-21: s'ka monitor → hapet UptimeRobot (falas). Afati i reagimit: **24 orë** ✅ |
| Q-02 | "Plan konkret brenda 24 orësh": a e mban realisht çdo herë? | F1-6 | 2026-10-21: plani / oferta → **24–48 orë** ✅ ("përgjigje brenda 24h" mbetet) |
| Q-03 | Çmimet e SEO / Google Ads | F2-1 | 2026-10-21 ✅ **Opsioni A**: SEO+Ads €189/379/599 |
| Q-04 | Telefoni në formularin e kontaktit: i detyrueshëm apo opsional? | F3-2 | 2026-10-21 ✅ **opsional**; gamat e buxhetit sipas paketave (zgjedhur nga Claude me leje) |
| Q-05 | Për çdo shërbim: përfshirjet, përjashtimet, rishikimet, pronësia e skedarëve dhe e kodit, kostot e palëve të treta | Faza 6 | ❓ Shih matricën më poshtë |
| Q-06 | Aplikacione mobile: cilat teknologji (React Native, Flutter…)? A është publikuar ndonjë app në store? | F6-7 | ❓ |
| Q-07 | Statusi i secilit nga 8 projektet (live / i përfunduar / në punë / koncept) | F7-1 | 2026-10-22 ✅ të dyja **në punë** (pa liveUrl, si tani) |
| Q-08 | Performanca mobile: opsioni A (75–85, më pak animacione vetëm në mobile) apo B (90+, shumicën e animacioneve jashtë)? | F8-1 | ❓ (në pritje që nga 2026-10-04) |
| Q-09 | Dëshmitë në Supabase: a janë të gjitha reale dhe me leje publikimi? | Faza 7 | 2026-10-22: **jo**, s'janë reale. Të fshehura në kod (të komentuara); 4 rreshtat në Supabase u fshehën (visible=false) me kërkesë të pronarit. Pronari po mbledh dëshmi reale |
| Q-10 | Link building "5–10" dhe "15–20 backlinks/muaj" te `/services/seo`: a ofrohet realisht? | F1, F2 | 2026-10-22 ✅ s'ofrohet si numër në muaj → numrat hequr (direktori lokale + lidhje nga partnerë/media "sipas mundësive") |
| Q-12 | Mirëmbajtja: Pro "përgjigje brenda 4h", Premium "përgjigje brenda 1h", "ndërhyrje teknike pa limit", "WAF, anti-DDoS": a i mban realisht? | F1-5, F6-6 | 2026-10-21 ✅: Pro → 24 orë; Premium → e njëjta ditë pune + deri 5 orë/muaj; DDoS/firewall "përmes Vercel ose Cloudflare" (disa faqe klientësh s'janë në Vercel → për Premium vendoset Cloudflare falas para fillimit) |
| Q-13 | Consent Mode "advanced": para pëlqimit gtag dërgon ping-e **pa cookies** (`gcs=G100`), p.sh. `page_view`, `contact_click`. Google e lejon dhe e përdor për modelim; disa autoritete në BE (p.sh. CNIL) e shohin si të diskutueshme. Mbetet kështu, apo kalojmë në "basic" (gtag ngarkohet vetëm pas pranimit, por humbet modelimi i konvertimeve)? **Pyetje për jurist, jo për Claude.** | Faza 9 | ❓ |
| Q-14 | Schema LocalBusiness: orari "E hënë–E premte 09:00–18:00" dhe `foundingDate: 2024`. A janë të sakta? (Premtimi i konfirmuar është takime online në mbrëmje / fundjavë.) | F5-5 | 2026-10-22: eksperiencë që nga 2020; orari s'u konfirmua → `foundingDate` dhe orari jashtë schema-s (të komentuara) |
| Q-15 | `/diaspora/shba-kanada`: "Dashboard i thjeshtë… Shihni dhe ndryshoni informacionin e biznesit vetë". A ofrohet vërtet një panel ku klienti ndryshon vetë përmbajtjen? (Portali `/klienti` tregon vetëm statusin e projektit.) | F7 | 2026-10-22: **jo** (për momentin) → zëvendësuar me "Ndryshimet i bëjmë ne, nga distanca" (me paketën e mirëmbajtjes) |
| Q-16 | Shiriti i besimit te faqet e shërbimeve dhe të diasporës thoshte **"6 vite eksperiencë · 100 projekte · 80 klientë besnikë"**. U zëvendësua (2026-10-22) me numra nga të dhënat: **8 projekte në portofol · 7 vende me klientë · 8 qytete**. A janë 6/100/80 të vërteta (p.sh. eksperienca jote para agjencisë)? Nëse po, rikthehen me një ndryshim te `lib/conversionLandingShared.ts` (vlerat e vjetra janë aty të komentuara). | Faza 9 | 2026-10-22: eksperiencë që nga 2020 → "6+ vite eksperiencë" rikthehet (llogaritur nga viti); projektet: ka më shumë se portofoli, numri real ❓ |
| Q-11 | Leje për deploy në prodhim (merge në `main`) | çdo fazë | Pyetet në fund të çdo faze |

---

## Q-01 — Rekomandimi për monitorin uptime

**UptimeRobot (plani falas).** Kontrollon çdo faqe klienti çdo 5 minuta dhe të njofton me email dhe push në aplikacionin e telefonit kur bie. Është i mjaftueshëm për fillim. Telegram dhe SMS mund të kërkojnë plan me pagesë, prandaj kontrollohet në faqen e tyre para se të premtohen.

Alternativa: **Better Stack** (plan falas me më pak monitorë, por kontroll më i shpeshtë).

Hapat (rreth 15 minuta, i bën pronari):
1. Krijo llogari në uptimerobot.com.
2. Shto një monitor HTTP(S) për çdo faqe klienti dhe për illyrianpixel.com.
3. Instalo aplikacionin në telefon dhe aktivizo njoftimet.

**Teksti i propozuar për faqen** (pasi monitori të jetë aktiv):
- ❌ "Monitorim 24/7 dhe reagim i menjëhershëm"
- ✅ "Monitorim automatik çdo 5 minuta — njoftohemi menjëherë nëse faqja bie, dhe reagojmë brenda **X orësh** në ditë pune."

X duhet ta vendosë pronari sipas orarit real. Duke pasur parasysh punën full-time, "brenda 24 orësh" ose "të njëjtën ditë pune" është i sigurt.

## Q-03 — Opsionet për çmimet SEO / Google Ads

**Gjendja sot (live):**

| Paketa | SEO vetëm (`/services/seo`) | Google Ads vetëm (`/services/google-ads`) | Shuma | SEO + Ads (`/cmimet`) |
|---|---|---|---|---|
| Starter / Basic | €99 | €120 | €219 | **€149** |
| Growth | €199 | €250 | €449 | **€249** |
| Pro | €299 | €400 | €699 | **€399** |

Problemi: paketa e kombinuar del 32–45% më lirë se të dyja veç e veç. Growth (€249, me SEO) kushton më pak se Ads vetëm (€250) me të njëjtat 2–3 fushata. Klienti që e vëren pyet "pse të marr Ads veç?". Në anën tjetër, €149/muaj për Ads + SEO paguan pak për punën mujore.

**Opsioni A (i rekomanduar): paketa e kombinuar = shuma − rreth 15%.** Çmimet veç e veç mbeten.

| Paketa | SEO | Ads | SEO + Ads |
|---|---|---|---|
| Starter | €99 | €120 | **€189** (kurse €30) |
| Growth | €199 | €250 | **€379** (kurse €70) |
| Pro | €299 | €400 | **€599** (kurse €100) |

Kursimi mund të shfaqet në kartë: një arsye e vërtetë për të zgjedhur paketën e kombinuar, pa çmime të rreme të vizatuara.

**Opsioni B: mbahen €149 / €249 / €399 te `/cmimet`, ulen paketat veç e veç.** Për shembull SEO €69/129/199 dhe Ads €89/159/249. Rrezik: të ardhura më të ulëta për të njëjtën punë.

**Opsioni C: mbahen të gjitha çmimet, por paketa e kombinuar bëhet "Lite".** Për shembull 1 fushatë + vetëm bazat e SEO në çdo nivel, që të mos jetë më e plotë se paketat veç e veç. Rrezik: të ndryshosh përmbajtjen e paketave pa ndryshuar çmimin është më e vështirë për t'u shpjeguar.

Shënim: më 2026-10-20 u vendos të priten 4–6 javë të dhëna (`pricing_goal`, `select_package`) para se të preken çmimet. Ky rast është **mospërputhje**, jo optimizim, prandaj zgjidhet tani. Ndryshimet bëhen vetëm me miratimin e pronarit.

## Q-05: Matrica e mungesave në faqet e shërbimeve (2026-10-22)

Kërkim me fjalë kyçe në tekstin e çdo faqeje (`lib/serviceCategories.sq.ts`, `lib/*ConversionContent.sq.ts`, faqet SEO/Ads). Matrica është e përafërt: ✅ = tema përmendet diku, — = s'u gjet.

| Faqja | hosting | domain | rishikime | pronësia | çfarë s'përfshihet | çfarë na duhet nga klienti | afati | procesi | platforma | kosto të palëve të treta | raportim |
|---|---|---|---|---|---|---|---|---|---|---|---|
| website | — | — | — | ✅ | — | — | — | ✅ | — | — | — |
| ecommerce | — | — | — | — | — | — | ✅ | ✅ | — | — | ✅ |
| seo (më vete) | — | ✅ | — | — | — | — | ✅ | — | ✅ | — | ✅ |
| google-ads (më vete) | — | — | — | — | ✅ | — | ✅ | — | ✅ | ✅ | ✅ |
| seo-google-ads | — | — | — | ✅ | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ |
| smm | — | — | — | — | — | — | ✅ | ✅ | ✅ | — | ✅ |
| branding-content | — | — | — | — | — | ✅ | — | ✅ | — | — | — |
| mirembajtja | — | — | — | — | ✅ | — | ✅ | ✅ | — | — | ✅ |
| aplikacione-mobile | — | — | — | — | — | — | ✅ | — | — | — | — |

**Përfundimi:** hosting-u, domain-i, rishikimet dhe pronësia **s'përmenden askund**. Pa këto, klienti s'e di çfarë paguan veç pas lansimit.

**Çfarë duhet nga pronari (një përgjigje për pikë mjafton):**
1. **Hosting + domain:** a përfshihen në çmimin e website-it / e-commerce? Kush paguan nga viti i 2-të, dhe sa afërsisht?
2. **Pronësia:** pas pagesës së plotë, a i merr klienti kodin, dizajnin dhe skedarët burim (logo .ai/.svg etj.)?
3. **Rishikimet:** sa raunde ndryshimesh për website, branding dhe postime SMM?
4. **E-commerce:** cila platformë (WooCommerce / Shopify / me porosi)? Abonimet mujore (Shopify, Stripe/PayPal fees) kush i paguan?
5. **SMM:** cilat platforma (Instagram, Facebook, TikTok, LinkedIn)? A përfshihet buxheti i reklamave të paguara? (Supozimi i sigurt: jo.)
6. **Aplikacione mobile:** teknologjia; tarifat e App Store ($99/vit) dhe Google Play ($25 një herë) i paguan klienti?
7. **Mirëmbajtja:** a vlen edhe për faqe të ndërtuara nga të tjerë (kartat thonë "po")? Çfarë ndodh me orët e papërdorura?

Kur të vijnë përgjigjet, shtohet një bllok i shkurtër "Përfshihet / S'përfshihet / Na duhet nga ju" në seksionin e paketave të çdo faqeje (pa faqe të reja).
