import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Props {
  category: string;
  categoryColor: string;
  title: React.ReactNode;
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
  description,
  date,
  readTime,
  children,
  related = [],
}: Props) {
  return (
    <>
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
