"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";
import { caseStudies, type CaseStudy } from "@/lib/caseStudies";

function resultPills(project: CaseStudy): string[] {
  const fromTags = project.tags.slice(0, 4);
  if (fromTags.length >= 4) return fromTags;
  const extra = project.metrics.filter((m) => !fromTags.includes(m));
  return [...fromTags, ...extra].slice(0, 4);
}

export default function FeaturedWorkGrid() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);
  const imageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reducedMotion = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const featuredProjects = caseStudies.filter((project) =>
    ["esm-group", "bardhi-wellness", "palushi-brothers"].includes(project.slug)
  );

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current || reducedMotion) return;
    const { gsap, ScrollTrigger } = ensureGSAP();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".featured-chapters-intro > *",
        { opacity: 0, y: 26, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%"
          }
        }
      );

      chapterRefs.current.forEach((chapter, idx) => {
        if (!chapter) return;
        const imageWrap = imageRefs.current[idx];
        const content = chapter.querySelector(".chapter-copy");

        gsap.fromTo(
          content,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.72,
            ease: "power3.out",
            scrollTrigger: {
              trigger: chapter,
              start: "top 70%"
            }
          }
        );

        if (imageWrap) {
          gsap.fromTo(
            imageWrap,
            { opacity: 0.75, scale: 0.98, clipPath: "inset(0 100% 0 0 round 1.25rem)" },
            {
              opacity: 1,
              scale: 1,
              clipPath: "inset(0 0% 0 0 round 1.25rem)",
              duration: 1.05,
              ease: "power4.out",
              scrollTrigger: {
                trigger: chapter,
                start: "top 72%"
              }
            }
          );

          gsap.to(imageWrap, {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: chapter,
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            }
          });
        }

        ScrollTrigger.create({
          trigger: chapter,
          start: "top 52%",
          end: "bottom 52%",
          onEnter: () => setActiveIdx(idx),
          onEnterBack: () => setActiveIdx(idx)
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="featured-work" ref={sectionRef} className="cinematic-section section-tone-work relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_22%,rgba(171,131,57,0.08),transparent_36%),radial-gradient(circle_at_84%_78%,rgba(171,131,57,0.05),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(171,131,57,0.04),transparent_48%,rgba(171,131,57,0.03))] animate-[featuredAmbient_20s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025] [background-image:repeating-radial-gradient(circle_at_0_0,rgba(255,255,255,0.4)_0_1px,transparent_1px_4px)]" />

      <div className="section-wrap featured-chapters-intro">
        <SectionMark label="PROJEKTET" />
        <h2 className="section-title mt-3 max-w-4xl">
          {"Projekte q\u00eb sjellin "}
          <span className="text-accent">{"klient\u00eb real\u00eb"}</span>
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
          {"Nd\u00ebrtuar p\u00ebr performanc\u00eb dhe rritje t\u00eb biznesit."}
        </p>
      </div>

      <div className="mt-10 md:mt-12">
        {featuredProjects.map((project, idx) => {
          const isTextLeft = idx % 2 === 0;
          const copyOrder = isTextLeft ? "lg:order-1" : "lg:order-2";
          const mediaOrder = isTextLeft ? "lg:order-2" : "lg:order-1";

          return (
            <article
              key={project.slug}
              ref={(node) => {
                chapterRefs.current[idx] = node;
              }}
              className="relative flex min-h-0 items-center py-14 md:min-h-[85svh] md:py-20"
            >
              <div className="section-wrap grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
                <div
                  className={`chapter-copy order-2 flex flex-col transition-opacity duration-500 ${copyOrder} ${
                    activeIdx === idx ? "opacity-100" : "opacity-[0.88]"
                  }`}
                >
                  <p className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-accent/85">
                    {project.category}
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(2rem,5vw,4rem)] leading-[0.92] tracking-[0.01em] text-white">
                    {project.title}
                  </h3>
                  <p className="mt-4 inline-flex flex-wrap items-center gap-2 font-display text-[clamp(1rem,2.1vw,1.2rem)] leading-snug tracking-[0.02em] text-white/88">
                    <span className="inline-flex items-center gap-1 rounded-md border border-white/[0.07] bg-white/[0.06] px-2 py-1" aria-hidden>
                      {project.flagCodes.map((code) => (
                        <Image
                          key={code}
                          src={`https://flagcdn.com/w20/${code}.png`}
                          alt=""
                          width={20}
                          height={14}
                          className="h-3.5 w-5 rounded-[2px] object-cover"
                          loading="lazy"
                          unoptimized
                        />
                      ))}
                    </span>
                    <span>{project.location}</span>
                  </p>
                  <p className="mt-5 max-w-[52ch] whitespace-pre-line font-body text-sm leading-relaxed text-white/72 md:text-base">
                    {project.intro}
                  </p>

                  <div className="mt-6 flex min-h-[52px] flex-wrap content-start gap-2">
                    {resultPills(project).map((pill, pillIdx) => (
                      <span
                        key={`${project.slug}-${pill}`}
                        style={{ transitionDelay: `${pillIdx * 40}ms` }}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1 font-body text-[11px] tracking-[0.02em] text-white/76 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:border-white/18 hover:shadow-[0_0_12px_rgba(171,131,57,0.12)]"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>

                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="luxury-link mt-8"
                    >
                      Shiko projektin live <span aria-hidden>\u2192</span>
                    </a>
                  ) : (
                    <span className="luxury-link mt-8 cursor-default opacity-50" aria-disabled>
                      {"S\u00cb SHPEJTI"}
                    </span>
                  )}
                </div>

                <div
                  ref={(node) => {
                    imageRefs.current[idx] = node;
                  }}
                  className={`order-1 ${mediaOrder}`}
                >
                  <div
                    className={`relative overflow-hidden rounded-[1.25rem] border border-[rgba(255,255,255,0.05)] bg-[#0d0d0c] shadow-[0_28px_90px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)_inset] transition-[box-shadow,border-color] duration-500 ${
                      activeIdx === idx ? "border-accent/25 shadow-[0_32px_100px_rgba(0,0,0,0.58),0_0_40px_rgba(171,131,57,0.08)]" : ""
                    }`}
                  >
                    <div className="group/img relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={project.heroImage}
                        alt={`${project.title} — ${project.category} | Illyrian Pixel`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/img:scale-[1.03]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="section-wrap pb-2 pt-12">
        <Link href="/projektet" className="luxury-link">
          {"T\u00eb gjitha projektet "}
          <span aria-hidden>{"\u2192"}</span>
        </Link>
      </div>
    </section>
  );
}
