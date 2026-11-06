import Image from "next/image";
import { Link } from "@/i18n/navigation";

/** Karta e 6-të te /diaspora: shtetet e tjera ku jetojnë shqiptarët — çon te kontakti */
const FLAGS = ["at", "be", "nl", "fr", "se", "gr", "au", "xk"];

export default function DiasporaAnyCountryCard({ title, hookLine, cta }: { title: string; hookLine: string; cta: string }) {
  return (
    <Link
      href="/contact"
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-accent/25 bg-[linear-gradient(140deg,rgba(171,131,57,0.08)_0%,#0d0d0d_55%,#0f0f0f_100%)] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-accent/55 hover:shadow-gold-lift sm:p-6"
    >
      <div className="flex h-[70px] items-center justify-center sm:h-[82px]">
        <div className="flex -space-x-3">
          {FLAGS.map((code, i) => (
            <Image
              key={code}
              src={`/flags/4x3/${code}.svg`}
              unoptimized
              alt=""
              width={40}
              height={30}
              style={{ zIndex: FLAGS.length - i }}
              className="relative h-7 w-auto rounded-sm object-cover shadow-card ring-1 ring-black/60 transition-transform duration-300 group-hover:-translate-y-1 sm:h-8"
            />
          ))}
        </div>
      </div>

      <h3 className="mt-4 font-display text-[1.05rem] font-bold leading-snug tracking-[-0.01em] text-white sm:text-[1.15rem]">
        {title}
      </h3>

      <p className="mt-2 line-clamp-2 font-body text-[0.8rem] leading-[1.55] text-white/45 transition-colors duration-300 group-hover:text-white/60">
        {hookLine}
      </p>

      <span className="mt-4 inline-flex items-center gap-2 self-start font-body text-[10px] font-bold uppercase tracking-[1.2px] text-accent transition-colors duration-300 group-hover:text-accentLight">
        {cta}
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}
