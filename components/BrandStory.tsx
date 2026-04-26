import SectionMark from "@/components/SectionMark";

export default function BrandStory() {
  return (
    <section id="brand-story" className="cinematic-section border-t border-white/[0.08] bg-black/20 !min-h-0 py-0 md:!min-h-0">
      <div className="section-wrap py-24 md:py-30">
        <SectionMark label="STORY" />
        <h2 className="section-title mt-3 max-w-4xl">Pse ekziston Illyrian Pixel.</h2>
        <div className="mt-8 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <p className="text-[1.08rem] leading-relaxed text-white/74 md:text-[1.2rem]">
            Illyrian Pixel nisi nga një bindje e thjeshtë: shumica e website-ve duken bukur, por nuk bindin. Ne
            ekzistojmë për ta kthyer estetikën në performancë, pa humbur elegancën.
          </p>
          <div className="space-y-4 border-l border-accent/35 pl-5 md:pl-7">
            <p className="text-sm leading-relaxed text-white/65">
              Nuk punojmë për volum. Punojmë për marka që duan cilësi, ritëm dhe qartësi të matshme.
            </p>
            <p className="text-sm leading-relaxed text-white/65">
              Çdo projekt është një sistem: strategji, dizajn, teknologji dhe optimizim i vazhdueshëm.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
