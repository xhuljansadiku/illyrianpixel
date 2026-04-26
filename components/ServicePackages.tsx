import SectionMark from "@/components/SectionMark";

const packages = [
  {
    name: "Starter",
    range: "nga €700 – €1,500",
    desc: "Për biznese që duan një bazë të pastër dhe prezencë serioze.",
    bullets: ["Website bazë", "Mobile responsive", "Basic SEO"]
  },
  {
    name: "Growth",
    range: "nga €1,500 – €3,500",
    desc: "Balanca ideale midis website-it dhe mekanikave të rritjes.",
    bullets: ["Website + marketing", "SEO on-page", "Analytics setup"],
    featured: true
  },
  {
    name: "Premium",
    range: "nga €3,500+",
    desc: "Sistem i plotë për marka që kërkojnë performancë dhe autoritet.",
    bullets: ["Full system", "Advanced SEO", "Conversion optimization"]
  }
];

export default function ServicePackages() {
  return (
    <section id="service-packages" className="cinematic-section section-tone-services border-t border-white/[0.08] !min-h-0 py-0 md:!min-h-0">
      <div className="section-wrap py-22 md:py-28">
        <SectionMark label="PAKETA SHËRBIMI" />
        <h2 className="section-title mt-3 max-w-4xl">Paketa të qarta për ritëm dhe pritshmëri reale.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {packages.map((p) => (
            <article
              key={p.name}
              className={`rounded-[1rem] border p-5 md:p-6 ${
                p.featured
                  ? "border-accent/45 bg-accent/[0.07] shadow-[0_0_28px_rgba(200,155,46,0.08)]"
                  : "border-white/10 bg-[#151515]"
              }`}
            >
              <p className="text-[11px] tracking-[0.18em] text-accent/90">{p.name}</p>
              <p className="mt-2 font-display text-[1.85rem] leading-none text-white">{p.range}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/62">{p.desc}</p>
              <ul className="mt-4 space-y-2">
                {p.bullets.map((item) => (
                  <li key={item} className="text-sm text-white/72">
                    • {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
