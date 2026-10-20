// FAQE TESTI LOKALE (2026-10-20) — krahasim i efekteve "wow" (Tani vs I ri).
// Fshihet sapo të zgjidhen variantet; s'ka link nga askund dhe është noindex.
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { Link } from "@/i18n/navigation";
import HeroBrandBuilder from "@/components/HeroBrandBuilder";
import HeroBrandBuilderLive from "@/components/HeroBrandBuilderLive";
import ScrollLightTitle from "@/components/ScrollLightTitle";
import ProjectBrowserCards from "@/components/ProjectBrowserCards";
import { getCaseStudies } from "@/lib/caseStudies";
import type { Locale } from "@/i18n/routing";
import WowDemoButton from "./WowDemoButton";

export const metadata: Metadata = { title: "Test — efektet wow", robots: { index: false, follow: false } };

type Props = { params: Promise<{ locale: Locale }> };

function Label({ n, title, note }: { n: string; title: string; note: string }) {
  return (
    <div className="mb-8 border-l-2 border-accent pl-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{n}</p>
      <h2 className="mt-1 font-display text-3xl font-bold text-white">{title}</h2>
      <p className="mt-1 max-w-2xl text-sm text-white/60">{note}</p>
    </div>
  );
}

function Tag({ children, active = false }: { children: string; active?: boolean }) {
  return (
    <p className={`mb-4 inline-block rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${active ? "bg-accent text-black" : "border border-white/20 text-white/60"}`}>
      {children}
    </p>
  );
}

export default async function TestWowPage(props: Props) {
  const { locale } = await props.params;
  const projects = getCaseStudies(locale).filter((p) => ["esm-group", "palushi-brothers", "roofon-nyc"].includes(p.slug));

  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-bg pb-40 pt-28">
        <div className="section-wrap">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">Faqe testi · vetëm lokalisht</p>
          <h1 className="mt-2 font-display text-5xl font-bold text-white">Efektet &quot;wow&quot; — krahaso</h1>
          <p className="mt-3 max-w-2xl text-white/60">
            Çdo bllok tregon <strong className="text-white">Tani</strong> (si është live) dhe <strong className="text-accent">I ri</strong>. Bëj scroll ngadalë.
            Kalimi mes faqeve (4) është aktiv në gjithë site-in lokal — kliko çdo link në menu.
          </p>
        </div>

        {/* 1. Hero */}
        <section className="section-wrap">
          <Label n="1" title="Hero që luan vetë" note="I riu shkruan vetë emra biznesesh, ndërron stilin dhe mini-faqja transformohet. Kliko fushën ose një stil: demo ndalon dhe merr ti kontrollin." />
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Tag>Tani</Tag>
              <HeroBrandBuilder />
            </div>
            <div>
              <Tag active>I ri</Tag>
              <HeroBrandBuilderLive />
            </div>
          </div>
        </section>

        {/* 2. Titujt */}
        <section className="section-wrap">
          <Label n="2" title="Titujt ndizen me scroll" note="Bëj scroll ngadalë që titujt të kalojnë nga poshtë ekranit drejt mesit." />
          <div className="space-y-[38vh] pb-[20vh]">
            <div>
              <Tag>Tani</Tag>
              <h2 className="section-title max-w-4xl">
                Projekte që sjellin <span className="text-accent">klientë realë</span>
              </h2>
            </div>
            <div>
              <Tag active>I ri · A: dritë e artë</Tag>
              <ScrollLightTitle className="section-title max-w-4xl" accent="klientë realë" variant="sweep">
                Projekte që sjellin
              </ScrollLightTitle>
            </div>
            <div>
              <Tag active>I ri · B: fjalë që ndizen</Tag>
              <ScrollLightTitle className="section-title max-w-4xl" accent="klientë realë" variant="words">
                Projekte që sjellin
              </ScrollLightTitle>
            </div>
          </div>
        </section>

        {/* 3. Projektet */}
        <section className="section-wrap">
          <Label n="3" title="Projektet “të gjalla”" note="Te i riu faqja brenda dritares bën vetë scroll kur del në ekran; me maus, karta anon në 3D." />
          <Tag>Tani</Tag>
          <ProjectBrowserCards projects={projects} locale={locale} columns={3} />
          <div className="h-24" />
          <Tag active>I ri</Tag>
          <ProjectBrowserCards projects={projects} locale={locale} columns={3} live />
        </section>

        {/* 4. Kalimi */}
        <section className="section-wrap">
          <Label n="4" title="Kalim mes faqeve" note="Shtyp butonin për ta parë pa lëvizur, ose kliko një link — në lokal perdja punon kudo në site." />
          <div className="flex flex-wrap items-center gap-6">
            <WowDemoButton label="Provo kalimin" />
            <Link href="/sherbimet" className="luxury-link">Shërbimet →</Link>
            <Link href="/projektet" className="luxury-link">Projektet →</Link>
            <Link href="/cmimet" className="luxury-link">Çmimet →</Link>
          </div>
        </section>
      </main>
    </>
  );
}
