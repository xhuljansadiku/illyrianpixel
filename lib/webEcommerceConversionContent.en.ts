import {
  getConversionTrustStatsDefault,
  getConversionWhyUsHeroDefault,
  type ConversionLandingData,
} from "@/lib/conversionLandingShared";

export const webConversionLandingData: ConversionLandingData = {
  trustStats: { ...getConversionTrustStatsDefault("en") },
  whyUs: {
    ...getConversionWhyUsHeroDefault("en"),
    items: [
      {
        icon: "convert",
        title: "Professional website",
        body: "",
      },
      {
        icon: "seo",
        title: "Clear structure, no confusion",
        body: "",
      },
      {
        icon: "speed",
        title: "SEO that brings you clients",
        body: "",
      },
      {
        icon: "support",
        title: "Long-term partner",
        body: "",
      },
    ],
  },
  process: [
    {
      step: "1",
      title: "Strategy",
      desc: "We understand your business and clients.\nWe build the plan and structure.",
    },
    {
      step: "2",
      title: "Design",
      desc: "We create a clear look and structure.\nFocused on conversion.",
    },
    {
      step: "3",
      title: "Development",
      desc: "We turn it into a fast, functional website.\nOptimized for Google.",
    },
    {
      step: "4",
      title: "Launch",
      desc: "We take it live, secure and ready for clients.\nWe stay partners.",
    },
  ],
  processHeadline: "A clear process, no surprises.",
  portfolioBlurbs: {
    "esm-group": "A B2B website with a clear message and structure that brings more concrete inquiries.",
    "bardhi-wellness": "A simplified structure and clear path for the client.\nResult: fewer questions, more purchases.",
    "hauswerk-niederbayern": "Visitors quickly find the service and reach out with clear expectations.",
  },
  portfolioSlugs: ["esm-group", "bardhi-wellness", "hauswerk-niederbayern"],
  feedbackLabel: "WHAT CLIENTS SAY",
  feedbackHeadline: "Real results from businesses like yours.",
  feedbackSubline: "Fewer words. More results.",
  testimonials: [
    {
      quote: "Clients understand what we do faster and conversations are more concrete.",
      name: "Mariglent S.",
      role: "ESM Group",
      location: "Milan, Italy",
    },
    {
      quote: "The package presentation and brand message now look more professional and trustworthy.",
      name: "Bardhi U.",
      role: "Bardhi Wellness",
      location: "Pristina & Cologne",
    },
    {
      quote: "Visitors quickly find the service and inquiries are more accurate.",
      name: "Amir S.",
      role: "Hauswerk Niederbayern",
      location: "Straubing, Germany",
    },
    {
      quote: "Clients contact us with clear expectations from the start.",
      name: "Vehbi P.",
      role: "Palushi Brothers",
      location: "London, UK",
    },
  ],
};
