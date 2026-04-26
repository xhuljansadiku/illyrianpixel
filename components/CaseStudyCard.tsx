import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/lib/caseStudies";

export default function CaseStudyCard({ item }: { item: CaseStudy }) {
  return (
    <article className="group overflow-hidden rounded-[1rem] border border-white/10 bg-[#151515]">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={item.heroImage}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/15 to-transparent" />
      </div>
      <div className="p-5">
        <p className="text-[11px] tracking-[0.18em] text-accent/88">
          {item.category} • {item.year}
        </p>
        <h3 className="mt-2 font-display text-[2rem] leading-[0.95] text-white">{item.title}</h3>
        <p className="mt-2 text-sm text-white/62">{item.intro}</p>
        <Link href={`/work/${item.slug}`} className="luxury-link mt-4">
          Shiko case study <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
