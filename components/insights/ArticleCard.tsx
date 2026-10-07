import type { Article } from "@/content/insights";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/** A small, unique pixel composition per card instead of stock imagery. */
const PIXEL_PATTERNS = [
  ["is-on", "", "is-accent", "", "is-deep", "", "is-on", "", ""],
  ["", "is-on", "", "is-deep", "", "is-on", "", "is-accent", ""],
  ["is-accent", "", "", "is-on", "is-on", "", "", "is-deep", "is-on"],
];

export function formatDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "sv" ? "sv-SE" : "en-GB", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}

type ArticleCardProps = {
  article: Article;
  locale: Locale;
  index: number;
  readingLabel: string;
  headingLevel?: "h2" | "h3";
};

export function ArticleCard({ article, locale, index, readingLabel, headingLevel = "h2" }: ArticleCardProps) {
  const Heading = headingLevel;
  const pattern = PIXEL_PATTERNS[index % PIXEL_PATTERNS.length];

  return (
    <article className="card card--interactive article-card">
      <div className="article-card__visual" aria-hidden="true">
        <span className="article-card__category">{article.category}</span>
        <span className="article-card__pixels">
          {pattern.map((tone, cell) => (
            <span key={cell} className={tone} />
          ))}
        </span>
      </div>
      <div className="article-card__body">
        <p className="sr-only">{article.category}</p>
        <Heading className="article-card__title">
          <Link href={{ pathname: "/insights/[slug]", params: { slug: article.slug } }} className="card__link">
            {article.title}
          </Link>
        </Heading>
        <p className="article-card__excerpt">{article.excerpt}</p>
        <p className="article-card__meta">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time>
          <span aria-hidden="true">·</span>
          <span>{readingLabel}</span>
        </p>
      </div>
    </article>
  );
}
