import {
  conversionTrustStatsDefault,
  type ConversionLandingData,
} from "@/lib/conversionLandingShared";

export const ecommerceConversionLandingData: ConversionLandingData = {
  trustStats: {
    ...conversionTrustStatsDefault,
    reachLabel: "Dyqane online që shesin çdo ditë, 24/7",
  },
  painSection: {
    anchorId: "situata",
    eyebrow: "Realiteti",
    headingBefore: "Shumë dyqane online",
    headingAccent: "nuk shesin realisht.",
    intro:
      "Keni investuar kohë dhe para — por karrocat braktiset, blerësit largohen pa paguar dhe shitjet mbeten modeste. Nuk është produkt i keq. Është sistem i dobët.",
    items: [
      {
        title: "70% e karrocave braktiset para pagesës",
        body: "Checkout i komplikuar, mungesë besimi ose ngarkesë e ngadaltë — dhe blerësi humb. Jo sepse nuk donte, por sepse diçka e ndaloi.",
      },
      {
        title: "Vizitorë që hyjnë dhe dalin pa blerë",
        body: "Faqja tregon produktet, por nuk bind. Pa urgjencë, pa besim, pa rrugë të qartë drejt blerjes — vizitori kthehet bosh.",
      },
      {
        title: "Pagesa të ndërlikuara humbin shitje",
        body: "Nëse procesi i pagesës ka hapa shumë ose mungon metoda e preferuar, blerësi nuk përfundon porosinë.",
      },
      {
        title: "Pa analitikë, nuk dini ku humbisni para",
        body: "Nëse nuk e dini ku largohet blerësi, nuk mund ta ndaloni. Humbjet vazhdojnë çdo ditë — pa raport, pa zgjidhje.",
      },
    ],
  },
  solutionSection: {
    anchorId: "zgjidhja",
    eyebrow: "Ndërhyrja",
    headingBefore: "Dyqan online që",
    headingAccent: "shitet çdo ditë pa pushim.",
    intro:
      "Ndërtojmë dyqane online të optimizuara për konvertim: checkout i shpejtë, pagesa të integruara, rikuperim karroce dhe analitikë e plotë. Blerësi merr rrugën e duhur, ju merrni shitjen.",
    items: [
      {
        title: "Checkout i optimizuar — hapa minimal",
        body: "Sa më pak klikime, aq më shumë shitje. Ndërtojmë rrugën drejt pagesës të pastër dhe të shpejtë — pa distragsione.",
      },
      {
        title: "Pagesa të integruara dhe të besueshme",
        body: "Stripe, PayPal dhe metoda lokale — klienti paguan me metodën e preferuar. Besimi fillon me mundësinë e zgjedhjes.",
      },
      {
        title: "Rikuperim karroce automatik",
        body: "Email i automatizuar që kujton blerësin për karrocën e braktisur. Shitje shtesë pa kosto shtesë.",
      },
      {
        title: "Analitikë që tregon çdo humbje dhe fitim",
        body: "E dini saktë: nga vijnë blerësit, ku largohen dhe çfarë shet më shumë. Vendime bazuar në numra, jo intuitë.",
      },
    ],
  },
  whyUsEyebrow: "Pse na zgjedhin",
  whyUs: {
    headingBefore: "Ndërtojmë dyqane online",
    headingAccent: "që sjellin xhiro reale.",
    intro:
      "Nga katalogjet e vogla te platformat e mëdha B2C — çdo dyqan ka nevojë për arkitekturë që bind blerësin dhe procedon shitjen pa fërkime. Ne kombinojmë UX, teknologji dhe strategji shitjesh në një produkt të vetëm.",
    items: [
      {
        icon: "convert",
        title: "Fokus te shitja, jo vetëm te pamja",
        body: "Çdo element i dyqanit është projektuar për të çuar blerësin drejt 'Bli tani'. Dizajni i shërben shitjes.",
      },
      {
        icon: "speed",
        title: "Shpejtësi që ndikon direkt në shitje",
        body: "1 sekondë vonesa = 7% më pak konvertime. Ndërtojmë dyqane të shpejta nga hapi i parë, jo pas lançimit.",
      },
      {
        icon: "mRoi",
        title: "Analitikë dhe optimizim i vazhdueshëm",
        body: "Nuk dorëzojmë dhe largohemi. Monitorojmë funnel-in e shitjeve dhe optimizojmë çdo javë.",
      },
      {
        icon: "support",
        title: "Siguri dhe mbështetje 24/7",
        body: "Dyqani juaj nuk mund të jetë jashtë linje. Monitorim aktiv dhe support prioritar — çdo minutë pa shërbim është humbje.",
      },
    ],
  },
  processHeadline: "Katër hapa. Dyqan gati për shitje.",
  process: [
    {
      step: "01",
      title: "Strategji",
      desc: "Kuptojmë produktet, klientët dhe konkurrencën.\nNdërtojmë arkitekturën e dyqanit.",
    },
    {
      step: "02",
      title: "Dizajn & UX",
      desc: "Pamje dhe rrugë e qartë drejt blerjes.\nMobile-first, checkout i optimizuar.",
    },
    {
      step: "03",
      title: "Zhvillim & integrim",
      desc: "Pagesa, stok, email automatizim.\nGjithçka që nevojitet për shitje.",
    },
    {
      step: "04",
      title: "Lançim & rritje",
      desc: "Hedhim live, testojmë funnel-in.\nOptimizojmë bazuar në të dhëna reale.",
    },
  ],
  portfolioSlugs: ["esm-group", "bardhi-wellness", "hauswerk-niederbayern"],
  portfolioBlurbs: {
    "esm-group": "Prezencë B2B profesionale me mesazh të qartë dhe strukturë që gjeneron kontakte konkrete.",
    "bardhi-wellness": "Rrugë e thjeshtuar drejt shërbimit dhe blerjes — rezultati: më pak pyetje, më shumë konvertime.",
    "hauswerk-niederbayern": "Vizitorët gjejnë shpejt shërbimin dhe kontaktojnë me pritshmëri të qarta.",
  },
  feedbackLabel: "ÇFARË THONË KLIENTËT",
  feedbackHeadline: "Dyqane që shesin — çdo ditë.",
  feedbackSubline: "Rezultate reale, jo premtime.",
  testimonials: [
    {
      quote: "Pas ndërtimit të platformës, klientët mund të porosisin lehtë dhe blerjet u rritën ndjeshëm që muajin e parë.",
      name: "Mariglent S.",
      role: "ESM Group",
      location: "Milano, Itali",
    },
    {
      quote: "Shitjet online filluan menjëherë pas lançimit. Checkout i thjeshtë dhe pagesa pa asnjë problem.",
      name: "Bardhi U.",
      role: "Bardhi Wellness",
      location: "Prishtinë & Köln",
    },
    {
      quote: "Klientët gjejnë shpejt çfarë kërkojnë dhe porosisin pa hesitim — diçka që nuk e kishim me dyqanin e vjetër.",
      name: "Vehbi P.",
      role: "Palushi Brothers",
      location: "Londër, Angli",
    },
  ],
};
