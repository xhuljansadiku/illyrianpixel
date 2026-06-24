import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { buildWhatsAppChatHref, DEFAULT_WHATSAPP_E164 } from "@/lib/whatsappPrefill";
import { buildBreadcrumb, seo } from "@/lib/seo";

const WA_HREF = buildWhatsAppChatHref(DEFAULT_WHATSAPP_E164);

interface Props {
  category: string;
  categoryColor: string;
  title: React.ReactNode;
  /** String version of title used for JSON-LD BreadcrumbList */
  breadcrumbLabel?: string;
  /** Canonical path, e.g. "/blog/seo-tirane" */
  path?: string;
  description: React.ReactNode;
  date: string;
  readTime: string;
  children: React.ReactNode;
  related?: { href: string; category: string; categoryColor: string; title: string }[];
}

export default function BlogArticleLayout({
  category,
  categoryColor,
  title,
  breadcrumbLabel,
  path,
  description,
  date,
  readTime,
  children,
  related = [],
}: Props) {
  const breadcrumbSchema = path && breadcrumbLabel
    ? buildBreadcrumb([
        { name: "Home", url: seo.siteUrl },
        { name: "Blog", url: `${seo.siteUrl}/blog` },
        { name: breadcrumbLabel, url: `${seo.siteUrl}${path}` },
      ])
    : null;

  return (
    <>
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <Navbar />
      <main className="min-h-screen bg-bg pb-16 pt-20 text-text">
        {/* Hero */}
        <section className="border-b border-white/10">
          <div className="section-wrap pb-12 pt-6">
            <Link href="/blog" className="luxury-link">
              <span aria-hidden>←</span> Kthehu te blogu
            </Link>
            <div className="mt-8">
              <span
                className="inline-flex rounded-full px-4 py-[7px] text-[0.8rem] font-semibold uppercase leading-none tracking-[0.08em]"
                style={{ background: categoryColor, color: "#0a0a0a" }}
              >
                {category}
              </span>
              <h1 className="section-title font-display mt-5 max-w-4xl text-white">
                {title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/68">
                {description}
              </p>
              <p className="mt-5 text-xs tracking-[0.14em] text-white/45">
                {date} · {readTime}
              </p>
            </div>
          </div>
        </section>

        {/* Article body */}
        <article className="section-wrap py-14 md:py-20">
          <div className="mx-auto max-w-2xl space-y-10">
            {children}
          </div>
        </article>

        {/* WhatsApp CTA */}
        <section className="section-wrap border-t border-white/10 py-8">
          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-[1.05rem] text-white">Keni pyetje rreth projektit tuaj?</p>
              <p className="mt-1 text-[0.85rem] text-white/45">Na shkruani direkt, përgjigjemi brenda minutave.</p>
            </div>
            <a
              href={WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-[0.8rem] font-semibold tracking-[0.06em] text-white transition-opacity hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="section-wrap border-t border-white/10 py-12 md:py-16">
            <h3 className="font-display text-[clamp(1.35rem,2.8vw,1.9rem)] text-white">
              Artikuj të ngjashëm
            </h3>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-accent/40"
                >
                  <span
                    className="inline-flex rounded-full px-4 py-[7px] text-[0.8rem] font-semibold uppercase leading-none tracking-[0.08em]"
                    style={{ background: r.categoryColor, color: "#0a0a0a" }}
                  >
                    {r.category}
                  </span>
                  <p className="mt-4 font-display text-[1.2rem] leading-tight text-white">
                    {r.title}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
