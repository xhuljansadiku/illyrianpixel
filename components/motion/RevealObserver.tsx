"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll reveal for elements marked with `data-reveal`.
 *
 * Content is visible by default: the hiding styles only apply once this
 * component adds `.js-reveal` to <html> — and that happens only after the
 * observer has reported which elements are already on screen (those are
 * revealed immediately, so nothing above the fold ever flashes or delays LCP).
 * No synchronous layout reads; runs again after client-side navigation.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!("IntersectionObserver" in window) || reduceMotion) {
      elements.forEach((element) => element.classList.add("is-revealed"));
      return;
    }

    let ready = root.classList.contains("js-reveal");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
      // First callback = initial state of every element; enable hiding only now.
      if (!ready) {
        ready = true;
        root.classList.add("js-reveal");
      }
    });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
