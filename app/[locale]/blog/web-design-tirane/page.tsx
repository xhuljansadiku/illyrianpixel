import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import BlogArticleLayout from "@/components/BlogArticleLayout";

type Props = { params: { locale: string } | Promise<{ locale: string }> };

const META: Record<Locale, { title: string; description: string; keywords: string[] }> = {
  sq: {
    title: "Agjenci Web Tiranë: Si të Zgjidhni Web Design Profesional (2026)",
    description:
      "Si të zgjidhni agjenci web tiranë të besueshme. Kriteret, pyetjet e duhura dhe gabimet të shmangni para se të nënshkruani kontratën.",
    keywords: ["agjenci web tiranë", "web design tiranë", "agjenci web design shqipëri", "website professional tiranë"],
  },
  en: {
    title: "Web Design Tirana: How to Choose a Professional Agency",
    description:
      "How to choose the right web design agency in Tirana. The right criteria, the questions to ask, and the mistakes to avoid before signing the contract.",
    keywords: ["web design tirana", "web design agency albania", "professional website tirana", "web design albania"],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  const m = META[locale as Locale] ?? META.sq;
  return buildMetadata(m.title, m.description, "/blog/web-design-tirane", m.keywords);
}

export default async function Page({ params }: Props) {
  const { locale } = await Promise.resolve(params);

  if (locale === "en") {
    return (
      <BlogArticleLayout
        category="Web Design"
        categoryColor="rgba(234,206,113,0.95)"
        breadcrumbLabel="Web Design Tirana"
        path="/blog/web-design-tirane"
        title={<>Web Design Tirana<br />How to Choose a Professional Agency</>}
        description={<>{"How to tell a serious agency apart from amateurs."}<br className="max-md:hidden" />{" The right criteria, the questions to ask, and the warning signs before signing a contract."}</>}
        date="May 2026"
        readTime="6 min read"
        related={[
          { href: "/blog/sa-kushton-website-shqiperi", category: "Web Design", categoryColor: "rgba(234,206,113,0.95)", title: "How Much Does a Professional Website Cost in Albania in 2026?" },
          { href: "/blog/seo-tirane", category: "SEO", categoryColor: "rgba(167,243,208,0.9)", title: "SEO Tirana: How to Rank First on Google in 2026" },
        ]}
      >
        <p className="whitespace-pre-line text-[1.05rem] leading-relaxed text-white/72">
          {"Tirana has dozens of web design agencies and hundreds of freelancers.\nMost promise the same thing.\nOnly a few deliver results.\nHow do you tell a truly professional agency apart from one that just sells words?\nThis article gives you the right criteria before you sign any contract."}
        </p>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            What sets a professional agency apart from amateurs
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">A real portfolio, not templates.</strong>{"\nAsk for live URLs of projects.\nIf every site looks the same, they're probably working off the same template."}</p>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Price transparency.</strong>{"\nA serious agency gives you a detailed quote with a breakdown by component design, development, SEO, hosting."}</p>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">A structured process.</strong>{"\nProfessional projects are preceded by a planning and briefing phase.\nIf the agency starts designing without understanding your business that's not a good sign."}</p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            7 questions to ask every web design agency
          </h2>
          <ol className="space-y-3 text-[1.02rem] leading-relaxed text-white/68">
            <li><strong className="text-white">1.</strong> Can I see projects similar to my industry?</li>
            <li><strong className="text-white">2.</strong> Who will actually build the project? (some subcontract)</li>
            <li><strong className="text-white">3.</strong> What will the site look like in 2 years is it built with modern technology?</li>
            <li><strong className="text-white">4.</strong> What exactly does the SEO you offer include?</li>
            <li><strong className="text-white">5.</strong> Who owns the code and the domain after the project?</li>
            <li><strong className="text-white">6.</strong> How are changes handled after delivery are they free or paid?</li>
            <li><strong className="text-white">7.</strong> Can you show me references or testimonials from your clients?</li>
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Warning signs to walk away
          </h2>
          <ul className="space-y-2 text-[1.02rem] text-white/68">
            {[
              'They offer a website "within 3 days"',
              'They promise "first page of Google within a week"',
              "They have no contract or only a one-page contract",
              "They don't ask anything about your business before the quote",
              "The price changes during the process with no justification",
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
            What web design contracts should specify
          </h2>
          <ul className="space-y-2 text-[1.02rem] text-white/68">
            {[
              "The exact number of pages and features",
              "The delivery deadline with intermediate milestones",
              "The number of revisions included",
              "Ownership of the code, design, and domain",
              "Post-launch maintenance terms",
              "Total price and payment terms",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 text-accent">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-[1.02rem] leading-relaxed text-white/68">
            Discover how we build projects with full transparency and <Link href="/services/website" className="text-accent underline underline-offset-4">professional web design service</Link> with no surprises.
          </p>
        </section>

        <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 md:p-9">
          <p className="font-display text-[1.1rem] text-white">Want to discuss your project?</p>
          <p className="mt-2 text-[0.95rem] text-white/65">The first consultation is free, no obligation.</p>
          <Link href="/contact" className="interactive-button ip-cta-primary ip-cta-primary--lg mt-5 inline-flex">
            Contact us here →
          </Link>
        </div>
      </BlogArticleLayout>
    );
  }

  return (
    <BlogArticleLayout
      category="Web Design"
      categoryColor="rgba(234,206,113,0.95)"
      breadcrumbLabel="Web Design Tiranë"
      path="/blog/web-design-tirane"
      title={<>Web Design Tiranë<br />Si të zgjidhni agjenci profesionale</>}
      description={<>{"Si ta dalloni agjencinë serioze nga amatorët."}<br className="max-md:hidden" />{" Kriteret e sakta, pyetjet që duhet të bëni dhe shenjat paralajmëruese para nënshkrimit të kontratës."}</>}
      date="Maj 2026"
      readTime="6 min lexim"
      related={[
        { href: "/blog/sa-kushton-website-shqiperi", category: "Web Design", categoryColor: "rgba(234,206,113,0.95)", title: "Sa kushton një website profesional në Shqipëri në 2026?" },
        { href: "/blog/seo-tirane", category: "SEO", categoryColor: "rgba(167,243,208,0.9)", title: "SEO Tiranë: Si të dilni i pari në Google në 2026" },
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
