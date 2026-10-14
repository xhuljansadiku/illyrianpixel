import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { CaseStudy } from "@/lib/caseStudies";
import type { Locale } from "@/i18n/routing";

const LABELS: Record<Locale, { caseStudy: string; live: string; soon: string }> = {
  sq: { caseStudy: "Lexo rastin", live: "Vizito site-in", soon: "Së shpejti online" },
  en: { caseStudy: "Read case study", live: "Visit website", soon: "Going live soon" },
};

const domainOf = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

// Variant C: çdo projekt brenda një dritareje browser-i me domain-in real; screenshot-i skrollohet në hover
export default function ProjectBrowserCards({ projects, locale }: { projects: CaseStudy[]; locale: Locale }) {
  const l = LABELS[locale];

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-20">
      {projects.map((p, i) => (
        <article key={p.slug} className={`group ${i % 2 === 1 ? "md:mt-24" : ""}`}>
          {/* Dritarja e browser-it */}
          <Link
            href={`/projektet/${p.slug}`}
            aria-label={`${l.caseStudy}: ${p.title}`}
            className="block rounded-2xl border border-white/10 bg-[#1a1714] p-1.5 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.9)] transition-all duration-700 [transform:perspective(1400px)_rotateX(4deg)] group-hover:-translate-y-2 group-hover:border-accent/40 group-hover:shadow-[0_40px_90px_-35px_rgba(171,131,57,0.5)] group-hover:[transform:perspective(1400px)_rotateX(0deg)]"
          >
            <div className="flex items-center gap-3 px-3 py-2.5">
              <div className="flex gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
              </div>
              <div className="mx-auto flex max-w-[70%] flex-1 items-center justify-center gap-1.5 truncate rounded-md bg-white/[0.06] px-3 py-1 font-mono text-[11px] text-white/50">
                <svg aria-hidden viewBox="0 0 24 24" className="h-3 w-3 shrink-0 text-white/40" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                <span className="truncate">{p.liveUrl ? domainOf(p.liveUrl) : `illyrianpixel.com/projektet/${p.slug}`}</span>
              </div>
              <span className="w-[54px]" aria-hidden />
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-black">
              <Image
                src={p.heroImage}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-top transition-[object-position] duration-[3000ms] ease-in-out group-hover:object-bottom"
              />
            </div>
          </Link>

          {/* Info poshtë dritares */}
          <div className="mt-7 flex items-start gap-5 px-1">
            <span className="pt-1 font-mono text-xs text-accent/70">{String(i + 1).padStart(2, "0")}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                <span className="inline-flex items-center gap-1.5">
                  {p.flagCodes.map((code) => (
                    <Image key={code} src={`/flags/4x3/${code}.svg`} alt="" width={16} height={12} className="h-3 w-4 rounded-[2px] object-cover" unoptimized />
                  ))}
                  {p.location}
                </span>
                <span className="text-white/20">/</span>
                <span className="text-accent/80">{p.category}</span>
              </div>
              <h3 className="mt-2 font-display text-2xl font-bold tracking-[-0.02em] text-white md:text-3xl">
                <Link href={`/projektet/${p.slug}`} className="transition-colors hover:text-accent">
                  {p.title}
                </Link>
              </h3>
              <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-white/50">{p.result}</p>

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  href={`/projektet/${p.slug}`}
                  className="group/cta inline-flex items-center gap-2 border-b border-accent pb-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent transition-colors hover:text-accentLight"
                >
                  {l.caseStudy}
                  <span aria-hidden className="transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
                </Link>
                {p.liveUrl ? (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/live inline-flex items-center gap-2 pb-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55 transition-colors hover:text-white"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    {l.live}
                    <span aria-hidden className="transition-transform duration-300 group-hover/live:-translate-y-0.5 group-hover/live:translate-x-0.5">↗</span>
                  </a>
                ) : (
                  <span className="pb-1 text-[11px] uppercase tracking-[0.16em] text-white/25">{l.soon}</span>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
