"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ensureGSAP, getIsMobile, MOTION, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";
import { useDepthTilt } from "@/lib/useDepthTilt";

const work = [
  {
    name: "Atelier Prime",
    type: "Ribrandim E-commerce",
    desc: "Transformim i plotë i eksperiencës së blerjes për të rritur perceptimin premium dhe ritmin e konvertimit.",
    kpi: "+42% lead-e të kualifikuara",
    proof: "AOV më i lartë në 8 javë",
    cta: "Shiko projektin",
    slug: "atelier-prime",
    image: "/images/work-01.svg",
    glow: "radial-gradient(circle_at_68%_30%,rgba(200,155,46,0.26),transparent_56%)"
  },
  {
    name: "Maison Verre",
    type: "Website për Fushatë Luksi",
    desc: "Narrativë vizuale e ndërtuar për lançim koleksioni, me fokus në kohëzgjatje sesioni dhe intent të lartë.",
    kpi: "2.3x kohë në faqe",
    proof: "Bounce rate i ulur me 34%",
    cta: "Shiko projektin",
    slug: "maison-verre",
    image: "/images/work-02.svg",
    glow: "radial-gradient(circle_at_58%_36%,rgba(245,245,240,0.16),transparent_58%)"
  },
  {
    name: "Nocturne Hotel",
    type: "Eksperiencë Rezervimi Imersive",
    desc: "Ekosistem rezervimi me rrjedhë kinematike që udhëheq përdoruesin drejt vendimeve me vlerë më të lartë.",
    kpi: "+31% rezervime direkte",
    proof: "Varësi më e ulët nga OTA",
    cta: "Shiko projektin",
    slug: "nocturne-hotel",
    image: "/images/work-03.svg",
    glow: "radial-gradient(circle_at_70%_34%,rgba(200,155,46,0.24),transparent_56%)"
  }
];

function StackMediaTilt({ depthOn, src, alt }: { depthOn: boolean; src: string; alt: string }) {
  const tiltRef = useDepthTilt<HTMLDivElement>(depthOn);
  return (
    <div
      className="stacked-media media-frame relative h-[280px] w-full overflow-hidden rounded-[1.2rem] border border-white/14 bg-white/[0.03] md:h-[460px] md:[perspective:1040px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div ref={tiltRef} className="relative h-full w-full duration-100 ease-out will-change-transform" style={{ transformStyle: "preserve-3d" }}>
        <div className="pointer-events-none absolute inset-0 z-[11] rounded-[inherit] bg-gradient-to-br from-white/[0.07] via-transparent to-transparent opacity-50 mix-blend-soft-light" />
        <div className="featured-overlay pointer-events-none absolute inset-0 z-10 rounded-[inherit]" />
        <Image src={src} alt={alt} fill className="featured-image object-cover [filter:contrast(1.16)_saturate(1.02)_brightness(1.02)]" />
      </div>
    </div>
  );
}

