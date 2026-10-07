import {
  getConversionTrustStatsDefault,
  type ConversionLandingData,
} from "@/lib/conversionLandingShared";

export const maintenanceConversionLandingData: ConversionLandingData = {
  trustStats: {
    ...getConversionTrustStatsDefault("en"),
    reachLabel: "A website that never stops, fast, secure and always online.",
  },
  painSection: {
    anchorId: "situata",
    eyebrow: "The Reality",
    headingBefore: "A website without maintenance",
    headingAccent: "is on borrowed time.",
    intro:
      "The site exists, but it's slow,\nold, or at risk of failing.\nWithout regular care,\nyou lose clients every day without realizing it.",
    items: [
      {
        title: "A few minutes offline, and you lose clients",
        body: "Visitors go to the competition. If it's not monitored, you might not realize it for hours.",
      },
      {
        title: "Old plugins open the door to attacks",
        body: "Most attacks happen because of missing updates. Without maintenance, your site is exposed.",
      },
      {
        title: "A slow site, clients who leave",
        body: "If loading takes more than 3 seconds, most people leave. Speed isn't a detail, it's conversion.",
      },
      {
        title: "Without backup, one mistake costs you dearly",
        body: "A technical problem can wipe out everything. Without an active backup, recovery starts from zero.",
      },
    ],
  },
  whyUsEyebrow: "The Solution",
  whyUs: {
    headingBefore: "Your site,",
    headingAccent: "always online and fast.",
    intro: "",
    items: [
      { icon: "support", title: "24/7 monitoring and immediate response", body: "" },
      { icon: "speed",   title: "The site gets faster every month", body: "" },
      { icon: "seo",     title: "We rebuild old sites from scratch", body: "" },
      { icon: "convert", title: "You focus on the business, we focus on the tech", body: "" },
    ],
  },
  processHeadline: "You focus on the business.\nWe keep the website online.",
  process: [
    {
      step: "01",
      title: "Full website audit",
      desc: "We identify critical issues: security, speed and stability, before they turn into lost clients.",
    },
    {
      step: "02",
      title: "Complete technical setup",
      desc: "We set up monitoring, backup and protection. Your site becomes secure within 24 hours.",
    },
    {
      step: "03",
      title: "Active maintenance every month",
      desc: "Updates, optimization and continuous checks, no interruptions, no surprises.",
    },
    {
      step: "04",
      title: "Total transparency",
      desc: "A clear monthly report: what was done, what was improved and what's next.",
    },
  ],
  portfolioSlugs: ["esm-group", "bardhi-wellness", "hauswerk-niederbayern"],
  portfolioHeadingBefore: "From technical problems →",
  portfolioHeadingAccent: "stability and performance.",
  portfolioSubline: "Active maintenance that keeps sites fast, secure and always online, without interruptions.",
  portfolioBlurbs: {
    "esm-group": "Stability and consistent performance\nAn optimized B2B website, continuously monitored, no downtime, no lost clients.",
    "bardhi-wellness": "A website that's always fast and secure\nWith active maintenance, the site stays optimal every day. Clients don't wait, the business grows.",
    "hauswerk-niederbayern": "A stable system with no interruptions\nContinuous monitoring and optimization. The business runs without worrying about the technology.",
  },
  feedbackLabel: "WHAT CLIENTS SAY",
  feedbackHeadline: "We take care of the site.\nYou take care of the business.",
  feedbackSubline: "24/7 monitoring, immediate response and consistent performance, without interruptions.",
  feedbackBadge: "Real clients",
  testimonials: [
    {
      quote: "Since we started maintenance, the site hasn't had a single problem.\nWe get notified immediately about everything. Everything is under control.",
      name: "Mariglent S.",
      role: "ESM Group",
      location: "Milan, Italy",
    },
    {
      quote: "The site was slow and unoptimized.\nAfter maintenance, it loads much faster and clients stay longer.",
      name: "Bardhi U.",
      role: "Bardhi Wellness",
      location: "Pristina & Cologne",
    },
    {
      quote: "I no longer deal with technical problems.\nEverything gets solved quickly and without stress. I know the site is in safe hands.",
      name: "Amir S.",
      role: "Hauswerk Niederbayern",
      location: "Straubing, Germany",
    },
  ],
};
