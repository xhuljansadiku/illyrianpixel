"use client";

// Udhëzuesi i markës — vetëm në /admin (privat). Vlerat vijnë nga tailwind.config.ts dhe
// app/globals.css; butonat dhe etiketat përdorin klasat e vërteta të faqes, kështu që
// ajo që sheh këtu është ajo që del live.

import { useState } from "react";
import Image from "next/image";

type Swatch = { token: string; name: string; web: string; print: string; usage: string };

const COLORS: Swatch[] = [
  { token: "accent", name: "Ari i markës", web: "#AB8339", print: "#8A6A2C", usage: "Butonat kryesorë, etiketat, fjala e theksuar në tituj. I vetmi ar." },
  { token: "accentLight", name: "Ari i hapur", web: "#EACE71", print: "#6F5420", usage: "Hover dhe gjysma \"PIXEL\" e logos." },
  { token: "bg", name: "Sfondi", web: "#0A0A0A", print: "#FFFFFF", usage: "Sfondi i faqes." },
  { token: "bgDeep", name: "Sfondi i thellë", web: "#070707", print: "#F5F2EA", usage: "Footer, shtresat më poshtë." },
  { token: "surface", name: "Sipërfaqja", web: "#0E0E0E", print: "#FAF8F3", usage: "Kartat, menutë, dritaret." },
  { token: "text", name: "Teksti", web: "#E0E0E0", print: "#1C1C1C", usage: "Teksti kryesor." },
  { token: "muted", name: "Teksti dytësor", web: "#A0A0A0", print: "#5C5C5C", usage: "Data, shënime, etiketa dytësore." },
];

const STATE_COLORS = [
  { name: "WhatsApp", hex: "#25D366", usage: "Vetëm butonat WhatsApp." },
  { name: "Sukses", hex: "#6EE7B7", usage: "Pranuar, paguar, kryer." },
  { name: "Gabim", hex: "#F87171", usage: "Gabime, refuzim." },
];

const TYPE_SCALE = [
  { name: "Hero", spec: "Cormorant Garamond 700 · clamp(3.6rem, 11vw, 8.8rem)", className: "font-display text-[56px] font-bold leading-[0.92]", sample: "Ktheje biznesin në BRAND." },
  { name: "Titull seksioni (H2)", spec: "Cormorant Garamond 600 · clamp(2rem, 4vw, 3.6rem)", className: "font-display text-[40px] font-semibold leading-[0.95]", sample: "Shërbimet tona" },
  { name: "Nëntitull (H3)", spec: "Cormorant Garamond 600 · 28px", className: "font-display text-[28px] font-semibold leading-tight", sample: "Website për biznesin tënd" },
  { name: "Lead", spec: "Plus Jakarta Sans 400 · 18px / 1.6", className: "text-[18px] leading-relaxed", sample: "Faqe që sjellin klientë, jo vetëm vizita." },
  { name: "Tekst", spec: "Plus Jakarta Sans 400 · 16px / 1.65", className: "text-[16px] leading-[1.65]", sample: "Takime online në mbrëmje dhe fundjavë, në shqip." },
  { name: "Shënim", spec: "Plus Jakarta Sans 400 · 13px", className: "text-[13px] text-muted", sample: "Prill 2026 · 7 min lexim" },
];

const SHADOWS = [
  { name: "card", className: "shadow-card", usage: "Karta në pushim që duhet ndarë nga faqja." },
  { name: "lift", className: "shadow-lift", usage: "Karta në hover, elementë ngjitës." },
  { name: "overlay", className: "shadow-overlay", usage: "Dritare, popup, menuja e celularit." },
  { name: "gold", className: "shadow-gold", usage: "Halo e butonit kryesor." },
  { name: "gold-lift", className: "shadow-gold-lift", usage: "Karta me theks ari në hover." },
];

