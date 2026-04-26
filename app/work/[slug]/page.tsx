import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, caseStudyBySlug } from "@/lib/caseStudies";
import { seo } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return caseStudies.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const caseStudy = caseStudyBySlug(params.slug);
  if (!caseStudy) return {};
  return {
    title: `${caseStudy.title} | Illyrian Pixel`,
    description: caseStudy.intro,
    openGraph: {
      title: `${caseStudy.title} | Illyrian Pixel`,
      description: caseStudy.intro,
      images: [caseStudy.heroImage || seo.ogImage]
    }
  };
}

export default function CaseStudyPage({ params }: Props) {
  const caseStudy = caseStudyBySlug(params.slug);
  if (!caseStudy) notFound();

  return (
    <>
      <Navbar />
      <main className="bg-bg pb-8 pt-14 text-text md:pt-16">
        <section className="section-wrap max-w-5xl">
        <p className="text-[11px] tracking-[0.2em] text-accent/85">
          {caseStudy.category} • {caseStudy.year}
        </p>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,5.6rem)] leading-[0.92]">{caseStudy.title}</h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/74">{caseStudy.intro}</p>
        </section>

        <section className="section-wrap max-w-5xl pt-0">
        <div className="grid gap-8 md:grid-cols-2">
          <article className="premium-card p-6">
            <h2 className="font-display text-3xl">Problem</h2>
            <p className="mt-3 text-white/72">{caseStudy.problem}</p>
          </article>
          <article className="premium-card p-6">
            <h2 className="font-display text-3xl">Solution</h2>
            <p className="mt-3 text-white/72">{caseStudy.solution}</p>
          </article>
        </div>

        <article className="premium-card mt-8 p-6">
          <h2 className="font-display text-3xl">Result</h2>
          <p className="mt-3 text-white/72">{caseStudy.result}</p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-3">
            {caseStudy.metrics.map((metric) => (
              <li key={metric} className="rounded-lg border border-white/12 bg-white/[0.02] px-3 py-2 text-sm text-accent/90">
                {metric}
              </li>
            ))}
          </ul>
        </article>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link href="/work" className="luxury-link">
            Kthehu te punët <span aria-hidden>→</span>
          </Link>
          <Link href="/contact" className="rounded-full border border-accent/70 bg-accent px-6 py-3 text-[11px] tracking-[0.14em] text-black">
            Nis projektin
          </Link>
        </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
