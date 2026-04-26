"use client";

import { useRef } from "react";
import { ensureGSAP, getIsMobile, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";

const proofItems = [
  {
    target: 27,
    decimals: 0,
    suffix: "",
    label: "Projekte luksi të dorëzuara",
    barLabel: "Ritëm dorëzimi",
    barPct: 0.72
  },
  {
    target: 92,
    decimals: 0,
    suffix: "%",
    label: "Klientë nga referime",
    barLabel: "Besim i përsëritur",
    barPct: 0.92
  },
  {
    target: 4.9,
    decimals: 1,
    suffix: "/5",
    label: "Vlerësim mesatar bashkëpunimi",
    barLabel: "Konsistencë cilësie",
    barPct: 0.88
  },
  {
    target: 24,
    decimals: 0,
    suffix: "h",
    label: "Drejtim i qartë pas brief-it",
    barLabel: "Qartësi operacionale",
    barPct: 0.64
  },
  {
    target: 42,
    decimals: 0,
    suffix: "%",
    label: "Konvertim në fushatat e fundit",
    barLabel: "Performancë",
    barPct: 0.42,
    showSpark: true
  }
];

export default function About() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const manifestoRef = useRef<HTMLDivElement | null>(null);
  const proofWallRef = useRef<HTMLDivElement | null>(null);
  const proofLineRef = useRef<HTMLSpanElement | null>(null);
  const proofLineDotRef = useRef<HTMLSpanElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const proofItemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const proofValueRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const { gsap, ScrollTrigger } = ensureGSAP();
    const isMobile = getIsMobile();
    const ctx = gsap.context(() => {
      const activateItem = (activeIdx: number) => {
        proofItemRefs.current.forEach((item, idx) => {
          if (!item) return;
          item.classList.toggle("is-active", idx === activeIdx);
        });
      };

      if (reducedMotion) {
        gsap.set(headlineRef.current?.querySelectorAll(".about-headline-line-inner") ?? [], { opacity: 1, yPercent: 0 });
        return;
      }

      gsap.fromTo(
        headlineRef.current?.querySelectorAll(".about-headline-line-inner") ?? [],
        { opacity: 0, yPercent: 105, filter: "blur(4px)" },
        {
          opacity: 1,
          yPercent: 0,
          filter: "blur(0px)",
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true
          }
        }
      );

      gsap.fromTo(
        manifestoRef.current?.querySelectorAll(".manifesto-item") ?? [],
        { opacity: 0, y: 22, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.12,
          duration: 0.9,
          delay: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: manifestoRef.current,
            start: "top 82%"
          }
        }
      );

      gsap.fromTo(
        proofItemRefs.current,
        { opacity: 0.56, y: 16, x: 0 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: proofWallRef.current,
            start: "top 76%"
          }
        }
      );

      proofValueRefs.current.forEach((el, idx) => {
        if (!el) return;
        const cfg = proofItems[idx];
        const state = { value: 0 };
        gsap.to(state, {
          value: cfg.target,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 84%",
            once: true
          },
          onUpdate: () => {
            const formatted =
              cfg.decimals > 0 ? state.value.toFixed(cfg.decimals) : Math.round(state.value).toString();
            el.textContent = `${formatted}${cfg.suffix}`;
          }
        });
      });

      proofItemRefs.current.forEach((item, idx) => {
        if (!item) return;
        const cfg = proofItems[idx];
        const bar = item.querySelector(".proof-metric-bar-fill") as HTMLElement | null;
        if (bar) {
          gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
          gsap.to(bar, {
            scaleX: cfg.barPct,
            duration: 1.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 84%",
              once: true
            }
          });
        }
        const spark = item.querySelector(".proof-spark-path") as SVGPathElement | null;
        if (spark && cfg.showSpark) {
          const len = spark.getTotalLength?.() ?? 240;
          gsap.set(spark, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(spark, {
            strokeDashoffset: 0,
            duration: 1.35,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: item,
              start: "top 84%",
              once: true
            }
          });
        }
      });

      if (!isMobile) {
        gsap.fromTo(
          proofLineRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: proofWallRef.current,
              start: "top 76%",
              end: "bottom 28%",
              scrub: 1.1
            }
          }
        );

        const moveDotToItem = (idx: number) => {
          const wall = proofWallRef.current;
          const dot = proofLineDotRef.current;
          const item = proofItemRefs.current[idx];
          if (!wall || !dot || !item) return;
          const wallRect = wall.getBoundingClientRect();
          const itemRect = item.getBoundingClientRect();
          const y = itemRect.top - wallRect.top + 24;
          gsap.to(dot, { y, duration: 0.45, ease: "power3.out" });
        };

        activateItem(0);
        moveDotToItem(0);

        proofItemRefs.current.forEach((item, idx) => {
          if (!item) return;
          ScrollTrigger.create({
            trigger: item,
            start: "top 62%",
            end: "bottom 52%",
            onEnter: () => {
              activateItem(idx);
              moveDotToItem(idx);
            },
            onEnterBack: () => {
              activateItem(idx);
              moveDotToItem(idx);
            }
          });
        });
      }

      proofItemRefs.current.forEach((item, idx) => {
        if (!item) return;
        gsap.to(item, {
          x: isMobile ? 0 : 10,
          opacity: isMobile ? 1 : 0.98,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top 66%",
            end: "bottom 52%",
            scrub: 0.8,
            onToggle: (self) => {
              if (self.isActive) activateItem(idx);
            }
          }
        });
      });

      gsap.to(manifestoRef.current, {
        yPercent: isMobile ? 0 : -4,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.05
        }
      });

      gsap.to(proofWallRef.current, {
        yPercent: isMobile ? 0 : -8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.1
        }
      });

      gsap.to(spotlightRef.current, {
        yPercent: 12,
        xPercent: 4,
        ease: "none",
        scrollTrigger: {
          trigger: proofWallRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.1
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="about" ref={sectionRef} className="cinematic-section section-tone-about editorial-proof-section">
      <div className="editorial-proof-grain pointer-events-none absolute inset-0 opacity-30" />
      <div className="section-wrap">
        <SectionMark label="PSE KLIENTËT NA ZGJEDHIN" />
        <h2
          ref={headlineRef}
          className="mt-6 max-w-[1000px] font-display text-[clamp(2.3rem,6.7vw,5.7rem)] leading-[0.95] tracking-[0.01em]"
        >
          <span className="about-headline-line block overflow-hidden">
            <span className="about-headline-line-inner block">Premium nuk është dekorim.</span>
          </span>
          <span className="about-headline-line block overflow-hidden">
            <span className="about-headline-line-inner block">
              Është disiplinë, ritëm dhe qartësi që ndërton besim.
            </span>
          </span>
        </h2>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
          <div ref={manifestoRef} className="space-y-8">
            <p className="manifesto-item max-w-[58ch] text-[1.1rem] leading-relaxed text-white/78 md:text-[1.23rem] md:leading-relaxed">
              Ne kombinojmë strategjinë, dizajnin dhe teknologjinë për të krijuar prezenca dixhitale që duken serioze
              dhe performojnë në treg.
            </p>
            <p className="manifesto-item max-w-[56ch] text-[1.1rem] leading-relaxed text-white/72 md:text-[1.2rem] md:leading-relaxed">
              Çdo faqe ndërtohet me strukturë, hierarki vizuale, mesazh të qartë dhe lëvizje të kontrolluar.
            </p>
          </div>

          <div ref={proofWallRef} className="relative pl-8 md:pl-10 lg:pl-12">
            <div ref={spotlightRef} className="pointer-events-none absolute -left-8 top-4 h-[86%] w-[112%] bg-[radial-gradient(circle_at_62%_34%,rgba(200,155,46,0.15),transparent_58%)]" />
            <span className="proof-line-track absolute left-1 top-2 h-[calc(100%-12px)] w-px bg-white/12" />
            <span ref={proofLineRef} className="proof-line-progress absolute left-1 top-2 h-[calc(100%-12px)] w-px bg-accent/85" />
            <span ref={proofLineDotRef} className="proof-line-dot absolute -left-[4px] top-2 h-[10px] w-[10px] rounded-full border border-accent/85 bg-[#0b0b0b]" />
            {proofItems.map((item, idx) => (
              <div
                key={item.label}
                ref={(el) => {
                  proofItemRefs.current[idx] = el;
                }}
                className="proof-item relative mb-11 border-t border-white/12 pt-5 last:mb-0"
              >
                <span className="proof-dot absolute -left-[35px] top-[1.5rem] h-2.5 w-2.5 rounded-full border border-accent/65 bg-[#0b0b0b]" />
                <p className="font-display text-[clamp(2.5rem,6vw,5.1rem)] leading-[0.92] text-white/92">
                  <span
                    ref={(el) => {
                      proofValueRefs.current[idx] = el;
                    }}
                  >
                    0{item.suffix}
                  </span>
                </p>
                <p className="mt-2 max-w-[30ch] text-[1rem] leading-relaxed text-white/68">{item.label}</p>
                {"barLabel" in item && "barPct" in item ? (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between gap-3 text-[10px] tracking-[0.16em] text-white/40">
                      <span>{item.barLabel}</span>
                      <span className="text-accent/80">{Math.round(item.barPct * 100)}%</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <div className="proof-metric-bar-fill h-full w-full origin-left scale-x-0 bg-gradient-to-r from-accent/25 via-accent/80 to-accent/35" />
                    </div>
                    {item.showSpark ? (
                      <svg
                        className="mt-2 w-full max-w-[220px] text-accent/80"
                        viewBox="0 0 120 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                      >
                        <path
                          d="M4 28 L22 20 L40 24 L58 10 L76 16 L94 8 L112 12"
                          className="proof-spark-path"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.85"
                        />
                      </svg>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
