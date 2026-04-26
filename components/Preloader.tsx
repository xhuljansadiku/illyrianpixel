"use client";

import { useState } from "react";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";

export default function Preloader() {
  const [visible, setVisible] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const hasSeen = sessionStorage.getItem("ip_preloader_seen");
    if (hasSeen) return;
    sessionStorage.setItem("ip_preloader_seen", "1");
    setVisible(true);
    const { gsap } = ensureGSAP();
    const tl = gsap.timeline({
      onComplete: () => setVisible(false)
    });
    tl.fromTo(".preloader-line", { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power3.out" })
      .to(".preloader-shell", { opacity: 0, duration: 0.45, delay: 0.35, ease: "power2.out" });
  }, []);

  if (!visible) return null;

  return (
    <div className="preloader-shell fixed inset-0 z-[120] grid place-items-center bg-[#0b0b0b]">
      <div className="text-center">
        <p className="font-display text-4xl text-white">Illyrian Pixel</p>
        <span className="preloader-line mt-4 block h-px w-40 origin-left bg-accent/90" />
      </div>
    </div>
  );
}
