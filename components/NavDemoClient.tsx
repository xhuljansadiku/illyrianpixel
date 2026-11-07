"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";

/**
 * DEMO (2026-11-07): 5 versione navbar-i, secili me pamje desktop + celular (390px).
 * Pamjet janë statike brenda kutive — s'zëvendësojnë navbar-in real. Fshihet pas zgjedhjes.
 */

const LINKS = ["Shërbimet", "Çmimet", "Projektet", "Blog", "Diasporë", "Kontakt"];
const SERVICES = [
  { t: "Website profesional", img: "/images/services/website-hero-v3.avif" },
  { t: "Dyqan online", img: "/images/services/ecommerce-hero-v1.avif" },
  { t: "SEO & Google Ads", img: "/images/services/seo-hero-v1.avif" },
  { t: "Social Media", img: "/images/services/smm-hero-v2.avif" },
  { t: "Branding & Përmbajtje", img: "/images/services/branding-hero-v1.avif" },
  { t: "Aplikacione", img: "/images/services/apps-hero-v1.avif" },
  { t: "Mirëmbajtje", img: "/images/services/maintenance-hero-v1.avif" },
];

const CTA = "font-ui inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-[12px] font-bold tracking-[1px] text-bg transition-shadow hover:shadow-gold";

function Eagle({ className = "h-8 w-8" }: { className?: string }) {
  return <Image src="/images/illyrianpixel_logo.svg" alt="" width={40} height={37} unoptimized className={`${className} object-contain`} />;
}
function Wordmark({ className = "h-5" }: { className?: string }) {
  return <Image src="/images/illyrianpixel_text.svg" alt="Illyrian Pixel" width={200} height={33} unoptimized className={`${className} w-auto object-contain`} />;
}
function Lang() {
  return (
    <span className="font-ui inline-flex rounded-full border border-white/15 p-0.5 text-[11px] font-bold">
      <span className="rounded-full bg-white/10 px-2 py-1 text-white">SQ</span>
      <span className="px-2 py-1 text-white/50">EN</span>
    </span>
  );
}
function Burger({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="Menu" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/85">
      {open ? "✕" : "☰"}
    </button>
  );
}

/** Kornizë celulari 390px me një "faqe" poshtë navbar-it */
function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-[390px] max-w-full overflow-hidden rounded-[36px] border-[6px] border-[#1c1c1c] bg-bg shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
      <div className="relative h-[640px] overflow-hidden">{children}</div>
    </div>
  );
}
function FakeHero({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "px-5 pt-10" : "px-10 pt-16 pb-14"}>
      <p className="ip-eyebrow">ILLYRIAN PIXEL</p>
      <h2 className={`mt-4 font-display font-bold leading-[1.05] text-white ${compact ? "text-[2rem]" : "text-[3rem]"}`}>
        Standard ndërkombëtar. <span className="italic text-accent">Në shqip.</span>
      </h2>
    </div>
  );
}

