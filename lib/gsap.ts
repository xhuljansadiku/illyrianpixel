"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export const MOTION = {
  ease: {
    enter: "expo.out",
    smooth: "power3.inOut",
    scrub: "none"
  },
  duration: {
    fast: 0.34,
    base: 0.72,
    slow: 0.96
  },
  stagger: {
    tight: 0.07,
    base: 0.1
  }
} as const;

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const useReducedMotion = () => {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
};

export const getIsMobile = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;

export const ensureGSAP = () => {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
};
