"use client";
/**
 * DEMO (2026-11-05): 4 pamje alternative për paketat te /cmimet — pronari zgjedh një,
 * pastaj kjo faqe fshihet dhe /cmimet përditësohet me versionin e zgjedhur.
 */
import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getServiceCategories, type ServicePackage } from "@/lib/serviceCategories";
import type { Locale } from "@/i18n/routing";

const VARIANTS = [
  { id: "A", name: "Tabelë krahasimi" },
  { id: "B", name: "Paketa e rekomanduar në qendër" },
  { id: "C", name: "Rreshta horizontalë" },
  { id: "D", name: "Zgjedhës me një paketë" },
] as const;
type VariantId = (typeof VARIANTS)[number]["id"];

const CTA = "Merr ofertë falas";
const RECOMMENDED = "Më e zgjedhura";

function Check() {
  return <span aria-hidden className="mt-[3px] inline-block h-4 w-4 shrink-0 rounded-full bg-accent/15 text-center text-[10px] leading-4 text-accent">✓</span>;
}

function Price({ p, big = false }: { p: ServicePackage; big?: boolean }) {
  return (
    <p className={`font-display text-white ${big ? "text-6xl" : "text-4xl"}`}>
      {p.price}
      {p.priceNote && <span className="ml-1 font-body text-sm text-white/45">{p.priceNote}</span>}
    </p>
  );
}

function Gift({ p }: { p: ServicePackage }) {
  if (!p.gift) return null;
  return <p className="mt-3 rounded-lg border border-accent/30 bg-accent/[0.07] px-3 py-2 text-[13px] text-accent">🎁 {p.gift}</p>;
}

