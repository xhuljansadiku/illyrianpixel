"use client";

// Çmimi numërohet nga 0 te vlera kur karta del në ekran (~0.8s, një herë) — 2026-10-20.
// HTML-ja e serverit ka çmimin final (SEO, pa JS); gjerësia rezervohet nga një kopje e padukshme,
// që numrat që ndryshojnë të mos lëvizin layout-in. Me reduced-motion s'animohet.
import { useEffect, useRef, useState } from "react";
import { parseEuro } from "@/lib/pricingPsychology";

const DURATION = 800;

export default function CountUpPrice({ price, className = "" }: { price: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const target = parseEuro(price);
  const [shown, setShown] = useState<string>(price);

  useEffect(() => {
    const el = ref.current;
    if (!el || !target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(price);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / DURATION);
          const eased = 1 - Math.pow(1 - p, 3);
          setShown(`€${Math.round(target * eased).toLocaleString("en-US")}`);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [price, target]);

  return (
    <span ref={ref} className={`inline-grid tabular-nums ${className}`}>
      <span aria-hidden className="invisible [grid-area:1/1]">{price}</span>
      <span className="[grid-area:1/1]">{shown}</span>
    </span>
  );
}
