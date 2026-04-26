"use client";

import { useRef } from "react";
import { ensureGSAP, getIsMobile, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";

const steps = [
  {
    title: "Vëzhgojmë",
    text: "Deshifrojmë kategorinë tuaj, tensionin e audiencës dhe boshllëqet e perceptimit."
  },
  {
    title: "Distilojmë",
    text: "Formësojmë një narrativë të qartë dhe heqim zhurmën vizuale."
  },
  {
    title: "Kompozojmë",
    text: "Ndërtojmë ritëm scroll-i, tranzicione dhe sisteme thellësie."
  },
  {
    title: "Elevuojmë",
    text: "Lustrojmë çdo mikro-detaj në një eksperiencë finale premium."
  }
];

export default function ScrollStory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const textColRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const progressDotRef = useRef<HTMLDivElement | null>(null);
  const visualWrapRef = useRef<HTMLDivElement | null>(null);
  const visualStagesRef = useRef<Array<HTMLDivElement | null>>([]);
  const glowRef = useRef<Array<HTMLDivElement | null>>([]);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current || !panelRef.current) return;
    const { gsap } = ensureGSAP();
    const isMobile = getIsMobile();

    const ctx = gsap.context(() => {
      if (reducedMotion || isMobile) {
        gsap.set(stepRefs.current, { opacity: 1, x: 0, filter: "blur(0px)" });
        gsap.set(visualStagesRef.current, { opacity: 1, scale: 1, rotate: 0 });
        return;
      }

      gsap.set(stepRefs.current, { opacity: 0.48, x: 0, filter: "blur(3px)" });
      gsap.set(stepRefs.current[0], { opacity: 1, x: 10, filter: "blur(0px)" });
      gsap.set(visualStagesRef.current, { opacity: 0, scale: 0.94, rotate: -4 });
      gsap.set(visualStagesRef.current[0], { opacity: 1, scale: 1, rotate: 0 });
      gsap.set(progressDotRef.current, { yPercent: 0 });

      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%"
          }
        }
      );

      gsap.to(bgRef.current, {
        yPercent: 8,
        xPercent: 3,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.1
        }
      });

      gsap.to(textColRef.current, {
        yPercent: -3,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.to(visualWrapRef.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.15
        }
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=3400",
          pin: panelRef.current,
          scrub: 1.25,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      timeline
        .to(progressRef.current, { scaleY: 1, transformOrigin: "top center", duration: 3.2, ease: "none" }, 0)
        .to(progressDotRef.current, { yPercent: 1220, duration: 3.2, ease: "none" }, 0)
        .fromTo(
          visualWrapRef.current,
          { filter: "blur(4px) contrast(0.9) saturate(0.86)" },
          { filter: "blur(0px) contrast(1) saturate(1)", duration: 1.3, ease: "power3.out" },
          0
        )
        .to(
          visualStagesRef.current[0],
          { opacity: 1, scale: 1, rotate: 0, duration: 0.55, ease: "power3.out" },
          0
        );

      steps.forEach((_, idx) => {
        const step = stepRefs.current[idx];
        const previous = idx > 0 ? stepRefs.current[idx - 1] : null;
        const segment = idx * 0.78 + 0.24;
        const stage = visualStagesRef.current[idx];
        const prevStage = idx > 0 ? visualStagesRef.current[idx - 1] : null;
        const glow = glowRef.current[idx];

        if (stage) {
          timeline.to(
            stage,
            {
              opacity: 1,
              scale: 1,
              rotate: 0,
              duration: 0.52,
              ease: "power3.out"
            },
            segment
          );
        }

        if (prevStage) {
          timeline.to(
            prevStage,
            {
              opacity: 0.26,
              scale: 0.97,
              rotate: -3,
              filter: "blur(2px)",
              duration: 0.46,
              ease: "power2.inOut"
            },
            segment
          );
        }

        timeline.to(
          step,
          {
            opacity: 1,
            x: 10,
            filter: "blur(0px)",
            duration: 0.5,
            ease: "power3.out"
          },
          segment + 0.02
        );

        if (previous) {
          timeline.to(
            previous,
            {
              opacity: 0.44,
              x: 0,
              filter: "blur(2px)",
              duration: 0.42,
              ease: "power2.inOut"
            },
            segment
          );
        }

        if (glow) {
          timeline.fromTo(
            glow,
            { opacity: 0.25, scale: 0.86 },
            { opacity: 0.72, scale: 1.08, duration: 0.45, yoyo: true, repeat: 1, ease: "power2.out" },
            segment
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="scroll-story" ref={sectionRef} className="cinematic-section section-tone-story pt-0">
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(200,155,46,0.18),transparent_42%),radial-gradient(circle_at_22%_36%,rgba(255,255,255,0.05),transparent_36%)]"
      />
      <div ref={panelRef} className="section-wrap grid min-h-[100vh] gap-8 lg:grid-cols-[1fr_1fr]">
        <div ref={textColRef} className="space-y-4">
          <SectionMark label="RRËFIMI NË SCROLL" />
          <h2 ref={headingRef} className="section-title">
            Nga strategjia te atmosfera.
          </h2>
          <p className="muted max-w-xl text-sm leading-relaxed md:text-base">
            Motori ynë kryesor narrativ. Çdo fazë mpreh sinjalin e markës ndërsa objekti vizual
            evoluon me qëllim.
          </p>
          <div className="relative mt-5 space-y-3 pl-6 md:space-y-3.5">
            <div className="absolute left-0 top-0 h-full w-px bg-white/10" />
            <div ref={progressRef} className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-accent/80" />
            <div
              ref={progressDotRef}
              className="absolute -left-[5px] top-0 h-[10px] w-[10px] rounded-full border border-accent/85 bg-[#0b0b0b]"
            />
            {steps.map((step, idx) => (
              <div
                key={step.title}
                ref={(el) => {
                  stepRefs.current[idx] = el;
                }}
                className="story-step relative pl-2 will-change-transform"
              >
                <span className="story-step-connector absolute -right-6 top-[1.75rem] hidden h-px w-10 bg-gradient-to-r from-accent/40 to-transparent lg:block" />
                <p className="text-[11px] tracking-[0.2em] text-accent">HAPI 0{idx + 1}</p>
                <h3 className="mt-1 font-display text-[1.5rem] leading-[0.95] md:text-[1.8rem]">{step.title}</h3>
                <p className="muted mt-1 max-w-[44ch] text-[13px] leading-relaxed md:text-[14px]">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div
          ref={visualWrapRef}
          className="story-visual relative grid min-h-[420px] place-items-center overflow-hidden rounded-[2rem] will-change-transform"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_30%,rgba(200,155,46,0.22),transparent_46%),radial-gradient(circle_at_32%_72%,rgba(255,255,255,0.08),transparent_38%)]" />

          <div
            ref={(el) => {
              visualStagesRef.current[0] = el;
            }}
            className="story-stage absolute grid h-[260px] w-[260px] place-items-center rounded-full border border-white/18"
          >
            <div className="h-[120px] w-[120px] rounded-full border border-accent/50" />
            <div
              ref={(el) => {
                glowRef.current[0] = el;
              }}
              className="absolute h-28 w-28 rounded-full bg-accent/20 blur-3xl"
            />
          </div>

          <div
            ref={(el) => {
              visualStagesRef.current[1] = el;
            }}
            className="story-stage absolute grid h-[290px] w-[290px] place-items-center"
          >
            <div className="absolute h-[178px] w-[178px] rotate-45 border border-accent/55" />
            <div className="absolute h-[110px] w-[110px] rounded-full border border-white/35" />
            <div
              ref={(el) => {
                glowRef.current[1] = el;
              }}
              className="absolute h-36 w-36 rounded-full bg-accent/20 blur-3xl"
            />
          </div>

          <div
            ref={(el) => {
              visualStagesRef.current[2] = el;
            }}
            className="story-stage absolute grid h-[300px] w-[300px] place-items-center"
          >
            <div className="absolute h-[220px] w-[220px] rounded-[1.8rem] border border-accent/60 bg-white/[0.02]" />
            <div className="absolute h-[160px] w-[160px] rounded-[1.35rem] border border-white/26" />
            <div className="absolute h-[74px] w-[74px] rounded-full bg-accent/70 blur-[1px]" />
            <div
              ref={(el) => {
                glowRef.current[2] = el;
              }}
              className="absolute h-40 w-40 rounded-full bg-accent/22 blur-3xl"
            />
          </div>

          <div
            ref={(el) => {
              visualStagesRef.current[3] = el;
            }}
            className="story-stage absolute grid h-[320px] w-[320px] place-items-center"
          >
            <div className="absolute h-[246px] w-[246px] rounded-[2rem] border border-accent/65 bg-gradient-to-br from-accent/20 via-white/[0.06] to-transparent" />
            <div className="absolute h-[180px] w-[180px] rounded-[1.5rem] border border-white/34" />
            <div className="absolute h-[110px] w-[110px] rounded-[1rem] border border-accent/55 bg-accent/12" />
            <div
              ref={(el) => {
                glowRef.current[3] = el;
              }}
              className="absolute h-48 w-48 rounded-full bg-accent/26 blur-3xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
