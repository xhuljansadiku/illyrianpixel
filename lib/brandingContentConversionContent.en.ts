import { getConversionTrustStatsDefault, type ConversionLandingData } from "@/lib/conversionLandingShared";

export const brandingConversionLandingData: ConversionLandingData = {
  trustStats: {
    ...getConversionTrustStatsDefault("en"),
    reachLabel: "Tirana · diaspora · where status becomes presence",
  },
  painSection: {
    anchorId: "realiteti",
    eyebrow: "Reflection",
    headingBefore: "Your brand",
    headingAccent: "doesn't show your real value.",
    intro:
      "The business is good.\nBut the brand doesn't show it.\nThe right clients don't find you.",
    items: [
      {
        title: "Clients think you're cheaper than you are",
        body: "When the presence doesn't carry the same weight as the quality, the good client leaves without explanation: they're looking for certainty, and certainty shows before it's documented.",
      },
      {
        title: "Clients judge in 10 seconds, not from a brochure",
        body: "If they don't feel consistency and care for detail, they won't put you on the same shelf as the reference they pay gladly.",
      },
      {
        title: "You compete only on price, not value",
        body: "When the brand carries no narrative, only price remains, and that's where the game of selection is lost: you want clients who choose, not who compare.",
      },
      {
        title: "Clients don't remember you after the meeting",
        body: "A brand that doesn't stick in the mind loses more than a click, it loses your place on tomorrow's list of who's considered 'serious'.",
      },
    ],
  },
  solutionSection: {
    anchorId: "transformimi",
    eyebrow: "The Elevation",
    headingBefore: "We don't decorate the surface.",
    headingAccent: "We match presence with merit.",
    intro:
      "We start from the right question: who is the client who pays you best, what do they need to feel to choose you, and what makes that choice feel honored. Then we translate it into identity, image and content that carry the same luxury tone in every scene, from a meeting in Tirana to a presentation for the diaspora.",
    items: [
      {
        title: "We put you in the category of choice, not of comparison",
        body: "Premium isn't fussing over details: it's order, clarity and a silent signal: here, quality is never compromised.",
      },
      {
        title: "A presence that invites 'yes' before the discussion even opens",
        body: "When the identity and materials speak one language, the client feels less risk, and the discount is replaced with trust.",
      },
      {
        title: "Perceived value makes room for more worthy prices",
        body: "When you look like the reference, the client comes more prepared to pay for what they expect, because they've made up their mind before sitting at the table.",
      },
      {
        title: "A partner for the legacy of your impression",
        body: "We know the Albanian market and buyer behavior in the diaspora, and we keep the brand worthy as the team and the offer grow.",
      },
    ],
  },
  outcomesSection: {
    anchorId: "ndikimi",
    eyebrow: "The Legacy",
    headingBefore: "Not what we deliver.",
    headingAccent: "But how you're felt, and how you're chosen.",
    intro:
      "These are the shapes a brand takes when it becomes a privilege: better-fit clients, less shame about price, more respect in every meeting.",
    items: [
      {
        title: "Trust born before the wallet even opens",
        body: "From the business card to the page: the same level of dignity. The client feels they're entering somewhere care is standard, not extra.",
      },
      {
        title: "An identity that attracts those who pay better",
        body: "Your look excludes the race to the bottom: those who come, come because they want you, not because they were looking for 'cheaper'.",
      },
      {
        title: "Content that invites the desire for a meeting",
        body: "The words and images don't just fill a page, they build desire: to work with you, to book, to trust.",
      },
      {
        title: "One single language, the true luxury of consistency",
        body: "Social, print, presentation, team in the field: the same authority. Consistency is the strongest signal of status.",
      },
    ],
  },
  visualPowerSection: {
    anchorId: "pamja",
    eyebrow: "The First Rite",
    headingBefore: "The first second is",
    headingAccent: "the invitation into the room.",
    intro:
      "The brain decides before it reasons. A carefully considered look isn't 'decoration': it's respect for the client's time, and a silent invitation into a more worthy relationship.",
    items: [
      {
        title: "The first impression is your welcome",
        body: "If it's unclear or faded, the rest of the conversation fights to recover it, often without reaching the same level of trust.",
      },
      {
        title: "Quick judgment isn't superficiality, it's the filter of time",
        body: "The client scans: are you consistent, organized, worthy of trust? The answer shapes the price before the words do.",
      },
      {
        title: "Strong visuals make the offer land differently",
        body: "When trust is born earlier, every word about value falls softer: you're not asking for trust, you've already earned it with your look.",
      },
    ],
  },
  whyUsEyebrow: "The Solution",
  whyUs: {
    headingBefore: "We build brands that",
    headingAccent: "attract the right clients.",
    intro: "",
    items: [
      { icon: "bPsyche", title: "Professional logo and visual identity", body: "" },
      { icon: "bStory",  title: "A clear message for every platform", body: "" },
      { icon: "bTouch",  title: "Design that builds trust instantly", body: "" },
      { icon: "bEdge",   title: "A consistent, memorable brand", body: "" },
    ],
  },
  processHeadline: "A considered process. A presence that lasts.",
  process: [
    {
      step: "01",
      title: "Discovery",
      desc: "We listen to the ambition, the ideal client and the competition, until we understand what a person needs to feel before opening their wallet.",
    },
    {
      step: "02",
      title: "Strategy",
      desc: "Position, personality and key messages, before a single color point is touched. This is where the level of presence is decided.",
    },
    {
      step: "03",
      title: "Design & content",
      desc: "The identity, materials and images that carry the same tone: clear, worthy, consistent.",
    },
    {
      step: "04",
      title: "Refinement",
      desc: "Perfection until every detail is worthy of your name, then a guide your team follows without losing the elegance.",
    },
  ],
  portfolioSlugs: [],
  feedbackLabel: "",
  feedbackHeadline: "",
  testimonials: [
  ],
};
