"use client";
/**
 * DEMO (2026-11-05): 4 pamje alternative për /projektet — pronari zgjedh një,
 * pastaj kjo faqe fshihet dhe /projektet përditësohet me versionin e zgjedhur.
 */
import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { CaseStudy } from "@/lib/caseStudies";

const VARIANTS = [
  { id: "A", name: "Indeks me foto në hover" },
  { id: "B", name: "Vitrinë me një projekt" },
  { id: "C", name: "Galeri pa korniza" },
  { id: "D", name: "Projekte në laptop" },
] as const;
type VariantId = (typeof VARIANTS)[number]["id"];

const domainOf = (url: string) => url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");

function Flags({ codes }: { codes: string[] }) {
  return (
    <span className="inline-flex gap-1">
      {codes.map((c) => (
        <Image key={c} src={`/flags/4x3/${c}.svg`} alt="" width={16} height={12} className="h-3 w-4 rounded-[2px] object-cover" unoptimized />
      ))}
    </span>
  );
}

/** A — listë e madhe me emra; screenshot-i ndjek miun */
function IndexHover({ items }: { items: CaseStudy[] }) {
  const [hover, setHover] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div className="relative" onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }}>
      <ul className="border-t border-white/[0.08]">
        {items.map((p, i) => (
          <li key={p.slug} className="border-b border-white/[0.08]" onMouseEnter={() => setHover(p.slug)} onMouseLeave={() => setHover(null)}>
            <Link href={`/projektet/${p.slug}`} className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-7 md:grid-cols-[4rem_1fr_14rem_6rem] md:py-9">
              <span className="font-mono text-sm text-accent/70">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-display text-[clamp(1.8rem,4.5vw,3.6rem)] leading-none text-white transition-colors duration-300 group-hover:text-accent">{p.title}</span>
              <span className="hidden text-[14px] text-white/50 md:block">{p.category}</span>
              <span className="flex items-center justify-end gap-2 text-[13px] text-white/50"><Flags codes={p.flagCodes} /><span className="hidden md:inline">{p.year}</span></span>
            </Link>
          </li>
        ))}
      </ul>
      <div
        className="pointer-events-none absolute z-10 hidden h-[240px] w-[380px] overflow-hidden rounded-xl border border-white/10 shadow-2xl transition-opacity duration-300 lg:block"
        style={{ left: pos.x + 24, top: pos.y - 120, opacity: hover ? 1 : 0 }}
      >
        {items.map((p) => (
          <Image key={p.slug} src={p.heroImage} alt="" fill sizes="380px" className="object-cover object-top transition-opacity duration-300" style={{ opacity: hover === p.slug ? 1 : 0 }} />
        ))}
      </div>
    </div>
  );
}

/** B — një projekt i madh në qendër, miniaturat poshtë për të ndërruar */
function Showcase({ items }: { items: CaseStudy[] }) {
  const [i, setI] = useState(0);
  const p = items[i];
  if (!p) return null;
  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-center">
        <Link href={`/projektet/${p.slug}`} className="group relative block aspect-[16/10] overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl">
          <Image key={p.slug} src={p.heroImage} alt={p.title} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover object-top transition-transform duration-[2500ms] group-hover:scale-[1.03]" />
        </Link>
        <div>
          <p className="flex items-center gap-2 text-[13px] text-white/50"><Flags codes={p.flagCodes} />{p.location} · {p.year}</p>
          <h2 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-tight text-white">{p.title}</h2>
          <p className="mt-2 text-accent">{p.category}</p>
          <p className="mt-5 max-w-[44ch] text-[15px] leading-relaxed text-white/60">{p.result}</p>
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <Link href={`/projektet/${p.slug}`} className="ip-cta-primary inline-flex">Lexo rastin</Link>
            {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="luxury-link">Vizito faqen ↗</a>}
          </div>
        </div>
      </div>
      <div className="mt-10 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
        {items.map((x, k) => (
          <button key={x.slug} type="button" onClick={() => setI(k)} className={`relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border transition-all ${k === i ? "border-accent opacity-100" : "border-white/10 opacity-50 hover:opacity-80"}`}>
            <Image src={x.heroImage} alt={x.title} fill sizes="128px" className="object-cover object-top" />
          </button>
        ))}
      </div>
    </div>
  );
}

