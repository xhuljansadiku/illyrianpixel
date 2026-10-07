import type { WebHeroVariant } from "./webHeroVariants.sq";

export type { WebHeroVariant };

// ─── VARIANT 1: PREMIUM / LUXURY ───────────────────────────────────────────
export const heroVariantPremium: WebHeroVariant = {
  headline: "First-class digital presence, built for businesses that don't compromise.",
  subheadline:
    "Every project is a strategic investment: unrepeatable design, conversion architecture and digital authority built to last.",
  description:
    "We work with selective businesses that understand the value of a high-level digital presence. If you have high standards and want a partner who respects them, we're ready.",
  ctaPrimary: "Book a Private Consultation",
  ctaSecondary: "Discover the Process",
  trustLine: "Full confidentiality · Uncompromising execution · Results-driven commitment",
  subServices: [
    "World-Class Design",
    "Lasting Authority",
    "Premium Architecture",
    "Global Presence",
    "Exclusive Solutions",
  ],
};

// ─── VARIANT 2: DIRECT / AGGRESSIVE SALES ──────────────────────────────────
export const heroVariantAggressive: WebHeroVariant = {
  headline: "Professional website design for businesses that want more clients, not just visitors.",
  subheadline:
    "We build websites that look professional and turn visitors into real clients.",
  description: "",
  ctaPrimary: "Start your project →",
  ctaSecondary: "See our work",
  trustLine: "Free consultation · No obligation · Reply within 24h",
  subServices: [
    "Premium website",
    "SEO that brings clients",
    "High speed",
    "Custom design",
    "Simple CMS",
  ],
};

// ─── VARIANT 3: MINIMAL / APPLE-STYLE ──────────────────────────────────────
export const heroVariantMinimal: WebHeroVariant = {
  headline: "The perfect website doesn't exist, until we build it.",
  subheadline: "Precision. Performance. Measurable results.",
  description:
    "We build digital systems that are clean, fast and effective, no noise, no excess. Just what works.",
  ctaPrimary: "Start the Project",
  ctaSecondary: "See the Work",
  trustLine: "Free consultation · Total transparency · No obligation",
  subServices: [
    "Clear & fast web",
    "Clean E-Commerce",
    "Focused SEO",
    "Naturally mobile",
    "Custom & Minimal",
  ],
};

// ─── ACTIVE VARIANT ─────────────────────────────────────────────────────────
export const activeWebHeroVariant: WebHeroVariant = heroVariantAggressive;
