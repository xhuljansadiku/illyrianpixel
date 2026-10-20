"use client";

// Kalim mes faqeve me perde të artë + logo (2026-10-20). JO AKTIV — useri vendosi të mos përdoret
// (shih MarketingChrome, "// GoldCurtain:"). Ruhet për rast se do kthehet, p.sh. vetëm te klikimi i parë.
// Klikimi i një linku të brendshëm ngre perden (0.45s) ndërsa Next ngarkon faqen; kur ndryshon
// pathname-i, perdja largohet lart. Navigimi s'bllokohet kurrë (s'ka preventDefault) dhe ka
// failsafe 4s. Me reduced-motion s'bën asgjë. window.dispatchEvent(new Event("gold-curtain-demo"))
// e luan pa navigim (për faqen e testit).
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ensureGSAP } from "@/lib/gsap";

const SKIP = ["/admin", "/oferta", "/klienti", "/feedback"];

export default function GoldCurtain() {
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{ inFlight: Promise<void> | null; failsafe: number }>({ inFlight: null, failsafe: 0 });
  const lastPath = useRef(pathname);

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const playIn = () => {
    const el = curtainRef.current;
    if (!el) return Promise.resolve();
    const { gsap } = ensureGSAP();
    gsap.killTweensOf([el, el.querySelector(".gc-logo")]);
    const p = new Promise<void>((resolve) => {
      gsap
        .timeline({ onComplete: () => resolve() })
        .set(el, { y: 0, yPercent: 100, visibility: "visible" })
        .to(el, { yPercent: 0, duration: 0.45, ease: "power3.inOut" })
        .fromTo(el.querySelector(".gc-logo"), { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }, "-=0.15");
    });
    stateRef.current.inFlight = p;
    return p;
  };

  const playOut = async () => {
    const el = curtainRef.current;
    if (!el) return;
    window.clearTimeout(stateRef.current.failsafe);
    await stateRef.current.inFlight;
    stateRef.current.inFlight = null;
    const { gsap } = ensureGSAP();
    gsap
      .timeline()
      .to(el.querySelector(".gc-logo"), { opacity: 0, duration: 0.2 }, 0.1)
      .to(el, { yPercent: -100, duration: 0.55, ease: "power3.inOut" }, 0.15)
      .set(el, { visibility: "hidden" });
  };

  // Linqet e brendshme: ngri perden pa e ndalur navigimin
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || reduced()) return;
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // vetëm #hash ose ?query
      if (SKIP.some((p) => url.pathname.startsWith(p) || url.pathname.startsWith(`/en${p}`))) return;
      playIn();
      stateRef.current.failsafe = window.setTimeout(playOut, 4000);
    };
    const onDemo = () => {
      if (reduced()) return;
      playIn().then(() => window.setTimeout(playOut, 350));
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("gold-curtain-demo", onDemo);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("gold-curtain-demo", onDemo);
    };
    // playIn/playOut lexojnë vetëm ref-e
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Faqja e re u renderua → largo perden
  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    if (stateRef.current.inFlight) playOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      ref={curtainRef}
      aria-hidden
      className="gold-curtain pointer-events-none fixed inset-0 z-[140] flex items-center justify-center"
      style={{ visibility: "hidden" }}
    >
      <div className="gc-logo flex items-center gap-4 opacity-0">
        {/* SVG të vogla — next/image s'sjell gjë këtu */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/illyrianpixel_logo.svg" alt="" width={56} height={56} className="h-14 w-14" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/illyrianpixel_text.svg" alt="" width={200} height={40} className="h-8 w-auto" />
      </div>
    </div>
  );
}