/** C — galeri e pastër: vetëm screenshot-et, teksti del në hover */
function Gallery({ items }: { items: CaseStudy[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((p, i) => (
        <Link key={p.slug} href={`/projektet/${p.slug}`} className={`group relative block overflow-hidden rounded-2xl border border-white/[0.08] ${i % 3 === 0 ? "md:col-span-2 aspect-[21/9]" : "aspect-[4/3]"}`}>
          <Image src={p.heroImage} alt={p.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
            <div>
              <p className="flex items-center gap-2 text-[12px] text-white/60"><Flags codes={p.flagCodes} />{p.location}</p>
              <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">{p.title}</h2>
              <p className="mt-1 text-sm text-accent">{p.category}</p>
            </div>
            <span aria-hidden className="text-2xl text-white/70 transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

/** D — çdo projekt brenda një laptopi të vizatuar, në dy kolona */
function Laptops({ items }: { items: CaseStudy[] }) {
  return (
    <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
      {items.map((p) => (
        <Link key={p.slug} href={`/projektet/${p.slug}`} className="group block">
          <div className="mx-auto w-[92%] rounded-t-[14px] border border-white/15 bg-[#0d0c0b] p-[2.2%] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:-translate-y-1.5">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[4px]">
              <Image src={p.heroImage} alt={p.title} fill sizes="(min-width: 768px) 45vw, 92vw" className="object-cover object-top transition-[object-position] duration-[4000ms] ease-linear group-hover:object-bottom" />
            </div>
          </div>
          <div className="relative mx-auto h-3 w-full rounded-b-[14px] bg-gradient-to-b from-[#3a3835] to-[#1c1b19]">
            <div className="absolute left-1/2 top-0 h-1.5 w-[18%] -translate-x-1/2 rounded-b-md bg-black/40" />
          </div>
          <div className="mt-6 flex items-baseline justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl text-white transition-colors group-hover:text-accent">{p.title}</h2>
              <p className="mt-1 text-sm text-white/50">{p.category}</p>
            </div>
            <span className="flex items-center gap-2 text-[13px] text-white/45"><Flags codes={p.flagCodes} />{p.liveUrl ? domainOf(p.liveUrl) : ""}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function ProjektetDemoClient({ projects }: { projects: CaseStudy[] }) {
  const [v, setV] = useState<VariantId>("A");
  return (
    <>
      <Navbar />
      <main id="main-content" className="relative bg-bg pb-28 pt-14 text-text md:pt-16">
        <div className="sticky top-16 z-30 border-b border-accent/20 bg-bgDeep/95 backdrop-blur">
          <div className="section-wrap flex flex-wrap items-center gap-2 py-3">
            <span className="mr-2 text-xs uppercase tracking-[0.2em] text-accent">Demo</span>
            {VARIANTS.map((x) => (
              <button key={x.id} type="button" onClick={() => setV(x.id)} className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${v === x.id ? "border-accent bg-accent text-black" : "border-white/15 text-white/70 hover:border-accent/50"}`}>
                {x.id} · {x.name}
              </button>
            ))}
          </div>
        </div>

        <section className="section-wrap pb-14 pt-16 md:pt-24">
          <p className="ip-eyebrow">PROJEKTET</p>
          <h1 className="mt-5 font-display text-[clamp(2.6rem,6vw,5rem)] font-bold leading-[1.05] text-white">
            Website që kemi <span className="text-accent">ndërtuar.</span>
          </h1>
        </section>

        <section className="section-wrap">
          {v === "A" && <IndexHover items={projects} />}
          {v === "B" && <Showcase items={projects} />}
          {v === "C" && <Gallery items={projects} />}
          {v === "D" && <Laptops items={projects} />}
        </section>
      </main>
      <Footer />
    </>
  );
}
