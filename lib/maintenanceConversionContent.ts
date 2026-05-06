import {
  conversionTrustStatsDefault,
  type ConversionLandingData,
} from "@/lib/conversionLandingShared";

export const maintenanceConversionLandingData: ConversionLandingData = {
  trustStats: {
    ...conversionTrustStatsDefault,
    reachLabel: "Website që nuk ndalet — i shpejtë, i sigurt dhe gjithmonë online.",
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
        title: "Çdo minutë offline = humbje klientësh",
        body: "Vizitorët ikin te konkurrenca. Nëse nuk monitorohet, mund të mos e kuptoni për orë të tëra.",
      },
      {
        title: "Plugin-et e vjetra janë rrezik real",
        body: "Shumica e sulmeve ndodhin nga përditësime të mungura. Pa mirëmbajtje, faqja juaj është e ekspozuar.",
      },
      {
        title: "Faqe e ngadaltë = më pak shitje",
        body: "Nëse ngarkimi zgjat mbi 3 sekonda, shumica largohen. Shpejtësia nuk është detaj — është konvertim.",
      },
      {
        title: "Pa backup, çdo gabim është i shtrenjtë",
        body: "Një problem teknik mund të fshijë gjithçka. Pa backup aktiv, rikuperimi bëhet nga zero.",
      },
    ],
  },
  whyUsEyebrow: "Pse na zgjedhin",
  whyUs: {
    headingBefore: "Mirëmbajtje aktive që",
    headingAccent: "mban biznesin tuaj gjithmonë online.",
    intro:
      "Ne monitorojmë, mbrojmë dhe optimizojmë çdo ditë që ju të fokusoheni te biznesi, jo te problemet teknike.",
    items: [
      {
        icon: "support",
        title: "Monitorim 24/7 — reagim i menjëhershëm",
        body: "Nëse faqja bie, e dimë menjëherë dhe e rregullojmë pa vonesë.\nPa pritje. Pa humbje klientësh.",
      },
      {
        icon: "speed",
        title: "Faqe e shpejtë në çdo moment",
        body: "Optimizim i vazhdueshëm që faqja të hapet shpejt dhe të konvertojë më shumë.\nShpejtësia = më shumë shitje.",
      },
      {
        icon: "seo",
        title: "Siguri dhe backup i garantuar",
        body: "Faqja juaj është e mbrojtur dhe gjithmonë e rikuperueshme.\nEdhe në rast problemi, gjithçka rikthehet shpejt.",
      },
      {
        icon: "convert",
        title: "Ndërhyrje teknike pa stres",
        body: "Çdo ndryshim, rregullim apo problem zgjidhet nga ne.\nJu fokusoheni te biznesi — ne te teknika.",
      },
    ],
  },
  processHeadline: "Ju fokusoheni te biznesi.\nNe mbajmë website-in online.",
  process: [
    {
      step: "01",
      title: "Auditim i plotë i website-it",
      desc: "Identifikojmë problemet kritike — siguri, shpejtësi dhe stabilitet — para se të kthehen në humbje klientësh.",
    },
    {
      step: "02",
      title: "Setup i plotë teknik",
      desc: "Vendosim monitorim, backup dhe mbrojtje — website-i juaj bëhet i sigurt brenda 24 orëve.",
    },
    {
      step: "03",
      title: "Mirëmbajtje aktive çdo muaj",
      desc: "Përditësime, optimizim dhe kontroll i vazhdueshëm — pa ndërprerje, pa surpriza.",
    },
    {
      step: "04",
      title: "Transparencë totale",
      desc: "Raport mujor i qartë — çfarë është bërë, çfarë është përmirësuar dhe çfarë vjen më pas.",
    },
  ],
  portfolioSlugs: ["esm-group", "bardhi-wellness", "hauswerk-niederbayern"],
  portfolioHeadingBefore: "Nga probleme teknike →",
  portfolioHeadingAccent: "stabilitet dhe performancë.",
  portfolioSubline: "Mirëmbajtje aktive që mban faqet të shpejta, të sigurta dhe gjithmonë online — pa ndërprerje.",
  portfolioBlurbs: {
    "esm-group": "Stabilitet dhe performancë e qëndrueshme\nWebsite B2B i optimizuar dhe i monitoruar vazhdimisht — pa downtime, pa humbje klientësh.",
    "bardhi-wellness": "Website gjithmonë i shpejtë dhe i sigurt\nMe mirëmbajtje aktive, faqja qëndron optimale çdo ditë — klientët nuk presin, biznesi rritet.",
    "hauswerk-niederbayern": "Sistem i qëndrueshëm pa ndërprerje\nMonitorim dhe optimizim i vazhdueshëm — biznesi punon pa u shqetësuar për teknologjinë.",
  },
  feedbackLabel: "ÇFARË THONË KLIENTËT",
  feedbackHeadline: "Faqe të qëndrueshme. Biznese pa stres teknik.",
  feedbackSubline: "Monitorim 24/7, reagim i menjëhershëm dhe performancë e qëndrueshme — pa ndërprerje.",
  feedbackBadge: "Klientë realë",
  testimonials: [
    {
      quote: "Që kur filluam mirëmbajtjen, faqja nuk ka pasur asnjë problem.\nNjoftohemi menjëherë për çdo gjë — gjithçka është nën kontroll.",
      name: "Mariglent S.",
      role: "ESM Group",
      location: "Milano, Itali",
    },
    {
      quote: "Faqja ishte e ngadaltë dhe e paoptimizuar.\nPas mirëmbajtjes, ngarkon shumë më shpejt dhe klientët qëndrojnë më gjatë.",
      name: "Bardhi U.",
      role: "Bardhi Wellness",
      location: "Prishtinë & Köln",
    },
    {
      quote: "Nuk merrem më me probleme teknike.\nÇdo gjë zgjidhet shpejt dhe pa stres — di që faqja është në duar të sigurta.",
      name: "Amir S.",
      role: "Hauswerk Niederbayern",
      location: "Straubing, Gjermani",
    },
  ],
};
