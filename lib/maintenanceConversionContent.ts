import {
  conversionTrustStatsDefault,
  type ConversionLandingData,
} from "@/lib/conversionLandingShared";

export const maintenanceConversionLandingData: ConversionLandingData = {
  trustStats: {
    ...conversionTrustStatsDefault,
    reachLabel: "Website të mbrojtura, të shpejta dhe gjithmonë online",
  },
  painSection: {
    anchorId: "situata",
    eyebrow: "Realiteti",
    headingBefore: "Website pa mirëmbajtje",
    headingAccent: "ka kohë të kufizuar.",
    intro:
      "Faqja juaj nuk është produkt i përfunduar — është sistem i gjallë. Pa kujdes të rregullt, dështimet janë çështje kohe, jo mundësie.",
    items: [
      {
        title: "Çdo minutë jashtë linje kushton",
        body: "Kur faqja bie, klientët ikin te konkurrenti. Dhe shpesh nuk e dini as për orë të tëra — sepse nuk ka kush të monitorojë.",
      },
      {
        title: "Plugin-et e pa-updateuara janë porta e hakerëve",
        body: "80% e hakimeve ndodhin nga plugin dhe tema të vjetruara. Pa përditësime, faqja juaj është e hapur — pa dashur.",
      },
      {
        title: "Faqja e ngadaltë humbet klientë çdo ditë",
        body: "53% e vizitorëve largohen nëse faqja nuk ngarkohet brenda 3 sekondave. Shpejtësia nuk është detail — është shitje.",
      },
      {
        title: "Pa backup, një gabim = gjithçka nga zero",
        body: "Nëse diçka shkon keq pa backup aktiv, humbja mund të jetë totale: content, produkte, porosi dhe konfigurimi i plotë.",
      },
    ],
  },
  whyUsEyebrow: "Pse na zgjedhin",
  whyUs: {
    headingBefore: "Mirëmbajtje aktive që",
    headingAccent: "e mban biznesin tuaj online.",
    intro:
      "Ne nuk presim të ndodhë problemi. Monitorojmë, sigurojmë dhe optimizojmë çdo ditë — kështu ju keni një partner teknik gjithmonë aktiv, jo dikë që reagon pas dëmit.",
    items: [
      {
        icon: "support",
        title: "Monitorim 24/7 — reagim i menjëhershëm",
        body: "Nëse faqja bie, ne e dimë para jush dhe fillojmë zgjidhjen menjëherë. Pa pritje, pa humbje të panevojshme.",
      },
      {
        icon: "speed",
        title: "Shpejtësi e optimizuar çdo muaj",
        body: "Cache, imazhe dhe Core Web Vitals të optimizuara rregullisht — Google dhe klientët tuaj e vlerësojnë.",
      },
      {
        icon: "seo",
        title: "Siguri aktive dhe backup i sigurt",
        body: "Firewall, skanim malware dhe backup ditor — faqja juaj e mbrojtur dhe gjithmonë e rikuperueshme.",
      },
      {
        icon: "convert",
        title: "Ndërhyrje teknike pa vonesë",
        body: "Ndryshime, rregullime dhe shtesa të vogla bëhen shpejt nga ekipi ynë — pa fatura surprizë.",
      },
    ],
  },
  processHeadline: "Katër hapa. Faqja juaj gjithmonë e sigurt.",
  process: [
    {
      step: "01",
      title: "Auditim",
      desc: "Analizojmë gjendjen aktuale.\nSiguri, shpejtësi dhe probleme teknike.",
    },
    {
      step: "02",
      title: "Konfigurimi",
      desc: "Vendosim monitorim, backup dhe siguri.\nGjithçka gati brenda 24 orëve.",
    },
    {
      step: "03",
      title: "Mirëmbajtje aktive",
      desc: "Përditësime, optimizim dhe skanim.\nCdo muaj, pa ndërhyrje tuajën.",
    },
    {
      step: "04",
      title: "Raportim",
      desc: "Raport mujor me gjendjen e faqes.\nTransparencë e plotë mbi çdo ndërhyrje.",
    },
  ],
  portfolioSlugs: ["esm-group", "bardhi-wellness", "hauswerk-niederbayern"],
  portfolioBlurbs: {
    "esm-group": "Faqe B2B me uptime të garantuar dhe performancë të qëndrueshme — klientët vijnë dhe faqja nuk zhgënjen.",
    "bardhi-wellness": "Mirëmbajtje aktive që mban faqen të shpejtë, të sigurt dhe gjithmonë gati për klientë.",
    "hauswerk-niederbayern": "Sistem i qëndrueshëm dhe i mbrojtur — biznesi punon pa u shqetësuar për aspektin teknik.",
  },
  feedbackLabel: "ÇFARË THONË KLIENTËT",
  feedbackHeadline: "Faqe të qëndrueshme. Biznese pa stres teknik.",
  feedbackSubline: "Monitorim aktiv. Reagim i menjëhershëm. Paqe mendore.",
  testimonials: [
    {
      quote: "Që kur filluan mirëmbajtjen, nuk kam pasur asnjë problem. Nëse ndodh diçka, e marr njoftim para se ta kuptoj vetë.",
      name: "Mariglent S.",
      role: "ESM Group",
      location: "Milano, Itali",
    },
    {
      quote: "Faqja jonë ishte e ngadaltë dhe nuk e dinim. Pas optimizimit, koha e ngarkimit u ul ndjeshëm dhe klientët qëndrojnë më gjatë.",
      name: "Bardhi U.",
      role: "Bardhi Wellness",
      location: "Prishtinë & Köln",
    },
    {
      quote: "Tani nuk mendoj fare për aspektin teknik. E di që dikush e menaxhon dhe nëse ka problem, e zgjidhni shpejt.",
      name: "Amir S.",
      role: "Hauswerk Niederbayern",
      location: "Straubing, Gjermani",
    },
  ],
};
