"use client";

// "Klientët tanë" (2026-10-16): logot e klientëve + globi. Kalimi/prekja e një logoje kthen globin
// te vendi i klientit dhe tregon çfarë i ndërtuam. Numrat llogariten nga të dhënat (gjithmonë të vërtetë).
// Zëvendësoi TrustedClients (shirit me logo + "6+ vite / 100+ projekte").
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
// import { Link } from "@/i18n/navigation"; — për kutinë me detaje (e komentuar)
import type { Locale } from "@/i18n/routing";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { getCaseStudies } from "@/lib/caseStudies";
import { CLIENT_COUNTRIES } from "@/lib/clientLocations";
import SectionMark from "@/components/SectionMark";
import LazyMount from "@/components/LazyMount";
import type { GlobeFocus } from "@/components/ClientGlobe";

const ClientGlobe = dynamic(() => import("@/components/ClientGlobe"), { ssr: false });

type Client = { name: string; logo: string; slug?: string; darkHover?: boolean; showName?: string };

const CLIENTS: Client[] = [
  { name: "ESM Group", logo: "/images/logos/esm-group.png", slug: "esm-group", darkHover: true },
  { name: "Palushi Brothers", logo: "/images/logos/palushi-brothers.webp", slug: "palushi-brothers" },
  { name: "Roof ON NYC", logo: "/images/logos/roofon-nyc.png", slug: "roofon-nyc", showName: "Roof ON" },
  { name: "Hauswerk Niederbayern", logo: "/images/logos/hauswerk-niederbayern.png", slug: "hauswerk-niederbayern" },
  { name: "Bardhi Wellness", logo: "/images/logos/bardhi-wellness.png", slug: "bardhi-wellness" },
  { name: "Suli Group Trockenbau", logo: "/images/logos/suli-group-trockenbau.png", slug: "suli-group-trockenbau" },
  { name: "Ilirjana Shehu Photography", logo: "/images/logos/ilirjana-shehu-photography.png", slug: "ilirjana-shehu-photography" },
  { name: "Squadin", logo: "/images/logos/squadin.svg" },
];

