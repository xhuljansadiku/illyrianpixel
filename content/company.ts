/**
 * Company details for the footer, contact page, legal pages and structured data.
 *
 * Values in [BRACKETS] are placeholders. Replace them with the real details once
 * the Swedish company is registered — never invent them. Placeholders are shown
 * as visibly marked text on the site and are left out of structured data (JSON-LD).
 */
export const company = {
  brand: "Nordic Pixel",
  legalName: "[COMPANY NAME AB]",
  orgNumber: "[ORG. NUMBER]",
  address: "[REGISTERED ADDRESS]",
  email: "[EMAIL]",
  phone: "[PHONE]",
  /** Social profiles. Leave as null until the profile exists — null links are not rendered. */
  social: {
    linkedin: null as string | null,
    instagram: null as string | null,
    facebook: null as string | null,
  },
} as const;

export type SocialNetwork = keyof typeof company.social;

/** True for empty values and "[PLACEHOLDER]" tokens. */
export function isPlaceholder(value: string | null | undefined): boolean {
  if (!value) return true;
  return /^\[.*\]$/.test(value.trim());
}

/** Real (non-placeholder) value or null. */
export function realValue(value: string | null | undefined): string | null {
  return isPlaceholder(value) ? null : (value as string).trim();
}

export function socialLinks(): { network: SocialNetwork; url: string }[] {
  return (Object.entries(company.social) as [SocialNetwork, string | null][])
    .filter((entry): entry is [SocialNetwork, string] => typeof entry[1] === "string" && entry[1].length > 0)
    .map(([network, url]) => ({ network, url }));
}
