import type { Locale } from "@/i18n/routing";
import { en } from "./en";
import { sv, type Dictionary } from "./sv";

const DICTIONARIES: Record<Locale, Dictionary> = { sv, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

export type { Dictionary };
