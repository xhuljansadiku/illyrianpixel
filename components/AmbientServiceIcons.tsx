"use client";

import { useRef, type RefObject } from "react";
import ServiceCardHeroVisual from "@/components/ServiceCardHeroVisual";
import type { ServiceCardVisualVariant } from "@/components/ServiceCardHeroVisual";
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

export type AmbientIconConfig = {
  variant: ServiceCardVisualVariant;
  className: string;
  depth: number;
  scale: number;
};

type Props = {
  heroRef: RefObject<HTMLElement | null>;
  icons: AmbientIconConfig[];
};

// Ambient icons floating behind hero copy on service/pricing overview pages.
// Desktop-only (lg:block): not enough breathing room next to the text on
// smaller screens. `scale` is applied via gsap.set (not a Tailwind class) so
// it survives gsap's later transform writes for the parallax x tween.
export default function AmbientServiceIcons({ heroRef, icons }: Props) {
  const iconRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!heroRef.current) return;
    const { gsap } = ensureGSAP();
    iconRefs.current.forEach((el, idx) => {
      if (el) gsap.set(el, { scale: icons[idx].scale });
    });

    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-float-icon",
        { opacity: 0, y: 14 },
        { opacity: 0.55, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out", delay: 0.5 }
      );
    }, heroRef);

    let onMove: ((e: PointerEvent) => void) | null = null;
    if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
      const setters = iconRefs.current.map((el) =>
        el ? gsap.quickTo(el, "x", { duration: 1.1, ease: "power2.out" }) : null
      );
      onMove = (e: PointerEvent) => {
        const rect = heroRef.current!.getBoundingClientRect();
        const mx = (e.clientX - rect.left) / rect.width - 0.5;
        setters.forEach((setX, idx) => {
          setX?.(mx * 30 * icons[idx].depth);
        });
      };
      heroRef.current.addEventListener("pointermove", onMove);
    }

    return () => {
      ctx.revert();
      if (onMove && heroRef.current) heroRef.current.removeEventListener("pointermove", onMove);
    };
  }, [reducedMotion, heroRef, icons]);

  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
      {icons.map((icon, idx) => (
        <div
          key={icon.variant}
          ref={(node) => {
            iconRefs.current[idx] = node;
          }}
          className={`hero-float-icon absolute opacity-0 ${icon.className}`}
        >
          <ServiceCardHeroVisual variant={icon.variant} compact />
        </div>
      ))}
    </div>
  );
}
