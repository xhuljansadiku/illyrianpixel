export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  date: string;
};

export const blogPosts: BlogPost[] = [
  // ── Artikujt e rinj (shfaqen të parët) ──────────────────────────
  {
    slug: "sa-kushton-website-kosove",
    title: "Sa kushton një website profesional në Kosovë në 2026?",
    category: "Web Design",
    excerpt: "Çmimet reale të website-ve në Kosovë (Prishtinë, Prizren, Pejë) për 2026.\nÇfarë përfshin një faqe profesionale dhe si e zgjidhni agjencinë e duhur, brenda apo jashtë Kosovës.",
    date: "Korrik 2026",
    content: [
      "Në Kosovë, pyetja 'sa kushton një website' merr shpesh përgjigje edhe më kontradiktore se në Shqipëri: nga 250 € te 4.000 € pa asnjë shpjegim se çfarë ndryshon mes ofertave. Tregu i web design-it në Prishtinë, Prizren apo Pejë është ende relativisht i vogël dhe i pastrukturuar, ndaj çmimet variojnë sipas përvojës së ofruesit, jo gjithmonë sipas cilësisë reale.",
      "Çmimi mesatar sipas llojit të faqes është i ngjashëm me tregun shqiptar, meqë shumica e agjencive serioze punojnë njëkohësisht me klientë në të dy vendet: faqe prezantuese (5–7 faqe) 400–800 €, website biznesi (10–20 faqe) 800–1.800 €, e-commerce (dyqan online) 1.200–4.000 €, landing page 200–500 €.",
      "Faktorët që ndikojnë çmimin janë të njëjtë kudo: kompleksiteti i dizajnit (template i modifikuar kundrejt dizajni origjinal), funksionet teknike (rezervime online, pagesa, integrime CRM), niveli i SEO-s dhe optimizimit, dhe kostot e vazhdueshme të mirëmbajtjes/hosting-ut (100–300 €/vit hosting, 50–200 €/muaj mirëmbajtje nëse zgjidhni kontratë).",
      "Pyetja që dëgjojmë shpesh nga klientët në Kosovë: 'a ka rëndësi nëse agjencia është nga Prishtina apo nga Tirana?' Përgjigja e ndershme: jo, për sa kohë procesi është plotësisht online (call-e video, WhatsApp, dokumente të dixhitalizuara) dhe agjencia ka portofol të dëshmuar me klientë konkretë nga Kosova, jo vetëm nga Shqipëria. Gjuha, monedha (euro në të dyja vendet) dhe kultura e biznesit janë praktikisht identike, ndaj distanca fizike s'është pengesë reale.",
      "Çfarë duhet të shmangni: oferta nën 250 € (zakonisht template i lirë pa SEO dhe pa mbështetje), kontrata pa specifikime të qarta të faqeve/funksioneve/afatit, dhe premtimet për 'renditje #1 në Google' brenda javësh, gjë që askush s'mund ta garantojë realisht.",
      "Kosova ka gjithashtu një audiencë specifike që Shqipëria e ka më pak të theksuar në po të njëjtën masë: diaspora e madhe në Zvicër dhe Gjermani që mban lidhje të forta biznesi me familjen dhe partnerët në Kosovë. Nëse keni klientë apo partnerë në diasporë, një website dygjuhësh (shqip + gjermanisht) e zgjeron ndjeshëm rrezen e biznesit tuaj që në fillim.",
      "Rekomandimi ynë praktik: mos zgjidhni bazuar vetëm në çmimin më të ulët apo vendndodhjen gjeografike të agjencisë. Kërkoni portofol me projekte reale (jo mockup), pyesni konkretisht se çfarë përfshin çmimi (SEO bazë? Mirëmbajtje? Trajnim?), dhe verifikoni a ka agjencia eksperiencë reale me biznese nga Kosova, jo thjesht një faqe të përkthyer nga shqipja e Shqipërisë."
    ]
  },
  {
    slug: "menaxho-biznesin-nga-diaspora",
    title: "Kam biznes në Shqipëri ose Kosovë, jetoj jashtë: si e menaxhoj online pa qenë atje",
    category: "Diasporë",
    excerpt: "Si e drejtoni një biznes në atdhe kur jetoni në Gjermani, Zvicër apo SHBA.\nWebsite si zyra juaj digjitale që punon edhe kur ju flini në një timezone tjetër.",
    date: "Korrik 2026",
    content: [
      "Mijëra shqiptarë e kosovarë jetojnë sot në Gjermani, Zvicër, Austri, SHBA apo Kanada, ndërsa biznesi i tyre, restoranti, dyqani, kompania e ndërtimit, mbetet në Shqipëri apo Kosovë. Sfida është e njëjtë për të gjithë: si e menaxhon një biznes kur je fizikisht 2.000 km larg, në një timezone tjetër, dhe s'mund të jesh atje çdo ditë për të mbikëqyrur gjithçka?",
      "Zgjidhja tradicionale ka qenë telefoni dhe një person besnik në vend, zakonisht familje, që përgjigjet për gjithçka. Kjo funksionon deri në një pikë, por ka limite reale: personi në Shqipëri nuk mund t'i përgjigjet çdo mesazhi Facebook në kohë reale, nuk di gjithmonë çmimet e sakta të përditësuara, dhe klientët e rinj shpesh dorëzohen para se të marrin përgjigje.",
      "Website-i i mirë-ndërtuar bëhet zyra juaj digjitale që punon 24/7, pavarësisht ku jeni ju apo çfarë ore është atje. Klienti në Tiranë sheh çmimet, shërbimet dhe orarin e saktë në orën 22:00 kur ju jeni në gjumë në Mynih. Nuk pret që dikush t'i përgjigjet, informacioni është aty, gati.",
      "Çfarë duhet të ketë realisht një website i tillë: faqe shërbimesh/çmimesh të qarta që s'kanë nevojë përditësim të shpeshtë manual, buton direkt WhatsApp që bie në telefonin tuaj kudo që jeni (jo në një numër lokal që dikush tjetër duhet ta mbajë), Google Maps dhe orari i saktë i biznesit në vend, dhe një panel administrimi aq i thjeshtë sa një person i besuar në Shqipëri mund të ngarkojë foto apo të ndryshojë një çmim vetë, pa ju pyetur çdo herë.",
      "Roli juaj nga jashtë ndryshon: nuk jeni më ai që përgjigjet çdo mesazhi, jeni ai që merr vendimet strategjike, ndërsa website-i dhe një person lokal me akses admin trajtojnë ditën-për-ditë. Shumë pronarë biznesesh në diasporë na thonë të njëjtën gjë: 'Website-i më dha kohën time mbrapsht, tani s'më duhet të jem në telefon çdo minutë.'",
      "Raportimi është pjesa që shpesh harrohet. Nëse jeni jashtë, doni të dini çfarë ndodh pa qenë atje: sa mesazhe kontakti vijnë në muaj, cilat shërbime kërkohen më shumë, nga cilat qytete apo vende po ju gjejnë klientët. Një panel i thjeshtë me këto numra ju jep kontroll real, pa pasur nevojë të thërrisni dikë për të pyetur 'si po shkon?'",
      "Nëse keni biznes në Shqipëri apo Kosovë dhe jetoni jashtë, pyetja e parë s'është 'a më duhet website', është 'sa para po humbas çdo javë sepse klientët nuk më gjejnë ose nuk marrin përgjigje kur unë flej'. Për shumicën e bizneseve që kemi ndihmuar në këtë situatë, përgjigja e asaj pyetjeje justifikon investimin brenda 2-3 muajve."
    ]
  },
  {
    slug: "website-dygjuhesh-biznes-diaspore",
    title: "Website dygjuhësh (shqip + gjuha e vendit): pse i duhet çdo biznesi shqiptar në diasporë",
    category: "Diasporë",
    excerpt: "Bizneset e hapura nga shqiptarë në Gjermani, Zvicër apo SHBA kanë dy audienca njëherësh.\nSi ndërton një website që flet të dyja gjuhët pa e ndarë besueshmërinë.",
    date: "Korrik 2026",
    content: [
      "Nëse keni hapur biznes në Gjermani, Zvicër, Austri apo SHBA, keni në fakt dy audienca njëherësh: klientët/partnerët vendas që presin një website profesional në gjuhën e tyre, dhe komunitetin shqiptar, klientë, punonjës, nënkontraktorë, që ju gjejnë dhe ju besojnë më shpejt kur website-i flet edhe shqip.",
      "Shumë biznese shqiptare në diasporë zgjidhin vetëm një gjuhë dhe humbasin gjysmën e mundësisë. Një kompani ndërtimi në Gjermani me website vetëm gjermanisht e ka të vështirë të tërheqë punonjës apo nënkontraktorë shqiptarë që e njohin cilësinë e punës shqiptare por parapëlqejnë të komunikojnë në gjuhën e tyre. Anasjelltas, një website vetëm shqip humbet besueshmërinë tek klientët gjermanë që presin standard lokal profesional.",
      "Zgjidhja e saktë nuk është një widget 'Google Translate' i ngjitur sipër faqes, përkthimet automatike janë të dukshme dhe ulin besueshmërinë menjëherë. Zgjidhja është strukturë e vërtetë dygjuhëshe: çdo faqe e përkthyer nga një njeri, URL të veçanta për secilën gjuhë (p.sh. domain.com dhe domain.com/en), dhe sinjalizim i qartë tek Google (hreflang) se cila faqe i shërben cilit vizitor.",
      "Rasti ynë konkret: e kemi ndërtuar këtë saktësisht për klientë si Hauswerk Niederbayern (kompani ndërtimi në Straubing, Gjermani) dhe Suli Group Trockenbau, biznese të themeluara nga shqiptarë që operojnë në tregun gjerman por kanë ekip dhe rrjet kontaktesh shqiptar. Website dygjuhësh u dha atyre kërkesa më të sakta nga të dyja anët, pa humbur kohë me telefonata për të sqaruar gjuhën.",
      "Çka duhet të përfshijë praktikisht: faqja kryesore dhe shërbimet plotësisht të përkthyera (jo vetëm titujt), numri i telefonit/WhatsApp funksional për të dyja audiencat, çmimet e paraqitura në monedhën e duhur për secilin treg (EUR për Gjermani/Zvicër, mund të shtohet CHF nëse jeni në Zvicër), dhe dëshmi/portofol që tregojnë cilësinë e punës në të dyja gjuhët.",
      "Përfitimi SEO është real: Google e indekson secilën gjuhë veç e veç, që do të thotë se rankoni njëkohësisht për kërkime gjermane/angleze (nga klientë vendas) dhe kërkime shqipe (nga komuniteti dhe familjet që kërkojnë 'firma ndërtimi shqiptare gjermani' apo të ngjashme). Një website vetëm-gjuhësh ju mbyll gjysmën e këtij trafiku që në start.",
      "Nëse biznesi juaj në diasporë ende ka website vetëm në një gjuhë, kjo është ndoshta arsyeja pse humbisni gjysmën e kërkesave që mund t'i kishit. Dygjuhësia e vërtetë (jo përkthim automatik) është investim i vogël krahasuar me numrin e klientëve që hapni prej saj."
    ]
  },
  {
    slug: "si-te-gjejne-klientet-shqiptare-biznesin-tend",
    title: "Si e gjejnë klientët shqiptarë biznesin tënd online, kudo që të jenë",
    category: "Diasporë",
    excerpt: "Shqiptarët në Shqipëri, Kosovë dhe diasporë kërkojnë ndryshe nga tregjet perëndimore.\nÇfarë duhet të dijë biznesi juaj për t'u gjetur nga e gjithë kjo audiencë e shpërndarë.",
    date: "Korrik 2026",
    content: [
      "Audienca shqiptare sot nuk është e përqendruar në një vend të vetëm. Është e ndarë mes Shqipërisë, Kosovës, dhe komuniteteve të mëdha në Gjermani, Zvicër, Itali, Belgjikë, SHBA e Kanada. Për një biznes që dëshiron t'i shërbejë kësaj audience, kjo do të thotë një gjë të rëndësishme: strategjia juaj online s'mund të mendohet vetëm 'për Shqipërinë' apo vetëm 'për diasporën', duhet të mbulojë të dyja.",
      "Shqiptarët kërkojnë shumë shpesh në gjuhën shqipe, pavarësisht se jetojnë në Mynih apo Toronto. Dikush në diasporë që kërkon 'avokat për çështje trashëgimie shqipëri' apo 'dërgesa parash shqipëri gjermani' e shkruan kërkimin në shqip, jo në gjermanisht. Bizneset që kanë përmbajtje shqip të mirë-optimizuar kapin këtë trafik që konkurrentët me website vetëm në gjuhë të huaj e humbasin plotësisht.",
      "Kanalet e komunikimit ndryshojnë nga tregjet perëndimore. WhatsApp është mbizotërues për kontakt direkt, edhe në diasporë. Grupet e Facebook (qytetare, profesionale, të diasporës në qytete specifike gjermane apo zvicerane) janë burim i fortë referimi. Google Maps/Business Profile mbetet kritik për këdo që kërkon të gjejë një biznes fizik në Shqipëri apo Kosovë nga jashtë, para se të udhëtojë apo të kontaktojë familjen atje.",
      "Citations dhe përmendje në direktoret e komunitetit shqiptar (shoqata biznesi, dhoma tregtie shqiptaro-gjermane/zvicerane, grupe LinkedIn/Facebook të profesionistëve shqiptarë jashtë vendit) kanë vlerë të dyfishtë: japin backlink real për SEO, dhe ju vendosin drejtpërdrejt para audiencës që kërkoni, jo thjesht para algoritmit të Google.",
      "Rasti tipik: një biznes në Tiranë me klientë të rregullt nga diaspora (p.sh. shërbime avokatie, transport mallrash, apo ndërtim/renovim shtëpish për familje që jetojnë jashtë) fiton më shumë nga një postim i mirë-shpërndarë në një grup Facebook të diasporës gjermane sesa nga muaj të tërë reklamash gjenerike Google drejtuar vetëm publikut brenda Shqipërisë.",
      "Struktura praktike që rekomandojmë: website me përmbajtje shqip si bazë (jo dytësore), buton WhatsApp të dukshëm në çdo faqe, prani aktive në Google Business Profile me adresën e saktë në Shqipëri/Kosovë, dhe të paktën një prezencë (postim, listim, apo partneritet) në një kanal komuniteti të diasporës relevant për biznesin tuaj specifik.",
      "Nëse audienca juaj reale përfshin Shqipërinë, Kosovën dhe diasporën njëkohësisht, mos e ndani strategjinë sikur të ishin tregje të veçanta e të pavarura. Janë e njëjta audiencë, e shpërndarë gjeografikisht por e bashkuar nga gjuha, kultura dhe kanalet e komunikimit, dhe kjo është pikërisht arsyeja pse duhet t'i qaseni si një treg i vetëm, jo disa."
    ]
  },
  {
    slug: "sa-kushton-website-shqiperi",
    title: "Sa kushton një website profesional në Shqipëri në 2026?",
    category: "Web Design",
    excerpt: "Çmimet reale të website-ve në Shqipëri për 2026.\nZbuloni sa kushton faqja profesionale, çfarë përfshin dhe si të shmangni gabimet e shtrenjta.",
    date: "Maj 2026",
    content: [
      "Çmimi i një website profesional në Shqipëri në 2026 varion gjerësisht, nga 300 € për një faqe prezantuese të thjeshtë deri në 8.000 € e lart për platforma e-commerce të plota ose aplikacione web me funksionalitete të avancuara. Diferenca e madhe nuk është rastësi; ajo pasqyron diferencën midis një template të gatshëm dhe një zgjidhjeje të ndërtuar ekskluzivisht për biznesin tuaj.",
      "Tre faktorët kryesorë që ndikojnë çmimin janë: lloji i faqes, niveli i personalizimit dhe kapaciteti teknik i kërkuar. Një faqe prezantuese me 5–7 seksione kushton mesatarisht 600–1.500 €. Një dyqan online me katalog produktesh, sistem pagese dhe panel administrimi fillon nga 1.800 € dhe ngjitet lehtë mbi 5.000 € sipas kompleksitetit.",
      "Kujdes me ofertat nën 300 €. Në shumicën e rasteve, çmime të tilla nënkuptojnë template të lirë nga WordPress ose Wix, pa strategji, pa optimizim SEO dhe pa mbështetje pas dorëzimit. Faqja do të duket 'e bërë' por nuk do të sjellë klientë, dhe pas 6 muajsh do të keni nevojë ta ribëni.",
      "Çfarë duhet të përfshijë çmimi i një website serioz: dizajn të personalizuar (jo template të blerë), programim të pastër dhe të sigurt, optimizim bazë SEO on-page, faqe të shpejta dhe responsive për mobile, panel administrimi intuitiv dhe trajnim të shkurtër se si ta përdorni vetë.",
      "Kostot e vazhdueshme pas lansimit shpesh harrohen nga bizneset. Hosting i mirë kushton 80–200 € në vit. Domain-i 10–15 € në vit. Nëse keni kontratë mirëmbajtjeje (update-e, ndryshime të vogla, backup), shtoni 50–150 € në muaj. Këto janë investime të domosdoshme, jo opsionale.",
      "Pyetja e saktë nuk është 'Sa të lirë mund ta gjej?' por 'Çfarë kthimi do të marr nga ky investim?' Një website 2.000 € që sjell 3 klientë të rinj në muaj ka ROI pozitiv brenda muajve të parë. Një website 300 € që nuk rankohet në Google dhe nuk konverton vizitorë është para e hedhur.",
      "Rekomandimi ynë: para nënshkrimit të ndonjë kontrate, kërkoni të shikoni punë reale të mëparshme të agjencisë (jo mockup-e), referenca nga klientë ekzistues dhe një plan të qartë se si faqja juaj do t'ju sjellë klientë, jo vetëm si do të duket."
    ]
  },
  {
    slug: "seo-tirane",
    title: "SEO Tiranë: Si të dilni i pari në Google në 2026",
    category: "SEO",
    excerpt: "Si bizneset shqiptare dalin në faqen e parë të Google dhe çfarë kërkon strategji SEO që jep rezultate reale në tregun shqiptar.",
    date: "Maj 2026",
    content: [
      "SEO (Search Engine Optimization) është procesi i optimizimit të faqes suaj web që Google ta shfaqë sa më lart kur dikush kërkon shërbimet ose produktet tuaja. Në Tiranë dhe në Shqipëri gjerësisht, konkurrenca online është rritur ndjeshëm, bizneset që nuk investojnë në SEO humbasin klientë çdo ditë ndaj konkurrentëve që janë të dukshëm në Google.",
      "Tregu shqiptar ka disa karakteristika që e dallojnë nga tregjet perëndimore: volumi i kërkimeve është më i ulët, por konkurrenca në shumë fusha është ende e menaxhueshme. Kjo do të thotë se me strategji të saktë, një biznes shqiptar mund të dalë në faqen e parë të Google për fjalë kyçe relevante brenda 3–6 muajsh, kohë që në tregje si Gjermania apo UK do të kërkonte 12–18 muaj.",
      "SEO ndahet në dy komponentë kryesorë: SEO on-page dhe SEO off-page. On-page përfshin strukturën e faqes, titujt, meta-descriptions, shpejtësinë e ngarkimit, optimizimin për mobile dhe cilësinë e përmbajtjes. Off-page ndërtohet kryesisht përmes backlinks, faqe të tjera të besueshme që lidhen me tuajën, duke i sinjalizuar Google se jeni autoritet në fushën tuaj.",
      "Gabimi më i shpeshtë i bizneseve shqiptare: blejnë paketa SEO të lira (50–100 € në muaj) dhe presin mrekulli. SEO serios kërkon punë të qëndrueshme: audit teknik i faqes, kërkim i fjalëve kyçe, krijim i përmbajtjes relevante, optimizim i vazhdueshëm. Çmimi minimal për SEO profesional që jep rezultate fillon nga 300–500 € në muaj.",
      "Google sot vlerëson tre gjëra mbi të gjitha: E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness), shpejtësia e faqes (Core Web Vitals) dhe përvojën e përdoruesit. Kjo nënkupton se nuk mjafton vetëm të shtoni fjalë kyçe, duhet të keni përmbajtje të vlefshme, faqe teknike të shëndetshme dhe reputacion të ndërtuar në kohë.",
      "Rezultatet SEO nuk vijnë brenda natës. Pritshmëritë realiste: muajt 1–2 janë auditim dhe optimizim teknik pa ndryshime të dukshme në renditje; muajt 3–4 filloni të shihni lëvizje për fjalë kyçe me konkurrencë të ulët; muajt 5–6 dhe pas, rezultate stabile për fjalë kyçe strategjike. Bizneset që braktisin SEO pas 2 muajsh humbasin investimin pa arritur asnjë rezultat.",
      "Nëse jeni biznes me bazë në Tiranë, prioriteti juaj SEO duhet të jetë Google Business Profile (Google Maps) i plotësuar dhe optimizuar, SEO lokal me fjalë kyçe si 'shërbim + Tiranë', dhe faqe të shpejtë e mobile-friendly. Këto tre hapa të saktë mund t'ju sjellin klientë lokal brenda 60 ditësh nga fillimi."
    ]
  },
  {
    slug: "dyqan-online-shqiperi",
    title: "Si të hapni dyqan online në Shqipëri: Udhëzues i plotë 2026",
    category: "E-Commerce",
    excerpt: "Udhëzues praktik për hapjen e dyqanit online në Shqipëri.\nPlatformat, pagesat, kostot reale dhe hapat e parë për të filluar shitjet online.",
    date: "Maj 2026",
    content: [
      "E-commerce në Shqipëri ka shënuar rritje të vazhdueshme vit pas viti. Nëse keni një biznes fizik ose dëshironi të filloni shitje online, 2026 është momenti i duhur, konkurrenca është ende e menaxhueshme dhe klientët shqiptarë janë gjithnjë e më të gatshëm të blejnë online. Ja hapat konkretë për të nisur.",
      "Hapi i parë: zgjidhni platformën e duhur. Tre opsionet kryesore në tregun shqiptar janë WooCommerce (mbi WordPress), Shopify dhe zhvillim custom. WooCommerce është zgjidhja më e përdorur: kosto e ulët fillestare (800–2.000 €), fleksibilitet i lartë dhe shumë zgjerime falas. Shopify është më e lehtë për t'u menaxhuar vetë por ka kosto mujore (29–79 $/muaj) dhe komision ndaj shitjeve. Zhvillimi custom rekomandohet vetëm nëse keni nevojë për funksionalitete shumë specifike.",
      "Pagesat online: sfida kryesore në Shqipëri. PayPal ka kufizime për llogaritë shqiptare. Stripe është i disponueshëm dhe ofron integrimin më të mirë. Bankat shqiptare si Credins, Raiffeisen dhe BKT ofrojnë gateway-e pagese vendase. Shumë biznese shqiptare fillojnë me 'paguaj me dorëzim' (cash on delivery) si opsionin kryesor dhe shtojnë kartë gradualisht.",
      "Aspekti ligjor: dyqani online konsiderohet veprimtari tregtare dhe kërkon NIPT. Nëse jeni tashmë i regjistruar si biznes, mund të filloni menjëherë. Nëse jo, regjistrimi në QKB kushton rreth 100 € dhe bëhet brenda disa ditësh. Sigurohuni të keni politikë kthimi dhe kushte shërbimi të qarta, klientët shqiptarë i lexojnë gjithnjë e më shumë.",
      "Kostot reale të fillimit: platforma dhe dizajni 800–2.500 €, fotografi produktesh (nëse nevojitet) 200–600 €, hosting dhe domain 100–200 €/vit, integrimi i pagesave 0–300 € (shumë zgjerime janë falas). Buxheti minimal për nisje serioz: 1.500–3.000 €.",
      "Marketingu është aty ku shumë dyqane online shqiptare dështojnë. Hapja e dyqanit është vetëm 20% e punës, 80% tjetër është sjella e klientëve. Facebook dhe Instagram Ads janë kanalet me ROI më të lartë për e-commerce shqiptar. SEO i dyqanit ndihmon afatgjatë. Google Shopping Ads japin rezultate të shpejta nëse buxheti lejon.",
      "Këshilla praktike nga eksperienca jonë: filloni me 20–30 produkte të zgjedhura mirë, jo me gjithçka katalogut. Focusohuni në fotografi të mira dhe përshkrime të detajuara. Vendosni çmime transparente duke përfshirë shpenzimet e dërgesës. Dhe mbi të gjitha, përgjigjuni mesazheve të klientëve brenda 1–2 orësh. Shërbimi ndaj klientit është konkurrenca juaj kryesore ndaj platformave të mëdha."
    ]
  },
  {
    slug: "google-ads-shqiperi",
    title: "Google Ads Shqipëri: Çmime reale dhe rezultate të pritshme",
    category: "Marketing",
    excerpt: "Çmimet reale të Google Ads në Shqipëri, gabimet kryesore dhe si ta menaxhoni buxhetin tuaj reklamues për ROI maksimal.",
    date: "Maj 2026",
    content: [
      "Google Ads është sistemi i reklamave me pagesë të Google, kompania juaj shfaqet e para kur dikush kërkon fjalë kyçe specifike. Pagoni vetëm kur dikush klikon reklamën tuaj (CPC: cost per click). Është kanali i marketingut dixhital me ROI më të matshëm dhe me rezultate të shpejta: kampanja e konfiguruar sot mund të sjellë klientë nesër.",
      "Çmimet e Google Ads në Shqipëri janë ndër më të favorshmet në rajon. CPC mesatar (çmimi për klikim) varion sipas industrisë: shërbime ligjore dhe financiare 0.80–2.50 €, sektori i ndërtimit dhe mobiljeve 0.30–1.20 €, restorante dhe hotele 0.15–0.60 €, dyqane online 0.20–0.80 €. Krahasuar me Europën Perëndimore ku CPC-të i kalojnë lehtë 5–15 €, tregu shqiptar ofron mundësi të jashtëzakonshme.",
      "Buxheti minimal për rezultate të matshme: 300–500 € në muaj për shpenzim reklamash plus 150–300 € menaxhim agjenci. Nën këtë nivel, të dhënat e mbledhura janë të pamjaftueshme për optimizim real. Bizneset që investojnë 800–1.500 € në muaj shpesh shohin rezultate transformuese nëse kampanja menaxhohet siç duhet.",
      "Gabimet kryesore që shohim tek bizneset shqiptare që menaxhojnë vetë Google Ads: fjalë kyçe shumë të gjera pa negative keywords (shpenzojnë buxhetin me klikime irelevante), faqe destinacioni (landing page) e dobët që nuk konverton, mungesë konversioni-tracking (nuk dini cilat fjalë kyçe sjellin klientë), dhe ndërhyrje të shpeshta në kampanja pa i lënë kohë algoritmit të mësojë.",
      "Rezultate realiste nga Google Ads të menaxhuar mirë: muaji i parë është mbledhje të dhënash dhe optimizim fillestar, mos prisni perfeksion. Muaji 2–3 kampanja optimizohet dhe CPA (cost per acquisition) bie. Pas muajit 3–4, me kampanja stabile dhe landing page të testuar, shumica e bizneseve arrijnë ROI pozitiv të qëndrueshëm.",
      "Google Ads apo SEO? Nuk është zgjedhje ekskluzive, idealisht i bëni të dyja. Por nëse keni buxhet të kufizuar: nëse keni nevojë për klientë brenda 30 ditësh, filloni me Google Ads. Nëse keni durim dhe dëshironi investim afatgjatë me kosto në rënie, SEO është i pasëvitshëm. Bizneset e suksesshme i kombinojnë: Ads financojnë rritjen ndërsa SEO ndërtohet.",
      "Çfarë duhet të kërkoni nga agjencia që menaxhon Google Ads: raporte transparente javore ose mujore me metrika reale (klikimet, konvertimet, çmimi për konvertim), akses të plotë tek llogaria juaj Google Ads (jo vetëm agjencia ta ketë), dhe qartësi absolute se sa shpenzoni për reklamat dhe sa për shërbimin e menaxhimit."
    ]
  },
  {
    slug: "web-design-tirane",
    title: "Web Design Tiranë: Si të zgjidhni agjenci profesionale",
    category: "Web Design",
    excerpt: "Si ta dalloni agjencinë serioze nga amatorët.\nKriteret e sakta, pyetjet që duhet të bëni dhe shenjat paralajmëruese para nënshkrimit.",
    date: "Maj 2026",
    content: [
      "Tirana ka me qindra 'agjenci web design', nga freelancerë të vetmuar deri në kompani me ekipe të plota. Të gjithë premtojnë faqe të bukura, SEO të mirë dhe rezultate. Si ta dalloni kush është serioz dhe kush do t'ju zhgënjejë? Ja kriteret konkrete.",
      "Kriteri i parë dhe më i rëndësishëm: portfolio me projekte reale, jo mockup-e. Kërkoni të shikoni faqe të lansuara, jo imazhe të bëra në Photoshop. Vizitoni faqet personalisht dhe testoni shpejtësinë, dizajnin mobile dhe funksionalitetin. Nëse agjencia nuk ju jep URL-t e projekteve të mëparshme, ky është alarmi i parë.",
      "Pyetjet që duhet të bëni çdo agjensie para nënshkrimit: Kush konkretisht do ta bëjë projektin tim (in-house apo outsource)? Sa kohë do të marrë dhe cili është procesi hap pas hapi? Çfarë ndodh nëse rezultati nuk plotëson standardet? Kush do të posedojë kodin dhe domain-in pas projektit? A përfshihet trajnim se si ta menaxhoj vetë?",
      "Shenjat paralajmëruese (red flags): premtojnë numra konkretë të vizitorëve ose renditje specifike në Google (askush nuk mund ta garantojë këtë); çmim shumë i ulët pa shpjegim të qartë se çfarë përfshihet; kontratë e paqartë ose pa afat dorëzimi; nuk kanë rrjet social aktiv ose prezencë online të tyre (pse t'u besoni ata të bëjnë marketing digital?); komunikim i vonuar gjatë fazës para-kontratës.",
      "Procesi i saktë i punës me agjencinë: faza e briefimit ku ju shpjegoni biznesin, klientët dhe qëllimet; faza e strategjisë dhe arkitekturës; dizajni i faqeve kryesore me mundësi komentesh; zhvillimi dhe testimi; lansimi dhe trajnimi. Nëse agjencia kalon direkt në dizajn pa ju pyetur thellë rreth biznesit tuaj, kjo tregon mungesë procesi.",
      "Çmimi nuk është kriteri kryesor, por është tregues. Agjenci serioze me ekip të trajnuar dhe proceso të qartë nuk mund të ofrojnë faqe professionale nën 800–1.000 €. Nëse çmimi është shumë i ulët, dikush paguan çmimin, zakonisht ju, me kohën e humbur dhe nevojën për të ribërë gjithçka.",
      "Marrëdhënia me agjencinë nuk përfundon pas lansimit. Pyesni nëse ofrojnë mbështetje pas lansimit, si funksionon procesi i ndryshimeve dhe update-ve, dhe nëse keni kontakt të vetëm pikë (account manager) ose komunikoni me persona të ndryshëm çdo herë. Agjencia e duhur është partner afatgjatë, jo vetëm ofrues i shërbimit njëherësh."
    ]
  },
  {
    slug: "social-media-menaxhim-shqiperi",
    title: "Social Media Menaxhim në Shqipëri: Çmime dhe çfarë të prisni",
    category: "Social Media",
    excerpt: "Çmimet e menaxhimit profesional të social media në Shqipëri, platformat kryesore dhe si të zgjidhni agjencinë e duhur.",
    date: "Maj 2026",
    content: [
      "Social media në Shqipëri nuk është thjesht postim fotosh, është kanali kryesor përmes të cilit bizneset shqiptare ndërtojnë besim, afrojnë klientë dhe rrisin shitjet. Por shumë biznese i qasen social media pa strategji, me postime të parregullta dhe pa asnjë analizë rezultatesh. Kjo është arsyeja pse shumica nuk shohin kthim nga investimi.",
      "Platformat kryesore për tregun shqiptar: Facebook mbetet platforma me audiencën më të gjerë ndër moshave 25–55 vjeç, ideale për biznese lokale, shërbime dhe produkte. Instagram dominon tek grupmoshat 18–35 vjeç dhe është i detyrueshëm për bizneset me komponent vizual të fortë (moda, ushqim, interior, bukuri). TikTok po rritet shpejt dhe ofron reach organik aktualisht superior, bizneset që hyjnë tani kanë avantazh të qartë. LinkedIn është relevant vetëm për shërbime B2B.",
      "Çmimet e menaxhimit profesional të social media në Shqipëri variojnë sipas paketës: paketa bazë (3–4 postime/javë + raport mujor) 200–350 € në muaj; paketa standard (postime ditore + stories + menaxhim komentesh + raport) 400–700 € në muaj; paketa e plotë (strategji + content creation + ads menaxhim + raport i detajuar) 800–1.500 € në muaj.",
      "Çfarë duhet të përfshijë shërbimi profesional: strategji e qartë bazuar në audiencën tuaj dhe konkurrentët, content calendar mujor i miratuar paraprakisht nga ju, dizajn vizual konsistent me branding-un tuaj, copywriting në gjuhën e audiencës (jo thjesht kaptinaçe të kopjuara), menaxhim i komenteve dhe mesazheve, raporte mujore me metrika reale dhe rekomandime.",
      "Gabimi #1: menaxhimi i social media nga personi i kompanisë 'që di pak kompjuter'. Social media profesionale kërkon strategji, njohje të algoritmeve, aftësi grafike, copywriting dhe analizë të vazhdueshme. Është punë me kohë të plotë, duke ia ngarkuar dikujt që ka punë tjera, praktikisht garantoni rezultate mediokre.",
      "Metrikat që duhet të ndiqni realisht (jo numri i likes): reach organik (sa njerëz shohin postimet pa reklama), engagement rate (si % e audiencës), klikime në link/profil, mesazhe dhe pyetje të marra, konvertimet (njerëzit që bëjnë diçka pas shikimit të postimit). Agjencia e mirë raporton këto metrika çdo muaj me kontekst, nuk ju jep vetëm grafika pa shpjegim.",
      "Si të zgjidhni agjencinë e duhur: shikoni profilin e tyre të social media (nëse nuk menaxhojnë mirë të tyren, si do ta menaxhojnë tuajën?), kërkoni 2–3 raste studimi me rezultate konkrete nga klientë të ngjashëm me biznesin tuaj, dhe shmangni kontratat shumë të gjata (6–12 muaj) pa periudhë prove fillestare."
    ]
  },
  // ── Artikujt e vjetër (shfaqen të fundit) ───────────────────────
  {
    slug: "si-te-rrisesh-klientet-online",
    title: "Ke trafikun. Por ku janë klientët?",
    category: "Rritje",
    excerpt:
      "Shumica e bizneseve shpenzojnë para për të sjellë njerëz në faqe dhe i humbin menjëherë.\nJo sepse oferta është e keqe, por sepse faqja nuk po bën punën e saj.",
    date: "Prill 2026",
    content: [
      "Shumica e bizneseve shpenzojnë para për të sjellë njerëz në faqe dhe i humbin menjëherë. Jo sepse oferta është e keqe, por sepse faqja nuk po bën punën e saj.",
      "Oferta e parë, dëshmia dhe autoriteti, një CTA e vetme për seksion, pastaj mat klikimet në CTA, fillimin e formularit dhe dërgimin.",
      "Rritja fillon me një faqe që di punën e saj; pastaj çdo euro reklamë kthehet mbrapsht."
    ]
  },
  {
    slug: "gabimet-kryesore-ne-website",
    title: "Gabimet që bëjnë bizneset në website (dhe si i rregullojmë)",
    category: "UX",
    excerpt: "Një listë e shkurtër e gabimeve që ulin besimin dhe shtyjnë klientin të largohet.",
    date: "Prill 2026",
    content: [
      "Gabimi #1: Hierarki e paqartë. Vizitori nuk kupton çfarë ofroni brenda 5 sekondave.",
      "Gabimi #2: CTA të shumta pa prioritet. Kur çdo gjë është e rëndësishme, asgjë nuk është.",
      "Gabimi #3: Faqe e ngadaltë në mobile. Shpejtësia është pjesë e perceptimit premium."
    ]
  },
  {
    slug: "pse-seo-eshte-kritik",
    title: "Pse SEO është kritik për biznese serioze (dhe jo një opsion)",
    category: "Strategji",
    excerpt:
      "Të kesh një website të bukur që nuk shfaqet në Google është si të hapësh një dyqan luksoz në mes të shkretëtirës.\nAskush nuk e gjen, askush nuk blen.",
    date: "Prill 2026",
    content: [
      "Google është kanali ku kërkohet zgjidhja; pa faqen e parë, biznesi është i padukshëm për shumicën e tregut.",
      "SEO ul CAC në afatgjatë dhe ndërton autoritet; PPC zhduket kur ndalon pagesa.",
      "UX dhe cilësia e faqes janë pjesë e renditjes. SEO është maratonë, shumica dështojnë sepse presin rezultate për dy javë."
    ]
  },
  {
    slug: "google-ads-vs-seo",
    title: "Google Ads apo SEO: Ku të investosh para?",
    category: "Marketing",
    excerpt:
      "Dy kanale të ndryshme, dy logjika të ndryshme.\nNjëra jep rezultate nesër, tjetra ndërton diçka që zgjat vite.\nJa si të zgjedhësh sipas situatës suaj.",
    date: "Prill 2026",
    content: []
  },
  {
    slug: "pse-ecommerce-eshte-i-rendesishem",
    title: "Dyqani juaj fizik mbyllet në orën 18:00. Dyqani online kurrë.",
    category: "E-Commerce",
    excerpt:
      "Pse bizneset shqiptare kanë nevojë për dyqan online në 2026.\nGabimet më të shpeshta, kostot reale dhe çfarë humbisni çdo muaj pa e-commerce.",
    date: "Prill 2026",
    content: []
  },
  {
    slug: "cfare-eshte-branding",
    title: "Branding nuk është logo. Është çfarë ndiejnë të tjerët.",
    category: "Branding",
    excerpt:
      "Çfarë është branding në të vërtetë, pse bizneset shqiptare e nënvlerësojnë dhe çfarë humbasin duke e trajtuar si thjesht logo dhe ngjyrë.",
    date: "Prill 2026",
    content: []
  }
];

export const getBlogPostBySlug = (slug: string) => blogPosts.find((post) => post.slug === slug);
