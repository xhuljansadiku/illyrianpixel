import SectionMark from "@/components/SectionMark";

export default function PositioningFilter() {
  return (
    <section id="positioning-filter" className="cinematic-section border-t border-white/[0.08] bg-black/25 !min-h-0 py-0 md:!min-h-0">
      <div className="section-wrap py-20 md:py-24">
        <SectionMark label="FILTRIM" />
        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[0.95] text-white">
              Nuk bëjmë gjithçka.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/58">
              Nuk ofrojmë punë me shabllon, çmime “nga sirtari”, ose faqe që duken sikur të gjitha të tjerat. Kjo është
              qëllimisht: kur marka dëshiron të dallohet, detajet nuk janë opsionale.
            </p>
          </div>
          <div className="space-y-6 border-l border-accent/30 pl-6 md:pl-10">
            <p className="font-display text-xl text-white/92 md:text-2xl">We don’t do cheap / template work.</p>
            <p className="text-sm leading-relaxed text-white/62">
              Built for serious businesses — kur kërkesa është rritje reale, matje, dhe prezencë që mbajnë çmimin.
            </p>
            <p className="text-sm leading-relaxed text-white/55">
              Nëse kërkon “vetëm një faqe të shpejtë” pa strategji, ka shumë alternativa të shkëlqyera diku tjetër. Ne
              hyjmë kur dëshiron sistem.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
