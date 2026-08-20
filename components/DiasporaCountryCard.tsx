import Image from "next/image";
import { Link } from "@/i18n/navigation";

type Props = {
  slug: string;
  countryLabel: string;
  flagCode: string;
  hookLine: string;
};

export default function DiasporaCountryCard({ slug, countryLabel, flagCode, hookLine }: Props) {
  return (
    <Link
      href={`/diaspora/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[linear-gradient(140deg,#111111_0%,#0d0d0d_55%,#0f0f0f_100%)] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[#D4AF37]/45 hover:shadow-[0_18px_44px_rgba(0,0,0,0.45),0_0_0_1px_rgba(212,175,55,0.3)] sm:p-6"
    >
      <div className="flex h-[70px] items-center justify-center sm:h-[82px]">
        <Image
          src={`https://flagcdn.com/w160/${flagCode}.png`}
          alt=""
          width={64}
          height={48}
          className="h-10 w-auto rounded-[3px] object-cover shadow-[0_4px_14px_rgba(0,0,0,0.4)] sm:h-12"
        />
      </div>

      <h3 className="mt-4 font-display text-[1.05rem] font-bold leading-snug tracking-[-0.01em] text-white sm:text-[1.15rem]">
        {countryLabel}
      </h3>

      <p className="mt-2 line-clamp-2 font-body text-[0.8rem] leading-[1.55] text-white/45 transition-colors duration-300 group-hover:text-white/60">
        {hookLine}
      </p>

      <span className="mt-4 inline-flex items-center gap-2 self-start font-body text-[10px] font-bold uppercase tracking-[1.2px] text-[#D4AF37] transition-colors duration-300 group-hover:text-[#eace71]">
        Shiko faqen
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}
