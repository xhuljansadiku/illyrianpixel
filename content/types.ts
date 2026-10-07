import type { Locale, StaticPathname } from "@/i18n/routing";

export type { Locale, StaticPathname };

export type Localized<T> = Record<Locale, T>;

/**
 * Long-form content (articles, legal pages, case studies) is stored as blocks.
 * Inline text supports two lightweight markers:
 *   [label](/contact)  → localized internal link (internal route from i18n/routing.ts)
 *   [label](https://…) → external link
 *   **bold**           → strong emphasis
 */
export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id?: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; title?: string; text: string };

export type ServiceId =
  | "web-development"
  | "e-commerce"
  | "seo-google-ads"
  | "branding-content"
  | "digital-marketing"
  | "maintenance-growth";

export type FaqItem = { question: string; answer: string };

export type TitledText = { title: string; text: string };
