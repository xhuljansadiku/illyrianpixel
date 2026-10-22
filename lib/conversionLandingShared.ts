import { getCaseStudies } from "@/lib/caseStudies";
import { CLIENT_COUNTRIES } from "@/lib/clientLocations";
import type { Locale } from "@/i18n/routing";

export type WhyUsIcon =
  | "convert"
  | "seo"
  | "speed"
  | "support"
  /** Marketing, minimal feature icons */
  | "mFocus"
  | "mAudience"
  | "mRoi"
  | "mScale"
  /** Branding, minimal feature icons */
  | "bPsyche"
  | "bStory"
  | "bTouch"
  | "bEdge";

export type WhyUsItem = {
  title: string;
  body: string;
  icon: WhyUsIcon;
};

/** Shared trust bar, service conversion pages (counts animate on scroll) */
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

// 2026-10-22: numrat llogariten nga të dhënat e faqes (portofoli, lib/clientLocations), që të jenë
// gjithmonë të vërtetë. Më parë ishin fiks "6 vite eksperiencë · 100 projekte · 80 klientë besnikë" —
// s'dalin nga asnjë burim dhe s'përputhen me portofolin (8 projekte). Nëse pronari i konfirmon,
// rikthehen duke zëvendësuar vlerat më poshtë me ato të komentuarat:
// Vlerat e vjetra: sq { 6 "vite eksperiencë", 100 "projekte", 80 "klientë besnikë" }
//                  en { 6 "years of experience", 100 "projects", 80 "loyal clients" }
// Q-16 (2026-10-22): pronari ka eksperiencë që nga 2020 → vitet rikthehen (llogariten, s'vjetrohen);
// "100 projekte / 80 klientë" mbeten jashtë derisa pronari të japë numrin real.
export const EXPERIENCE_SINCE_YEAR = 2020;
const experienceYears = () => new Date().getFullYear() - EXPERIENCE_SINCE_YEAR;

const CONVERSION_TRUST_STATS: Record<Locale, ConversionTrustStats> = {
  sq: {
    primaryCount: experienceYears(),
    primaryLabel: "vite eksperiencë",
    secondaryCount: getCaseStudies("sq").length,
    secondaryLabel: "projekte në portofol",
    tertiaryCount: CLIENT_COUNTRIES.length,
    tertiaryLabel: "vende me klientë",
  },
  en: {
    primaryCount: experienceYears(),
    primaryLabel: "years of experience",
    secondaryCount: getCaseStudies("en").length,
    secondaryLabel: "projects in our portfolio",
    tertiaryCount: CLIENT_COUNTRIES.length,
    tertiaryLabel: "countries with clients",
  },
};

export function getConversionTrustStatsDefault(locale: Locale): ConversionTrustStats {
  return CONVERSION_TRUST_STATS[locale];
}

/** Shared “Pse ne” headline + intro, all service conversion landings */
const CONVERSION_WHY_US_HERO: Record<Locale, { headingBefore: string; headingAccent: string; intro: string }> = {
  sq: {
    headingBefore: "Zgjidhja =",
    headingAccent: "Ne.",
    intro:
      "Punojmë me biznese shqiptare në Shqipëri dhe diasporë.\nProcese të qarta, komunikim profesional dhe rezultate reale, jo vetëm premtime.",
  },
  en: {
    headingBefore: "The solution =",
    headingAccent: "Us.",
    intro:
      "We work with Albanian businesses in Albania and the diaspora.\nClear processes, professional communication and real results, not just promises.",
  },
};

export function getConversionWhyUsHeroDefault(locale: Locale) {
  return CONVERSION_WHY_US_HERO[locale];
}

/** Pain / solution / outcomes blocks (optional; e.g. seo-google-ads CRO flow) */
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
  /** Situata / problemi, optional, rendered after trust bar */
  painSection?: ConversionTextCardSection;
  /** Si e zgjidhim, optional */
  solutionSection?: ConversionTextCardSection;
  /** Çfarë merrni në praktikë, optional, outcome-framed */
  outcomesSection?: ConversionTextCardSection;
  /** Pamja / përmbajtja si motor konvertimi, opsionale (e.g. branding-content) */
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
  /** Optional custom portfolio section heading (white part) */
  portfolioHeadingBefore?: string;
  /** Optional custom portfolio section heading (accent part) */
  portfolioHeadingAccent?: string;
  /** Optional subline below the portfolio heading */
  portfolioSubline?: string;
  testimonials: readonly { quote: string; name: string; role: string; location?: string }[];
  /** Optional overrides for the feedback section header (falls back to generic) */
  feedbackLabel?: string;
  feedbackHeadline?: string;
  feedbackSubline?: string;
  /** Optional badge shown above the testimonials heading */
  feedbackBadge?: string;
};

export function getPortfolioCardsFromSlugs(slugs: readonly string[], locale: Locale = "sq") {
  const studies = getCaseStudies(locale);
  return slugs
    .map((slug) => {
      const study = studies.find((c) => c.slug === slug);
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
