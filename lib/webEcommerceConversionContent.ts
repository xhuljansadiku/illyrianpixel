import {
  conversionTrustStatsDefault,
  conversionWhyUsHeroDefault,
  type ConversionLandingData,
} from "@/lib/conversionLandingShared";

export const webConversionLandingData: ConversionLandingData = {
  trustStats: { ...conversionTrustStatsDefault },
  whyUs: {
    ...conversionWhyUsHeroDefault,
    items: [
      {
        icon: "convert",
        title: "Website që sjell klientë",
        body: "Shumë website ekzistojnë, por nuk konvertojnë. Ne ndërtojmë faqe që sjellin kërkesa reale.",
      },
      {
        icon: "seo",
        title: "Strukturë që bën diferencën",
        body: "Mesazh i qartë dhe rrugë e thjeshtë për klientin. Pa konfuzion, pa humbje.",
      },
      {
        icon: "speed",
        title: "Google ju gjen",
        body: "SEO bazë e integruar dhe performancë e lartë. Faqja juaj shfaqet dhe krijon besim.",
      },
      {
        icon: "support",
        title: "Partner, jo vetëm zhvillues",
        body: "Jemi me ju edhe pas publikimit. Optimizim dhe përmirësim i vazhdueshëm.",
      },
    ],
  },
  process: [
    {
      step: "1",
      title: "Strategji",
      desc: "Kuptojmë biznesin dhe klientët tuaj.\nNdërtojmë planin dhe strukturën.",
    },
    {
      step: "2",
      title: "Dizajni",
      desc: "Krijojmë pamje dhe strukturë të qartë.\nFokus te konvertimi.",
    },
    {
      step: "3",
      title: "Zhvillimi",
      desc: "E kthejmë në website të shpejtë dhe funksional.\nI optimizuar për Google.",
    },
    {
      step: "4",
      title: "Publikimi",
      desc: "E hedhim live, të sigurt dhe gati për klientë.\nNe mbetemi partnerë.",
    },
  ],
  processHeadline: "Proces i qartë, pa surpriza.",
  portfolioBlurbs: {
    "esm-group": "Website B2B me mesazh të qartë dhe strukturë që sjell kontakte më konkrete.",
    "bardhi-wellness": "Strukturë e thjeshtuar dhe rrugë e qartë për klientin.\nRezultati: më pak pyetje, më shumë blerje.",
    "hauswerk-niederbayern": "Vizitorët gjejnë shpejt shërbimin dhe kontaktojnë me pritshmëri të qarta.",
  },
  portfolioSlugs: ["esm-group", "bardhi-wellness", "hauswerk-niederbayern"],
  feedbackLabel: "ÇFARË THONË KLIENTËT",
  feedbackHeadline: "Rezultate reale nga klientë realë.",
  feedbackSubline: "Më pak fjalë. Më shumë rezultate.",
  testimonials: [
    {
      quote: "Klientët e kuptojnë më shpejt çfarë bëjmë dhe bisedat janë më konkrete.",
      name: "Mariglent S.",
      role: "ESM Group",
      location: "Milano, Itali",
    },
    {
      quote: "Prezantimi i paketave dhe mesazhi i brandit tani duken më profesionalë dhe të besueshëm.",
      name: "Bardhi U.",
      role: "Bardhi Wellness",
      location: "Prishtinë & Köln",
    },
    {
      quote: "Vizitorët gjejnë shpejt shërbimin dhe kërkesat vijnë më të sakta.",
      name: "Amir S.",
      role: "Hauswerk Niederbayern",
      location: "Straubing, Gjermani",
    },
    {
      quote: "Klientët na kontaktojnë me pritshmëri të qarta që në fillim.",
      name: "Vehbi P.",
      role: "Palushi Brothers",
      location: "Londër, Angli",
    },
  ],
};
