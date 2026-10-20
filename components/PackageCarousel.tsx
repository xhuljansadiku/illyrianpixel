"use client";

// Kartat e paketave (2026-10-20): në telefon karusel me rrëshqitje që hapet te paketa e
// rekomanduar (Business), jo te më e lira — kështu klienti s'ankorohet te çmimi më i ulët.
// Nga md e lart: grid si më parë. Pikat poshtë tregojnë ku je.
import { Children, useEffect, useRef, useState, type ReactNode } from "react";

export default function PackageCarousel({ children, focusIndex = 0, columns = 3 }: { children: ReactNode; focusIndex?: number; columns?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const count = Children.count(children);
  const [active, setActive] = useState(focusIndex);

  const center = (i: number, smooth: boolean) => {
    const box = ref.current;
    const card = box?.children[i] as HTMLElement | undefined;
    if (!box || !card || window.matchMedia("(min-width: 768px)").matches) return;
    box.scrollTo({ left: card.offsetLeft - (box.clientWidth - card.clientWidth) / 2, behavior: smooth ? "smooth" : "auto" });
  };

  // Hapet te paketa e rekomanduar; rifokusohet kur "Çfarë do të arrish?" zgjedh tjetër
  useEffect(() => {
    center(focusIndex, false);
    setActive(focusIndex);
  }, [focusIndex]);

  const onScroll = () => {
    const box = ref.current;
    if (!box) return;
    const mid = box.scrollLeft + box.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(box.children).forEach((c, i) => {
      const el = c as HTMLElement;
      const d = Math.abs(el.offsetLeft + el.clientWidth / 2 - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  };

  const grid = columns >= 4 ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-3";

  return (
    <>
      <div
        ref={ref}
        onScroll={onScroll}
        className={`price-grid -mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 pt-2 [scrollbar-width:none] md:mx-0 md:mt-12 md:grid md:items-stretch md:gap-5 md:overflow-visible md:px-0 md:pb-0 ${grid} [&::-webkit-scrollbar]:hidden`}
      >
        {Children.map(children, (child) => (
          <div className="flex w-[84%] shrink-0 snap-center flex-col md:w-auto">{child}</div>
        ))}
      </div>
      {count > 1 && (
        <div className="mt-3 flex justify-center gap-2 md:hidden" aria-hidden>
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              onClick={() => center(i, true)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? "w-6 bg-accent" : "w-1.5 bg-white/25"}`}
            />
          ))}
        </div>
      )}
    </>
  );
}
