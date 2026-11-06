import {
  getConversionTrustStatsDefault,
  getConversionWhyUsHeroDefault,
} from "@/lib/conversionLandingShared";
import { DEFAULT_WHATSAPP_E164 } from "@/lib/whatsappPrefill";
import type { CountrySlug, DiasporaCountryContent } from "@/lib/diasporaShared";

function buildDiasporaWhatsAppHref(countryLine: string): string {
  const lines = [
    "Përshëndetje 👋,",
    "",
    "Dëshiroj të marr një ofertë për shërbimet tuaja.",
    "",
    `• Nga: ${countryLine}`,
    "• Emri / Biznesi: ",
    "• Shërbimi: ",
    "• Buxheti: ",
  ];
  return `https://wa.me/${DEFAULT_WHATSAPP_E164}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/** I njëjtë për të 5 shtetet — dorëzimi është identik, ndryshojnë vetëm pikat e dhimbjes. */
const DIASPORA_PROCESS = [
  {
    step: "1",
    title: "Bisedë online",
    desc: "Flasim online, në orarin që ju vjen mirë.",
  },
  {
    step: "2",
    title: "Dizajni & struktura",
    desc: "Shihni progresin hap pas hapi, pa surpriza.",
  },
  {
    step: "3",
    title: "Zhvillimi",
    desc: "Website i shpejtë, gati për klientët tuaj.",
  },
  {
    step: "4",
    title: "Publikimi & dorëzimi",
    // Q-15 (2026-10-22): s'ka panel për klientin — ndryshimet i bëjmë ne (2026-10-25)
    // desc: "E hedhim live dhe ju japim akses admin të thjeshtë.\nBëni vetë ndryshime, pa pritur askënd.",
    desc: "E publikojmë dhe ndryshimet i bëjmë ne.",
  },
] as const;

const whyUsHero = getConversionWhyUsHeroDefault("sq");
const trustStats = getConversionTrustStatsDefault("sq");

export const diasporaContent: Record<CountrySlug, DiasporaCountryContent> = {
  gjermani: {
    countryLabel: "Gjermani",
    flagCode: "de",
    heroEyebrow: "DIASPORA SHQIPTARE NË GJERMANI",
    heroHeadline: "Biznesi juaj në Gjermani, i menaxhuar",
    heroHeadlineAccent: "nga kudo.",
    heroIntro:
      "Website profesionale për biznese shqiptare në Gjermani. Në shqip, thjeshtë, pa telefonata të pafundme.",
    heroTrustLine: "Përgjigje brenda 24 orësh · Klientë në Gjermani",
    hookLine: "Klientë të rinj në Gjermani, me projekte reale si provë.",
    trustStats,
    painSection: {
      eyebrow: "SITUATA",
      headingBefore: "Të kesh biznes në Gjermani",
      headingAccent: "s'do të thotë ta menaxhosh lehtë.",
      items: [
        { title: "Mesazhe pa përgjigje në kohë reale", body: "Klientët shkruajnë në Facebook/Instagram në orë kur s'jeni në gjendje të përgjigjeni, dhe humbin durimin." },
        { title: "Besim i ulët nga një prezencë e vjetër", body: "Një sit i vjetëruar ose thjesht një faqe Facebook nuk krijon besimin që kërkon tregu gjerman." },
        { title: "Menaxhim i vështirë nga distanca", body: "Çdo ndryshim i vogël, çmim, foto, orar, kërkon të thërrisni dikë tjetër dhe të prisni." },
      ],
    },
    solutionSection: {
      eyebrow: "ZGJIDHJA",
      headingBefore: "Një website që punon",
      headingAccent: "edhe kur ju flini.",
      items: [
        { title: "WhatsApp & formular gjithmonë aktiv", body: "Klientët ju kontaktojnë 24/7, edhe jashtë orarit tuaj." },
        { title: "Dizajn që përshtatet me standardet gjermane", body: "Strukturë e qartë që krijon besim që në shikim të parë." },
        // Q-15: { title: "Admin panel i thjeshtë", body: "Ndryshoni vetë çmime, foto dhe tekste, pa varësi nga dikush tjetër." },
        { title: "Ndryshimet i bëjmë ne", body: "Na shkruani çfarë duhet ndryshuar dhe e përditësojmë ne." },
      ],
    },
    whyUs: {
      ...whyUsHero,
      items: [
        { icon: "convert", title: "Faqe që sjell kërkesa reale", body: "Çdo faqe ndërtohet për të kthyer vizitorët në klientë, jo thjesht për të dukur mirë." },
        { icon: "support", title: "Komunikim 100% në shqip", body: "Flasim gjuhën tuaj, kuptojmë kontekstin e biznesit shqiptar jashtë vendit." },
        { icon: "seo", title: "Gjetshëm nga klientët e duhur", body: "SEO bazë i përfshirë, për shqiptarët dhe tregun gjerman." },
        { icon: "speed", title: "Shpejtë, pa humbje kohe", body: "Faqja gati brenda javësh, jo muajsh." },
      ],
    },
    process: DIASPORA_PROCESS,
    portfolioSlugs: ["hauswerk-niederbayern", "suli-group-trockenbau"],
    // Q-09 (2026-10-22): s'janë dëshmi reale me leje publikimi → fshehur derisa pronari të sjellë dëshmi të vërteta
    testimonials: [
      /*
      { quote: "Vizitorët gjejnë shpejt shërbimin dhe kërkesat vijnë më të sakta.", name: "Amir S.", role: "Hauswerk Niederbayern", location: "Straubing, Gjermani" },
      */
    ],
    ctaWhatsappHref: buildDiasporaWhatsAppHref("Gjermani"),
    relatedBlogSlugs: ["website-dygjuhesh-biznes-diaspore", "menaxho-biznesin-nga-diaspora"],
    hasLocalCaseStudy: true,
  },

  britani: {
    countryLabel: "Britania e Madhe",
    flagCode: "gb",
    heroEyebrow: "DIASPORA SHQIPTARE NË BRITANINË E MADHE",
    heroHeadline: "Biznesi juaj në Britaninë e Madhe,",
    heroHeadlineAccent: "gati për klientë të rinj.",
    heroIntro:
      "Website profesionale për biznese shqiptare në Britani, në nivel me konkurrentët vendas.",
    heroTrustLine: "Përgjigje brenda 24 orësh · Klient në Londër",
    hookLine: "Prezencë dixhitale që ju gjen klientë në Britani.",
    trustStats,
    painSection: {
      eyebrow: "SITUATA",
      headingBefore: "Tregu britanik pret",
      headingAccent: "standarde shumë të larta.",
      items: [
        { title: "Konkurrentët lokalë duken më profesionalë", body: "Kompani britanike me sit modern fitojnë besimin para se ju të merrni telefonin." },
        { title: "Komunikimi nga larg zvarritet", body: "Kur gjithçka varet nga telefonatat, projekti ecën ngadalë." },
        { title: "Facebook nuk mjafton më", body: "Klientët britanikë presin një website, jo vetëm një faqe sociale, para se të kontaktojnë." },
      ],
    },
    solutionSection: {
      eyebrow: "ZGJIDHJA",
      headingBefore: "Prezencë që konkurron,",
      headingAccent: "jo që ndjek.",
      items: [
        { title: "Dizajn i nivelit ndërkombëtar", body: "Website që duket dhe funksionon si i kompanive më të mira britanike të sektorit tuaj." },
        { title: "Raportim i qartë, jo telefonata të pafundme", body: "Përditësime me shkrim dhe pamje të progresit, kur t'ju vijë mirë." },
        { title: "Google Ads kur ju duhet më shumë se organiku", body: "Fushata të targetuara për zonën tuaj në Britani." },
      ],
    },
    whyUs: {
      ...whyUsHero,
      items: [
        { icon: "convert", title: "Faqe që sjell kërkesa reale", body: "Struktura e faqes çon vizitorin drejt kontaktit, jo drejt konfuzionit." },
        { icon: "support", title: "Komunikim i qartë në shqip dhe anglisht", body: "Ju shpjegojmë çdo hap thjeshtë, pa zhargon teknik." },
        { icon: "seo", title: "Gjetshëm në Google UK dhe nga shqiptarët", body: "Optimizim që mbulon të dyja audiencat tuaja njëherësh." },
        { icon: "speed", title: "Plan brenda 24–48 orësh", body: "S'humbisni kohë, e dini shpejt çfarë përfshin projekti dhe sa kushton." },
      ],
    },
    process: DIASPORA_PROCESS,
    portfolioSlugs: ["palushi-brothers"],
    // Q-09 (2026-10-22): s'janë dëshmi reale me leje publikimi → fshehur derisa pronari të sjellë dëshmi të vërteta
    testimonials: [
      /*
      { quote: "Klientët na kontaktojnë me pritshmëri të qarta që në fillim.", name: "Vehbi P.", role: "Palushi Brothers", location: "Londër, Angli" },
      */
    ],
    ctaWhatsappHref: buildDiasporaWhatsAppHref("Britania e Madhe"),
    relatedBlogSlugs: ["menaxho-biznesin-nga-diaspora", "si-te-gjejne-klientet-shqiptare-biznesin-tend"],
    hasLocalCaseStudy: true,
  },

  zvicer: {
    countryLabel: "Zvicër",
    flagCode: "ch",
    heroEyebrow: "DIASPORA SHQIPTARE NË ZVICËR",
    heroHeadline: "Standard zviceran,",
    heroHeadlineAccent: "shërbim shqiptar.",
    heroIntro:
      "Website profesionale për biznese shqiptare në Zvicër, me cilësinë që pret ky treg.",
    heroTrustLine: "Përgjigje brenda 24 orësh · Komunikim në shqip",
    hookLine: "Cilësi zvicerane, e menaxhuar thjesht në shqip.",
    trustStats,
    painSection: {
      eyebrow: "SITUATA",
      headingBefore: "Zvicra pret",
      headingAccent: "profesionalizëm maksimal.",
      items: [
        { title: "Standarde shumë të larta pritshmërie", body: "Klientët zviceranë vlerësojnë saktësinë dhe pamjen profesionale që në kontaktin e parë." },
        { title: "Pak kohë personale për ta menaxhuar vetë", body: "Ritmi i jetës në Zvicër lë pak hapësirë për të mësuar e mirëmbajtur një website vetë." },
        { title: "Nevoja për dikë që kupton të dyja botët", body: "Ju duhet dikush që flet shqip por e kupton edhe pritshmërinë e tregut zviceran." },
      ],
    },
    solutionSection: {
      eyebrow: "ZGJIDHJA",
      headingBefore: "Cilësi zvicerane,",
      headingAccent: "menaxhim shqiptar i thjeshtë.",
      items: [
        { title: "Dizajn i pastër dhe i saktë", body: "Struktura dhe estetika ndërtohen për standardin e lartë që tregu zviceran pret." },
        { title: "Ne e mirëmbajmë teknikalitetin", body: "Ju fokusoheni te biznesi, ne kujdesemi për sigurinë, shpejtësinë dhe përditësimet." },
        { title: "Komunikim i drejtpërdrejtë në shqip", body: "Pa nevojë të përktheni vetë çdo kërkesë, flasim gjuhën tuaj nga fillimi në fund." },
      ],
    },
    whyUs: {
      ...whyUsHero,
      items: [
        { icon: "convert", title: "Website që ndërton besim", body: "Struktura dhe pamja komunikojnë seriozitet që në sekondat e para." },
        { icon: "support", title: "Komunikim i qartë në shqip", body: "Çdo pyetje merr përgjigje pa barriera gjuhësore." },
        { icon: "seo", title: "Gjetshëm nga komuniteti shqiptar në Zvicër", body: "SEO që ju lidh me klientët që kërkojnë pikërisht shërbimin tuaj." },
        { icon: "speed", title: "Proces i shpejtë, pa humbje kohe", body: "Plan i qartë brenda 24–48 orësh, pa muaj pritje." },
      ],
    },
    process: DIASPORA_PROCESS,
    portfolioSlugs: ["hauswerk-niederbayern", "palushi-brothers"],
    portfolioSubline: "Shembuj nga puna jonë me biznese shqiptare në diasporë.",
    // Q-09 (2026-10-22): s'janë dëshmi reale me leje publikimi → fshehur derisa pronari të sjellë dëshmi të vërteta
    testimonials: [
      /*
      { quote: "Vizitorët gjejnë shpejt shërbimin dhe kërkesat vijnë më të sakta.", name: "Amir S.", role: "Hauswerk Niederbayern", location: "Straubing, Gjermani" },
      */
    ],
    ctaWhatsappHref: buildDiasporaWhatsAppHref("Zvicër"),
    relatedBlogSlugs: ["website-dygjuhesh-biznes-diaspore", "menaxho-biznesin-nga-diaspora"],
    hasLocalCaseStudy: false,
  },

  itali: {
    countryLabel: "Itali",
    flagCode: "it",
    heroEyebrow: "DIASPORA SHQIPTARE NË ITALI",
    heroHeadline: "Afërsia gjeografike nuk mjafton,",
    heroHeadlineAccent: "duhet prezencë profesionale.",
    heroIntro:
      "Website dygjuhëshe (shqip/italisht) për biznese shqiptare në Itali.",
    heroTrustLine: "Përgjigje brenda 24 orësh · Klient në Milano",
    hookLine: "Dy gjuhë, dy tregje: klientë italianë dhe shqiptarë.",
    trustStats,
    painSection: {
      eyebrow: "SITUATA",
      headingBefore: "Afër gjeografikisht,",
      headingAccent: "larg dixhitalisht.",
      items: [
        { title: "Konkurrentët italianë ju kalojnë online", body: "Pa një sit profesional, humbisni klientë ndaj bizneseve italiane edhe kur oferta juaj është më e mirë." },
        { title: "Dy audienca, një mesazh i vetëm", body: "Website vetëm në shqip ju izolon nga tregu italian; vetëm në italisht ju largon nga komuniteti shqiptar." },
        { title: "Menaxhim i vështirë nga distanca", body: "Ndryshimet e vogla kërkojnë dikë tjetër dhe kohë që s'e keni." },
      ],
    },
    solutionSection: {
      eyebrow: "ZGJIDHJA",
      headingBefore: "Një website,",
      headingAccent: "dy audienca, të dyja të mbuluara.",
      items: [
        { title: "Sit dygjuhësh shqip/italisht", body: "Të njëjtin mesazh profesional, në gjuhën që flet secili vizitor." },
        { title: "Dizajn që krijon besim menjëherë", body: "Strukturë e qartë që e bën vizitorin të marrë vendim shpejt." },
        // Q-15: { title: "Admin i thjeshtë për ndryshime vetë", body: "Ndryshoni çmime, foto e orare pa pritur dikë tjetër." },
        { title: "Ndryshimet i bëjmë ne", body: "Na shkruani çfarë duhet ndryshuar dhe e përditësojmë ne." },
      ],
    },
    whyUs: {
      ...whyUsHero,
      items: [
        { icon: "convert", title: "Mesazh që sjell kërkesa reale", body: "Struktura e faqes udhëheq vizitorin drejt kontaktit, jo drejt konfuzionit." },
        { icon: "support", title: "Komunikim në shqip dhe italisht", body: "Ju shpjegojmë çdo hap qartë, pa barriera gjuhësore." },
        { icon: "seo", title: "Gjetshëm nga të dyja audiencat", body: "SEO i strukturuar për kërkime në shqip dhe italisht njëkohësisht." },
        { icon: "speed", title: "Plan brenda 24–48 orësh", body: "E dini shpejt çfarë përfshin projekti dhe sa kushton." },
      ],
    },
    process: DIASPORA_PROCESS,
    portfolioSlugs: ["esm-group"],
    // Q-09 (2026-10-22): s'janë dëshmi reale me leje publikimi → fshehur derisa pronari të sjellë dëshmi të vërteta
    testimonials: [
      /*
      { quote: "Klientët e kuptojnë më shpejt çfarë bëjmë dhe bisedat janë më konkrete.", name: "Mariglent S.", role: "ESM Group", location: "Milano, Itali" },
      */
    ],
    ctaWhatsappHref: buildDiasporaWhatsAppHref("Itali"),
    relatedBlogSlugs: ["menaxho-biznesin-nga-diaspora", "si-te-gjejne-klientet-shqiptare-biznesin-tend"],
    hasLocalCaseStudy: true,
  },

  "shba-kanada": {
    countryLabel: "SHBA & Kanada",
    flagCode: "us",
    heroEyebrow: "DIASPORA SHQIPTARE NË SHBA & KANADA",
    heroHeadline: "Diferenca e orës s'duhet të ndalojë",
    heroHeadlineAccent: "biznesin tuaj.",
    heroIntro:
      "Website profesionale për biznese shqiptare në SHBA dhe Kanada, që punojnë edhe kur ju flini.",
    heroTrustLine: "Përgjigje brenda 24 orësh · Komunikim në shqip",
    hookLine: "Biznesi juaj sjell klientë 24/7, edhe kur ju flini.",
    trustStats,
    painSection: {
      eyebrow: "SITUATA",
      headingBefore: "6-9 orë diferencë",
      headingAccent: "e bëjnë telefonatën jopraktike.",
      items: [
        { title: "Telefonatat bëhen të pamundura", body: "Kur njëri fle, tjetri punon, komunikimi vetëm me telefon ngadalëson çdo vendim." },
        { title: "Pritshmëri amerikane/kanadeze për sit të shpejtë", body: "Klientët presin një website profesional, të shpejtë dhe të qartë, jo thjesht një faqe Facebook." },
        { title: "Vizita të rralla në shtëpi", body: "Me 1-2 vizita në vit, ju duhet një mënyrë të mbani kontroll nga distanca gjatë gjithë kohës." },
      ],
    },
    solutionSection: {
      eyebrow: "ZGJIDHJA",
      headingBefore: "Raportim online,",
      headingAccent: "jo varësi nga telefonata.",
      items: [
        { title: "Website + WhatsApp, gjithmonë aktiv", body: "Klientët ju gjejnë dhe kontaktojnë pavarësisht orarit, faqja punon edhe kur ju flini." },
        // Q-15 (2026-10-22): s'ka ende panel ku klienti ndryshon vetë përmbajtjen
        // { title: "Dashboard i thjeshtë për kontroll nga distanca", body: "Shihni dhe ndryshoni informacionin e biznesit vetë, pa pritur vizitën tjetër në shtëpi." },
        { title: "Ndryshimet i bëjmë ne, nga distanca", body: "Na shkruani çfarë duhet ndryshuar dhe e përditësojmë ne, pa pritur vizitën në shtëpi." },
        { title: "Komunikim asinkron, i qartë", body: "Përditësime me shkrim dhe pamje të progresit, pa orar të përbashkët." },
      ],
    },
    whyUs: {
      ...whyUsHero,
      items: [
        { icon: "convert", title: "Website që sjell kërkesa, jo vetëm vizita", body: "Struktura e faqes e çon vizitorin drejt kontaktit real." },
        { icon: "support", title: "Komunikim i qartë në shqip", body: "Pa barriera gjuhësore, pavarësisht sa larg jeni." },
        { icon: "seo", title: "Gjetshëm nga komuniteti shqiptar në SHBA/Kanada", body: "SEO që ju lidh direkt me audiencën tuaj specifike." },
        { icon: "speed", title: "Proces i shpejtë, edhe nga larg", body: "Plan brenda 24–48 orësh, pa nevojë prezence fizike." },
      ],
    },
    process: DIASPORA_PROCESS,
    portfolioSlugs: ["roofon-nyc", "suli-group-trockenbau", "palushi-brothers"],
    portfolioSubline: "Nga Nju Jorku (Roof ON NYC) te bizneset shqiptare në Evropë.",
    // Q-09 (2026-10-22): s'janë dëshmi reale me leje publikimi → fshehur derisa pronari të sjellë dëshmi të vërteta
    testimonials: [
      /*
      { quote: "Klientët na kontaktojnë me pritshmëri të qarta që në fillim.", name: "Vehbi P.", role: "Palushi Brothers", location: "Londër, Angli" },
      */
    ],
    ctaWhatsappHref: buildDiasporaWhatsAppHref("SHBA / Kanada"),
    relatedBlogSlugs: ["menaxho-biznesin-nga-diaspora", "si-te-gjejne-klientet-shqiptare-biznesin-tend"],
    hasLocalCaseStudy: true,
  },
};
