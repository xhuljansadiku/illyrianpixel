import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { CaseStudy } from "@/lib/caseStudies";
import type { Locale } from "@/i18n/routing";
import { seo, jsonLd } from "@/lib/seo";

const L: Record<Locale, Record<string, string>> = {
  sq: {
    projects: "Projektet",
    client: "Klienti",
    location: "Vendndodhja",
    year: "Viti",
    services: "Çfarë bëmë",
    live: "Vizito site-in",
    contact: "Dua një projekt si ky",
    challenge: "Sfida",
    solution: "Zgjidhja",
    result: "Rezultati",
    outcomes: "Çfarë fitoi klienti",
    next: "Projekti tjetër",
    ctaTitle: "Biznesi yt meriton të njëjtin rezultat.",
    ctaBody: "Na tregoni për projektin dhe ju kthejmë përgjigje brenda 24 orësh.",
    ctaBtn: "Fillo bisedën",
  },
  en: {
    projects: "Projects",
    client: "Client",
    location: "Location",
    year: "Year",
    services: "What we did",
    live: "Visit website",
    contact: "I want a project like this",
    challenge: "Challenge",
    solution: "Solution",
    result: "Result",
    outcomes: "What the client gained",
    next: "Next project",
    ctaTitle: "Your business deserves the same result.",
    ctaBody: "Tell us about your project, we reply within 24 hours.",
    ctaBtn: "Start the conversation",
  },
};

// Pa "www." — njësoj si te kartat e projekteve
const domainOf = (url: string) => url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");

type Props = { cs: CaseStudy; next: CaseStudy; locale: Locale };