export default function ClientsShowcase() {
  const t = useTranslations("home.trustedClients");
  const locale = useLocale() as Locale;
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState<string | null>(null);

  const caseStudies = getCaseStudies(locale);
  const activeClient = CLIENTS.find((c) => c.name === active) ?? null;
  const cs = activeClient?.slug ? caseStudies.find((c) => c.slug === activeClient.slug) : undefined;
  const country = cs ? CLIENT_COUNTRIES.find((c) => c.flag === cs.flagCodes[0]) : undefined;
  const focus: GlobeFocus = country ? { country: country.country, lat: country.lat, lon: country.lon } : null;


  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cs-reveal",
        { opacity: 0, y: 20, filter: "blur(4px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)",
          stagger: 0.08, duration: 0.75, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="klientet" className="relative overflow-hidden border-b border-white/[0.06] bg-bgDeep/92">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/3 h-80 w-[700px] -translate-x-1/2 rounded-full bg-accent/[0.06] blur-[90px]" />

      <div className="section-wrap relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <div className="cs-reveal">
            <SectionMark label={t("eyebrow")} />
          </div>
          <h2 className="cs-reveal section-title mt-2 text-white">{t("headline")}</h2>
          <p className="cs-reveal mt-4 max-w-[480px] font-body text-[0.94rem] font-light leading-relaxed tracking-[0.02em] text-white/45">
            {t("intro")}
          </p>

          {/* Logot */}
          <ul className="cs-reveal mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CLIENTS.map((client) => {
              const isActive = client.name === active;
            // Kalimi me maus vetëm kthen globin te vendi i klientit (pa kutinë me detaje)
              return (
                <li key={client.name}>
                  <button
                    type="button"
                    aria-pressed={isActive}
                    aria-label={client.name}
                    onMouseEnter={() => setActive(client.name)}
                    onFocus={() => setActive(client.name)}
                    onClick={() => setActive(client.name)}
                    className={`group flex h-[70px] w-full items-center justify-center gap-2 rounded-2xl border p-4 transition-all duration-500 ${
                      isActive
                        ? client.darkHover
                          ? "border-accent/60 bg-accent/[0.08] shadow-gold"
                          : "border-transparent bg-[#faf8f4] shadow-card"
                        : "border-accent/18 bg-[linear-gradient(135deg,rgba(171,131,57,0.07),rgba(171,131,57,0.02))] hover:border-accent/40"
                    }`}
                  >
                    <span className={`relative h-full ${client.showName ? "w-8 shrink-0" : "w-full"}`}>
                      <Image
                        src={client.logo}
                        // aria-label i butonit mbetet emri i aksesueshëm; alt-i ndihmon Bing/Google Images
                        alt={`${client.name} logo`}
                        fill
                        sizes="140px"
                        className={`object-contain transition-all duration-500 ${
                          isActive && !client.darkHover ? "" : "brightness-0 invert opacity-50 group-hover:opacity-90"
                        }`}
                      />
                    </span>
                    {client.showName && (
                      <span className={`truncate text-[12px] font-semibold tracking-wide transition-colors ${isActive ? "text-[#1a1714]" : "text-white/55"}`}>
                        {client.showName}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Kutia me detaje dhe numrat (7 vende / 9 qytete / 8 projekte) u hoqën 2026-10-16 me kërkesë — vetëm logot.
          {/ * Detajet e klientit të zgjedhur * /}
          <div className="cs-reveal mt-5 min-h-[118px] rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5" aria-live="polite">
            {cs ? (
              <div key={cs.slug} className="brand-builder-in">
                <p className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                  {cs.flagCodes.map((code) => (
                    <Image key={code} src={`/flags/4x3/${code}.svg`} alt="" width={16} height={12} className="h-3 w-4 rounded-[2px] object-cover" unoptimized />
                  ))}
                  {cs.location}
                  <span className="text-white/20">/</span>
                  <span className="text-accent/80">{cs.category}</span>
                </p>
                <p className="mt-2 text-[15px] text-white/85">
                  <span className="font-semibold text-white">{cs.title}:</span> {cs.result}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                  <Link href={`/projektet/${cs.slug}`} className="border-b border-accent pb-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent hover:text-accentLight">
                    {t("caseStudy")} →
                  </Link>
                  {cs.liveUrl && (
                    <a href={cs.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 pb-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55 hover:text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {t("live")} ↗
                    </a>
                  )}
                </div>
              </div>
            ) : activeClient ? (
              <p className="text-[15px] font-semibold text-white">{activeClient.name}</p>
            ) : (
              <p className="text-[13px] leading-relaxed text-white/40">
                <span className="hidden md:inline">{t("hoverHint")}</span>
                <span className="md:hidden">{t("tapHint")}</span>
              </p>
            )}
          </div>

          {/ * Numra të verifikueshëm * /}
          <dl className="cs-reveal mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-3xl font-bold text-accent">{s.value}</dd>
                <dd className="mt-1 font-mono text-[10px] uppercase leading-snug tracking-[0.16em] text-white/45">{s.label}</dd>
              </div>
            ))}
          </dl>
          */}
        </div>

        <div className="relative mx-auto h-[360px] w-full max-w-[560px] sm:h-[460px] lg:h-[560px]">
          {/* d3 + harta e botës shkarkohen vetëm kur seksioni afrohet në ekran (2026-10-25) */}
          <LazyMount className="absolute inset-0">
            <ClientGlobe locale={locale} variant="pins" focus={focus} start={[-22, 44]} sway />
          </LazyMount>
          <p className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/55">
            ↻ {t("dragGlobe")}
          </p>
        </div>
      </div>
    </section>
  );
}