const RADII = [
  { name: "10px", className: "rounded-[10px]", usage: "Fusha, kontrolle të vogla" },
  { name: "16px · 2xl", className: "rounded-2xl", usage: "Kartat" },
  { name: "24px · 3xl", className: "rounded-3xl", usage: "Panelet e mëdha" },
  { name: "Kapsulë", className: "rounded-full", usage: "Butonat, etiketat" },
];

const LOGOS = [
  { name: "Shqiponja", file: "/images/illyrianpixel_logo.svg", note: "Ikona, cepa postimesh, vula.", w: 120, h: 112 },
  { name: "Logoja me tekst", file: "/images/illyrianpixel_text.svg", note: "ILLYRIAN në ar, PIXEL në ar të hapur.", w: 260, h: 43 },
  { name: "Ikona e aplikacionit", file: "/favicon.svg", note: "Favicon dhe foto profili.", w: 112, h: 112 },
];

const SECTIONS = [
  ["logo", "Logoja"],
  ["ngjyrat", "Ngjyrat"],
  ["fontet", "Fontet"],
  ["elementet", "Butonat & elementët"],
  ["shkalla", "Qoshet & hijet"],
  ["toni", "Toni i zërit"],
  ["rregullat", "Rregullat"],
] as const;

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="ip-eyebrow">{eyebrow}</p>
      <h2 className="mt-2 font-display text-[32px] font-semibold leading-tight text-white">{title}</h2>
    </div>
  );
}

