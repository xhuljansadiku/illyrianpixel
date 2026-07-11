import {
  getConversionTrustStatsDefault,
  type ConversionLandingData,
} from "@/lib/conversionLandingShared";

export const smmConversionLandingData: ConversionLandingData = {
  trustStats: {
    ...getConversionTrustStatsDefault("en"),
    reachLabel: "An active, professional social presence every day",
  },
  painSection: {
    anchorId: "situata",
    eyebrow: "The Reality",
    headingBefore: "Social media without a strategy",
    headingAccent: "is wasted time.",
    intro:
      "You post every day.\nBut followers don't become clients.\nThe presence exists, the system is missing.",
    items: [
      {
        title: "Posts with no results, burned time",
        body: "Without a strategy, posts fill the feed but don't bring clients. Time passes, the audience doesn't grow, sales stay the same.",
      },
      {
        title: "An irregular presence loses trust",
        body: "When a profile is active for a week and silent for two, the audience forgets. Consistency builds trust, its absence destroys it.",
      },
      {
        title: "Weak design lowers brand value",
        body: "Different graphics, inconsistent colors, careless photos, the visitor feels a lack of professionalism without reading a single word.",
      },
      {
        title: "Without analytics, you don't know what works",
        body: "If you don't measure reach, engagement and conversion, future posts are just as blind as the first ones.",
      },
    ],
  },
  whyUsEyebrow: "The Solution",
  whyUs: {
    headingBefore: "Social media that brings",
    headingAccent: "clients, not just followers.",
    intro: "",
    items: [
      { icon: "mAudience", title: "Content that attracts the right clients", body: "" },
      { icon: "mFocus",    title: "The same professional design every day", body: "" },
      { icon: "mScale",    title: "Regular posting, no stress for you", body: "" },
      { icon: "mRoi",      title: "Measurable results every month", body: "" },
    ],
  },
  processHeadline: "Four steps. A professional presence.",
  process: [
    {
      step: "01",
      title: "Audit",
      desc: "We analyze your existing profiles.\nWe identify opportunities and gaps.",
    },
    {
      step: "02",
      title: "Strategy",
      desc: "A clear plan: platforms, tone, frequency.\nA custom content calendar.",
    },
    {
      step: "03",
      title: "Production",
      desc: "Graphic design, captions and Reels.\nContent ready and approved.",
    },
    {
      step: "04",
      title: "Optimization",
      desc: "Monthly performance analysis.\nAn updated strategy based on numbers.",
    },
  ],
  portfolioSlugs: [],
  feedbackLabel: "",
  feedbackHeadline: "",
  testimonials: [],
};
