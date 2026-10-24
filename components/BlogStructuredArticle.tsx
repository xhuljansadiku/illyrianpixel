import type { Metadata } from "next";
import { Fragment } from "react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import BlogArticleLayout from "@/components/BlogArticleLayout";
import { buildMetadata, jsonLd, seo } from "@/lib/seo";
import type { BlogBlock, StructuredArticlePair } from "@/lib/blogArticles/types";
import { blogArticleSchema } from "@/lib/blogDates";

const P = "whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68";
const LIST = "space-y-3 text-[1.02rem] leading-relaxed text-white/68";
const H2 = "font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white";
const LINK = "text-accent underline underline-offset-4";
// Kategoria e lidhjes s'përdor ngjyra të veçanta — BlogArticleLayout ka një stil të vetëm për të gjitha
const CATEGORY_COLOR = "rgba(234,206,113,0.95)";

/** "**x**" → <strong>, "[x](/path)" → <Link>; pjesa tjetër tekst i thjeshtë */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const bold = /^\*\*([^*]+)\*\*$/.exec(part);
        if (bold) return <strong key={i} className="text-white">{bold[1]}</strong>;
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (link) return <Link key={i} href={link[2]} className={LINK}>{link[1]}</Link>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

function Block({ block }: { block: BlogBlock }) {
  if ("h2" in block) return <h2 className={H2}>{block.h2}</h2>;
  if ("p" in block) return <p className={P}><Inline text={block.p} /></p>;
  if ("note" in block)
    return (
      <p className="rounded-xl border-l-2 border-accent/60 bg-white/[0.03] px-5 py-4 text-[0.98rem] leading-relaxed text-white/75">
        <Inline text={block.note} />
      </p>
    );
  const Tag = "ul" in block ? "ul" : "ol";
  const items = "ul" in block ? block.ul : block.ol;
  return (
    <Tag className={`${LIST} ${Tag === "ul" ? "list-disc" : "list-decimal"} pl-5 marker:text-accent/70`}>
      {items.map((item, i) => (
        <li key={i}><Inline text={item} /></li>
      ))}
    </Tag>
  );
}

/** Ndan blloqet në seksione sipas çdo h2, si artikujt e shkruar me dorë (<section className="space-y-4">) */
function sections(blocks: BlogBlock[]) {
  const out: BlogBlock[][] = [];
  for (const b of blocks) {
    if ("h2" in b || out.length === 0) out.push([b]);
    else out[out.length - 1].push(b);
  }
  return out;
}

export function structuredArticleMetadata(pair: StructuredArticlePair, locale: Locale): Promise<Metadata> | Metadata {
  const a = pair[locale] ?? pair.sq;
  return buildMetadata(a.metaTitle, a.metaDescription, `/blog/${pair.slug}`, a.keywords, locale);
}

export default function BlogStructuredArticle({ pair, locale }: { pair: StructuredArticlePair; locale: Locale }) {
  const a = pair[locale] ?? pair.sq;
  const path = `/blog/${pair.slug}`;
  const articleSchema = blogArticleSchema(pair.slug, a.title, a.metaDescription, locale);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema) }}
      />
      <BlogArticleLayout
        category={a.category}
        categoryColor={CATEGORY_COLOR}
        breadcrumbLabel={a.breadcrumb}
        path={path}
        title={a.title}
        description={a.description}
        date={a.date}
        readTime={a.readTime}
        related={a.related.map((r) => ({ href: `/blog/${r.slug}`, category: r.category, categoryColor: CATEGORY_COLOR, title: r.title }))}
      >
        {sections(a.blocks).map((group, i) =>
          i === 0 && !("h2" in group[0]) ? (
            <div key={i} className="space-y-4">
              {group.map((b, j) => <Block key={j} block={b} />)}
            </div>
          ) : (
            <section key={i} className="space-y-4">
              {group.map((b, j) => <Block key={j} block={b} />)}
            </section>
          )
        )}

        <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 md:p-9">
          <p className="font-display text-[1.1rem] text-white">{a.cta.title}</p>
          <p className="mt-2 text-[0.95rem] text-white/65">{a.cta.body}</p>
          <Link href="/contact" className="interactive-button ip-cta-primary ip-cta-primary--lg mt-5 inline-flex">
            {a.cta.button}
          </Link>
        </div>
      </BlogArticleLayout>
    </>
  );
}
