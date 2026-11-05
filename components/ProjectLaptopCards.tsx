import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { CaseStudy } from "@/lib/caseStudies";

/* /projektet (2026-11-05, versioni D i demos): çdo projekt brenda një laptopi;
   në hover faqja brenda ekranit skrollohet poshtë. Kryefaqja vazhdon me ProjectBrowserCards. */

const domainOf = (url: string) => url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");

function Flags({ codes }: { codes: string[] }) {
  return (
    <span className="inline-flex gap-1">
      {codes.map((c) => (
        <Image key={c} src={`/flags/4x3/${c}.svg`} alt="" width={16} height={12} className="h-3 w-4 rounded-[2px] object-cover" unoptimized />
      ))}
    </span>
  );
}

export default function ProjectLaptopCards({ items }: { items: CaseStudy[] }) {
  return (
    <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
      {items.map((p) => (
        <Link key={p.slug} href={`/projektet/${p.slug}`} className="group block">
          <div className="mx-auto w-[92%] rounded-t-[14px] border border-white/15 bg-[#0d0c0b] p-[2.2%] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:-translate-y-1.5">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[4px]">
              <Image src={p.heroImage} alt={p.title} fill sizes="(min-width: 768px) 45vw, 92vw" className="object-cover object-top transition-[object-position] duration-[4000ms] ease-linear group-hover:object-bottom" />
            </div>
          </div>
          <div className="relative mx-auto h-3 w-full rounded-b-[14px] bg-gradient-to-b from-[#3a3835] to-[#1c1b19]">
            <div className="absolute left-1/2 top-0 h-1.5 w-[18%] -translate-x-1/2 rounded-b-md bg-black/40" />
          </div>
          <div className="mt-6 flex items-baseline justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl text-white transition-colors group-hover:text-accent">{p.title}</h2>
              <p className="mt-1 text-sm text-white/50">{p.category}</p>
            </div>
            <span className="flex items-center gap-2 text-[13px] text-white/45"><Flags codes={p.flagCodes} />{p.liveUrl ? domainOf(p.liveUrl) : ""}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
