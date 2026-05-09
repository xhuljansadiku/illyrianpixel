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
      "Postoni çdo ditë.\nPor ndjekësit nuk bëhen klientë.\nPrezenca ekziston, sistemi mungon.",
    items: [
      {
        title: "Postime pa rezultat, kohë e djegur",
        body: "Pa strategji, postimet mbushin feed-in por nuk sjellin klientë. Koha shkon, audienca nuk rritet, shitjet mbeten njësoj.",
      },
      {
        title: "Prezencë e parregullt humbet besimin",
        body: "Kur profili është aktiv një javë dhe i heshtur dy, audienca e harron. Rregullsia ndërton besim, mungesa e saj e shkatërron.",
      },
      {
        title: "Dizajni i dobët zvogëlon vlerën e brandit",
        body: "Grafika të ndryshme, ngjyra të çrregullta, foto pa kujdes, vizitori ndjen mosprofesionalizëm pa lexuar asnjë fjalë.",
      },
      {
        title: "Pa analizë, nuk dini çfarë funksionon",
        body: "Nëse nuk mat reach, engagement dhe konvertim, post-et e ardhshme janë po aq të verbëra sa të parat.",
      },
    ],
  },
  whyUsEyebrow: "Zgjidhja",
  whyUs: {
    headingBefore: "Social media që sjell",
    headingAccent: "klientë, jo vetëm ndjekës.",
    intro: "",
    items: [
      { icon: "mAudience", title: "Content që tërheq klientët e duhur", body: "" },
      { icon: "mFocus",    title: "Dizajn i njëjtë dhe profesional çdo ditë", body: "" },
      { icon: "mScale",    title: "Posting i rregullt pa stres për ju", body: "" },
      { icon: "mRoi",      title: "Rezultate të matshme çdo muaj", body: "" },
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
  portfolioSlugs: [],
  feedbackLabel: "",
  feedbackHeadline: "",
  testimonials: [],
};
