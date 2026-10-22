"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ensureGSAP, useIsomorphicLayoutEffect, useReducedMotion } from "@/lib/gsap";
import SectionMark from "@/components/SectionMark";

export type TestimonialItem = {
  quote: string;
  name: string;
  company: string | null;
  result: string | null;
  logo: string | null;
  category?: string | null;
};

// Q-09 (2026-10-22): citate statike pa klientë realë me leje → jashtë përdorimit, të ruajtura këtu.
/*
const quotes: TestimonialItem[] = [
  {
    quote: "Para, çdo gjë ua shpjegonim në telefon nga fillimi. Tani klientët vijnë të informuar dhe e dinë çfarë duan. Na ka kursyer shumë kohë.",
    name: "Mariglent S.",
    company: "ESM Group",
    result: "Milano, Itali",
    logo: "/images/logos/esm-group.png"
  },
  {
    quote: "Më parë njerëzit na bënin pafund pyetje për programet. Tani paketat janë të qarta, klientët vendosin vetë dhe na shkruajnë gati për të filluar.",
    name: "Bardhi U.",
    company: "Bardhi Wellness",
    result: "Prishtinë & Köln",
    logo: "/images/logos/bardhi-wellness.png"
  },
  {
    quote: "Bënim punë të mirë, por pa website nuk na merrnin seriozisht. Tani klientët gjermanë na gjejnë dhe kërkesat vijnë të sakta, pa telefonata të kota.",
    name: "Amir S.",
    company: "Hauswerk Niederbayern",
    result: "Straubing, Gjermani",
    logo: "/images/logos/hauswerk-niederbayern.png"
  },
  {
    quote: "Humbnim kohë me telefonata që s'përfundonin kurrë në punë. Me website-in dhe Google Ads, tani na shkruajnë njerëz që e dinë çfarë duan.",
    name: "Vehbi P.",
    company: "Palushi Brothers",
    result: "Londër, Angli",
    logo: "/images/logos/palushi-brothers.webp"
  }
];

const quotesEn: TestimonialItem[] = [
  {
    quote: "We used to explain everything over the phone from scratch. Now clients arrive informed and know what they want. It's saved us so much time.",
    name: "Mariglent S.",
    company: "ESM Group",
    result: "Milan, Italy",
    logo: "/images/logos/esm-group.png"
  },
  {
    quote: "People used to send us endless questions about the programs. Now the packages are clear, clients decide on their own and message us ready to start.",
    name: "Bardhi U.",
    company: "Bardhi Wellness",
    result: "Pristina & Cologne",
    logo: "/images/logos/bardhi-wellness.png"
  },
  {
    quote: "We did good work, but without a website nobody took us seriously. Now German clients find us and the inquiries come in clear, with no wasted calls.",
    name: "Amir S.",
    company: "Hauswerk Niederbayern",
    result: "Straubing, Germany",
    logo: "/images/logos/hauswerk-niederbayern.png"
  },
  {
    quote: "We used to waste time on calls that never turned into jobs. With the website and Google Ads, the people who contact us now know exactly what they want.",
    name: "Vehbi P.",
    company: "Palushi Brothers",
    result: "London, UK",
    logo: "/images/logos/palushi-brothers.webp"
  }
];
*/

export default function Testimonials({ items }: { items?: TestimonialItem[] }) {
  const t = useTranslations("home.testimonials");
  // Items vijnë nga admini tashmë të lokalizuara (getVisibleTestimonials(locale)).
  // Q-09 (2026-10-22): citatet statike s'janë dëshmi reale → s'përdoren më si rezervë.
  // const fallback = locale === "en" ? quotesEn : quotes;
  // const list = items && items.length > 0 ? items : fallback;
  const list = items ?? [];
  const hasCategories = list.some((item) => "category" in item && item.category);

  // Track-u horizontal punon mbi një listë të sheshtë — kategoria (nëse ka)
  // shfaqet si chip mbi çdo kartë në vend të grupimit vertikal.
  const cards = list.map((item) => ({
    ...item,
    categoryLabel: hasCategories ? item.category || t("otherCategory") : null,
  }));

  const sectionRef = useRef<HTMLElement | null>(null);
  const trackWrapRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const { gsap } = ensureGSAP();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-reveal",
        { opacity: 0, y: 24, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }
        }
      );

      // Desktop: seksioni pinohet dhe kartat rrëshqasin horizontalisht me scroll.
      // Mobile / prefers-reduced-motion: stack vertikal klasik, pa pin.
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      if (reducedMotion || !isDesktop || !trackRef.current || !trackWrapRef.current) return;

      const getDistance = () =>
        Math.max(0, trackRef.current!.scrollWidth - trackWrapRef.current!.clientWidth);
      if (getDistance() < 60) return;

      gsap.to(trackRef.current, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) gsap.set(progressRef.current, { scaleX: self.progress });
          },
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion, cards.length]);

  return (
    <section id="testimonials" ref={sectionRef} className="cinematic-section section-tone-about lg:overflow-hidden">
      <div className="section-wrap">
        <div className="testimonial-reveal">
          <SectionMark label={t("eyebrow")} />
        </div>
        <h2 className="testimonial-reveal section-title mt-3 max-w-4xl">{t("headline")}</h2>
        <p className="testimonial-reveal mt-4 max-w-[480px] font-body text-[0.94rem] font-light leading-relaxed tracking-[0.02em] text-white/45">{t("intro")}</p>

        <div ref={trackWrapRef} className="mt-10 lg:mt-12 lg:overflow-hidden">
          <div ref={trackRef} className="flex flex-col gap-6 lg:w-max lg:flex-row lg:flex-nowrap lg:gap-7 lg:pr-[10vw]">
            {cards.map((item, idx) => (
              <article
                key={`${item.name}-${idx}`}
                className="testimonial-reveal relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-7 md:p-9 lg:w-[560px] lg:shrink-0"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="pointer-events-none font-display text-6xl leading-none text-accent/20" aria-hidden>
                      &ldquo;
                    </span>
                    {item.categoryLabel && (
                      <span className="rounded-full border border-white/10 px-2.5 py-1 font-ui text-[10px] font-semibold uppercase tracking-[0.15em] text-white/45">
                        {item.categoryLabel}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-[1.05rem] leading-relaxed text-white/84 md:text-[1.15rem]">
                    {item.quote}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5 text-sm text-white/62">
                  {item.logo && (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5">
                      <Image
                        src={item.logo}
                        alt={item.company ?? item.name}
                        width={36}
                        height={36}
                        className="h-full w-full object-contain p-1"
                      />
                    </span>
                  )}
                  <span className="text-white/88">{item.name}</span>
                  {item.company && (
                    <>
                      <span>•</span>
                      <span>{item.company}</span>
                    </>
                  )}
                  {item.result && (
                    <span className="rounded-full border border-accent/30 px-2 py-0.5 text-accent/85">{item.result}</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Progres i rrëshqitjes horizontale — vetëm desktop */}
        <div className="mt-8 hidden lg:block" aria-hidden>
          <span className="block h-px w-full bg-white/10">
            <span ref={progressRef} className="block h-px w-full origin-left scale-x-0 bg-accent" />
          </span>
        </div>
      </div>
    </section>
  );
}
