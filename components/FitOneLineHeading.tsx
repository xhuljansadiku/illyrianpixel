"use client";

import {
  createElement,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode
} from "react";

type FitMode = "one" | "two";

type FitOneLineHeadingProps = {
  as?: "h2" | "h3";
  className?: string;
  children: ReactNode;
  minRem?: number;
  maxRem?: number;
  forceOneLine?: boolean;
};

function lineHeightPx(el: HTMLElement, fontSizeRem: number): number {
  const lh = parseFloat(getComputedStyle(el).lineHeight);
  if (Number.isFinite(lh) && lh > 0) return lh;
  return fontSizeRem * 16 * 1.12;
}

export default function FitOneLineHeading({
  as = "h3",
  className = "",
  children,
  minRem = 0.72,
  maxRem = 2.65,
  forceOneLine = false
}: FitOneLineHeadingProps) {
  const elRef = useRef<HTMLHeadingElement>(null);
  const [rem, setRem] = useState(maxRem);
  const [mode, setMode] = useState<FitMode>("one");

  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const fit = () => {
      const w = el.clientWidth;
      if (w <= 0) {
        requestAnimationFrame(fit);
        return;
      }

      // Reset measurement styles (clear prior line-clamp from last commit so scrollHeight is real)
      el.style.display = "block";
      el.style.overflow = "visible";
      el.style.whiteSpace = "nowrap";
      el.style.wordBreak = "";
      el.style.overflowWrap = "";
      el.style.removeProperty("-webkit-line-clamp");
      el.style.removeProperty("-webkit-box-orient");

      let lo = minRem;
      let hi = maxRem;
      for (let i = 0; i < 22; i++) {
        const mid = (lo + hi) / 2;
        el.style.fontSize = `${mid}rem`;
        void el.offsetWidth;
        if (el.scrollWidth <= w + 1) lo = mid;
        else hi = mid;
      }

      el.style.fontSize = `${lo}rem`;
      void el.offsetWidth;

      if (el.scrollWidth <= w + 1 || forceOneLine) {
        setMode("one");
        setRem(lo);
        return;
      }

      // Still overflows at best one-line size: allow up to 2 lines, maximize font size
      el.style.whiteSpace = "normal";
      el.style.overflowWrap = "anywhere";
      el.style.wordBreak = "break-word";

      lo = minRem;
      hi = maxRem;
      for (let i = 0; i < 22; i++) {
        const mid = (lo + hi) / 2;
        el.style.fontSize = `${mid}rem`;
        void el.offsetWidth;
        const lh = lineHeightPx(el, mid);
        const lines = el.scrollHeight / lh;
        if (lines <= 2.04) lo = mid;
        else hi = mid;
      }

      setMode("two");
      setRem(lo);
    };

    fit();

    const parent = el.parentElement;
    const ro = new ResizeObserver(fit);
    if (parent) ro.observe(parent);
    return () => ro.disconnect();
  }, [children, minRem, maxRem, forceOneLine]);

  const style: CSSProperties =
    mode === "one"
      ? {
          fontSize: `${rem}rem`,
          whiteSpace: "nowrap",
          display: "block",
          overflow: "visible",
          wordBreak: "normal",
          overflowWrap: "normal"
        }
      : {
          fontSize: `${rem}rem`,
          whiteSpace: "normal",
          overflowWrap: "anywhere",
          wordBreak: "break-word",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          overflow: "hidden"
        };

  return createElement(as, {
    ref: elRef,
    className,
    style
  }, children);
}
