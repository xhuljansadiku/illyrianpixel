"use client";

// Titulli që "ndizet" me scroll (2026-10-20, në provë te /test-wow).
// variant "sweep": një dritë e artë kalon nëpër tekst (background-clip:text, pozicioni i gradientit
//   lidhet me scroll-in) dhe teksti mbetet i bardhë pas saj.
// variant "words": fjalët ndizen një nga një nga e zbehta në të bardhë.
// Me reduced-motion teksti shfaqet normal. Pa JS, teksti është i dukshëm (stili vendoset në klient).
import { useRef, type ReactNode } from "react";
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";

type Props = {
  children: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  variant?: "sweep" | "words";
  /** pjesa e fundit e titullit me ngjyrë ari (si "klientë realë") */
  accent?: string;
};

export default function ScrollLightTitle({ children, as: Tag = "h2", className = "", variant = "sweep", accent }: Props): ReactNode {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      if (variant === "sweep") {
        el.classList.add("light-sweep-on");
        gsap.fromTo(
          el,
          { backgroundPosition: "100% 0%" },
          { backgroundPosition: "0% 0%", ease: "none", scrollTrigger: { trigger: el, start: "top 88%", end: "top 40%", scrub: 0.6 } }
        );
      } else {
        const words = el.querySelectorAll<HTMLElement>("[data-w]");
        gsap.fromTo(
          words,
          { opacity: 0.18 },
          { opacity: 1, stagger: 0.12, ease: "none", scrollTrigger: { trigger: el, start: "top 85%", end: "top 45%", scrub: 0.5 } }
        );
      }
    }, el);
    return () => {
      el.classList.remove("light-sweep-on");
      ctx.revert();
    };
  }, [variant, reduced]);

  const words = children.split(" ");
  return (
    <Tag ref={ref} className={className}>
      {variant === "words"
        ? words.map((w, i) => (
            <span key={i} data-w className="inline">
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))
        : children}
      {accent && (
        <>
          {" "}
          {variant === "words" ? (
            <span data-w className="text-accent">{accent}</span>
          ) : (
            <span className="light-sweep-accent">{accent}</span>
          )}
        </>
      )}
    </Tag>
  );
}
