import {
  conversionTrustStatsDefault,
  type ConversionLandingData,
} from "@/lib/conversionLandingShared";

export const marketingConversionLandingData: ConversionLandingData = {
  trustStats: {
    ...conversionTrustStatsDefault,
    reachLabel: "Sot fillon me një vendim, jo me një shpresë",
  },
  painSection: {
    anchorId: "situata",
    eyebrow: "Pa filtra",
    headingBefore: "Këtu ju lëndoni veten —",
    headingAccent: "dhe e ndjeni në xhiro.",
    intro:
      "Biznesi po punon.\nPor telefoni nuk bie.\nKlientët janë atje, ju nuk gjendeni.",
    items: [
      {
        title: "Heshtja në telefon ju vret në heshtje",
        body: "Çdo orë pa kërkesë të reja është para që nuk hyn në arkë, dhe nerv që shkon te konkurrenti pa asnjë fushatë ‘më të bukur’ se ju.",
      },
      {
        title: "Reklama që djeg para, jo klientë",
        body: "Klikime pa fund, zero takime. Buxheti del nga llogaria, por zëri i klientit nuk del nga goja e tij drejt jush. Kjo është e dhimbshme, dhe e matshme.",
      },
      {
        title: "Faqja ‘super’ që nuk të bën asnjë lek",
        body: "Nëse vizitori nuk ndjen urgjencë dhe besim në 10 sekonda, mbyll. Ju mbeteni me dizajn, ata me shitjen.",
      },
      {
        title: "Varësia nga goja ju bën të zbritshëm",
        body: "Referimet janë flori, por nëse rrjedha ndalet kur mbaron lista, ju jeni një shëtitje nga një muaj i keq.",
      },
    ],
  },
  solutionSection: {
    anchorId: "zgjidhja",
    eyebrow: "Ndërhyrja",
    headingBefore: "Ne nuk ju shesim ‘më shumë reklamë’.",
    headingAccent: "Ne ju shesim rrugën te para.",
    intro:
      "Së pari: kush blen, ku vendos, çfarë frike ka, çfarë oferte e detyron të veprojë. Pastaj: faqe dhe fushata që flasin një gjuhë, atë të pronarit që do të paguajë. Pa teatër. Pa pritje pa fund.",
    items: [
      {
        title: "Strategji para buxhetit, përndryshe është vetëm zhurmë",
        body: "Nëse nuk e dimë se çfarë numri përbën fitim për ju, çdo euro është lojë fati. Ne e vendosim targetin para se të ndizet karta.",
      },
      {
        title: "Faqja bëhet makinë kërkesash, jo broshurë",
        body: "Një veprim i qartë: thirrje, rezervim, formular. Asnjë ‘shiko edhe këtë’ që ju vjedh vëmendjen e blerësit.",
      },
      {
        title: "Ads vetëm aty ku blerësi juaj është gati të hapë xhepin",
        body: "Google, Meta, mjete. Ne i përdorim për të blerë vëmendje që kthehet në bisedë, jo në ‘like’ që nuk paguajnë faturën.",
      },
      {
        title: "Çdo javë: matim, prerje, rritje",
        body: "Çfarë djeg? Fshihet. Çfarë sjell? Shumëfishohet. Ju nuk prisni ‘raportin e bukur’, ju merrni vendimin e radhës.",
      },
    ],
  },
  outcomesSection: {
    anchorId: "rezultate",
    eyebrow: "Çfarë ndryshon",
    headingBefore: "Jo premtime në ajër.",
    headingAccent: "Rezultate që ndihen.",
    intro:
      "Këto janë gjërat që një pronar biznesi duhet të ndiejë në llogari dhe në telefon, jo në PowerPoint.",
    items: [
      {
        title: "Më shumë thirrje dhe mesazhe që kanë kuptim",
        body: "Më pak ‘po pyes vetëm’. Më shumë ‘dua ofertë, kur mund të fillojmë’. Kjo është ndryshimi midis lodhjes dhe rritjes.",
      },
      {
        title: "Më shumë para nga i njëjti trafik",
        body: "Nuk ju duhet gjithmonë më shumë vizitorë, shpesh ju duhet faqe dhe ofertë që nuk ju turpërojnë pas klikimit.",
      },
      {
        title: "Më pak para të djegura në ads",
        body: "Buxheti shkon te kërkesa ose ndalet. Nuk e lëmë ‘të provojë vetë’ derisa të mbarojë muaji.",
      },
      {
        title: "Parashikueshmëri që ju jep gjumë",
        body: "E dini çfarë u provua, çfarë fitoi, çfarë vjen tani. Jo magji, kontroll.",
      },
    ],
  },
  whyUsEyebrow: "Zgjidhja",
  whyUs: {
    headingBefore: "Ja si e",
    headingAccent: "zgjidhim këtë:",
    intro: "",
    items: [
      { icon: "mFocus",    title: "Sjellim klientë, jo vetëm klikime", body: "" },
      { icon: "mAudience", title: "Punojmë për tregun shqiptar dhe diasporën", body: "" },
      { icon: "mRoi",      title: "Ju themi të vërtetën, jo çfarë doni të dëgjoni", body: "" },
      { icon: "mScale",    title: "Rrisim vetëm kur rezultatet e lejojnë", body: "" },
    ],
  },
  processHeadline: "Katër hapa. Asnjë justifikim.",
  process: [
    {
      step: "01",
      title: "Analizë",
      desc: "Ku po humbisni sot: oferta, faqe, ads, konkurrencë. Pa analizë të fortë, çdo fushatë është lojë me veten.",
    },
    {
      step: "02",
      title: "Strategji",
      desc: "Cili kanal, cili mesazh, cili numër suksesi. Pa këtë, jeni duke vrapuar në vend.",
    },
    {
      step: "03",
      title: "Ekzekutim",
      desc: "Vendosim ose ndryshojmë gjithçka që prek parën: faqe, kreative, oferta. Një narrativë, një qëllim: kontakt.",
    },
    {
      step: "04",
      title: "Optimizim",
      desc: "Çdo javë: më shumë kërkesa me të njëjtin buxhet, ose i njëjti rezultat me më pak humbje. Kjo është loja.",
    },
  ],
  portfolioSlugs: ["palushi-brothers", "bardhi-wellness"],
  portfolioBlurbs: {
    "hauswerk-niederbayern": "Më pak humbje në klikime, më shumë kontakte që kërkojnë çmim dhe datë.",
    "esm-group": "Mesazh që mbijeton konkurrencën, dhe faqe që e mbështet bisedën B2B.",
    "suli-group-trockenbau": "Para se të hapet çanta veglash, klienti tashmë ju ka zgjedhur mendërisht.",
  },
  feedbackLabel: "ÇFARË THONË KLIENTËT",
  feedbackHeadline: "Çfarë thonë klientët tanë.",
  testimonials: [
    {
      quote: "Klientët na kontaktojnë me pritshmëri të qarta që në fillim.",
      name: "Vehbi P.",
      role: "Palushi Brothers",
      location: "Londër, Angli",
    },
    {
      quote: "Prezantimi i paketave dhe mesazhi i brandit tani duken më profesionalë dhe të besueshëm.",
      name: "Bardhi U.",
      role: "Bardhi Wellness",
      location: "Prishtinë & Köln",
    },
  ],
};
