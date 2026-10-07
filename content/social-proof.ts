/**
 * Social proof. Both lists are intentionally empty: add ONLY real clients
 * (with permission to show their logo) and real, attributable testimonials.
 * While empty, the site shows honest fallbacks instead of fake proof.
 */
import type { Localized } from "./types";

export type ClientLogo = {
  name: string;
  /** Path in /public, e.g. "/clients/acme.svg" (monochrome works best). */
  logo: string;
  url?: string;
};

export type Testimonial = {
  quote: Localized<string>;
  name: string;
  role: Localized<string>;
  company: string;
};

export const CLIENT_LOGOS: ClientLogo[] = [];

export const TESTIMONIALS: Testimonial[] = [];
