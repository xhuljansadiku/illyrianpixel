"use client";

import { useState } from "react";
import SectionMark from "@/components/SectionMark";

const faqs = [
  {
    q: "Sa zgjat ndërtimi i një website?",
    a: "Mesatarisht 2–4 javë, varësisht kompleksitetit dhe sasisë së përmbajtjes.\nProjektet me funksione të avancuara mund të zgjasin deri në 6 javë.\nNë fazën e planifikimit ju japim një afat të saktë."
  },
  {
    q: "A përfshihet SEO?",
    a: "Po, çdo website që ndërtojmë vjen me SEO bazë të instaluar: strukturë e saktë, faqe të shpejta dhe meta të optimizuara. SEO i avancuar dhe strategjia e përmbajtjes është shërbim i veçantë."
  },
  {
    q: "A ofroni mirëmbajtje pas publikimit?",
    a: "Po, ofrojmë paketa mirëmbajtjeje mujore që përfshijnë përditësime, monitorim sigurie dhe ndryshime të vogla.\nNuk ju lëmë vetëm pas lansimit."
  },
  {
    q: "A punoni me klientë ndërkombëtarë?",
    a: "Po, kemi klientë në Itali, Gjermani, Angli dhe SHBA. Komunikojmë në shqip, anglisht dhe italisht. Takimet bëhen online, procesi është i njëjtë për të gjithë."
  },
  {
    q: "Si funksionon pagesa?",
    a: "Pagesa ndahet në dy pjesë, 50% para fillimit të projektit dhe 50% pas aprovimit final para lansimit. Pranojmë transfertë bankare dhe metoda të tjera sipas marrëveshjes."
  },
  {
    q: "Çfarë kam nevojë të përgatis para fillimit?",
    a: "Mjafton të na tregoni çfarë bën biznesi juaj, kë synoni të arrini dhe çfarë nuk ju pëlqen tek prezenca juaj aktuale. Për pjesën tjetër kujdesemi ne, struktura, tekstet dhe dizajni."
  }
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
                <p className="overflow-hidden whitespace-pre-line text-sm leading-relaxed text-white/70 md:text-base">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
