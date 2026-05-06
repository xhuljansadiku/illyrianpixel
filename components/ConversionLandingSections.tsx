"use client";

import Image from "next/image";
import Link from "next/link";
import ConversionTrustBar from "@/components/ConversionTrustBar";
import SectionMark from "@/components/SectionMark";
import type {
  ConversionLandingData,
  ConversionTextCardSection,
  WhyUsItem,
} from "@/lib/conversionLandingShared";
import { getPortfolioCardsFromSlugs } from "@/lib/conversionLandingShared";

function TextCardSection({ data }: { data: ConversionTextCardSection }) {
  return (
    <section
      id={data.anchorId}
      className="relative z-[1] scroll-mt-28 border-b border-white/[0.07]"
    >
      <div className="section-wrap py-20 md:py-28">
        <div className="svc-reveal-heading">
          <SectionMark label={data.eyebrow} eyebrowClassName="tracking-[0.22em]" />
          <h2 className="mt-1 max-w-[min(100%,52rem)] font-display text-[clamp(1.9rem,4vw,3.05rem)] leading-[1.05] tracking-[-0.02em] text-white">
            {data.headingBefore}{" "}
            <span className="text-[#D4AF37]">{data.headingAccent}</span>
          </h2>
          {data.intro ? (
            <p className="mt-5 max-w-[56ch] text-[14px] leading-relaxed text-white/56 md:text-[15px]">
              {data.intro}
            </p>
          ) : null}
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {data.items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/[0.08] bg-[linear-gradient(165deg,rgba(24,23,22,0.92),rgba(14,13,12,0.96))] p-6 transition-[border-color,box-shadow] duration-300 hover:border-[#D4AF37]/28 hover:shadow-[0_18px_44px_rgba(0,0,0,0.26)]"
            >
              <h3 className="font-display text-[1.05rem] tracking-[-0.015em] text-white md:text-[1.12rem]">
                {item.title}
              </h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-white/50 md:text-[14px]">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyIcon({ type }: { type: WhyUsItem["icon"] }) {
  const common = "h-6 w-6 text-[#D4AF37]";
  const minimal = `${common} opacity-[0.92]`;
  switch (type) {
    case "mFocus":
      return (
        <svg className={minimal} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 4v6M8 10h8" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
          <path d="M6 18c3-4 9-4 12 0" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case "mAudience":
      return (
        <svg className={minimal} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.15" opacity="0.35" />
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.15" opacity="0.55" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" />
        </svg>
      );
    case "mRoi":
      return (
        <svg className={minimal} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 16l5-5 4 4 6-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 8h3v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "mScale":
      return (
        <svg className={minimal} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 18V10M12 18v-6M18 18V6" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
          <path d="M4 18h16" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" opacity="0.45" />
        </svg>
      );
    case "bPsyche":
      return (
        <svg className={minimal} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.15" opacity="0.4" />
          <path
            d="M9.5 10.5c.8-1.2 2.2-1.2 3 0 .8 1.2 2.2 1.2 3 0M9 14h6"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "bStory":
      return (
        <svg className={minimal} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M7 5h8a2 2 0 012 2v11l-4-2-4 2V7a2 2 0 00-2-2z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          <path d="M9 9h4M9 12h6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.55" />
        </svg>
      );
    case "bTouch":
      return (
        <svg className={minimal} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="16" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="12" cy="16" r="2.2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M9.4 9.4l5.2 5.2M14.6 9.4L9.4 14.8" stroke="currentColor" strokeWidth="1.05" opacity="0.45" />
        </svg>
      );
    case "bEdge":
      return (
        <svg className={minimal} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 4l7 8-7 8-7-8 7-8z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M12 9v6" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" opacity="0.5" />
        </svg>
      );
    case "convert":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
          <path
            d="M8 14c1.2 1.5 3.2 2.5 5.5 2.5 1.2 0 2.3-.25 3.2-.7"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      );
    case "seo":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.4" />
          <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M8 11h6M11 8v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "speed":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "support":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
  }
}

export default function ConversionLandingSections(data: ConversionLandingData) {
  const portfolio = getPortfolioCardsFromSlugs(data.portfolioSlugs);

  return (
    <>
      {data.painSection ? <TextCardSection data={data.painSection} /> : null}
      {data.solutionSection ? <TextCardSection data={data.solutionSection} /> : null}
      {data.outcomesSection ? <TextCardSection data={data.outcomesSection} /> : null}
      {data.visualPowerSection ? <TextCardSection data={data.visualPowerSection} /> : null}

      <section id="strategji" className="relative z-[1] scroll-mt-28 border-b border-white/[0.07]">
        <div className="section-wrap py-20 md:py-28">
          <div className="svc-reveal-heading">
            <SectionMark
              label={data.whyUsEyebrow ?? "Pse ne"}
              eyebrowClassName="tracking-[0.22em]"
            />
            <h2 className="mt-1 max-w-[min(100%,52rem)] font-display text-[clamp(1.9rem,4vw,3.05rem)] leading-[1.05] tracking-[-0.02em] text-white">
              {data.whyUs.headingBefore}{" "}
              <span className="text-[#D4AF37]">{data.whyUs.headingAccent}</span>
            </h2>
            <p className="mt-5 max-w-[56ch] whitespace-pre-line text-[14px] leading-relaxed text-white/56 md:text-[15px]">
              {data.whyUs.intro}
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.whyUs.items.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-white/[0.08] bg-[linear-gradient(165deg,rgba(24,23,22,0.92),rgba(14,13,12,0.96))] p-6 transition-[border-color,transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#D4AF37]/32 hover:shadow-[0_22px_56px_rgba(212,175,55,0.1),0_20px_48px_rgba(0,0,0,0.28)]"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.1] bg-[#D4AF37]/[0.1] transition-colors duration-300 group-hover:border-[#D4AF37]/38"
                  style={{ boxShadow: "inset 0 1px 0 rgba(212,175,55,0.12)" }}
                >
                  <WhyIcon type={item.icon} />
                </div>
                <h3 className="mt-5 font-display text-[1.05rem] tracking-[-0.015em] text-white md:text-[1.12rem]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-white/50 md:text-[14px]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-label="Besim dhe përvojë"
        className="relative z-[1] border-b border-[#D4AF37]/15 bg-[linear-gradient(180deg,rgba(212,175,55,0.04)_0%,rgba(255,255,255,0.02)_42%,rgba(255,255,255,0.015)_100%)] shadow-[inset_0_1px_0_rgba(212,175,55,0.07)]"
      >
        <div className="section-wrap py-10 md:py-12">
          <ConversionTrustBar stats={data.trustStats} />
        </div>
      </section>

      <section className="relative z-[1] border-b border-white/[0.07]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
          <div className="noir-grid h-full w-full" />
        </div>
        <div className="section-wrap relative z-[1] py-20 md:py-28">
          <div className="svc-reveal-heading">
            <SectionMark label="Procesi" eyebrowClassName="tracking-[0.22em]" />
            <h2 className="mt-1 max-w-2xl font-display text-[clamp(1.9rem,4vw,3.05rem)] leading-[1.05] tracking-[-0.02em] text-white">
              {data.processHeadline ?? (
                <>
                  Katër hapa të qartë,{" "}
                  <span className="text-white/50">pa surpriza.</span>
                </>
              )}
            </h2>
          </div>

          <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {data.process.map((p) => (
              <li
                key={p.step}
                className="flex gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors duration-300 hover:border-accentLight/30 md:flex-col md:gap-3"
              >
                <span className="font-display text-[2rem] leading-none text-accentLight/70">{p.step}</span>
                <div>
                  <h3 className="font-display text-[1.05rem] tracking-[-0.015em] text-white">{p.title}</h3>
                  <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-white/48">{p.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative z-[1] border-b border-white/[0.07]">
        <div className="section-wrap py-20 md:py-28">
          <div className="svc-reveal-heading flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionMark label="Projekte" eyebrowClassName="tracking-[0.22em]" />
              <h2 className="mt-1 max-w-xl font-display text-[clamp(1.9rem,4vw,3.05rem)] leading-[1.05] tracking-[-0.02em] text-white">
                {"Rezultate reale"}
                <br />
                <span className="text-[#D4AF37]">{"për biznese reale."}</span>
              </h2>
            </div>
            <Link href="/projektet" className="luxury-link shrink-0 text-[12px]">
              Shiko të gjitha <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {portfolio.map((item) => {
              const blurb = data.portfolioBlurbs?.[item.slug] ?? item.blurb;
              return (
                <Link
                  key={item.slug}
                  href={`/projektet/${item.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[linear-gradient(165deg,rgba(22,22,22,0.94),rgba(12,12,12,0.97))] transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-1 hover:border-[#D4AF37]/30 hover:shadow-[0_20px_52px_rgba(0,0,0,0.36),0_0_0_1px_rgba(212,175,55,0.08)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d0c] via-[#0e0d0c]/20 to-transparent opacity-85" />

                    {/* ESM Group — screen glow overlay */}
                    {item.slug === "esm-group" && (
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(ellipse 60% 55% at 50% 58%, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.06) 45%, transparent 75%)",
                        }}
                      />
                    )}

                    {/* Bardhi Wellness — floating 'B' coin with slow Y-rotation */}
                    {item.slug === "bardhi-wellness" && (
                      <>
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background:
                              "radial-gradient(ellipse 55% 50% at 72% 32%, rgba(212,175,55,0.18) 0%, transparent 70%)",
                          }}
                        />
                        <div
                          aria-hidden
                          className="pointer-events-none absolute right-5 top-4 z-10"
                          style={{ perspective: "320px" }}
                        >
                          <div
                            className="portfolio-b-spin flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full border border-[rgba(212,175,55,0.38)] bg-[rgba(212,175,55,0.1)]"
                            style={{
                              boxShadow:
                                "0 0 18px rgba(212,175,55,0.5), 0 0 36px rgba(212,175,55,0.22), inset 0 1px 0 rgba(212,175,55,0.2)",
                            }}
                          >
                            <span
                              className="font-display text-[1.75rem] leading-none text-[#D4AF37]"
                              style={{ textShadow: "0 0 12px rgba(212,175,55,0.6)" }}
                            >
                              B
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-5 pt-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/80">{item.category}</p>
                    <h3 className="mt-1.5 font-display text-[1.2rem] tracking-[-0.02em] text-white transition-colors duration-300 group-hover:text-[#D4AF37]/90">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-white/52">{blurb}</p>
                    <span className="luxury-link-look mt-3 inline-flex items-center gap-1 text-[11px]">
                      Shiko projektin <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-[1] border-b border-white/[0.07]">
        <div className="section-wrap py-20 md:py-28">
          <div className="svc-reveal-heading">
            <SectionMark
              label={data.feedbackLabel ?? "Feedback"}
              eyebrowClassName="tracking-[0.22em]"
            />
            <h2 className="mt-1 max-w-2xl font-display text-[clamp(1.9rem,4vw,3.05rem)] leading-[1.05] tracking-[-0.02em] text-white">
              {data.feedbackHeadline ?? (
                <>
                  Çfarë thonë <span className="text-white/50">klientët.</span>
                </>
              )}
            </h2>
            {data.feedbackSubline && (
              <p className="mt-3 font-body text-[0.88rem] font-light tracking-[0.04em] text-white/38">
                {data.feedbackSubline}
              </p>
            )}
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {data.testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="flex flex-col rounded-2xl border border-white/[0.08] bg-[linear-gradient(165deg,rgba(22,22,22,0.94),rgba(14,14,14,0.97))] p-6 transition-[border-color,box-shadow] duration-300 hover:border-[#D4AF37]/22 hover:shadow-[0_18px_44px_rgba(0,0,0,0.28),0_0_0_1px_rgba(212,175,55,0.06),0_0_28px_rgba(212,175,55,0.04)]"
                style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}
              >
                {/* decorative open-quote mark */}
                <span
                  aria-hidden
                  className="mb-3 block font-display text-[2.6rem] leading-none text-[#D4AF37]/20 select-none"
                >
                  &ldquo;
                </span>
                <p className="flex-1 text-[14px] leading-[1.7] text-white/75">{t.quote}</p>
                <footer className="mt-5 border-t border-white/[0.06] pt-4">
                  <cite className="not-italic">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="font-display text-[15px] text-white/92">{t.name}</span>
                      <span className="text-[12px] text-white/38">·</span>
                      <span className="text-[12px] text-white/55">{t.role}</span>
                    </div>
                    {t.location && (
                      <span className="mt-2.5 inline-flex items-center rounded-full border border-[#D4AF37]/22 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.13em] text-[#D4AF37]/65">
                        {t.location}
                      </span>
                    )}
                  </cite>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
