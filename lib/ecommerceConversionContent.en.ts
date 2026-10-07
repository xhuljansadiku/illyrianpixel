import {
  getConversionTrustStatsDefault,
  type ConversionLandingData,
} from "@/lib/conversionLandingShared";

export const ecommerceConversionLandingData: ConversionLandingData = {
  trustStats: {
    ...getConversionTrustStatsDefault("en"),
    reachLabel: "Online stores that sell every day, 24/7",
  },
  painSection: {
    anchorId: "situata",
    eyebrow: "The Reality",
    headingBefore: "Many online stores",
    headingAccent: "don't actually sell.",
    intro:
      "The store exists.\nVisitors come.\nBut most leave without buying.",
    items: [
      {
        title: "70% of purchases are abandoned before checkout",
        body: "A complicated checkout, lack of trust or slow loading, and the buyer is lost.\nNot because they didn't want to buy, but because something stopped them.",
      },
      {
        title: "Visitors come and go without buying",
        body: "The page shows the products, but doesn't convince.\nNo urgency, no trust, no clear path to purchase, the visitor leaves empty-handed.",
      },
      {
        title: "Complicated payments lose sales",
        body: "If the payment process has too many steps or is missing the preferred method, the buyer doesn't complete the order.",
      },
      {
        title: "Without analytics, you don't know where you're losing money",
        body: "If you don't know where the buyer drops off, you can't stop it.\nThe losses continue every day, with no report, no solution.",
      },
    ],
  },
  solutionSection: {
    anchorId: "zgjidhja",
    eyebrow: "The Intervention",
    headingBefore: "An online store that",
    headingAccent: "sells every day without a break.",
    intro:
      "We build online stores optimized for conversion: fast checkout, integrated payments, cart recovery and full analytics.\nThe buyer gets the right path, you get the sale.",
    items: [
      {
        title: "Optimized checkout, minimal steps",
        body: "Fewer clicks, more sales.\nWe build a clean, fast path to payment, with no distractions.",
      },
      {
        title: "Integrated, trusted payments",
        body: "Stripe, PayPal and local methods, the client pays with their preferred method.\nTrust starts with the ability to choose.",
      },
      {
        title: "Automatic abandoned cart recovery",
        body: "An automated email that reminds the buyer of their unfinished order.\nExtra sales at no extra cost.",
      },
      {
        title: "Analytics that show every loss and gain",
        body: "You know exactly: where buyers come from, where they drop off and what sells best.\nDecisions based on numbers, not intuition.",
      },
    ],
  },
  whyUsEyebrow: "Why They Choose Us",
  whyUs: {
    headingBefore: "We build online stores",
    headingAccent: "that bring real revenue.",
    intro:
      "From small catalogs to large B2C platforms, every store needs an architecture that convinces the buyer and completes the sale without friction.\nWe combine UX, technology and sales strategy into a single product.",
    items: [
      { icon: "convert", title: "Focused on sales, not just looks", body: "" },
      { icon: "speed",   title: "Speed that directly impacts sales", body: "" },
      { icon: "mRoi",    title: "Analytics and continuous optimization", body: "" },
      { icon: "support", title: "Security and 24/7 support", body: "" },
    ],
  },
  processHeadline: "Four steps. A store ready to sell.",
  process: [
    {
      step: "01",
      title: "Strategy",
      desc: "We understand your products, clients and competition.\nWe build the store architecture.",
    },
    {
      step: "02",
      title: "Design & UX",
      desc: "A clear look and path to purchase.\nMobile-first, optimized checkout.",
    },
    {
      step: "03",
      title: "Development & integration",
      desc: "Payments, stock, email automation.\nEverything needed to sell.",
    },
    {
      step: "04",
      title: "Launch & growth",
      desc: "We go live, test the funnel.\nWe optimize based on real data.",
    },
  ],
  portfolioSlugs: ["esm-group", "bardhi-wellness", "hauswerk-niederbayern"],
  portfolioBlurbs: {
    "esm-group": "A professional B2B presence with a clear message and structure that generates concrete inquiries.",
    "bardhi-wellness": "A simplified path to the service and purchase, result: fewer questions, more conversions.",
    "hauswerk-niederbayern": "Visitors quickly find the service and reach out with clear expectations.",
  },
  feedbackLabel: "WHAT CLIENTS SAY",
  feedbackHeadline: "Stores that sell, every day.",
  feedbackSubline: "Real results, not promises.",
  testimonials: [
    {
      quote: "After building the platform, clients could order easily and purchases grew significantly in the first month.",
      name: "Mariglent S.",
      role: "ESM Group",
      location: "Milan, Italy",
    },
    {
      quote: "Online sales started right after launch. Simple checkout and payments without any issues.",
      name: "Bardhi U.",
      role: "Bardhi Wellness",
      location: "Pristina & Cologne",
    },
    {
      quote: "Clients quickly find what they're looking for and order without hesitation, something we didn't have with the old store.",
      name: "Vehbi P.",
      role: "Palushi Brothers",
      location: "London, UK",
    },
  ],
};