// Faqe case study e shkurtër: hero + fakte, screenshot, sfida/zgjidhja/rezultati, përfitime, projekti tjetër, CTA
export default function CaseStudyView({ cs, next, locale }: Props) {
  const l = L[locale];
  const prefix = locale === "sq" ? "" : `/${locale}`;
  const pageUrl = `${seo.siteUrl}${prefix}/projektet/${cs.slug}`;

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Illyrian Pixel", item: `${seo.siteUrl}${prefix}` },
        { "@type": "ListItem", position: 2, name: l.projects, item: `${seo.siteUrl}${prefix}/projektet` },
        { "@type": "ListItem", position: 3, name: cs.title, item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: `${cs.title} — ${cs.category}`,
      description: cs.result,
      url: pageUrl,
      image: `${seo.siteUrl}${cs.heroImage}`,
      inLanguage: locale,
      dateCreated: cs.year,
      keywords: cs.tags.join(", "),
      locationCreated: { "@type": "Place", name: cs.location },
      creator: { "@type": "Organization", name: "Illyrian Pixel", url: seo.siteUrl },
      ...(cs.liveUrl && { about: { "@type": "WebSite", name: cs.title, url: cs.liveUrl } }),
    },
  ];

  // const steps = [
  //   { n: "01", label: l.challenge, text: cs.problem },
  //   { n: "02", label: l.solution, text: cs.solution },
  //   { n: "03", label: l.result, text: cs.result },
  // ];

  return (
    <main id="main-content" className="relative overflow-hidden bg-bg pt-14 text-text md:pt-16">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
      />
      <div aria-hidden className="pointer-events-none absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-accent/[0.07] blur-[140px]" />

      {/* Hero */}
      <section className="section-wrap relative max-w-6xl pb-0 pt-10 md:pb-0 md:pt-16">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
          <Link href="/projektet" className="transition-colors hover:text-accent">{l.projects}</Link>
          <span className="mx-2">/</span>
          <span className="text-white/60">{cs.title}</span>
        </nav>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">{cs.category}</p>
            <h1 className="mt-4 font-display text-[clamp(2.6rem,6.5vw,5.2rem)] font-bold leading-[0.95] tracking-[-0.03em] text-white">
              {cs.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-white/70 md:text-xl">{cs.result}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {cs.liveUrl && (
                <a
                  href={cs.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-black transition-colors hover:bg-accentLight"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-700" />
                  {l.live} <span aria-hidden>↗</span>
                </a>
              )}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-accent hover:text-accent"
              >
                {l.contact} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 text-sm">
            <div className="bg-bg p-5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">{l.client}</dt>
              <dd className="mt-1.5 text-white">{cs.title}</dd>
            </div>
            <div className="bg-bg p-5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">{l.year}</dt>
              <dd className="mt-1.5 text-white">{cs.year}</dd>
            </div>
            <div className="col-span-2 bg-bg p-5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">{l.location}</dt>
              <dd className="mt-1.5 flex items-center gap-2 text-white">
                {cs.flagCodes.map((code) => (
                  <Image key={code} src={`/flags/4x3/${code}.svg`} alt="" width={20} height={14} className="h-3.5 w-5 rounded-[2px] object-cover" unoptimized />
                ))}
                {cs.location}
              </dd>
            </div>
            <div className="col-span-2 bg-bg p-5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">{l.services}</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {cs.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-accent/30 px-2.5 py-0.5 text-[11px] text-accent/90">{tag}</span>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Screenshot në dritare browser-i */}
      <section className="section-wrap relative max-w-6xl pb-0 pt-12 md:pb-0 md:pt-16">
        <div className="group rounded-2xl border border-white/10 bg-[#1a1714] p-1.5 shadow-[0_40px_100px_-40px_rgba(171,131,57,0.4)]">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
            </div>
            <div className="mx-auto max-w-[70%] flex-1 truncate rounded-md bg-white/[0.06] px-3 py-1 text-center font-mono text-[11px] text-white/50">
              {cs.liveUrl ? domainOf(cs.liveUrl) : cs.title}
            </div>
            <span className="w-[54px]" aria-hidden />
          </div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-black">
            <Image
              src={cs.heroImage}
              alt={`${cs.title} — ${cs.category}, ${cs.location}`}
              fill
              priority
              sizes="(min-width: 1200px) 1150px, 100vw"
              className="object-cover object-top transition-[object-position] duration-[4000ms] ease-in-out group-hover:object-bottom"
            />
          </div>
        </div>
      </section>

      {/* Përfitimet (Sfida/Zgjidhja/Rezultati u hoqën — shumë tekst; shih komentin poshtë) */}
      <section className="section-wrap relative max-w-6xl pb-0 pt-16 md:pb-0 md:pt-20">
        {/* <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
          {steps.map((s) => (
            <article key={s.n} className="bg-bg p-7 md:p-9">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-accent">{s.n}</span>
                <h2 className="font-display text-2xl font-bold text-white">{s.label}</h2>
              </div>
              <p className="mt-4 text-[15px] font-light leading-relaxed text-white/60">{s.text}</p>
            </article>
          ))}
        </div> */}

        <div>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/60">{l.outcomes}</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {cs.metrics.map((m) => (
              <li key={m} className="flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/[0.04] px-5 py-4 text-[15px] text-white/85">
                <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12l5 5L20 7" />
                </svg>
                {m}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA + projekti tjetër */}
      <section className="section-wrap relative max-w-6xl pb-20 pt-16 md:pb-28 md:pt-20">
        <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/[0.12] to-transparent p-8 md:p-10">
            <h2 className="font-display text-3xl font-bold leading-tight text-white md:text-4xl">{l.ctaTitle}</h2>
            <p className="mt-3 text-white/60">{l.ctaBody}</p>
            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-black transition-colors hover:bg-accentLight"
            >
              {l.ctaBtn} <span aria-hidden>→</span>
            </Link>
          </div>

          <Link
            href={`/projektet/${next.slug}`}
            className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 p-7 transition-colors hover:border-accent/50"
          >
            <Image src={next.heroImage} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover object-top brightness-[0.3] transition-transform duration-700 group-hover:scale-105" />
            <span className="relative font-mono text-[10px] uppercase tracking-[0.22em] text-accent">{l.next} →</span>
            <span className="relative mt-2 font-display text-2xl font-bold text-white">{next.title}</span>
            <span className="relative mt-1 text-sm text-white/60">{next.category}</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
