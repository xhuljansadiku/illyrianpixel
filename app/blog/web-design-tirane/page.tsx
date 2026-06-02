import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import BlogArticleLayout from "@/components/BlogArticleLayout";

export const metadata: Metadata = buildMetadata(
  "Web Design Tiranë — Si zgjidhni agjencinë profesionale",
  "Si të zgjidhni agjencinë e duhur të web design në Tiranë. Kriteret, pyetjet e duhura dhe gabimet të shmangni para se të nënshkruani kontratën.",
  "/blog/web-design-tirane",
  ["web design tiranë", "agjenci web design shqipëri", "website professional tiranë", "dizajn web shqipëri"]
);

export default function Page() {
  return (
    <BlogArticleLayout
      category="Web Design"
      categoryColor="rgba(234,206,113,0.95)"
      breadcrumbLabel="Web Design Tiranë"
      path="/blog/web-design-tirane"
      title={<>Web Design Tiranë<br />— Si të zgjidhni agjenci profesionale</>}
      description={<>{"Si ta dalloni agjencinë serioze nga amatorët."}<br className="max-md:hidden" />{" Kriteret e sakta, pyetjet që duhet të bëni dhe shenjat paralajmëruese para nënshkrimit të kontratës."}</>}
      date="Maj 2026"
      readTime="6 min lexim"
      related={[
        { href: "/blog/sa-kushton-website-shqiperi", category: "Web Design", categoryColor: "rgba(234,206,113,0.95)", title: "Sa kushton një website profesional në Shqipëri në 2026?" },
        { href: "/blog/seo-tirane", category: "SEO", categoryColor: "rgba(167,243,208,0.9)", title: "SEO Tiranë — Si të dilni i pari në Google në 2026" },
      ]}
    >
      <p className="whitespace-pre-line text-[1.05rem] leading-relaxed text-white/72">
        {"Tirana ka dhjetëra agjenci web design dhe qindra freelancer-ë.\nShumica premtojnë të njëjtën gjë.\nVetëm pak japin rezultate.\nSi e dalloni agjencinë e vërtetë profesionale nga ajo që shet fjalë?\nKy artikull ju jep kriteret e sakta para se të nënshkruani ndonjë kontratë."}
      </p>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Çfarë e dallon agjencinë profesionale nga amatorët
        </h2>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Portfolio i vërtetë, jo template.</strong>{"\nKërkojini URL-të aktive të projekteve.\nNëse të gjitha faqet duken njëlloj, ndoshta punojnë me të njëjtin template."}</p>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Transparencë në çmim.</strong>{"\nAgjencia serioze ju jep ofertë të detajuar me breakdown sipas komponentëve dizajn, zhvillim, SEO, hosting."}</p>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Proces i strukturuar.</strong>{"\nProjekteve profesionale u paraprin faza e planifikimit dhe briefing-ut.\nNëse agjencia fillon të dizajnoj pa kuptuar biznesin tuaj kjo nuk është shenjë e mirë."}</p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          7 pyetje që duhet t&apos;i bëni çdo agjencie web design
        </h2>
        <ol className="space-y-3 text-[1.02rem] leading-relaxed text-white/68">
          <li><strong className="text-white">1.</strong> Mund të shoh projekte të ngjashme me industrinë time?</li>
          <li><strong className="text-white">2.</strong> Kush do ta bëjë realisht projektin? (disa nënkontraktojnë)</li>
          <li><strong className="text-white">3.</strong> Si do të duket faqja pas 2 vitesh a ndërtohet me teknologji moderne?</li>
          <li><strong className="text-white">4.</strong> Çfarë saktësisht përfshin SEO-i që ofrojnë?</li>
          <li><strong className="text-white">5.</strong> Kush zotëron kodin dhe domain-in pas projektit?</li>
          <li><strong className="text-white">6.</strong> Si menaxhohen ndryshimet pas dorëzimit janë falas apo paguhen?</li>
          <li><strong className="text-white">7.</strong> A mund të më tregoni referenca ose dëshmi nga klientët tuaj?</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Shenjat paralajmëruese kur të largoheni
        </h2>
        <ul className="space-y-2 text-[1.02rem] text-white/68">
          {[
            'Ofrojnë website "brenda 3 ditësh"',
            'Premtojnë "faqe e parë e Google brenda javës"',
            "Nuk kanë kontratë ose kanë kontratë njëfaqëshe",
            "Nuk pyesin asgjë për biznesin tuaj para ofertës",
            "Çmimi ndryshon gjatë procesit pa justifikim",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 text-red-400">⚠</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Çfarë duhet të specifikojë kontratat e web design
        </h2>
        <ul className="space-y-2 text-[1.02rem] text-white/68">
          {[
            "Numrin e faqeve dhe funksionet e sakta",
            "Afatin e dorëzimit me milestones të ndërmjetme",
            "Sasi ndryshimesh të përfshira",
            "Pronësinë e kodit, dizajnit dhe domain-it",
            "Kushtet e mirëmbajtjes pas lansimit",
            "Çmimin total dhe modalitetin e pagesës",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 text-accent">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-[1.02rem] leading-relaxed text-white/68">
          Zbuloni si ndërtojmë ne projektet me transparencë të plotë dhe <Link href="/services/website" className="text-accent underline underline-offset-4">shërbim profesional web design</Link> pa surpriza.
        </p>
      </section>

      <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 md:p-9">
        <p className="font-display text-[1.1rem] text-white">Doni të diskutoni projektin tuaj?</p>
        <p className="mt-2 text-[0.95rem] text-white/65">Konsultimi i parë është falas pa asnjë obligim.</p>
        <Link href="/contact" className="interactive-button ip-cta-primary ip-cta-primary--lg mt-5 inline-flex">
          Na kontaktoni këtu →
        </Link>
      </div>
    </BlogArticleLayout>
  );
}
