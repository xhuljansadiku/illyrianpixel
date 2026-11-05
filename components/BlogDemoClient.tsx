"use client";
/**
 * DEMO (2026-11-05): 4 pamje alternative për /blog — pronari zgjedh një,
 * pastaj kjo faqe fshihet dhe /blog përditësohet me versionin e zgjedhur.
 */
import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { BlogPost } from "@/lib/blogPosts";

const VARIANTS = [
  { id: "A", name: "Revistë: artikulli kryesor + listë" },
  { id: "B", name: "Filtër kategorish + rreshta" },
  { id: "C", name: "Kopertina tipografike" },
  { id: "D", name: "Indeks i pastër" },
] as const;
type VariantId = (typeof VARIANTS)[number]["id"];

const readMin = (p: BlogPost) => Math.max(2, Math.round(p.content.join(" ").split(/\s+/).length / 200));

function Meta({ p }: { p: BlogPost }) {
  return (
    <p className="text-[12px] uppercase tracking-[0.14em] text-white/45">
      <span className="text-accent">{p.category}</span> · {p.date} · {readMin(p)} min lexim
    </p>
  );
}

/** A — artikulli më i ri i madh, poshtë/anash lista */
function Magazine({ posts }: { posts: BlogPost[] }) {
  const [first, ...rest] = posts;
  if (!first) return null;
  return (
    <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
      <Link href={`/blog/${first.slug}`} className="group relative block overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-br from-accent/[0.14] via-transparent to-transparent p-8 md:p-12">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/[0.12] blur-3xl" />
        <p className="text-[11px] uppercase tracking-[0.2em] text-accent">Më i riu</p>
        <h2 className="mt-6 font-display text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.1] text-white transition-colors group-hover:text-accent">{first.title}</h2>
        <p className="mt-5 max-w-[50ch] text-[16px] leading-relaxed text-white/60">{first.excerpt}</p>
        <div className="mt-8"><Meta p={first} /></div>
      </Link>
      <ul className="divide-y divide-white/[0.07]">
        {rest.slice(0, 6).map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="group block py-5 first:pt-0">
              <Meta p={p} />
              <h3 className="mt-2 font-display text-xl leading-snug text-white transition-colors group-hover:text-accent">{p.title}</h3>
            </Link>
          </li>
        ))}
      </ul>
      {rest.length > 6 && (
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-3 lg:col-span-2">
          {rest.slice(6).map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group block border-t border-white/[0.07] pt-5">
              <Meta p={p} />
              <h3 className="mt-2 font-display text-lg leading-snug text-white transition-colors group-hover:text-accent">{p.title}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/** B — butona kategorish lart, artikujt si rreshta me përshkrim */
function FilterRows({ posts }: { posts: BlogPost[] }) {
  const cats = useMemo(() => ["Të gjitha", ...Array.from(new Set(posts.map((p) => p.category)))], [posts]);
  const [cat, setCat] = useState("Të gjitha");
  const list = cat === "Të gjitha" ? posts : posts.filter((p) => p.category === cat);
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <button key={c} type="button" onClick={() => setCat(c)} className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${cat === c ? "border-accent bg-accent/15 text-accent" : "border-white/12 text-white/60 hover:text-white"}`}>
            {c}
          </button>
        ))}
      </div>
      <ul className="mt-10 border-t border-white/[0.07]">
        {list.map((p) => (
          <li key={p.slug} className="border-b border-white/[0.07]">
            <Link href={`/blog/${p.slug}`} className="group grid gap-3 py-7 md:grid-cols-[1fr_1.1fr_auto] md:items-center md:gap-10">
              <h2 className="font-display text-2xl leading-snug text-white transition-colors group-hover:text-accent">{p.title}</h2>
              <p className="text-[15px] leading-relaxed text-white/55">{p.excerpt}</p>
              <span className="text-[12px] uppercase tracking-[0.14em] text-white/40 md:text-right">{p.date}<br className="hidden md:block" /> <span className="text-accent">{readMin(p)} min</span></span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** C — çdo artikull ka "kopertinë" me shkronjën e madhe të kategorisë në ar */
function Covers({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p, i) => (
        <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.015] transition-colors hover:border-accent/40">
          <div className={`relative flex aspect-[16/9] items-end overflow-hidden p-6 ${i % 3 === 0 ? "bg-gradient-to-br from-accent/25 to-black" : i % 3 === 1 ? "bg-gradient-to-br from-[#2a2520] to-black" : "bg-gradient-to-br from-accent/10 to-[#141210]"}`}>
            <span aria-hidden className="absolute -right-4 -top-10 select-none font-display text-[10rem] font-black leading-none text-accent/[0.18] transition-transform duration-700 group-hover:scale-110">{p.category.charAt(0)}</span>
            <span className="relative rounded-full border border-accent/40 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-accent">{p.category}</span>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <h2 className="font-display text-xl leading-snug text-white transition-colors group-hover:text-accent">{p.title}</h2>
            <p className="mt-3 line-clamp-2 text-[14px] leading-relaxed text-white/55">{p.excerpt}</p>
            <p className="mt-auto pt-5 text-[12px] text-white/40">{p.date} · {readMin(p)} min lexim</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

/** D — indeks minimal: vetëm titujt, të grupuar sipas kategorisë */
function CleanIndex({ posts }: { posts: BlogPost[] }) {
  const groups = useMemo(() => {
    const m = new Map<string, BlogPost[]>();
    for (const p of posts) m.set(p.category, [...(m.get(p.category) ?? []), p]);
    return Array.from(m.entries());
  }, [posts]);
  return (
    <div className="space-y-14">
      {groups.map(([cat, list]) => (
        <section key={cat} className="grid gap-6 md:grid-cols-[220px_1fr]">
          <h2 className="font-display text-2xl text-accent md:sticky md:top-32 md:self-start">{cat} <span className="ml-1 font-body text-sm text-white/35">{list.length}</span></h2>
          <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {list.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="group flex items-baseline justify-between gap-6 py-4">
                  <span className="text-[17px] text-white/85 transition-colors group-hover:text-accent">{p.title}</span>
                  <span className="shrink-0 text-[12px] text-white/35">{readMin(p)} min</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default function BlogDemoClient({ posts }: { posts: BlogPost[] }) {
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
          <p className="ip-eyebrow">BLOGU</p>
          <h1 className="mt-5 font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-bold leading-[1.06] text-white">
            Udhëzime për website, <span className="text-accent">SEO dhe marketing.</span>
          </h1>
        </section>

        <section className="section-wrap">
          {v === "A" && <Magazine posts={posts} />}
          {v === "B" && <FilterRows posts={posts} />}
          {v === "C" && <Covers posts={posts} />}
          {v === "D" && <CleanIndex posts={posts} />}
        </section>
      </main>
      <Footer />
    </>
  );
}
