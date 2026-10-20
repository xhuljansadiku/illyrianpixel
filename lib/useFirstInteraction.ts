"use client";

import { useEffect, useState } from "react";

// Ngjarjet që tregojnë se vizitori po përdor faqen (lëvizja e mausit përfshihet — në desktop
// ndodh menjëherë). Efektet dekorative të rënda (three.js, globi) presin këtë sinjal, që
// ngarkimi i faqes të mos ndajë CPU-në me animacione që askush s'po i sheh ende.
export const FIRST_INTERACTION_EVENTS = ["pointermove", "pointerdown", "keydown", "scroll", "wheel", "touchstart"] as const;

export function onFirstInteraction(callback: () => void): () => void {
  let done = false;
  const fire = () => {
    if (done) return;
    done = true;
    cleanup();
    callback();
  };
  const cleanup = () => {
    for (const e of FIRST_INTERACTION_EVENTS) window.removeEventListener(e, fire);
  };
  for (const e of FIRST_INTERACTION_EVENTS) window.addEventListener(e, fire, { passive: true });
  return cleanup;
}

export function useFirstInteraction(): boolean {
  const [interacted, setInteracted] = useState(false);
  useEffect(() => (interacted ? undefined : onFirstInteraction(() => setInteracted(true))), [interacted]);
  return interacted;
}
