"use client";

export default function WhyWebsiteFails() {
  const points = [
    { t: "I ngadalshëm", d: "Humbet vëmendja përpara se besimi të ndërtohet." },
    { t: "Pa strukturë", d: "Mesazhi premium zbehet kur hierarkia është e përzier." },
    { t: "Pa SEO", d: "Trafiku i ftohtë — pa intent, pa kërkesë, pa rritje." },
    { t: "Pa konvertim", d: "Dizajn i bukur pa ofertë të qartë është vetëm dekor." }
  ];

  return (
    <section id="why-not-working" className="cinematic-section border-t border-white/[0.08] bg-black/30">
      <div className="section-wrap grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-accent/90">DIAGNOZË</p>
          <h2 className="mt-4 max-w-[18ch] font-display text-[clamp(2rem,5vw,3.4rem)] leading-[0.95] text-white">
            Pse nuk po funksionon website-i yt?
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/58">
            Shumica e faqeve nuk dështojnë nga “mungesa e estetikës”. Dështojnë sepse nuk përputhen me sjelljen e
            përdoruesit dhe me ekonominë e vëmendjes.
          </p>
        </div>
        <div className="space-y-0 border-t border-white/12">
          {points.map((p) => (
            <div key={p.t} className="grid gap-2 border-b border-white/10 py-6 md:grid-cols-[0.42fr_1fr] md:items-start md:gap-8">
              <p className="font-display text-lg text-white md:text-xl">{p.t}</p>
              <p className="text-sm leading-relaxed text-white/62">{p.d}</p>
            </div>
          ))}
        </div>
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-4 rounded-[1rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] tracking-[0.2em] text-accent/90">ZGJIDHJA</p>
              <p className="mt-2 max-w-xl text-sm text-white/70">
                Website, e-commerce, marketing dhe SEO — të lidhura në një sistem që duket luks dhe sillet si biznes.
              </p>
            </div>
            <a href="#services" className="luxury-link shrink-0 text-[11px] tracking-[0.16em]">
              Shiko shërbimet <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
