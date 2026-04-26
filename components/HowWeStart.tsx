import SectionMark from "@/components/SectionMark";

const steps = ["Call (20 min)", "Strategji", "Dizajn", "Launch"];

export default function HowWeStart() {
  return (
    <section id="how-we-start" className="cinematic-section section-tone-process">
      <div className="section-wrap">
        <SectionMark label="HOW WE START" />
        <h2 className="section-title mt-3 max-w-4xl">Nisja e qartë në 4 hapa.</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {steps.map((step, idx) => (
            <div key={step} className="border-t border-white/10 pt-4">
              <p className="text-[11px] tracking-[0.16em] text-accent/80">0{idx + 1}</p>
              <p className="mt-2 font-display text-2xl leading-none text-white/88">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