/** A — një tabelë: paketat në kolona, veçoritë në rreshta */
function CompareTable({ pkgs }: { pkgs: ServicePackage[] }) {
  const rows = useMemo(() => {
    const all: string[] = [];
    for (const p of pkgs) for (const f of p.features) if (!all.includes(f)) all.push(f);
    return all;
  }, [pkgs]);
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr>
            <th className="w-[38%] p-5" />
            {pkgs.map((p) => (
              <th key={p.name} className={`p-5 align-top ${p.featured ? "bg-accent/[0.07]" : ""}`}>
                {p.featured && <p className="mb-2 text-[11px] uppercase tracking-[0.15em] text-accent">{RECOMMENDED}</p>}
                <p className="font-display text-2xl text-white">{p.name}</p>
                <div className="mt-2"><Price p={p} /></div>
                <Link href="/contact" className={`mt-4 inline-flex text-sm ${p.featured ? "ip-cta-primary" : "luxury-link"}`}>{CTA}</Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r} className="border-t border-white/[0.06]">
              <td className="whitespace-pre-line p-4 text-[14px] text-white/70">{r}</td>
              {pkgs.map((p) => (
                <td key={p.name} className={`p-4 text-center ${p.featured ? "bg-accent/[0.04]" : ""}`}>
                  {p.features.includes(r) ? <span className="text-accent">✓</span> : <span className="text-white/20">—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** B — paketa e rekomanduar e madhe në qendër, dy të tjerat më të vogla anash */
function Spotlight({ pkgs }: { pkgs: ServicePackage[] }) {
  return (
    <div className="grid items-center gap-5 lg:grid-cols-[1fr_1.25fr_1fr]">
      {pkgs.map((p) => (
        <div
          key={p.name}
          className={`rounded-3xl border p-7 ${p.featured ? "border-accent/50 bg-gradient-to-b from-accent/[0.12] to-transparent py-12 shadow-[0_30px_90px_-30px_rgba(171,131,57,0.45)] lg:order-none" : "border-white/[0.08] bg-white/[0.015] opacity-90"}`}
        >
          {p.featured && <p className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-black">{RECOMMENDED}</p>}
          <p className="font-display text-2xl text-white">{p.name}</p>
          {p.tagline && <p className="mt-1 text-sm text-white/50">{p.tagline}</p>}
          <div className="mt-5"><Price p={p} big={p.featured} /></div>
          <Gift p={p} />
          <ul className="mt-6 space-y-2.5">
            {p.features.slice(0, p.featured ? 7 : 4).map((f) => (
              <li key={f} className="flex gap-2.5 whitespace-pre-line text-[14px] text-white/70"><Check />{f}</li>
            ))}
          </ul>
          <Link href="/contact" className={`mt-7 inline-flex w-full justify-center ${p.featured ? "ip-cta-primary" : "rounded-full border border-white/15 px-5 py-3 text-sm text-white/80 hover:border-accent/50"}`}>{CTA}</Link>
        </div>
      ))}
    </div>
  );
}

/** C — çdo paketë një rresht i gjerë: emri + çmimi majtas, veçoritë në mes, butoni djathtas */
function Rows({ pkgs }: { pkgs: ServicePackage[] }) {
  return (
    <div className="space-y-4">
      {pkgs.map((p) => (
        <div key={p.name} className={`grid gap-6 rounded-2xl border p-6 md:grid-cols-[220px_1fr_auto] md:items-center md:p-8 ${p.featured ? "border-accent/50 bg-accent/[0.06]" : "border-white/[0.08] bg-white/[0.015]"}`}>
          <div>
            {p.featured && <p className="mb-2 text-[11px] uppercase tracking-[0.15em] text-accent">{RECOMMENDED}</p>}
            <p className="font-display text-2xl text-white">{p.name}</p>
            <div className="mt-1"><Price p={p} /></div>
          </div>
          <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {p.features.slice(0, 6).map((f) => (
              <li key={f} className="flex gap-2.5 whitespace-pre-line text-[14px] text-white/65"><Check />{f}</li>
            ))}
          </ul>
          <div className="md:text-right">
            <Link href="/contact" className={p.featured ? "ip-cta-primary inline-flex" : "luxury-link"}>{CTA}</Link>
            {p.gift && <p className="mt-3 max-w-[220px] text-[12px] text-accent md:ml-auto">🎁 {p.gift}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

/** D — zgjedhës: klikoni paketën lart, poshtë del vetëm ajo, e madhe dhe e qartë */
function Picker({ pkgs }: { pkgs: ServicePackage[] }) {
  const [sel, setSel] = useState(Math.max(0, pkgs.findIndex((p) => p.featured)));
  const p = pkgs[sel] ?? pkgs[0];
  return (
    <div>
      <div className="mx-auto flex max-w-xl rounded-full border border-white/10 bg-white/[0.02] p-1">
        {pkgs.map((x, i) => (
          <button key={x.name} type="button" onClick={() => setSel(i)} className={`flex-1 rounded-full px-4 py-2.5 text-sm transition-colors ${i === sel ? "bg-accent text-black" : "text-white/65 hover:text-white"}`}>
            {x.name}
          </button>
        ))}
      </div>
      {p && (
        <div className="mx-auto mt-8 grid max-w-4xl gap-10 rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/[0.08] to-transparent p-8 md:grid-cols-[1fr_1.2fr] md:p-12">
          <div>
            {p.featured && <p className="mb-3 text-[11px] uppercase tracking-[0.15em] text-accent">{RECOMMENDED}</p>}
            <p className="font-display text-4xl text-white">{p.name}</p>
            {p.tagline && <p className="mt-2 text-white/55">{p.tagline}</p>}
            <div className="mt-6"><Price p={p} big /></div>
            <Gift p={p} />
            <Link href="/contact" className="ip-cta-primary mt-8 inline-flex">{CTA}</Link>
          </div>
          <ul className="space-y-3">
            {p.features.map((f) => (
              <li key={f} className="flex gap-2.5 whitespace-pre-line text-[15px] text-white/75"><Check />{f}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function CmimetDemoClient() {
  const locale = useLocale() as Locale;
  const cats = getServiceCategories(locale);
  const [v, setV] = useState<VariantId>("B");
  const [slug, setSlug] = useState<string>("website");
  const cat = cats.find((c) => c.slug === slug) ?? cats[0];
  const pkgs = (cat?.packages ?? []).filter((p) => !p.asRow);
  const custom = (cat?.packages ?? []).find((p) => p.asRow);

  return (
    <>
      <Navbar />
      <main id="main-content" className="relative bg-bg pb-28 pt-14 text-text md:pt-16">
        <div className="sticky top-16 z-30 border-b border-accent/20 bg-bgDeep/95 backdrop-blur">
          <div className="section-wrap space-y-2 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 w-16 text-xs uppercase tracking-[0.2em] text-accent">Demo</span>
              {VARIANTS.map((x) => (
                <button key={x.id} type="button" onClick={() => setV(x.id)} className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${v === x.id ? "border-accent bg-accent text-black" : "border-white/15 text-white/70 hover:border-accent/50"}`}>
                  {x.id} · {x.name}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 w-16 text-xs uppercase tracking-[0.2em] text-white/40">Shërbimi</span>
              {cats.map((c) => (
                <button key={c.slug} type="button" onClick={() => setSlug(c.slug)} className={`rounded-full px-3 py-1 text-[13px] transition-colors ${slug === c.slug ? "bg-white/15 text-white" : "text-white/50 hover:text-white"}`}>
                  {c.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className="section-wrap pb-12 pt-16 md:pt-20">
          <p className="ip-eyebrow">ÇMIMET</p>
          <h1 className="mt-5 font-display text-[clamp(2.4rem,5vw,4rem)] font-bold leading-[1.08] text-white">
            {cat?.title} <span className="text-accent">paketat</span>
          </h1>
        </section>

        <section className="section-wrap">
          {v === "A" && <CompareTable pkgs={pkgs} />}
          {v === "B" && <Spotlight pkgs={pkgs} />}
          {v === "C" && <Rows pkgs={pkgs} />}
          {v === "D" && <Picker pkgs={pkgs} />}
          {custom && (
            <p className="mt-8 text-center text-sm text-white/55">
              {custom.name}: <span className="text-white">{custom.price}</span> · <Link href="/contact" className="luxury-link !text-sm">{CTA}</Link>
            </p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
