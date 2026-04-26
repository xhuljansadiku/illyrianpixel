import SectionMark from "@/components/SectionMark";

const points = [
  "Punojmë derisa të jesh i kënaqur",
  "Revisions pa limit gjatë fazës së dizajnit",
  "Transparencë totale në çdo hap"
];

export default function GuaranteeSection() {
  return (
    <section id="guarantee" className="cinematic-section border-t border-white/[0.08] bg-black/25 !min-h-0 py-0 md:!min-h-0">
      <div className="section-wrap py-20 md:py-24">
        <SectionMark label="GARANCI & BESIM" />
        <h2 className="section-title mt-3 max-w-4xl">Punojmë me disiplinë, qartësi dhe përgjegjësi ndaj rezultatit.</h2>
        <div className="mt-8 max-w-3xl space-y-4 border-l border-accent/35 pl-5 md:pl-7">
          {points.map((item) => (
            <p key={item} className="text-[1.03rem] leading-relaxed text-white/78 md:text-[1.12rem]">
              {item}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
