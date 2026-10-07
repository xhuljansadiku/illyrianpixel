import type { Locale, Localized, ServiceId } from "./types";

/**
 * Case studies.
 *
 * IMPORTANT: only publish real projects with the client's permission, and only
 * real, verifiable results. The entries below are PLACEHOLDERS that show the
 * structure — replace them (or delete them) before launch. Placeholder entries
 * are marked `placeholder: true`: their pages are `noindex` and they are left
 * out of the sitemap.
 *
 * Real screenshots go in /public/work/<slug>/ and are referenced in `images`.
 */
export type ProjectTheme = "blue" | "navy" | "mist";
export type ProjectMockup = "site" | "shop" | "brand";

export type ProjectResult = { value: string; label: string };

export type ProjectImages = {
  cover?: string;
  desktop?: string;
  tablet?: string;
  mobile?: string;
};

type ProjectCopy = {
  client: string;
  industry: string;
  location: string;
  summary: string;
  challenge: string;
  strategy: string;
  solution: string;
  results: ProjectResult[];
  /** Alt text describing the screenshots, once real images exist. */
  imageAlt: string;
};

type ProjectBase = {
  slug: string;
  placeholder: boolean;
  services: ServiceId[];
  theme: ProjectTheme;
  mockup: ProjectMockup;
  year?: string;
  /** Live website, if public. */
  url?: string;
  images?: ProjectImages;
};

export type Project = ProjectBase & ProjectCopy;

const placeholderCopy = (letter: string): Localized<ProjectCopy> => ({
  sv: {
    client: `[CLIENT NAME ${letter}]`,
    industry: "[INDUSTRY]",
    location: "[LOCATION]",
    summary: "[SHORT PROJECT DESCRIPTION — one or two sentences about what was created.]",
    challenge: "[THE CHALLENGE — What problem did the client have?]",
    strategy: "[THE STRATEGY — What approach did Nordic Pixel take?]",
    solution: "[THE SOLUTION — What was designed and developed?]",
    results: [
      { value: "[+X %]", label: "[PROJECT RESULT]" },
      { value: "[+X %]", label: "[PROJECT RESULT]" },
      { value: "[X]", label: "[PROJECT RESULT]" },
    ],
    imageAlt: "[IMAGE DESCRIPTION]",
  },
  en: {
    client: `[CLIENT NAME ${letter}]`,
    industry: "[INDUSTRY]",
    location: "[LOCATION]",
    summary: "[SHORT PROJECT DESCRIPTION — one or two sentences about what was created.]",
    challenge: "[THE CHALLENGE — What problem did the client have?]",
    strategy: "[THE STRATEGY — What approach did Nordic Pixel take?]",
    solution: "[THE SOLUTION — What was designed and developed?]",
    results: [
      { value: "[+X%]", label: "[PROJECT RESULT]" },
      { value: "[+X%]", label: "[PROJECT RESULT]" },
      { value: "[X]", label: "[PROJECT RESULT]" },
    ],
    imageAlt: "[IMAGE DESCRIPTION]",
  },
});

const PROJECTS: (ProjectBase & { copy: Localized<ProjectCopy> })[] = [
  {
    slug: "client-a",
    placeholder: true,
    services: ["web-development", "seo-google-ads"],
    theme: "blue",
    mockup: "site",
    copy: placeholderCopy("A"),
  },
  {
    slug: "client-b",
    placeholder: true,
    services: ["e-commerce", "digital-marketing"],
    theme: "navy",
    mockup: "shop",
    copy: placeholderCopy("B"),
  },
  {
    slug: "client-c",
    placeholder: true,
    services: ["branding-content", "web-development"],
    theme: "mist",
    mockup: "brand",
    copy: placeholderCopy("C"),
  },
];

export function getProjects(locale: Locale): Project[] {
  return PROJECTS.map(({ copy, ...base }) => ({ ...base, ...copy[locale] }));
}

export function getProject(locale: Locale, slug: string): Project | null {
  return getProjects(locale).find((project) => project.slug === slug) ?? null;
}

export const PROJECT_SLUGS = PROJECTS.map((project) => project.slug);
