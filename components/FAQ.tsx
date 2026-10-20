"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import SectionMark from "@/components/SectionMark";
import { buildFaqSchema, jsonLd } from "@/lib/seo";

export type FaqItem = { q: string; a: string; category?: string | null };

// Fallback nëse tabela faqs në DB është bosh / e paarritshme
const defaultFaqsSq: FaqItem[] = [
  {
    q: "Sa zgjat ndërtimi i një website?",
    a: "Mesatarisht 2–4 javë, varësisht kompleksitetit dhe sasisë së përmbajtjes.\nProjektet me funksione të avancuara mund të zgjasin deri në 6 javë.\nNë fazën e planifikimit ju japim një afat të saktë."
  },
  {
    q: "A përfshihet SEO?",
    a: "Po, çdo website që ndërtojmë vjen me SEO bazë të instaluar: strukturë e saktë, faqe të shpejta dhe meta të optimizuara. SEO i avancuar dhe strategjia e përmbajtjes është shërbim i veçantë."
  },
  {
    q: "A ofroni mirëmbajtje pas publikimit?",
    a: "Po, ofrojmë paketa mirëmbajtjeje mujore që përfshijnë përditësime, monitorim sigurie dhe ndryshime të vogla.\nNuk ju lëmë vetëm pas lansimit."
  },
  {
    q: "A punoni me klientë ndërkombëtarë?",
    a: "Po, kemi klientë në Gjermani, Itali, Angli, Suedi dhe SHBA, si edhe në Shqipëri e Kosovë.\nKomunikojmë në shqip, anglisht, gjermanisht dhe kroatisht.\nTakimet bëhen online, procesi është i njëjtë për të gjithë."
  },
  {
    q: "Si funksionon pagesa?",
    a: "Për projektet deri në €1,000: 50% paradhënie për të nisur punën dhe 50% para publikimit.\nMbi €1,000: 3 këste, 40% në fillim, 30% kur aprovoni dizajnin dhe 30% para lansimit."
  },
  {
    q: "Po sikur të mos më pëlqejë dizajni?",
    a: "Nëse dizajni i parë nuk ju pëlqen pas 2 raundesh ndryshimesh, ju kthejmë paradhënien 100%. Pa pyetje."
  },
  {
    q: "Çfarë kam nevojë të përgatis para fillimit?",
    a: "Mjafton të na tregoni çfarë bën biznesi juaj, kë synoni të arrini dhe çfarë nuk ju pëlqen tek prezenca juaj aktuale.\nPër pjesën tjetër kujdesemi ne, struktura, tekstet dhe dizajni."
  }
];

const defaultFaqsEn: FaqItem[] = [
  {
    q: "How long does building a website take?",
    a: "On average 2–4 weeks, depending on complexity and amount of content.\nProjects with advanced features can take up to 6 weeks.\nWe give you an exact timeline during the planning phase."
  },
  {
    q: "Is SEO included?",
    a: "Yes, every website we build comes with baseline SEO installed: correct structure, fast pages and optimized meta tags. Advanced SEO and content strategy is a separate service."
  },
  {
    q: "Do you offer maintenance after launch?",
    a: "Yes, we offer monthly maintenance packages that include updates, security monitoring and small changes.\nWe don't leave you on your own after launch."
  },
  {
    q: "Do you work with international clients?",
    a: "Yes, we have clients in Germany, Italy, England, Sweden and the US, as well as in Albania and Kosovo.\nWe communicate in Albanian, English, German and Croatian.\nMeetings happen online, the process is the same for everyone."
  },
  {
    q: "How does payment work?",
    a: "For projects up to €1,000: 50% upfront to start work and 50% before launch.\nAbove €1,000: 3 instalments, 40% at the start, 30% when you approve the design and 30% before launch."
  },
  {
    q: "What if I don't like the design?",
    a: "If you don't like the first design after 2 rounds of changes, we refund your deposit in full. No questions asked."
  },
  {
    q: "What do I need to prepare before we start?",
    a: "Just tell us what your business does, who you're targeting and what you don't like about your current presence.\nWe take care of the rest: structure, copy and design."
  }
];

export default function FAQ({ items }: { items?: FaqItem[] }) {
  const t = useTranslations("home.faq");
  const locale = useLocale();
  const [open, setOpen] = useState(0);
  const faqs = items && items.length > 0 ? items : locale === "en" ? defaultFaqsEn : defaultFaqsSq;
  const hasCategories = faqs.some((f) => "category" in f && f.category);

  const groups: { category: string | null; items: FaqItem[] }[] = [];
  if (hasCategories) {
    const map = new Map<string, FaqItem[]>();
    for (const f of faqs) {
      const key = f.category || t("otherCategory");
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(f);
    }
    for (const [category, groupItems] of map) groups.push({ category, items: groupItems });
  } else {
    groups.push({ category: null, items: faqs });
  }

  let runningIndex = 0;

  return (
    <section id="faq" className="cinematic-section section-tone-about">
      {/* Skema FAQ për Google — nga e njëjta listë që shfaqet (2026-10-20) */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLd(buildFaqSchema(faqs)) }}
      />
      <div className="section-wrap">
        <SectionMark label={t("eyebrow")} />
        <h2 className="section-title mt-3 max-w-4xl">{t("headline")}</h2>
        <div className="mt-8 max-w-4xl space-y-8">
          {groups.map((group) => (
            <div key={group.category ?? "all"}>
              {group.category && (
                <p className="ip-eyebrow mb-2">{group.category}</p>
              )}
              <div className="divide-y divide-white/10 border-y border-white/10">
                {group.items.map((item) => {
                  const idx = runningIndex++;
                  return (
                    <div key={item.q} className="py-4">
                      <button onClick={() => setOpen((prev) => (prev === idx ? -1 : idx))} className="flex w-full items-center justify-between text-left">
                        <span className="font-display text-[1.5rem] leading-tight text-white/92 md:text-[1.9rem]">{item.q}</span>
                        <span className="text-accent/85">{open === idx ? "−" : "+"}</span>
                      </button>
                      <div className={`grid transition-all duration-300 ${open === idx ? "grid-rows-[1fr] opacity-100 pt-3" : "grid-rows-[0fr] opacity-0"}`}>
                        <p className="overflow-hidden md:whitespace-pre-line text-sm leading-relaxed text-white/70 md:text-base">{item.a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
