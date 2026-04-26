const phrases = [
  "Strategji → strukturë → lëvizje e kontrolluar",
  "Performancë si standard — jo si shtesë",
  "Konvertim si pasojë e qartësisë",
  "Premium është ritëm + detaje",
  "Më pak zhurmë — më shumë vendime"
];

export default function LoopingStoryBand() {
  return (
    <section
      aria-hidden
      className="loop-story-band relative overflow-hidden border-y border-white/[0.07] bg-[#090909]/80 py-5"
    >
      <div className="loop-story-marquee flex w-max gap-20 pr-20">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex gap-20">
            {phrases.map((p) => (
              <span key={`${dup}-${p}`} className="whitespace-nowrap text-[11px] tracking-[0.28em] text-white/38">
                {p}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
