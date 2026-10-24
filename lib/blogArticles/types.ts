// Artikuj blogu si të dhëna (2026-10-22): një komponent i vetëm (components/BlogStructuredArticle)
// i shfaq me të njëjtin stil si artikujt e shkruar me dorë, pa dyfishuar JSX për çdo artikull.
import type { Locale } from "@/i18n/routing";

/**
 * Blloqet e tekstit. Brenda `p`, `ul`, `ol` dhe `note` lejohen:
 *   **tekst i theksuar**  dhe  [tekst lidhjeje](/rruga-e-brendshme)
 */
export type BlogBlock = { h2: string } | { p: string } | { ul: string[] } | { ol: string[] } | { note: string };

export type StructuredArticle = {
  /** <title> dhe meta description (pa " | Illyrian Pixel", e shton buildMetadata) */
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  category: string;
  title: string;
  /** Nëntitulli nën titull dhe excerpt-i te lista e blogut */
  description: string;
  /** Emri i shkurtër për breadcrumb */
  breadcrumb: string;
  /** Si shfaqet data, p.sh. "Tetor 2026" */
  date: string;
  readTime: string;
  related: { slug: string; title: string; category: string }[];
  blocks: BlogBlock[];
  cta: { title: string; body: string; button: string };
};

export type StructuredArticlePair = {
  slug: string;
  /** ISO, për sitemap dhe schema Article */
  published: string;
  /** ISO — vendose vetëm kur ndryshon përmbajtja (jo titulli/meta); pa të = published */
  modified?: string;
} & Record<Locale, StructuredArticle>;
