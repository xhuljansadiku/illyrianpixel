"use client";

import { useState } from "react";
import SectionMark from "@/components/SectionMark";

const faqs = [
  { q: "Sa zgjat një website?", a: "Mesatarisht 2-4 javë, varësisht kompleksitetit dhe volumit të përmbajtjes." },
  { q: "A përfshihet SEO?", a: "Po, përfshihet baza teknike dhe strukturimi on-page për indeksim korrekt." },
  { q: "A ofroni mirëmbajtje?", a: "Po. Ofronim mirëmbajtje periodike, monitorim dhe optimizim performance." },
  { q: "A punoni ndërkombëtarisht?", a: "Po, punojmë me biznese në Shqipëri, Gjermani dhe tregje ndërkombëtare." }
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="cinematic-section section-tone-about">
      <div className="section-wrap">
        <SectionMark label="FAQ" />
        <h2 className="section-title mt-3 max-w-4xl">Pyetje të shpeshta.</h2>
        <div className="mt-8 max-w-4xl divide-y divide-white/10 border-y border-white/10">
          {faqs.map((item, idx) => (
            <div key={item.q} className="py-4">
              <button onClick={() => setOpen((prev) => (prev === idx ? -1 : idx))} className="flex w-full items-center justify-between text-left">
                <span className="font-display text-[1.5rem] leading-tight text-white/92 md:text-[1.9rem]">{item.q}</span>
                <span className="text-accent/85">{open === idx ? "−" : "+"}</span>
              </button>
              <div className={`grid transition-all duration-300 ${open === idx ? "grid-rows-[1fr] opacity-100 pt-3" : "grid-rows-[0fr] opacity-0"}`}>
                <p className="overflow-hidden text-sm leading-relaxed text-white/70 md:text-base">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
