"use client";

import { useRef } from "react";
import Link from "next/link";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";
import ProjectIndexList, { type FeaturedItem } from "@/components/ProjectIndexList";
import { caseStudies } from "@/lib/caseStudies";

export type { FeaturedItem };

export default function FeaturedWorkGrid({ items }: { items?: FeaturedItem[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);

  const featuredProjects: FeaturedItem[] =
    items && items.length > 0
      ? items
      : caseStudies.filter((project) =>
          ["esm-group", "bardhi-wellness", "palushi-brothers"].includes(project.slug)
        );

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const { gsap } = ensureGSAP();
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
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="featured-work" ref={sectionRef} className="cinematic-section section-tone-work relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_22%,rgba(171,131,57,0.08),transparent_36%),radial-gradient(circle_at_84%_78%,rgba(171,131,57,0.05),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(171,131,57,0.04),transparent_48%,rgba(171,131,57,0.03))] animate-[featuredAmbient_20s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025] [background-image:repeating-radial-gradient(circle_at_0_0,rgba(255,255,255,0.4)_0_1px,transparent_1px_4px)]" />

      <div className="section-wrap featured-chapters-intro">
        <SectionMark label="PROJEKTET" />
        <h2 className="section-title mt-3 max-w-4xl">
          {"Projekte që sjellin "}
          <span className="text-accent">{"klientë realë"}</span>
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
          {"Ndërtuar për performancë dhe rritje të biznesit."}
        </p>
      </div>

      <div className="section-wrap mt-4 md:mt-10">
        <ProjectIndexList items={featuredProjects} />
      </div>

      <div className="section-wrap pb-2 pt-12">
        <Link href="/projektet" className="luxury-link">
          {"Të gjitha projektet "}
          <span aria-hidden>{"→"}</span>
        </Link>
      </div>
    </section>
  );
}
