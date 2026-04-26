"use client";

import { useMemo, useState } from "react";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";

const ids = ["hero", "services", "scroll-story", "featured-work", "about", "process", "cta"];

export default function JourneyProgress() {
  const [active, setActive] = useState("hero");
  const safeIds = useMemo(() => ids, []);

  useIsomorphicLayoutEffect(() => {
    const { ScrollTrigger } = ensureGSAP();
    const triggers: ScrollTrigger[] = [];

    safeIds.forEach((id) => {
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

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [safeIds]);

  return (
    <div className="journey-progress" aria-hidden>
      {safeIds.map((id) => (
        <span key={id} className={`journey-dot ${active === id ? "active" : ""}`} />
      ))}
    </div>
  );
}
