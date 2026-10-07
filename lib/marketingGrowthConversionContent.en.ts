import {
  getConversionTrustStatsDefault,
  type ConversionLandingData,
} from "@/lib/conversionLandingShared";

export const marketingConversionLandingData: ConversionLandingData = {
  trustStats: {
    ...getConversionTrustStatsDefault("en"),
    reachLabel: "Today starts with a decision, not a hope",
  },
  painSection: {
    anchorId: "situata",
    eyebrow: "No Filters",
    headingBefore: "You're losing clients",
    headingAccent: "every day.",
    intro:
      "The business is working.\nBut the phone isn't ringing.\nThe clients are out there, you're not being found.",
    items: [
      {
        title: "The phone doesn't ring for days",
        body: "Every hour without a new inquiry is money that never hits the register, and a nerve that goes to a competitor with no 'prettier' campaign than yours.",
      },
      {
        title: "You spend on ads, but no clients come",
        body: "Endless clicks, zero meetings. The budget leaves the account, but the client's voice never reaches you. This is painful, and measurable.",
      },
      {
        title: "The site looks good, but doesn't bring orders",
        body: "If the visitor doesn't feel urgency and trust within 10 seconds, they close the tab. You're left with a design, they're left with the sale.",
      },
      {
        title: "Dependent on referrals, no new clients",
        body: "Referrals are gold, but if the flow stops when the list runs out, you're one bad month away from trouble.",
      },
    ],
  },
  solutionSection: {
    anchorId: "zgjidhja",
    eyebrow: "The Intervention",
    headingBefore: "We don't sell you 'more advertising'.",
    headingAccent: "We sell you the path to money.",
    intro:
      "First: who buys, where they decide, what fear they have, what offer forces them to act. Then: a page and campaign that speak one language, the owner's, the one who's going to pay. No theater. No endless waiting.",
    items: [
      {
        title: "Strategy before budget, otherwise it's just noise",
        body: "If we don't know what number counts as profit for you, every euro is a gamble. We set the target before the card gets charged.",
      },
      {
        title: "The page becomes an inquiry machine, not a brochure",
        body: "One clear action: call, book, form. No 'check this out too' that steals the buyer's attention.",
      },
      {
        title: "Google Ads only where your buyer is ready to open their wallet",
        body: "SEO and Google Ads. We use them to buy attention that turns into a conversation, not clicks that don't pay the bill.",
      },
      {
        title: "Every week: measure, cut, grow",
        body: "What's burning money? Cut it. What's working? Multiply it. You don't wait for the 'pretty report', you get the next decision.",
      },
    ],
  },
  outcomesSection: {
    anchorId: "rezultate",
    eyebrow: "What Changes",
    headingBefore: "Not promises in the air.",
    headingAccent: "Results you can feel.",
    intro:
      "These are the things a business owner should feel in the bank account and on the phone, not in a PowerPoint.",
    items: [
      {
        title: "More calls and messages that make sense",
        body: "Less 'just asking'. More 'I want a quote, when can we start'. That's the difference between exhaustion and growth.",
      },
      {
        title: "More money from the same traffic",
        body: "You don't always need more visitors, you often need a page and offer that don't embarrass you after the click.",
      },
      {
        title: "Less money burned on ads",
        body: "The budget goes to what converts, or it stops. We don't let it 'try itself out' until the month is over.",
      },
      {
        title: "Predictability that lets you sleep",
        body: "You know what was tested, what worked, what's coming next. Not magic, control.",
      },
    ],
  },
  whyUsEyebrow: "The Solution",
  whyUs: {
    headingBefore: "Here's how we",
    headingAccent: "solve this:",
    intro: "",
    items: [
      { icon: "mFocus",    title: "We bring clients, not just clicks", body: "" },
      { icon: "mAudience", title: "We work for the Albanian market and the diaspora", body: "" },
      { icon: "mRoi",      title: "We tell you the truth, not what you want to hear", body: "" },
      { icon: "mScale",    title: "We scale only when the results allow it", body: "" },
    ],
  },
  processHeadline: "Four steps. No excuses.",
  process: [
    {
      step: "01",
      title: "Analysis",
      desc: "Where you're losing money today: offer, page, ads, competition. Without a solid analysis, every campaign is a gamble with yourself.",
    },
    {
      step: "02",
      title: "Strategy",
      desc: "Which channel, which message, which success number. Without this, you're running in place.",
    },
    {
      step: "03",
      title: "Execution",
      desc: "We set up or change everything that touches money: page, creative, offer. One narrative, one goal: contact.",
    },
    {
      step: "04",
      title: "Optimization",
      desc: "Every week: more inquiries with the same budget, or the same result with less waste. That's the game.",
    },
  ],
  portfolioSlugs: ["palushi-brothers", "bardhi-wellness"],
  portfolioBlurbs: {
    "hauswerk-niederbayern": "Fewer wasted clicks, more inquiries asking for a price and a date.",
    "esm-group": "A message that outlasts the competition, and a page that backs up the B2B conversation.",
    "suli-group-trockenbau": "Before the toolbox is even open, the client has already mentally chosen you.",
  },
  feedbackLabel: "WHAT CLIENTS SAY",
  feedbackHeadline: "What our clients say.",
  testimonials: [
    {
      quote: "Clients contact us with clear expectations from the start.",
      name: "Vehbi P.",
      role: "Palushi Brothers",
      location: "London, UK",
    },
    {
      quote: "The package presentation and brand message now look more professional and trustworthy.",
      name: "Bardhi U.",
      role: "Bardhi Wellness",
      location: "Pristina & Cologne",
    },
  ],
};
