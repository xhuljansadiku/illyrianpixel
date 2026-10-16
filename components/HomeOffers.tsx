// "Çfarë ofrojmë" (2026-10-16): 3 oferta të qarta me çmim "nga €X" — zëvendësoi listën e shërbimeve në faqen kryesore.
// Çmimet vijnë nga paketat e /cmimet (me ndryshimet e adminit), që të përputhen kudo.
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SectionMark from "@/components/SectionMark";

import type { OfferPrice } from "@/lib/offerPrices";

type Offer = { slug: string; title: string; for: string; points: string[]; cta: string };

const stripFrom = (p: string) => p.replace(/^(nga|from)\s+/i, "");

export default function HomeOffers({ prices }: { prices: Record<string, OfferPrice | undefined> }) {
  const t = useTranslations("home.offers");
  const offers = t.raw("items") as Offer[];

  return (
    <section id="sherbimet" className="relative border-b border-white/[0.06]">
      <div className="section-wrap">
        <SectionMark label={t("eyebrow")} />
        <h2 className="section-title mt-3 max-w-3xl">
          {t("headline")}
          <span className="text-accent">{t("headlineAccent")}</span>
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/55">{t("intro")}</p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {offers.map((o) => {
            const price = prices[o.slug];
            return (
              <article
                key={o.slug}
                className="group flex flex-col rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(171,131,57,0.08),rgba(255,255,255,0.01)_45%)] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-accent/45 hover:shadow-gold"
              >
                <h3 className="font-display text-2xl font-bold text-white">{o.title}</h3>
                <p className="mt-2 min-h-[48px] text-[14px] leading-relaxed text-white/55">{o.for}</p>

                {price && (
                  <p className="mt-6 flex items-baseline gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">{t("from")}</span>
                    <span className="font-display text-4xl font-bold text-accent">{stripFrom(price.price)}</span>
                    {price.note && <span className="text-sm text-white/45">{price.note}</span>}
                  </p>
                )}

                <ul className="mt-6 space-y-3 border-t border-white/[0.07] pt-6">
                  {o.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-[14px] text-white/75">
                      <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                      {p}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/sherbimet/${o.slug}`}
                  className="mt-8 inline-flex w-fit items-center gap-2 border-b border-accent pb-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent transition-colors hover:text-accentLight"
                >
                  {o.cta} <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </article>
            );
          })}
        </div>

        <p className="mt-10 text-[14px] text-white/50">
          {t("calcPre")}{" "}
          <Link href="/cmimet" className="text-accent underline underline-offset-4 hover:text-accentLight">
            {t("calcCta")} →
          </Link>
        </p>
      </div>
    </section>
  );
}
