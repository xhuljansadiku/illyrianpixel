"use client";

import { useRef } from "react";
import { ensureGSAP, useIsomorphicLayoutEffect } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";

const quotes = [
  {
    quote: "Më përpara na duhej t'u shpjegonim njerëzve çdo gjë nga fillimi në telefon. Website-i na ka shpëtuar, sepse tani klientët vijnë gati të informuar. Futen, shohin punët tona dhe kur na shkruajnë, e dinë fiks çfarë duan. Na ka kursyer pafund kohë.",
    name: "Mariglent S.",
    company: "ESM Group",
    result: "Milano, Itali",
    logo: "/images/logos/esm-group.png"
  },
  {
    quote: "Në fushën e fitnesit është e vështirë të krijosh besim, por ky Website i ri nga zero na ka ndryshuar komplet lojën. Më përpara njerëzit na shkruanin pafund pyetje për programet dhe ngatërroheshin. Tani që çdo paketë është e ndarë kaq qartë, klientët futen, binden dhe na kontaktojnë direkt për të filluar, pa ato diskutimet e gjata.",
    name: "Bardhi U.",
    company: "Bardhi Wellness",
    result: "Prishtinë & Köln",
    logo: "/images/logos/bardhi-wellness.png"
  },
  {
    quote: "Mendonim se na mjaftonte thjesht të bënim punë të mirë, por pa një Website si duhet nuk na merrnin seriozisht. Që kur u bë kjo faqja e Webit, gjithçka ka ndryshuar. Klientët Gjermanë futen, shohin shërbimet tona të ndara qartë dhe kërkesat tani na vijnë shumë më të sakta dhe profesionale, pa humbur kohë me telefonata.",
    name: "Amir S.",
    company: "Hauswerk Niederbayern",
    result: "Straubing, Gjermani",
    logo: "/images/logos/hauswerk-niederbayern.png"
  },
  {
    quote: "Në tregun e ndërtimit është shumë e vështirë të gjesh klientë seriozë. Ky Website i ri nga zero dhe sistemi me Google Ads na kanë shpëtuar nga telefonatat e gjata që nuk mbylleshin kurrë me punë. Tani na vijnë kërkesa reale nga njerëz që e kanë ndarë mendjen; na kontaktojnë duke e ditur fiks çfarë duan dhe çfarë ofrojmë që në sekondën e parë.",
    name: "Vehbi P.",
    company: "Palushi Brothers",
    result: "Londër, Angli",
    logo: "/images/logos/palushi-brothers.webp"
  }
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement | null>(null);
  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-reveal",
        { opacity: 0, y: 24, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="testimonials" ref={sectionRef} className="cinematic-section section-tone-about">
      <div className="section-wrap">
        <div className="testimonial-reveal">
          <SectionMark label="ZËRI I KLIENTËVE" />
        </div>
        <h2 className="testimonial-reveal section-title mt-3 max-w-4xl">{"Çfarë thonë klientët"}</h2>
        <p className="testimonial-reveal mt-4 max-w-[480px] font-body text-[0.94rem] font-light leading-relaxed tracking-[0.02em] text-white/45">{"Rezultate reale nga bashkëpunime reale."}</p>
        <div className="mt-10 space-y-8">
          {quotes.map((item) => (
            <article key={item.name} className="testimonial-reveal relative border-t border-white/10 pt-7">
              <span className="pointer-events-none absolute left-0 top-4 font-display text-6xl leading-none text-accent/18">“</span>
              <p className="max-w-4xl pl-6 text-[1.1rem] leading-relaxed text-white/84 md:text-[1.35rem]">
                {item.quote.split(". ").map((sentence, i, arr) => (
                  <span key={i} className="md:mb-1.5 md:block">
                    {sentence}{i < arr.length - 1 ? ". " : ""}
                  </span>
                ))}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 pl-6 text-sm text-white/62">
                <span className="text-white/88">{item.name}</span>
                <span>•</span>
                <span>{item.company}</span>
                <span className="rounded-full border border-accent/30 px-2 py-0.5 text-accent/85">{item.result}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