export default function FeaturedWork() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const reducedMotion = useReducedMotion();
  const [depthOn, setDepthOn] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setDepthOn(!getIsMobile() && !reducedMotion);
  }, [reducedMotion]);

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const { gsap, ScrollTrigger } = ensureGSAP();
    const isMobile = getIsMobile();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        introRef.current?.querySelectorAll(".cadence-item") ?? [],
        { opacity: 0, y: 24, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: MOTION.duration.base,
          stagger: MOTION.stagger.tight,
          ease: MOTION.ease.enter,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%"
          }
        }
      );

      if (reducedMotion || isMobile) {
        gsap.fromTo(
          cardRefs.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION.duration.base,
            stagger: MOTION.stagger.tight,
            ease: MOTION.ease.enter,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%"
            }
          }
        );
        return;
      }

      const slides = cardRefs.current.filter(Boolean) as HTMLElement[];
      const totalScrollVh = Math.max(320, work.length * 88);

      gsap.set(slides, { opacity: 0, yPercent: 7, scale: 0.96, filter: "blur(6px)", zIndex: 1 });
      gsap.set(slides[0], { opacity: 1, yPercent: 0, scale: 1, filter: "blur(0px)", zIndex: 4 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top",
          end: `+=${totalScrollVh}%`,
          scrub: 1.05,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      slides.forEach((slide, idx) => {
        const media = slide.querySelector(".stacked-media");
        const bgGlow = slide.querySelector(".stacked-bg-glow");
        const lines = slide.querySelectorAll(".case-line");
        if (idx > 0) {
          timeline.fromTo(
            slide,
            { opacity: 0, yPercent: 8, scale: 0.965, filter: "blur(7px)", zIndex: 4 },
            { opacity: 1, yPercent: 0, scale: 1, filter: "blur(0px)", duration: 0.62, ease: "power3.out" },
            idx - 0.12
          );
        }
        timeline.fromTo(
          lines,
          { opacity: 0, y: 16, filter: "blur(5px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.07, duration: 0.46, ease: "power3.out" },
          Math.max(0, idx - 0.03)
        );

        timeline.to(
          media,
          { scale: 1.02, yPercent: -2.5, duration: 0.66, ease: "power2.out" },
          Math.max(0, idx - 0.05)
        );

        timeline.to(
          bgGlow,
          { opacity: 0.92, duration: 0.52, ease: "power2.out" },
          Math.max(0, idx - 0.05)
        );

        if (idx < slides.length - 1) {
          timeline.to(
            lines,
            { opacity: 0.24, y: -10, duration: 0.34, stagger: 0.03, ease: "power2.inOut" },
            idx + 0.46
          );
          timeline.to(
            slide,
            { opacity: 0.16, scale: 0.96, yPercent: -2, filter: "blur(3px)", duration: 0.52, ease: "power2.inOut" },
            idx + 0.52
          );
        }
      });

      if (!reducedMotion) {
        const disposers: Array<() => void> = [];
        slides.forEach((slide) => {
          const media = slide.querySelector(".stacked-media") as HTMLDivElement | null;
          const img = slide.querySelector(".featured-image") as HTMLImageElement | null;
          if (!media || !img) return;
          const onMove = (ev: PointerEvent) => {
            const rect = media.getBoundingClientRect();
            const px = (ev.clientX - rect.left) / rect.width - 0.5;
            const py = (ev.clientY - rect.top) / rect.height - 0.5;
            gsap.to(img, { x: px * 10, y: py * 8, duration: 0.35, ease: "power3.out" });
          };
          const onLeave = () => gsap.to(img, { x: 0, y: 0, duration: 0.45, ease: "power3.out" });
          media.addEventListener("pointermove", onMove);
          media.addEventListener("pointerleave", onLeave);
          disposers.push(() => {
            media.removeEventListener("pointermove", onMove);
            media.removeEventListener("pointerleave", onLeave);
          });
        });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          onLeave: () => disposers.forEach((dispose) => dispose()),
          onLeaveBack: () => disposers.forEach((dispose) => dispose())
        });
      }

      gsap.to(stackRef.current, {
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top",
          end: `+=${totalScrollVh}%`,
          scrub: 1.2
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="featured-work" ref={sectionRef} className="cinematic-section section-tone-work featured-work-cinematic">
      <div className="section-wrap overflow-visible">
        <div ref={introRef}>
          <div className="cadence-item">
            <SectionMark label="PUNË TË PËRZGJEDHURA" />
          </div>
          <p className="cadence-item mt-2 text-[11px] tracking-[0.22em] text-white/40">Selected work</p>
          <h2 className="cadence-item section-title mt-3 mb-10 max-w-5xl text-balance text-[clamp(1.8rem,4vw,3rem)] leading-[1.15] md:leading-[1.1]">
            Punë që flasin vetë.
          </h2>
        </div>
        <div ref={stageRef} className="featured-stage relative min-h-[70svh] md:min-h-[78svh]">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_28%_40%,rgba(200,155,46,0.18),transparent_42%),radial-gradient(circle_at_74%_55%,rgba(255,255,255,0.08),transparent_38%)]" />
          <div ref={stackRef} className="relative h-full">
            {work.map((item, idx) => (
              <article
                key={item.name}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className={`featured-slide premium-card group overflow-hidden p-6 md:p-8 ${idx === 0 ? "is-initial" : ""}`}
              >
                <div className="grid h-full gap-6 md:grid-cols-[0.86fr_1.14fr] md:gap-8">
                  <div className="flex h-full flex-col justify-center">
                    <p className="case-line text-[11px] tracking-[0.2em] text-accent">{item.type}</p>
                    <h3 className="case-line mt-3 font-display text-[2.35rem] leading-[0.95] text-white md:text-[3.35rem]">
                      {item.name}
                    </h3>
                    <p className="case-line mt-4 max-w-[40ch] text-sm leading-relaxed text-white/72 md:text-base">{item.desc}</p>
                    <div className="case-line mt-5 space-y-1.5 border-l border-accent/35 pl-3">
                      <p className="text-[11px] tracking-[0.14em] text-accent/90">{item.kpi}</p>
                      <p className="muted text-xs">{item.proof}</p>
                    </div>
                    <a href={`/work/${item.slug}`} className="case-line cadence-cta luxury-link featured-slide-cta mt-6">
                      {item.cta} <span aria-hidden>→</span>
                    </a>
                  </div>
                  <div className="relative flex items-center">
                    <div className="stacked-bg-glow pointer-events-none absolute inset-0 opacity-65" style={{ background: item.glow }} />
                    <StackMediaTilt
                      depthOn={depthOn}
                      src={item.image}
                      alt={`Pamje paraprake e projektit ${item.name}`}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
