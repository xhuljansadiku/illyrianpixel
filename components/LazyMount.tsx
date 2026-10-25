"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Montohet (dhe shkarkon chunk-un e fëmijës, nëse është dynamic()) vetëm kur afrohet në ekran.
// Për efekte poshtë fold-it — në celular kursen JS gjatë ngarkimit të faqes (2026-10-25).
export default function LazyMount({ children, rootMargin = "400px", className }: { children: ReactNode; rootMargin?: string; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, visible]);

  return (
    <div ref={ref} className={className}>
      {visible ? children : null}
    </div>
  );
}
