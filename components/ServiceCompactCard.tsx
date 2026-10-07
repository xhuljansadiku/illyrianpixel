"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import ServiceCardHeroVisual from "@/components/ServiceCardHeroVisual";
import type { ServiceOverviewCard } from "@/lib/serviceOverviewCards";

type Props = {
  service: ServiceOverviewCard;
  headingAs?: "h2" | "h3";
};

export default function ServiceCompactCard({ service, headingAs = "h3" }: Props) {
  const t = useTranslations("services.overview");
  const Heading = headingAs;
  const spaceIdx = service.title.indexOf(" ");
  const firstWord = spaceIdx > -1 ? service.title.slice(0, spaceIdx) : service.title;
  const rest = spaceIdx > -1 ? service.title.slice(spaceIdx) : "";

  return (
    <Link
      href={service.href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[linear-gradient(140deg,#111111_0%,#0d0d0d_55%,#0f0f0f_100%)] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[#D4AF37]/45 hover:shadow-[0_18px_44px_rgba(0,0,0,0.45),0_0_0_1px_rgba(212,175,55,0.3)] sm:p-6"
    >
      <span className="absolute right-4 top-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]/30 transition-colors duration-300 group-hover:text-[#D4AF37]/55">
        {service.ordinal}
      </span>

      <div className="flex h-[70px] items-center justify-center sm:h-[82px]">
        <ServiceCardHeroVisual variant={service.visualVariant} compact />
      </div>

      <Heading className="mt-4 font-display text-[1.05rem] font-bold leading-snug tracking-[-0.01em] text-white sm:text-[1.15rem]">
        <span className="text-[#D4AF37]">{firstWord}</span>
        {rest && <span className="text-white/90">{rest}</span>}
      </Heading>

      <p className="mt-2 line-clamp-2 font-body text-[0.8rem] leading-[1.55] text-white/45 transition-colors duration-300 group-hover:text-white/60">
        {service.desc}
      </p>

      <span className="mt-4 inline-flex items-center gap-2 self-start font-body text-[10px] font-bold uppercase tracking-[1.2px] text-[#D4AF37] transition-colors duration-300 group-hover:text-[#eace71]">
        {t("cardLinkLabel")}
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}
