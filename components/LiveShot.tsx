"use client";

// Screenshot "i gjallë" brenda dritares së browser-it (2026-10-20, në provë te /test-wow):
// kur karta del në ekran, faqja brenda saj bën vetë scroll ngadalë poshtë-lart, sikur dikush
// po e shfleton. Lëviz me transform (compositor), jo me object-position — s'rëndon paint-in.
// Ecën vetëm kur është në ekran; me reduced-motion mbetet statik (sipër).
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function LiveShot({ src, sizes, delay = 0 }: { src: string; sizes: string; delay?: number }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState<number | null>(null); // gjerësi / lartësi e screenshot-it

  useEffect(() => {
    const box = boxRef.current;
    const inner = innerRef.current;
    if (!box || !inner || !ratio) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let anim: Animation | null = null;
    const build = () => {
      anim?.cancel();
      const travel = inner.offsetHeight - box.offsetHeight;
      if (travel < 40) return;
      // ~70px/s, me pauza lart dhe poshtë
      const duration = Math.max(9000, (travel / 70) * 1000 * 2 + 3000);
      anim = inner.animate(
        [
          { transform: "translateY(0)", offset: 0 },
          { transform: "translateY(0)", offset: 0.1 },
          { transform: `translateY(${-travel}px)`, offset: 0.5 },
          { transform: `translateY(${-travel}px)`, offset: 0.6 },
          { transform: "translateY(0)", offset: 1 },
        ],
        { duration, delay, iterations: Infinity, easing: "ease-in-out" }
      );
      anim.pause();
    };
    build();
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? anim?.play() : anim?.pause()), { threshold: 0.35 });
    io.observe(box);
    const ro = new ResizeObserver(() => {
      const playing = anim?.playState === "running";
      build();
      if (playing) anim?.play();
    });
    ro.observe(box);
    return () => {
      io.disconnect();
      ro.disconnect();
      anim?.cancel();
    };
  }, [ratio, delay]);

  return (
    <div ref={boxRef} className="absolute inset-0 overflow-hidden">
      <div
        ref={innerRef}
        className="absolute inset-x-0 top-0 will-change-transform"
        style={ratio ? { aspectRatio: String(ratio) } : { height: "100%" }}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          className="object-cover object-top"
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth && img.naturalHeight) setRatio(img.naturalWidth / img.naturalHeight);
          }}
        />
      </div>
    </div>
  );
}
