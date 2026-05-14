"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";

export default function Preloader() {
  const [visible, setVisible] = useState(false);
  const [shouldRun, setShouldRun] = useState(false);
  const brand = "ILLYRIAN PIXEL";
  const progressRef = useRef<HTMLParagraphElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const hasSeen = localStorage.getItem("ip_preloader_seen");
    if (hasSeen) return;
    localStorage.setItem("ip_preloader_seen", "1");
    setVisible(true);
    setShouldRun(true);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!visible || !shouldRun) return;
    const { gsap } = ensureGSAP();
    const init = window.setTimeout(() => {
      const counter = { value: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          setVisible(false);
          setShouldRun(false);
        }
      });
      tl.fromTo(".preloader-shell", { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" })
        .fromTo(
          ".preloader-orb",
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 0.8, duration: 0.45, ease: "power3.out" },
          "-=0.08"
        )
        .fromTo(
          ".preloader-footer",
          { yPercent: 12, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".preloader-logo-wrap",
          { y: 12, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" },
          "-=0.3"
        )
        .to(
          counter,
          {
            value: 100,
            duration: 2.8,
            ease: "power1.inOut",
            onUpdate: () => {
              if (progressRef.current) {
                progressRef.current.textContent = `${Math.round(counter.value)}%`;
              }
            }
          },
          "-=0.1"
        )
        .fromTo(".preloader-fire", { scaleX: 0 }, { scaleX: 1, duration: 2.8, ease: "power1.inOut" }, "<")
        .fromTo(
          ".preloader-char",
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.02, ease: "power3.out" },
          "-=2.5"
        )
        .fromTo(".preloader-line", { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "power2.out" }, "-=0.1")
        .to(".preloader-shine", { xPercent: 130, duration: 0.55, ease: "power2.inOut" }, "-=0.35")
        .to(".preloader-shell", { opacity: 0, scale: 1.01, duration: 0.45, delay: 0.25, ease: "power2.inOut" });
    }, 50);

    return () => window.clearTimeout(init);
  }, [visible, shouldRun]);

  if (!visible) return null;

  return (
    <div className="preloader-shell fixed inset-0 z-[120] overflow-hidden bg-[#06070b]">
      <div className="preloader-orb pointer-events-none absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(234,206,113,0.26)_0%,_rgba(171,131,57,0.1)_34%,_rgba(0,0,0,0)_72%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,12,0.55)_0%,rgba(7,8,12,0.9)_85%)]" />

      <div className="preloader-footer absolute bottom-8 left-1/2 w-[min(95vw,860px)] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-6 shadow-[0_0_40px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:px-10 sm:py-8">
        <div className="preloader-shine pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -translate-x-full bg-[linear-gradient(110deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.22)_52%,rgba(255,255,255,0)_100%)]" />
        <div className="preloader-logo-wrap mb-4 flex justify-center sm:mb-5">
          <div className="rounded-full border border-[#ab8339]/35 bg-black/35 p-2.5 shadow-[0_0_24px_rgba(171, 131, 57,0.2)] sm:p-3">
            <Image
              src="/images/illyrianpixel_logo.png"
              alt="Illyrian Pixel logo"
              width={280}
              height={100}
              priority
              className="h-14 w-auto max-w-[min(260px,78vw)] object-contain sm:h-16"
            />
          </div>
        </div>
        <p className="font-display text-center text-2xl tracking-[0.28em] text-white sm:text-4xl">
          {brand.split("").map((char, index) => (
            <span key={`${char}-${index}`} className="preloader-char inline-block">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </p>
        <span className="preloader-line mx-auto mt-4 block h-px w-56 origin-left bg-[linear-gradient(90deg,rgba(255,186,120,0.95)_0%,rgba(255,227,194,0.95)_45%,rgba(255,186,120,0.95)_100%)] sm:mt-5" />
        <div className="mx-auto mt-3 h-[3px] w-56 overflow-hidden rounded-full bg-white/10">
          <span className="preloader-fire block h-full origin-left scale-x-0 bg-[linear-gradient(90deg,rgba(255,120,55,0.95)_0%,rgba(255,184,102,0.98)_50%,rgba(255,232,180,0.95)_100%)] shadow-[0_0_14px_rgba(255,164,72,0.65)]" />
        </div>
        <p ref={progressRef} className="mt-2 text-center text-[10px] tracking-[0.2em] text-accent/85">
          0%
        </p>
        <p className="mt-3 text-center text-[10px] uppercase tracking-[0.42em] text-white/60 sm:text-xs">
          Creative Digital Studio
        </p>
      </div>
    </div>
  );
}
