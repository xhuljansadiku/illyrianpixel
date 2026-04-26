import SectionMark from "@/components/SectionMark";

const rows = [
  { name: "Website", price: "nga €500" },
  { name: "E-commerce", price: "nga €1200" },
  { name: "Marketing", price: "nga €300/muaj" }
];

export default function PricingPreview() {
  return (
    <section id="pricing-preview" className="cinematic-section section-tone-services">
      <div className="section-wrap">
        <SectionMark label="PRICING PREVIEW" />
        <h2 className="section-title mt-3 max-w-4xl">Transparencë që ndihmon vendimmarrjen.</h2>
        <div className="mt-8 max-w-3xl space-y-3">
          {rows.map((row) => (
            <div key={row.name} className="flex items-center justify-between border-b border-white/10 py-4">
              <p className="font-display text-3xl text-white/90">{row.name}</p>
              <p className="text-lg text-accent/90">{row.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
