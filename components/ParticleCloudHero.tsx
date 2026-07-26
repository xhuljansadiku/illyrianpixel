"use client";

// Hero-ja: teksti renderohet në server (LCP i shpejtë, zero CLS) ndërsa skena 3D
// (ParticleCloudScene → three.js/r3f) ngarkohet lazy VETËM pasi faqja të jetë
// bërë interaktive (requestIdleCallback) — three.js nuk prek dot rrugën kritike.

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useReducedMotion } from "@/lib/gsap";

const ParticleCloudScene = dynamic(() => import("@/components/ParticleCloudScene"), { ssr: false });

export default function ParticleCloudHero() {
  const t = useTranslations("home.hero");
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [showScene, setShowScene] = useState(false);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Skena 3D montohet vetëm kur browser-i është idle — LCP/TBT mbrohen.
  // Nën breakpoint-in lg (1024px) skena as nuk ngarkohet: bundle-i three.js/r3f
  // (~700KB, ~10s script evaluation në CPU mesatare mobile) rrit LCP mobile
  // në ~5s dhe TBT në ~2.9s (matur me Lighthouse mobile) — mobile merr vetëm
  // fallback-un statik .hero-grid.
  useEffect(() => {
    if (!mounted || reducedMotion) return;
    if (typeof window.matchMedia === "function" && !window.matchMedia("(min-width: 1024px)").matches) {
      return;
    }
    let idleId: number | undefined;
    let timerId: ReturnType<typeof setTimeout> | undefined;
    const arm = () => setShowScene(true);
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(arm, { timeout: 2000 });
    } else {
      timerId = setTimeout(arm, 1200);
    }
    return () => {
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timerId) clearTimeout(timerId);
    };
  }, [mounted, reducedMotion]);

  useEffect(() => {
    if (!mounted) return;

    let split: { revert: () => void } | null = null;
    let cancelled = false;
    // Nën lg (1024px) anashkalojmë SplitText: ndarja shkronjë-për-shkronjë e
    // titullit kushtonte ~2.3s script evaluation në CPU mesatare mobile
    // (matur me Lighthouse) për një efekt që amortizohet vetëm në ekrane të
    // mëdha. Mobile merr reveal-in e thjeshtë (i njëjti fallback si më poshtë)
    // dhe s'e shkarkon fare modulin gsap/SplitText.
    const isDesktop = typeof window.matchMedia === "function" && window.matchMedia("(min-width: 1024px)").matches;

    const runHeadlineReveal = (gsap: typeof import("gsap").default, SplitText?: typeof import("gsap/SplitText").SplitText) => {
      const headlineTarget = headlineRef.current?.querySelector<HTMLElement>(".headline-word");
      if (!headlineTarget || reducedMotion) return;

      if (SplitText) {
        // SplitText (falas që nga GSAP 3.13): çdo shkronjë ngrihet nga "sloti" i vet
        // i maskuar — reveal karakteristik i faqeve award-winning.
        // KUJDES: fjala e artë (.hero-brand-word) NUK ndahet — gradienti i saj përdor
        // background-clip:text me color:transparent, që humbet po u nda në shkronja.
        // Prandaj përjashtohet me `ignore` dhe animohet si njësi e vetme në fund.
        try {
          const s = SplitText.create(headlineTarget, {
            type: "words,chars",
            mask: "chars",
            ignore: ".hero-brand-word",
          });
          split = s;
          gsap.from(s.chars, {
            yPercent: 115,
            duration: 0.85,
            stagger: { each: 0.016, from: "start" },
            delay: 0.1,
            ease: "power4.out",
          });
          // Fjala e artë ngrihet e plotë pasi mbarojnë shkronjat para saj —
          // maska e jashtme e rreshtit (.headline-mask) e clip-on gjatë ngritjes.
          gsap.from(".hero-brand-word", {
            yPercent: 115,
            opacity: 0,
            duration: 0.9,
            delay: 0.1 + Math.min(0.45, s.chars.length * 0.016),
            ease: "power4.out",
          });
          return;
        } catch {
          // rrëzohet te reveal-i i thjeshtë poshtë
        }
      }

      // Mobile + fallback: reveal i thjeshtë i të gjithë rreshtit
      gsap.fromTo(
        headlineTarget,
        { yPercent: 105, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.05, delay: 0.08, ease: "power4.out" }
      );
    };

    const gsapPromise = import("gsap");
    const splitTextPromise = isDesktop ? import("gsap/SplitText") : Promise.resolve(undefined);

    Promise.all([gsapPromise, splitTextPromise]).then(([{ default: gsap }, splitTextModule]) => {
      if (cancelled) return;
      const SplitText = splitTextModule?.SplitText;
      if (SplitText) gsap.registerPlugin(SplitText);

      runHeadlineReveal(gsap, SplitText);

      if (!reducedMotion) {
        gsap.fromTo(
          badgeRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, delay: 0.18, ease: "power2.inOut" }
        );

        gsap.fromTo(
          paragraphRef.current,
          { y: 18, opacity: 0, filter: "blur(4px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, delay: 0.38, ease: "power2.inOut" }
        );

        gsap.fromTo(
          ".particle-hero-cta > *",
          { opacity: 0, y: 22, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.1,
            duration: 0.7,
            ease: "power2.inOut",
            delay: 0.5
          }
        );
      }
    });

    return () => {
      cancelled = true;
      split?.revert();
    };
  }, [mounted, reducedMotion]);

  return (
    <section
      id="hero"
      className="cinematic-section section-tone-hero relative overflow-hidden lg:min-h-screen"
    >
      <div className="hero-layout section-wrap relative z-10 grid items-center gap-12 lg:min-h-[100svh] lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div className="hero-copy space-y-7 text-center md:space-y-8 lg:pl-14 lg:text-left">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2.5 rounded-full border border-accent/45 bg-accent/10 px-4 py-1.5 text-[11px] tracking-[0.22em] text-accent"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            {t("badge")}
          </div>

          <h1
            ref={headlineRef}
            className="hero-headline-trigger cadence-title font-display relative max-w-[18ch] text-[clamp(2.6rem,5.5vw,4.8rem)] font-bold leading-[1.14] md:leading-[1.04] tracking-[-0.015em] md:tracking-[-0.03em]"
          >
            <span className="headline-mask block overflow-hidden">
              <span className="headline-word block">
                {t("headlineLine1")}
                <span className="hero-brand-word">
                  <span className="hero-brand-accent text-accent inline-block font-black uppercase">
                    {t("headlineAccent")}
                  </span>
                </span>
              </span>
            </span>
            <span className="sr-only"> {t("srSubtitle")}</span>
          </h1>

          <div ref={paragraphRef} className="cadence-body space-y-4">
            <p className="font-body text-[1.05rem] font-light leading-[1.75] tracking-[0.01em] text-white/62">
              {t("paragraph1")}
            </p>
            <p className="font-body text-[0.9rem] font-medium tracking-[0.02em] text-accent/85 text-center lg:text-left">
              {t("paragraph2")}
            </p>
            <p className="font-body text-[0.83rem] font-light tracking-[0.02em] text-white/38 text-center lg:text-left">
              {t("paragraph3")}
            </p>
          </div>

          <div ref={ctaRef} className="particle-hero-cta hero-cta-row justify-center lg:justify-start">
            <Link
              href="/contact"
              data-magnetic="true"
              className="interactive-button ip-cta-primary ip-cta-primary--lg"
            >
              {t("ctaPrimary")}
            </Link>
            <Link href="/projektet" data-magnetic="true" className="luxury-link">
              {t("ctaSecondary")} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {/* Right column is empty in the DOM on desktop — the gem renders inside the
            full-bleed Canvas behind everything, offset to sit visually in this area. */}
        <div className="hidden h-[460px] lg:block" aria-hidden />
      </div>

      {/* On mobile this is an in-flow block directly below the text (its own space,
          not a background). On desktop it pops out via lg:absolute to full-bleed behind everything. */}
      <div className="hero-visual relative z-0 h-[340px] w-full overflow-hidden lg:absolute lg:inset-0 lg:h-auto lg:w-auto lg:overflow-visible">
        {showScene && !reducedMotion ? (
          <ParticleCloudScene />
        ) : (
          <div className="hero-grid absolute inset-0 opacity-80" />
        )}
        <div className="pointer-events-none absolute inset-0 z-[1] hero-depth-vignette" aria-hidden />
      </div>

      <div className="hero-scroll-cue" aria-hidden>
        <span>{t("scrollCue")}</span>
        <span className="hero-scroll-cue-chevron" />
      </div>
    </section>
  );
}
