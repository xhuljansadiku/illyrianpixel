import { caseStudies } from "@/lib/caseStudies";

export type WhyUsIcon =
  | "convert"
  | "seo"
  | "speed"
  | "support"
  /** Marketing — minimal feature icons */
  | "mFocus"
  | "mAudience"
  | "mRoi"
  | "mScale"
  /** Branding — minimal feature icons */
  | "bPsyche"
  | "bStory"
  | "bTouch"
  | "bEdge";

export type WhyUsItem = {
  title: string;
  body: string;
  icon: WhyUsIcon;
};

/** Shared trust bar — service conversion pages (counts animate on scroll) */
export type ConversionTrustStats = {
  primaryCount: number;
  primaryLabel: string;
  secondaryCount: number;
  secondaryLabel: string;
  tertiaryCount: number;
  tertiaryLabel: string;
  /** Optional subline under the stats row */
  reachLabel?: string;
};

export const conversionTrustStatsDefault: ConversionTrustStats = {
  primaryCount: 6,
  primaryLabel: "vite eksperiencë",
  secondaryCount: 100,
  secondaryLabel: "projekte",
  tertiaryCount: 80,
  tertiaryLabel: "klientë besnikë",
};

/** Shared “Pse ne” headline + intro — all service conversion landings */
export const conversionWhyUsHeroDefault = {
  headingBefore: "6+ vite në shërbim",
  headingAccent: "të biznesit tuaj.",
  intro:
    "Punojmë me biznese shqiptare në Shqipëri dhe diasporë.\nProcese të qarta, komunikim profesional dhe rezultate reale, jo vetëm premtime.",
} as const;

/** Pain / solution / outcomes blocks (optional; e.g. marketing-growth CRO flow) */
export type ConversionTextCardSection = {
  anchorId?: string;
  eyebrow: string;
  headingBefore: string;
  headingAccent: string;
  intro?: string;
  items: readonly { title: string; body: string }[];
};

export type ConversionLandingData = {
  trustStats: ConversionTrustStats;
  /** Situata / problemi — optional, rendered after trust bar */
  painSection?: ConversionTextCardSection;
  /** Si e zgjidhim — optional */
  solutionSection?: ConversionTextCardSection;
  /** Çfarë merrni në praktikë — optional, outcome-framed */
  outcomesSection?: ConversionTextCardSection;
  /** Pamja / përmbajtja si motor konvertimi — opsionale (e.g. branding-content) */
  visualPowerSection?: ConversionTextCardSection;
  /** Overrides SectionMark label above whyUs (default: "Pse ne") */
  whyUsEyebrow?: string;
  whyUs: {
    headingBefore: string;
    headingAccent: string;
    intro: string;
    items: WhyUsItem[];
  };
  process: readonly { step: string; title: string; desc: string }[];
  /** Optional custom headline for the process section (falls back to generic) */
  processHeadline?: string;
  portfolioSlugs: readonly string[];
  /** Optional per-slug blurb overrides for portfolio cards */
  portfolioBlurbs?: Record<string, string>;
  testimonials: readonly { quote: string; name: string; role: string; location?: string }[];
  /** Optional overrides for the feedback section header (falls back to generic) */
  feedbackLabel?: string;
  feedbackHeadline?: string;
  feedbackSubline?: string;
};

export function getPortfolioCardsFromSlugs(slugs: readonly string[]) {
  return slugs
    .map((slug) => {
      const study = caseStudies.find((c) => c.slug === slug);
      if (!study) return null;
      return {
        slug: study.slug,
        title: study.title,
        image: study.heroImage,
        blurb: study.result,
        category: study.category,
      };
    })
    .filter(Boolean) as Array<{
    slug: string;
    title: string;
    image: string;
    blurb: string;
    category: string;
  }>;
}
