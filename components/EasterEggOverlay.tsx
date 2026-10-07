"use client";

import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

/** Alt+click logo (Navbar): one-shot soft gold pulse, tasteful, optional. */
export default function EasterEggOverlay() {
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    const onEgg = () => {
      const { gsap } = ensureGSAP();
      const el = document.createElement("div");
      el.setAttribute("aria-hidden", "true");
      el.className = "pointer-events-none fixed inset-0 z-[150]";
      el.style.background =
        "radial-gradient(circle at 50% 42%, rgba(171, 131, 57,0.22), transparent 58%), radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06), transparent 45%)";
      el.style.opacity = "0";
      document.body.appendChild(el);
      gsap
        .timeline({
          onComplete: () => el.remove()
        })
        .to(el, { opacity: 1, duration: 0.35, ease: "power2.out" })
        .to(el, { opacity: 0, duration: 0.55, ease: "power2.inOut", delay: 0.05 });
    };
    window.addEventListener("ip-easter-egg", onEgg as EventListener);
    return () => window.removeEventListener("ip-easter-egg", onEgg as EventListener);
  }, [reduced]);

  return null;
}
