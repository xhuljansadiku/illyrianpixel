"use client";

import { MouseEvent } from "react";
import { getIsMobile, useReducedMotion } from "@/lib/gsap";

export const usePointerHighlight = () => {
  const reducedMotion = useReducedMotion();

  const onMove = <T extends HTMLElement>(event: MouseEvent<T>) => {
    if (reducedMotion || getIsMobile()) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    event.currentTarget.style.setProperty("--mx", `${x}px`);
    event.currentTarget.style.setProperty("--my", `${y}px`);
  };

  const onLeave = <T extends HTMLElement>(event: MouseEvent<T>) => {
    event.currentTarget.style.setProperty("--mx", "50%");
    event.currentTarget.style.setProperty("--my", "50%");
  };

  return { onMove, onLeave };
};
