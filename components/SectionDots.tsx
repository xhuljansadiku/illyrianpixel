"use client";

import { useMemo, useState } from "react";
import { ensureGSAP, getIsMobile, useIsomorphicLayoutEffect } from "@/lib/gsap";

const items = [
  { id: "hero", label: "Hero" },
  { id: "services", label: "Services" },
  { id: "scroll-story", label: "Story" },
  { id: "featured-work", label: "Work" },
  { id: "testimonials", label: "Testimonials" },
  { id: "faq", label: "FAQ" },
  { id: "process", label: "Process" },
  { id: "cta", label: "CTA" }
];

export default function SectionDots() {
  const [active, setActive] = useState("hero");
  const ids = useMemo(() => items.map((i) => i.id), []);
  const isMobile = getIsMobile();

  useIsomorphicLayoutEffect(() => {
    if (isMobile) return;
    const { ScrollTrigger, gsap } = ensureGSAP();
    const triggers: ScrollTrigger[] = [];
    gsap.fromTo(".section-dot-nav", { opacity: 0, x: 8 }, { opacity: 1, x: 0, duration: 0.6, delay: 0.2, ease: "power3.out" });
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActive(id),
        onEnterBack: () => setActive(id)
      });
      triggers.push(st);
    });
    return () => triggers.forEach((trigger) => trigger.kill());
  }, [ids, isMobile]);

  if (isMobile) return null;

  return (
    <div className="section-dot-nav fixed right-5 top-1/2 z-[62] -translate-y-1/2 space-y-2.5">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
          aria-label={item.label}
          className={`block h-2 w-2 rounded-full border transition-all duration-300 ${
            active === item.id ? "scale-125 border-accent/95 bg-accent/85" : "border-white/30 bg-white/8 hover:border-white/50"
          }`}
        />
      ))}
    </div>
  );
}
