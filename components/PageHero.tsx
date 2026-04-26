import Image from "next/image";
import SectionMark from "@/components/SectionMark";

type PageHeroProps = {
  label: string;
  title: string;
  description: string;
  image?: string;
};

export default function PageHero({ label, title, description, image }: PageHeroProps) {
  return (
    <section className="cinematic-section relative overflow-hidden border-b border-white/10 !min-h-0 py-0 md:!min-h-0">
      <div className="section-wrap grid items-end gap-10 py-20 md:py-24 lg:grid-cols-[1.04fr_0.96fr]">
        <div>
          <SectionMark label={label} />
          <h1 className="font-display text-[clamp(2.2rem,6vw,5.2rem)] leading-[0.92] text-white">{title}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/66 md:text-base">{description}</p>
        </div>
        {image ? (
          <div className="relative h-[260px] overflow-hidden rounded-[1rem] border border-white/12 bg-[#111111] md:h-[320px]">
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 44vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/20 to-transparent" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
