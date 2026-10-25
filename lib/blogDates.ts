// Datat e artikujve të blogut — burim i vetëm për sitemap-in dhe schema Article (2026-10-24).
// published = data e publikimit; modified = ndryshimi i fundit i PËRMBAJTJES (nga git log).
// Ndryshimet vetëm te titulli/meta description nuk e lëvizin `modified` — Google s'do data
// të rifreskuara pa ndryshim real. Importohet vetëm nga kodi i serverit (si lib/blogArticles).
import { STRUCTURED_ARTICLES } from "@/lib/blogArticles";
import { buildArticleSchema } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

type BlogDates = { published: string; modified: string };

const HANDWRITTEN: Record<string, BlogDates> = {
  "si-te-rrisesh-klientet-online": { published: "2026-04-10", modified: "2026-10-13" },
  "gabimet-kryesore-ne-website": { published: "2026-04-15", modified: "2026-10-13" },
  // 2026-10-24: hiqen statistikat pa burim dhe premtimet për rezultate (fix/blog-overclaims)
  "pse-seo-eshte-kritik": { published: "2026-04-20", modified: "2026-10-24" },
  "google-ads-vs-seo": { published: "2026-05-05", modified: "2026-10-24" },
  "pse-ecommerce-eshte-i-rendesishem": { published: "2026-05-10", modified: "2026-10-25" },
  "cfare-eshte-branding": { published: "2026-05-15", modified: "2026-10-24" },
  "sa-kushton-website-shqiperi": { published: "2026-05-20", modified: "2026-07-30" },
  "seo-tirane": { published: "2026-05-22", modified: "2026-10-25" },
  "dyqan-online-shqiperi": { published: "2026-05-24", modified: "2026-10-25" },
  "google-ads-shqiperi": { published: "2026-05-26", modified: "2026-07-30" },
  "web-design-tirane": { published: "2026-05-28", modified: "2026-07-30" },
  "social-media-menaxhim-shqiperi": { published: "2026-05-30", modified: "2026-07-12" },
  // 2026-10-25: hiqet citimi i shpikur, premtimi "shlyhet brenda 2–3 muajve" dhe paneli admin
  "menaxho-biznesin-nga-diaspora": { published: "2026-07-25", modified: "2026-10-25" },
  "website-dygjuhesh-biznes-diaspore": { published: "2026-07-25", modified: "2026-10-25" },
  "si-te-gjejne-klientet-shqiptare-biznesin-tend": { published: "2026-07-25", modified: "2026-07-30" },
  "sa-kushton-website-kosove": { published: "2026-07-29", modified: "2026-07-30" },
};

export const BLOG_DATES: Record<string, BlogDates> = {
  ...HANDWRITTEN,
  ...Object.fromEntries(
    STRUCTURED_ARTICLES.map((a) => [a.slug, { published: a.published, modified: a.modified ?? a.published }])
  ),
};

/** Schema Article për një artikull blogu, me datat nga BLOG_DATES. */
export const blogArticleSchema = (slug: string, title: string, description: string, locale: Locale) => {
  const dates = BLOG_DATES[slug];
  return buildArticleSchema({
    title,
    description,
    path: `/blog/${slug}`,
    locale,
    published: dates?.published ?? "2026-05-10",
    modified: dates?.modified,
  });
};
