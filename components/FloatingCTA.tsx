"use client";

import { useRef, useState } from "react";
import { ensureGSAP, getIsMobile, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

const SECTIONS = [
  { id: "hero", sub: "Gati për projekt?", cta: "Nis projektin", href: "#hero" },
  { id: "services", sub: "Dëshiron sistem, jo patch-e?", cta: "Shiko si punojmë", href: "#process" },
  { id: "featured-work", sub: "Portofoli i përzgjedhur.", cta: "Shiko projektin", href: "/work/atelier-prime" },
  { id: "cta", sub: "Thjeshtojmë fillimin.", cta: "Rezervo call", href: "#cta" }
] as const;

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState<(typeof SECTIONS)[number]["id"]>("hero");
  const isMobile = getIsMobile();
  const reduced = useReducedMotion();
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const btnLabelRef = useRef<HTMLSpanElement | null>(null);
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!mounted || isMobile) return;
    const { ScrollTrigger } = ensureGSAP();
    const hero = document.getElementById("hero");
    const footer = document.querySelector("footer");
    if (!hero || !footer) return;
    const a = ScrollTrigger.create({
      trigger: hero,
      start: "top top+=1",
      onEnter: () => setVisible(true),
      onLeaveBack: () => setVisible(false)
    });
    const b = ScrollTrigger.create({
      trigger: footer,
      start: "top bottom",
      onEnter: () => setVisible(false),
      onLeaveBack: () => setVisible(true)
    });
    return () => {
      a.kill();
      b.kill();
    };
  }, [isMobile, mounted]);

  useIsomorphicLayoutEffect(() => {
    if (!mounted || isMobile) return;
    const { ScrollTrigger } = ensureGSAP();
    const triggers: ScrollTrigger[] = [];
    SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (!el) return;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 58%",
        end: "bottom 42%",
        onEnter: () => setActiveId(sec.id),
        onEnterBack: () => setActiveId(sec.id)
      });
      triggers.push(st);
    });
    return () => triggers.forEach((t) => t.kill());
  }, [isMobile, mounted]);

  useIsomorphicLayoutEffect(() => {
    if (!mounted || isMobile || reduced) return;
    const cfg = SECTIONS.find((s) => s.id === activeId) ?? SECTIONS[0];
    const { gsap } = ensureGSAP();
    const tl = gsap.timeline({ defaults: { duration: 0.35, ease: "power2.out" } });
    tl.to([subRef.current, btnLabelRef.current], { opacity: 0, y: 6 }, 0).add(() => {
      if (subRef.current) subRef.current.textContent = cfg.sub;
      if (btnLabelRef.current) btnLabelRef.current.textContent = cfg.cta;
      if (linkRef.current) linkRef.current.setAttribute("href", cfg.href);
    });
    tl.to([subRef.current, btnLabelRef.current], { opacity: 1, y: 0 }, 0);
  }, [activeId, isMobile, mounted, reduced]);

  useIsomorphicLayoutEffect(() => {
    if (!mounted || !isMobile) return;
    const onScroll = () => setVisible(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile, mounted]);

  useIsomorphicLayoutEffect(() => {
    if (!mounted || !containerRef.current) return;
    const root = document.documentElement;
    const updateHeight = () => {
      root.style.setProperty("--floating-cta-height", `${containerRef.current?.offsetHeight ?? 0}px`);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [mounted, visible, activeId]);

  if (!mounted) return null;

  const cfg = SECTIONS.find((s) => s.id === activeId) ?? SECTIONS[0];

  return (
    <div
      ref={containerRef}
      className={`fixed z-40 rounded-full border border-white/14 bg-[#0b0b0b]/72 px-3 py-2 backdrop-blur-xl transition-all duration-300 sm:px-4 sm:py-3 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
      style={{
        bottom: isMobile ? "calc(var(--social-proof-height, 0px) + 28px)" : "24px",
        right: isMobile ? "50%" : "24px",
        left: isMobile ? "50%" : "auto",
        transform: visible
          ? isMobile
            ? "translateX(-50%) translateY(0)"
            : undefined
          : isMobile
            ? "translateX(-50%) translateY(12px)"
            : undefined
      }}
    >
      <div className="flex items-center gap-2.5 sm:gap-3">
        <p ref={subRef} className="text-xs text-white/78 sm:text-sm">
          {cfg.sub}
        </p>
        <a
          ref={linkRef}
          href={cfg.href}
          data-magnetic="true"
          onClick={(e) => {
            if (cfg.id === "hero") {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent("open-inquiry-modal"));
              return;
            }
            if (cfg.id === "cta") {
              e.preventDefault();
              document.getElementById("cta")?.scrollIntoView({ behavior: "smooth", block: "start" });
              return;
            }
            if (cfg.id === "services") {
              e.preventDefault();
              document.getElementById("process")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
          className="rounded-full border border-accent/65 bg-accent px-3 py-1.5 text-[10px] tracking-[0.12em] text-black transition-all duration-300 hover:scale-[1.02] sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.14em]"
        >
          <span ref={btnLabelRef}>{cfg.cta}</span>
        </a>
      </div>
    </div>
  );
}