export default function BrandTab() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // Clipboard can be blocked; the value is visible and selectable anyway.
    }
  };

  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-bg font-body text-text">
      {/* Kreu */}
      <div className="border-b border-white/10 px-6 py-10 md:px-10">
        <div className="flex items-center gap-4">
          <Image src="/images/illyrianpixel_logo.svg" unoptimized alt="" width={56} height={52} className="h-12 w-auto" />
          <Image src="/images/illyrianpixel_text.svg" unoptimized alt="Illyrian Pixel" width={220} height={36} className="h-6 w-auto" />
        </div>
        <h1 className="mt-8 font-display text-[clamp(2.4rem,5vw,3.6rem)] font-bold leading-[0.95] text-white">
          Ktheje biznesin në <span className="uppercase text-accent">Brand</span>.
        </h1>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/75">
          Udhëzuesi i markës Illyrian Pixel: si duket dhe si flet marka. Përdore për çdo gjë që del me emrin tonë:
          faqja, ofertat, postimet në LinkedIn, kartëvizitat. Vlerat janë të njëjta me kodin e faqes.
        </p>
        <nav className="mt-8 flex flex-wrap gap-2" aria-label="Seksionet">
          {SECTIONS.map(([id, label]) => (
            <a
              key={id}
              href={`#brand-${id}`}
              className="rounded-full border border-white/15 px-3.5 py-1.5 text-[12px] font-semibold text-white/75 transition-colors hover:border-accent/60 hover:text-accentLight"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <div className="space-y-16 px-6 py-12 md:px-10">
        {/* Logoja */}
        <section id="brand-logo" className="scroll-mt-24">
          <SectionTitle eyebrow="01 · Logoja" title="Shqiponja ilire dhe emri" />
          <div className="grid gap-4 md:grid-cols-3">
            {LOGOS.map((l) => (
              <div key={l.file} className="flex flex-col rounded-2xl border border-white/10 bg-surface">
                <div className="flex h-44 items-center justify-center p-6">
                  <Image src={l.file} unoptimized alt={l.name} width={l.w} height={l.h} className="max-h-28 w-auto" />
                </div>
                <div className="flex flex-1 items-end justify-between gap-3 border-t border-white/10 p-4">
                  <div>
                    <p className="text-[14px] font-semibold text-white">{l.name}</p>
                    <p className="mt-0.5 text-[13px] text-white/60">{l.note}</p>
                  </div>
                  <a href={l.file} download className="ip-cta-secondary shrink-0 !px-3 !py-2">SVG</a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="flex h-36 items-center justify-center gap-3 rounded-2xl bg-white p-6">
              <Image src="/images/illyrianpixel_logo.svg" unoptimized alt="" width={56} height={52} className="h-12 w-auto" />
              <Image src="/images/illyrianpixel_text.svg" unoptimized alt="Logo mbi sfond të bardhë" width={220} height={36} className="h-6 w-auto" />
            </div>
            <ul className="space-y-2 rounded-2xl border border-white/10 bg-surface p-5 text-[14px] leading-relaxed text-white/80">
              <li><span className="font-semibold text-white">Hapësira e lirë:</span> sa gjysma e lartësisë së shqiponjës nga çdo anë.</li>
              <li><span className="font-semibold text-white">Më e vogla:</span> shqiponja 24px në ekran, 10mm në letër.</li>
              <li><span className="font-semibold text-white">Sfondi:</span> i zi ose i bardhë. Mbi foto vetëm me shtresë të errët.</li>
              <li><span className="font-semibold text-white">Mos:</span> e shtrij, rrotullo, rringjyros, i shto hije ose kontur.</li>
              <li><span className="font-semibold text-white">Email & Google:</span> përdor PNG-në (<code className="text-accentLight">/images/illyrianpixel_logo.png</code>).</li>
            </ul>
          </div>
        </section>

        {/* Ngjyrat */}
        <section id="brand-ngjyrat" className="scroll-mt-24">
          <SectionTitle eyebrow="02 · Ngjyrat" title="E zezë dhe ari" />
          <p className="-mt-2 mb-6 max-w-2xl text-[15px] leading-relaxed text-white/70">
            Kliko një kod për ta kopjuar. <span className="text-white">Web</span> është për faqen,{" "}
            <span className="text-white">Print</span> për ofertat në PDF dhe letër. Ari për printim: RGB 171 131 57 ≈ CMYK 0 23 67 33.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COLORS.map((c) => (
              <div key={c.token} className="overflow-hidden rounded-2xl border border-white/10 bg-surface">
                <div className="flex h-24">
                  <div className="flex-[3]" style={{ background: c.web }} />
                  <div className="flex-1 border-l border-white/10" style={{ background: c.print }} />
                </div>
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-[15px] font-semibold text-white">{c.name}</p>
                    <code className="text-[12px] text-white/50">{c.token}</code>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-[12px]">
                    {[["Web", c.web], ["Print", c.print]].map(([label, hex]) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => copy(hex)}
                        className="rounded-full border border-white/15 px-2.5 py-1 font-semibold tabular-nums text-white/80 transition-colors hover:border-accent/60 hover:text-accentLight"
                      >
                        {label} {copied === hex ? "✓ u kopjua" : hex}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-white/60">{c.usage}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {STATE_COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => copy(c.hex)}
                className="flex items-center gap-3 rounded-full border border-white/10 bg-surface py-1.5 pl-1.5 pr-4 text-left"
              >
                <span className="h-7 w-7 rounded-full" style={{ background: c.hex }} />
                <span className="text-[13px] text-white/80">
                  <span className="font-semibold text-white">{c.name}</span> {copied === c.hex ? "✓" : c.hex} · {c.usage}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Fontet */}
        <section id="brand-fontet" className="scroll-mt-24">
          <SectionTitle eyebrow="03 · Fontet" title="Serif për titujt, sans për tekstin" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-surface p-6">
              <p className="font-display text-[64px] font-bold leading-none text-accent">Aa</p>
              <p className="mt-3 text-[15px] font-semibold text-white">Cormorant Garamond</p>
              <p className="text-[13px] text-white/60">Titujt, numrat e mëdhenj, totali i ofertës · 600–700</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-surface p-6">
              <p className="text-[64px] font-semibold leading-none text-accent">Aa</p>
              <p className="mt-3 text-[15px] font-semibold text-white">Plus Jakarta Sans</p>
              <p className="text-[13px] text-white/60">Gjithçka tjetër · 400 tekst, 600–700 etiketa e butona</p>
            </div>
          </div>
          <div className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 bg-surface">
            {TYPE_SCALE.map((t) => (
              <div key={t.name} className="grid gap-2 p-5 md:grid-cols-[200px_1fr] md:items-baseline">
                <div>
                  <p className="text-[13px] font-semibold text-white">{t.name}</p>
                  <p className="text-[12px] text-white/50">{t.spec}</p>
                </div>
                <p className={`${t.className} min-w-0 text-white`}>{t.sample}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[14px] text-white/70">
            Teksti për lexim nuk del kurrë nën <span className="text-white">16px</span> në faqe dhe{" "}
            <span className="text-white">15px</span> në dokumente. Pa font mono.
          </p>
        </section>

        {/* Elementët */}
        <section id="brand-elementet" className="scroll-mt-24">
          <SectionTitle eyebrow="04 · Butonat & elementët" title="Të njëjtat klasa si në faqe" />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-surface p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="ip-cta-primary">Fillo sot →</span>
                <span className="ip-cta-secondary">WhatsApp</span>
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-white/65">
                <code className="text-accentLight">.ip-cta-primary</code> për veprimin kryesor, një për seksion.{" "}
                <code className="text-accentLight">.ip-cta-secondary</code> për alternativën. Variant i madh: <code>--lg</code>.
                Mos ua ndrysho madhësinë me <code>!text-…</code>.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-surface p-6">
              <p className="ip-eyebrow">Pse ne</p>
              <p className="mt-2 font-display text-[28px] font-semibold leading-tight text-white">
                Shqip, në <span className="text-accent">orarin</span> tuaj
              </p>
              <p className="mt-4 text-[13px] leading-relaxed text-white/65">
                <code className="text-accentLight">.ip-eyebrow</code> sipër çdo titulli seksioni. Një fjalë në ar te titulli.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-surface p-6">
              <div className="flex flex-wrap gap-2">
                {["SEO", "Branding", "E-Commerce", "Rritje"].map((c) => (
                  <span key={c} className="inline-flex rounded-full border border-accent/45 bg-accent/10 px-4 py-[7px] text-[0.75rem] font-semibold uppercase leading-none tracking-[0.15em] text-accentLight">
                    {c}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-white/65">Kategoritë e blogut: një stil i vetëm ari, pa ngjyra të ndryshme.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-bg p-6 shadow-gold-lift">
              <p className="ip-eyebrow">Karta</p>
              <p className="mt-2 font-display text-[24px] font-semibold text-white">Dyqan online</p>
              <p className="mt-1 text-[13px] leading-relaxed text-white/65">
                <code>surface</code> + kuadër 1px + qoshe 16px. Hija vetëm në hover (<code>shadow-gold-lift</code>, si kjo).
              </p>
              <span className="luxury-link mt-4">Mëso më shumë <span aria-hidden>→</span></span>
            </div>
          </div>
        </section>

        {/* Qoshet & hijet */}
        <section id="brand-shkalla" className="scroll-mt-24">
          <SectionTitle eyebrow="05 · Qoshet, hijet, hapësirat" title="Pak vlera, gjithmonë të njëjtat" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RADII.map((r) => (
              <div key={r.name} className="rounded-2xl border border-white/10 bg-surface p-5">
                <div className={`h-16 border-2 border-accent/70 bg-accent/10 ${r.className}`} />
                <p className="mt-3 text-[14px] font-semibold text-white">{r.name}</p>
                <p className="text-[13px] text-white/60">{r.usage}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {SHADOWS.map((s) => (
              <div key={s.name}>
                <div className={`h-20 rounded-2xl border border-white/10 bg-surface ${s.className}`} />
                <p className="mt-3 text-[14px] font-semibold text-white">{s.name}</p>
                <p className="text-[13px] leading-snug text-white/60">{s.usage}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-white/10 bg-surface p-5">
            <p className="text-[14px] font-semibold text-white">Hapësirat</p>
            <div className="mt-4 flex flex-wrap items-end gap-4">
              {[4, 8, 16, 24, 32, 48, 64].map((px) => (
                <div key={px} className="text-center">
                  <div className="mx-auto bg-accent" style={{ width: px, height: px }} />
                  <p className="mt-2 text-[12px] tabular-nums text-white/60">{px}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[13px] text-white/60">Seksionet: 64px në celular, 112px në desktop. Gutter-i anësor jo nën 16px.</p>
          </div>
        </section>

        {/* Toni */}
        <section id="brand-toni" className="scroll-mt-24">
          <SectionTitle eyebrow="06 · Toni i zërit" title="Si partner, jo si reklamë" />
          <ul className="mb-6 grid gap-3 text-[15px] leading-relaxed text-white/80 md:grid-cols-2">
            <li className="rounded-2xl border border-white/10 bg-surface p-4"><span className="font-semibold text-white">&quot;Ju&quot; me klientët</span> në faqe, oferta, email. &quot;Ti&quot; vetëm në postime të lehta.</li>
            <li className="rounded-2xl border border-white/10 bg-surface p-4"><span className="font-semibold text-white">Fjali të shkurtra.</span> Një ide për fjali.</li>
            <li className="rounded-2xl border border-white/10 bg-surface p-4"><span className="font-semibold text-white">Shqip i pastër.</span> Anglisht vetëm për terma si SEO, website, Google Ads.</li>
            <li className="rounded-2xl border border-white/10 bg-surface p-4"><span className="font-semibold text-white">Vetëm numra të vërtetë.</span> Asnjë statistikë apo vlerësim i shpikur.</li>
          </ul>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[520px] text-[14px]">
              <thead>
                <tr className="bg-white/[0.03] text-left">
                  <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.15em] text-emerald-300">Po</th>
                  <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.15em] text-red-400">Jo</th>
                </tr>
              </thead>
              <tbody className="text-white/85">
                {[
                  ["Takime online në mbrëmje dhe fundjavë, në shqip.", "Disponueshmëri 24/7 në çdo gjuhë."],
                  ["Klientë në 7 vende.", "Qindra klientë të kënaqur."],
                  ["Faqe që sjellin klientë, jo vetëm vizita.", "Zgjidhjet më inovative në treg!!!"],
                ].map(([yes, no]) => (
                  <tr key={yes} className="border-t border-white/10">
                    <td className="px-4 py-3">{yes}</td>
                    <td className="px-4 py-3 text-white/60 line-through decoration-red-400/60">{no}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-400/5 p-4 text-[14px] leading-relaxed text-white/80">
            <span className="font-semibold text-red-300">Premtime që NUK i bëjmë</span> (s&apos;janë konfirmuar): përkthim në gjermanisht/italisht,
            Impressum/DSGVO, &quot;më lirë se agjencitë gjermane&quot;.
          </div>
        </section>

        {/* Rregullat */}
        <section id="brand-rregullat" className="scroll-mt-24">
          <SectionTitle eyebrow="07 · Rregullat" title="Dokumente, King Genti, rrjete sociale" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-surface p-5 text-[14px] leading-relaxed text-white/80">
              <p className="font-semibold text-white">Dokumentet e klientit</p>
              <p className="mt-2">Oferta, fatura, portali, vlerësimi: e njëjta kokë dhe footer. Në PDF dalin të bardha, me ar #8A6A2C, pa butona.</p>
              <p className="mt-3 text-white/60">info@illyrianpixel.com · WhatsApp +355 69 472 6827 · illyrianpixel.com</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-surface p-5 text-[14px] leading-relaxed text-white/80">
              <p className="font-semibold text-white">King Genti</p>
              <p className="mt-2">Maskotë, jo logo. Vetëm te chat-i dhe në postime të lehta. Jo në oferta, fatura, kartëvizita apo pranë logos.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-surface p-5 text-[14px] leading-relaxed text-white/80">
              <p className="font-semibold text-white">Rrjetet sociale</p>
              <p className="mt-2">Foto profili: ikona e aplikacionit. Postimet: sfond i zi, titull në Cormorant, një fjalë në ar, logoja e vogël në një cep.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