// ── A · Kapsulë qelqi ───────────────────────────────────────────────
function DesktopA() {
  return (
    <div className="relative">
      <div className="flex items-center justify-between px-8 pt-6">
        <div className="flex items-center gap-3"><Eagle /><Wordmark /></div>
        <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur-xl">
          {LINKS.map((l, i) => (
            <a key={l} className={`font-ui rounded-full px-4 py-2 text-[13px] font-bold transition-colors ${i === 0 ? "bg-accent/15 text-accentLight" : "text-white/65 hover:text-white"}`}>{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3"><Lang /><span className={CTA}>Fillo sot</span></div>
      </div>
      <FakeHero />
    </div>
  );
}
function MobileA() {
  const [open, setOpen] = useState(false);
  return (
    <Phone>
      <div className="m-3 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.05] py-1.5 pl-3 pr-1.5 backdrop-blur-xl">
        <div className="flex items-center gap-2"><Eagle className="h-6 w-6" /><Wordmark className="h-3.5" /></div>
        <Burger open={open} onClick={() => setOpen(!open)} />
      </div>
      <FakeHero compact />
      {/* Fletë nga poshtë */}
      <div className={`absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-accent/30 bg-[#111] p-5 transition-transform duration-500 ${open ? "translate-y-0" : "translate-y-full"}`}>
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
        <div className="grid grid-cols-2 gap-2">
          {LINKS.map((l) => (
            <a key={l} className="font-ui rounded-xl border border-white/10 px-4 py-3.5 text-[14px] font-bold text-white/80">{l}</a>
          ))}
        </div>
        <span className={`${CTA} mt-4 w-full py-3.5`}>Fillo sot</span>
      </div>
    </Phone>
  );
}

// ── B · Editorial me shirit sipër ───────────────────────────────────
function DesktopB() {
  return (
    <div>
      <div className="border-b border-white/[0.06] py-2 text-center font-ui text-[11px] tracking-[2px] text-white/45">
        STANDARD NDËRKOMBËTAR · <span className="text-accent">NË SHQIP</span> · TIRANË — MYNIH — NJU JORK
      </div>
      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center px-10 py-5">
        <nav className="flex gap-7">
          {LINKS.slice(0, 3).map((l) => <a key={l} className="font-display text-[17px] text-white/75 hover:text-accent">{l}</a>)}
        </nav>
        <div className="flex flex-col items-center gap-1.5"><Eagle className="h-9 w-9" /><Wordmark className="h-3.5" /></div>
        <div className="flex items-center justify-end gap-7">
          {LINKS.slice(3, 5).map((l) => <a key={l} className="font-display text-[17px] text-white/75 hover:text-accent">{l}</a>)}
          <span className="font-ui border-b border-accent pb-0.5 text-[12px] font-bold tracking-[1.5px] text-accent">FILLO SOT →</span>
        </div>
        <div className="absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      </div>
      <FakeHero />
    </div>
  );
}
function MobileB() {
  const [open, setOpen] = useState(false);
  return (
    <Phone>
      <div className="border-b border-white/[0.06] py-1.5 text-center font-ui text-[9px] tracking-[2px] text-white/45">STANDARD NDËRKOMBËTAR · <span className="text-accent">NË SHQIP</span></div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 py-3">
        <button type="button" onClick={() => setOpen(!open)} className="justify-self-start font-ui text-[11px] font-bold tracking-[2px] text-white/80">{open ? "MBYLL" : "MENU"}</button>
        <Eagle className="h-8 w-8" />
        <span className="justify-self-end font-ui text-[11px] font-bold tracking-[1.5px] text-accent">FILLO →</span>
      </div>
      <FakeHero compact />
      <div className={`absolute inset-x-0 bottom-0 top-[86px] bg-bg px-6 pt-6 transition-opacity duration-500 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        {LINKS.map((l, i) => (
          <a key={l} className="flex items-baseline gap-4 border-b border-white/[0.07] py-4 font-display text-[1.9rem] text-white">
            <span className="font-mono text-[11px] text-accent">0{i + 1}</span>{l}
          </a>
        ))}
      </div>
    </Phone>
  );
}

// ── C · Minimal + menu në ekran të plotë ────────────────────────────
function DesktopC() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative min-h-[300px] overflow-hidden">
      <div className="relative z-10 flex items-center justify-between px-10 py-6">
        <div className="flex items-center gap-3"><Eagle /><Wordmark /></div>
        <div className="flex items-center gap-4">
          <span className={CTA}>Fillo sot</span>
          <button type="button" onClick={() => setOpen(!open)} className="font-ui inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-2.5 text-[12px] font-bold tracking-[2px] text-white">
            {open ? "MBYLL ✕" : "MENU"}
            {!open && <span className="flex flex-col gap-1"><span className="h-px w-5 bg-white" /><span className="h-px w-3 bg-accent" /></span>}
          </button>
        </div>
      </div>
      <FakeHero />
      <div className={`absolute inset-0 grid grid-cols-[1.4fr_1fr] gap-10 bg-[#0b0a08] px-10 pb-10 pt-24 transition-[clip-path] duration-700 ${open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]"}`}>
        <div className="grid grid-cols-2 gap-x-10">
          {LINKS.map((l, i) => (
            <a key={l} className="group flex items-baseline gap-3 py-2 font-display text-[2.6rem] leading-tight text-white/85 hover:text-accent">
              <span className="font-mono text-[11px] text-accent/70">0{i + 1}</span>{l}
            </a>
          ))}
        </div>
        <div className="border-l border-white/10 pl-10 font-ui text-[13px] leading-loose text-white/55">
          <p className="ip-eyebrow">KONTAKT</p>
          <p className="mt-3">info@illyrianpixel.com</p>
          <p>WhatsApp +355 69 472 6827</p>
          <p className="mt-6 font-display text-[1.3rem] italic text-accent">Standard ndërkombëtar. Në shqip.</p>
        </div>
      </div>
    </div>
  );
}
function MobileC() {
  const [open, setOpen] = useState(false);
  return (
    <Phone>
      <div className="relative z-10 flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2"><Eagle className="h-7 w-7" /><Wordmark className="h-3.5" /></div>
        <button type="button" onClick={() => setOpen(!open)} className="font-ui rounded-full border border-white/15 px-4 py-2 text-[11px] font-bold tracking-[2px] text-white">{open ? "MBYLL" : "MENU"}</button>
      </div>
      <FakeHero compact />
      <div className={`absolute inset-0 flex flex-col bg-[#0b0a08] px-6 pb-8 pt-24 transition-[clip-path] duration-700 ${open ? "[clip-path:circle(150%_at_90%_5%)]" : "[clip-path:circle(0%_at_90%_5%)]"}`}>
        {LINKS.map((l) => <a key={l} className="py-2 font-display text-[2.3rem] leading-tight text-white">{l}</a>)}
        <div className="mt-auto">
          <span className={`${CTA} w-full py-3.5`}>Fillo sot</span>
          <p className="mt-4 text-center font-display text-[15px] italic text-accent">Standard ndërkombëtar. Në shqip.</p>
        </div>
      </div>
    </Phone>
  );
}

// ── D · Mega-menu me foto shërbimesh ────────────────────────────────
function DesktopD() {
  const [open, setOpen] = useState(true);
  const [hover, setHover] = useState(0);
  return (
    <div className="relative min-h-[420px]">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-8 py-5">
        <div className="flex items-center gap-3"><Eagle /><Wordmark /></div>
        <nav className="flex items-center gap-8">
          <button type="button" onClick={() => setOpen(!open)} className={`font-ui text-[14px] font-bold ${open ? "text-accent" : "text-white/65"}`}>Shërbimet {open ? "▴" : "▾"}</button>
          {LINKS.slice(1).map((l) => <a key={l} className="font-ui text-[14px] font-bold text-white/65 hover:text-accentLight">{l}</a>)}
        </nav>
        <div className="flex items-center gap-3"><Lang /><span className={CTA}>Fillo sot</span></div>
      </div>
      {open ? (
        <div className="grid grid-cols-[1fr_1.1fr] gap-8 border-b border-accent/20 bg-[#0e0e0e] px-8 py-7 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
          <ul className="grid grid-cols-2 gap-x-6">
            {SERVICES.map((s, i) => (
              <li key={s.t} onMouseEnter={() => setHover(i)} className={`cursor-pointer border-b border-white/[0.06] py-3 font-ui text-[14px] font-bold transition-colors ${hover === i ? "text-accent" : "text-white/75"}`}>
                <span className="mr-2 font-mono text-[10px] text-accent/60">0{i + 1}</span>{s.t}
              </li>
            ))}
            <li className="py-3 font-ui text-[12px] font-bold tracking-[1px] text-accent">TË GJITHA →</li>
          </ul>
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/10">
            <Image src={SERVICES[hover].img} alt="" fill sizes="40vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 font-display text-xl text-white">{SERVICES[hover].t}</div>
          </div>
        </div>
      ) : (
        <FakeHero />
      )}
    </div>
  );
}
function MobileD() {
  const [open, setOpen] = useState(true);
  const [acc, setAcc] = useState(true);
  return (
    <Phone>
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
        <div className="flex items-center gap-2"><Eagle className="h-7 w-7" /><Wordmark className="h-3.5" /></div>
        <Burger open={open} onClick={() => setOpen(!open)} />
      </div>
      {open ? (
        <div className="overflow-y-auto px-4 pb-6" style={{ height: 570 }}>
          <button type="button" onClick={() => setAcc(!acc)} className="flex w-full justify-between border-b border-white/[0.07] py-4 font-ui text-[16px] font-bold text-accent">
            Shërbimet <span>{acc ? "−" : "+"}</span>
          </button>
          {acc && (
            <div className="grid grid-cols-2 gap-2 py-3">
              {SERVICES.slice(0, 6).map((s) => (
                <div key={s.t} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10">
                  <Image src={s.img} alt="" fill sizes="180px" className="object-cover opacity-70" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 font-ui text-[11px] font-bold text-white">{s.t}</span>
                </div>
              ))}
            </div>
          )}
          {LINKS.slice(1).map((l) => <a key={l} className="block border-b border-white/[0.07] py-4 font-ui text-[16px] font-bold text-white/80">{l}</a>)}
          <span className={`${CTA} mt-5 w-full py-3.5`}>Fillo sot</span>
        </div>
      ) : (
        <FakeHero compact />
      )}
    </Phone>
  );
}

// ── E · Dy kate + shirit poshtë në celular ──────────────────────────
function DesktopE() {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#080808] px-8 py-2 font-ui text-[11px] text-white/50">
        <div className="flex gap-6"><span>✉ info@illyrianpixel.com</span><span>💬 WhatsApp: +355 69 472 6827</span></div>
        <div className="flex items-center gap-5"><span className="text-accent">● Përgjigje brenda 24 orësh</span><Lang /></div>
      </div>
      <div className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3"><Eagle /><Wordmark /></div>
        <nav className="flex items-center gap-8">
          {LINKS.map((l, i) => (
            <a key={l} className={`relative font-ui text-[14px] font-bold ${i === 1 ? "text-white" : "text-white/60"}`}>
              {l}
              {i === 1 && <span className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-accent" />}
            </a>
          ))}
        </nav>
        <span className="font-ui inline-flex items-center rounded-[2px] bg-accent px-6 py-3 text-[12px] font-bold tracking-[1px] text-bg">MERR OFERTË FALAS</span>
      </div>
      <FakeHero />
    </div>
  );
}
function MobileE() {
  const tabs = [["⌂", "Ballina"], ["◇", "Shërbimet"], ["€", "Çmimet"], ["▣", "Projektet"], ["✉", "Kontakt"]];
  return (
    <Phone>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2"><Eagle className="h-7 w-7" /><Wordmark className="h-3.5" /></div>
        <span className="font-ui rounded-full bg-[#25D366]/15 px-3 py-1.5 text-[11px] font-bold text-[#25D366]">WhatsApp</span>
      </div>
      <FakeHero compact />
      {/* Shirit poshtë si aplikacion — gjithmonë i dukshëm */}
      <div className="absolute inset-x-3 bottom-3 grid grid-cols-5 rounded-2xl border border-white/10 bg-[#141414]/95 py-2 backdrop-blur-xl">
        {tabs.map(([icon, label], i) => (
          <span key={label} className={`flex flex-col items-center gap-1 py-1 font-ui text-[10px] font-bold ${i === 0 ? "text-accent" : "text-white/55"}`}>
            <span className="text-[16px] leading-none">{icon}</span>{label}
          </span>
        ))}
      </div>
    </Phone>
  );
}

const VERSIONS = [
  { id: "A", name: "Kapsulë qelqi", note: "Lidhjet në një kapsulë xhami në mes, si aplikacionet moderne. Në celular: fletë nga poshtë me butona të mëdhenj.", D: DesktopA, M: MobileA },
  { id: "B", name: "Editorial", note: "Logoja në qendër si revistë luksi, shirit me sloganin sipër. Në celular: menu me tituj të mëdhenj serif.", D: DesktopB, M: MobileB },
  { id: "C", name: "Minimal + menu e plotë", note: "Vetëm logo, \"Fillo sot\" dhe \"Menu\". Menuja hapet në ekran të plotë, edhe në desktop. Klikoni MENU.", D: DesktopC, M: MobileC },
  { id: "D", name: "Mega-menu me foto", note: "\"Shërbimet\" hap panel me 7 shërbimet dhe foton e secilit (kaloni mausin). Në celular: foto të shërbimeve brenda menusë.", D: DesktopD, M: MobileD },
  { id: "E", name: "Dy kate + shirit poshtë", note: "Shirit i vogël me email, WhatsApp dhe \"Përgjigje brenda 24h\". Në celular: shirit poshtë si aplikacion, gjithmonë i dukshëm.", D: DesktopE, M: MobileE },
];

export default function NavDemoClient() {
  return (
    <main className="min-h-screen bg-bgDeep pb-24 pt-10">
      <div className="section-wrap">
        <p className="ip-eyebrow">DEMO · NAVBAR</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white">5 versione navbar-i</h1>
        <p className="mt-2 text-white/50">Majtas desktop, djathtas celular. Në celular klikoni ☰ / MENU për ta hapur.</p>
      </div>
      {VERSIONS.map(({ id, name, note, D, M }) => (
        <section key={id} className="section-wrap mt-16">
          <div className="flex items-baseline gap-4">
            <span className="font-display text-5xl font-bold text-accent">{id}</span>
            <div>
              <h2 className="font-display text-2xl font-bold text-white">{name}</h2>
              <p className="max-w-[70ch] text-[14px] text-white/50">{note}</p>
            </div>
          </div>
          <div className="mt-6 grid items-start gap-8 xl:grid-cols-[1fr_390px]">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-bg">
              <D />
            </div>
            <M />
          </div>
        </section>
      ))}
    </main>
  );
}
