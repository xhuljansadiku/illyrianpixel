import {
  conversionTrustStatsDefault,
  type ConversionLandingData,
} from "@/lib/conversionLandingShared";

export const smmConversionLandingData: ConversionLandingData = {
  trustStats: {
    ...conversionTrustStatsDefault,
    reachLabel: "Prezencë sociale aktive dhe profesionale çdo ditë",
  },
  painSection: {
    anchorId: "situata",
    eyebrow: "Realiteti",
    headingBefore: "Social media pa strategji",
    headingAccent: "është kohë e humbur.",
    intro:
      "Post pas posti, orë pas ore — por komente pak, shitje aspak. Nuk mungon dedikimi, mungon sistemi.",
    items: [
      {
        title: "Postime pa rezultat — kohë e djegur",
        body: "Pa strategji, postimet mbushin feed-in por nuk sjellin klientë. Koha shkon, audienca nuk rritet, shitjet mbeten njësoj.",
      },
      {
        title: "Prezencë e parregullt humbet besimin",
        body: "Kur profili është aktiv një javë dhe i heshtur dy, audienca e harron. Rregullsia ndërton besim — mungesa e saj e shkatërron.",
      },
      {
        title: "Dizajni i dobët zvogëlon vlerën e brandit",
        body: "Grafika të ndryshme, ngjyra të çrregullta, foto pa kujdes — vizitori ndjen mosprofesionalizëm pa lexuar asnjë fjalë.",
      },
      {
        title: "Pa analizë, nuk dini çfarë funksionon",
        body: "Nëse nuk mat reach, engagement dhe konvertim, post-et e ardhshme janë po aq të verbëra sa të parat.",
      },
    ],
  },
  whyUsEyebrow: "Pse na zgjedhin",
  whyUs: {
    headingBefore: "Social media që ndërton",
    headingAccent: "audiencë dhe sjell klientë.",
    intro:
      "Menaxhojmë gjithë prezencën tuaj sociale — nga strategjia dhe dizajni te posting-u dhe analitika. Ju fokusoheni te biznesi, ne sigurojmë që marka juaj rritet çdo ditë.",
    items: [
      {
        icon: "mAudience",
        title: "Content që tërheq audiencën e duhur",
        body: "Mesazhi i duhur, njerëzit e duhur, koha e duhur. Content strategjik që ndërton komunitet dhe gjeneron kërkesa reale.",
      },
      {
        icon: "mFocus",
        title: "Dizajn konsistent dhe profesional",
        body: "Çdo postim reflekton identitetin e brandit tuaj. Ngjyra, tipografi dhe tone i njëjtë — në çdo platformë, çdo ditë.",
      },
      {
        icon: "mScale",
        title: "Rritje e matshme dhe e qëndrueshme",
        body: "Followers, reach, engagement dhe konvertime — monitorojmë çdo metrikë dhe optimizojmë çdo muaj.",
      },
      {
        icon: "mRoi",
        title: "Kthim real nga investimi",
        body: "Social media nuk është vetëm 'dukshmëri'. Çdo postim ka qëllim: ndërtim besimi, thirrje veprimi ose shitje direkte.",
      },
    ],
  },
  processHeadline: "Katër hapa. Prezencë profesionale.",
  process: [
    {
      step: "01",
      title: "Auditim",
      desc: "Analizojmë profilet ekzistuese.\nIdentifikojmë mundësitë dhe mangësitë.",
    },
    {
      step: "02",
      title: "Strategji",
      desc: "Plan i qartë: platformat, tone, frekuenca.\nContent calendar i personalizuar.",
    },
    {
      step: "03",
      title: "Prodhim",
      desc: "Dizajn grafik, caption dhe Reels.\nContent i gatshëm dhe i aprovuar.",
    },
    {
      step: "04",
      title: "Optimizim",
      desc: "Analizë mujore e performancës.\nStrategji e përditësuar bazuar në numra.",
    },
  ],
  portfolioSlugs: ["bardhi-wellness", "ilirjana-shehu-photography", "palushi-brothers"],
  portfolioBlurbs: {
    "bardhi-wellness": "Prezencë sociale e qëndrueshme që ndërton komunitet dhe gjeneron kërkesa organike.",
    "ilirjana-shehu-photography": "Brand personal i ndërtuar me kujdes — audiencë e drejtë dhe klientë që vijnë nga social.",
    "palushi-brothers": "Dukshmëri e rritur dhe angazhim aktiv që e bën markën të duket reale dhe të besueshme.",
  },
  feedbackLabel: "ÇFARË THONË KLIENTËT",
  feedbackHeadline: "Social media që sjell rezultate.",
  feedbackSubline: "Prezencë reale. Audiencë reale. Klientë realë.",
  testimonials: [
    {
      quote: "Pas bashkëpunimit, profili ynë u bë aktiv dhe profesional. Klientët na kontaktojnë nga Instagram direkt.",
      name: "Arta N.",
      role: "Wellness & shërbime personale",
      location: "Tiranë",
    },
    {
      quote: "Nuk kisha kohë për social media. Tani ekipi menaxhon gjithçka dhe unë shoh rritje çdo muaj pa u shqetësuar.",
      name: "Mariglent S.",
      role: "ESM Group",
      location: "Milano, Itali",
    },
    {
      quote: "Dizajni u bë konsistent dhe followerët e rregullt filluan të bëhen klientë realë.",
      name: "Jonida L.",
      role: "Fotografi & kreative",
      location: "Diasporë · EU",
    },
  ],
};
