import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, caseStudyBySlug } from "@/lib/caseStudies";
import { seo } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalCTA from "@/components/GlobalCTA";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return caseStudies.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cs = caseStudyBySlug(params.slug);
  if (!cs) return {};
  const cleanIntro = cs.intro.replace(/\n/g, " ");
  return {
    title: `${cs.title} | Illyrian Pixel`,
    description: cleanIntro,
    alternates: { canonical: `${seo.siteUrl}/projektet/${cs.slug}` },
    openGraph: {
      title: `${cs.title} — Rast Studimi | Illyrian Pixel`,
      description: cleanIntro,
      images: [{ url: cs.heroImage || seo.ogImage, width: 1200, height: 630, alt: `${cs.title} — ${cs.category}` }]
    }
  };
}

export default function CaseStudyPage({ params }: Props) {
  const cs = caseStudyBySlug(params.slug);
  if (!cs) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: seo.siteUrl },
      { "@type": "ListItem", position: 2, name: "Projektet", item: `${seo.siteUrl}/projektet` },
      { "@type": "ListItem", position: 3, name: cs.title, item: `${seo.siteUrl}/projektet/${cs.slug}` }
    ]
  };

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="relative overflow-hidden bg-bg pt-14 text-text md:pt-16">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_10%_14%,rgba(171, 131, 57,0.08),transparent_35%),radial-gradient(circle_at_88%_82%,rgba(171, 131, 57,0.05),transparent_40%)]" />

        {/* Hero image */}
        <section className="relative z-[1] section-wrap max-w-5xl pt-10 md:pt-14">
          <div className="relative h-[280px] overflow-hidden rounded-[1.1rem] border border-white/10 md:h-[500px]">
            <Image
              src={cs.heroImage}
              alt={cs.title}
              fill
              sizes="(max-width: 1200px) 100vw, 1000px"
              priority
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0b0b]/65 to-transparent" />
          </div>
        </section>

        {/* Title + meta */}
        <section className="relative z-[1] section-wrap max-w-5xl pb-0 pt-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-accent/80">
            {cs.category} ⬢ {cs.year}
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.4rem,7vw,5rem)] leading-[0.92]">
            {cs.title}
          </h1>
          <p className="mt-3 inline-flex items-center gap-2 text-sm text-white/50">
            <span className="inline-flex items-center gap-1 rounded-md bg-white/8 px-1.5 py-0.5" aria-hidden>
              {cs.flagCodes.map((code) => (
                <Image
                  key={code}
                  src={`https://flagcdn.com/w20/${code}.png`}
                  alt=""
                  width={20}
                  height={14}
                  className="h-3.5 w-5 rounded-[2px] object-cover"
                  loading="lazy"
                  unoptimized
                />
              ))}
            </span>
            {cs.location}
          </p>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/68">{cs.intro}</p>
        </section>

        {/* Problem + Solution */}
        <section className="relative z-[1] section-wrap max-w-5xl">
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-[1rem] border border-white/10 bg-[#151515] p-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-accent/78">Problemi</p>
              <h2 className="mt-2 font-display text-2xl leading-tight">Çfarë nuk funksiononte?</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/62">{cs.problem}</p>
            </article>
            <article className="rounded-[1rem] border border-white/10 bg-[#151515] p-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-accent/78">Zgjidhja</p>
              <h2 className="mt-2 font-display text-2xl leading-tight">Si e trajtuam?</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/62">{cs.solution}</p>
            </article>
          </div>
        </section>

        {/* Result + Metrics */}
        <section className="relative z-[1] section-wrap max-w-5xl">
          <article className="rounded-[1rem] border border-accent/25 bg-accent/[0.04] p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-[0.22em] text-accent/80">Rezultati</p>
            <h2 className="mt-2 font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight">
              {cs.result}
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {cs.metrics.map((metric) => (
                <div
                  key={metric}
                  className="rounded-[0.75rem] border border-white/10 bg-black/25 px-4 py-3.5"
                >
                  <p className="text-sm text-accent/90">{metric}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        {/* Tags */}
        <section className="relative z-[1] section-wrap max-w-5xl pb-0">
          <div className="flex flex-wrap gap-2">
            {cs.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/45"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Links */}
        <section className="relative z-[1] section-wrap max-w-5xl pb-20 md:pb-28">
          <div className="flex flex-wrap items-center gap-4 border-t border-white/8 pt-8">
            {cs.liveUrl ? (
              <a
                href={cs.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="luxury-link"
              >
                Shiko live projektin <span aria-hidden>→</span>
              </a>
            ) : (
              <span className="text-[11px] uppercase tracking-[0.18em] text-white/30">Se shpejti</span>
            )}
            <Link href="/projektet" className="luxury-link">
              <span aria-hidden>←</span> Kthehu te projektet
            </Link>
            <Link
              href="/contact"
              className="interactive-button ip-cta-primary ml-auto"
            >
              Fillo sot
            </Link>
          </div>
        </section>

        <GlobalCTA title="Le ta ndërtojmë studimin tënd të ardhshëm." />
      </main>
      <Footer />
    </>
  );
}







