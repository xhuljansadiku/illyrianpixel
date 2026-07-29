import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import BlogArticleLayout from "@/components/BlogArticleLayout";

type Props = { params: { locale: string } | Promise<{ locale: string }> };

const META: Record<Locale, { title: string; description: string; keywords: string[] }> = {
  sq: {
    title: "Sa kushton website profesional në Shqipëri 2026?",
    description:
      "Çmimet reale të website-ve në Shqipëri për 2026. Zbuloni sa kushton faqja profesionale, çfarë përfshin dhe si të shmangni gabimet e shtrenjta.",
    keywords: ["sa kushton website shqipëri 2026", "çmimi website shqipëri", "web design çmim", "agjenci web tiranë"],
  },
  en: {
    title: "How Much Does a Professional Website Cost in Albania in 2026?",
    description:
      "Real website pricing in Albania for 2026. Find out what a professional site costs, what it includes, and how to avoid costly mistakes.",
    keywords: ["website cost albania 2026", "website price albania", "web design price", "web agency tirana"],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  const m = META[locale as Locale] ?? META.sq;
  return buildMetadata(m.title, m.description, "/blog/sa-kushton-website-shqiperi", m.keywords);
}

export default async function Page({ params }: Props) {
  const { locale } = await Promise.resolve(params);

  if (locale === "en") {
    return (
      <BlogArticleLayout
        category="Web Design"
        categoryColor="rgba(234,206,113,0.95)"
        breadcrumbLabel="Website Cost?"
        path="/blog/sa-kushton-website-shqiperi"
        title="How Much Does a Professional Website Cost in Albania in 2026?"
        description={<>{"Real website pricing in Albania for 2026."}<br className="max-md:hidden" />{" Find out what a professional site costs, what it includes, and how to avoid costly mistakes."}</>}
        date="May 2026"
        readTime="6 min read"
        related={[
          { href: "/blog/sa-kushton-website-kosove", category: "Web Design", categoryColor: "rgba(234,206,113,0.95)", title: "How Much Does a Professional Website Cost in Kosovo in 2026?" },
          { href: "/blog/web-design-tirane", category: "Web Design", categoryColor: "rgba(234,206,113,0.95)", title: "Web Design Tirana: How to Choose a Professional Agency" },
        ]}
      >
        <p className="whitespace-pre-line text-[1.05rem] leading-relaxed text-white/72">
          {"This is the question every Albanian business owner asks sooner or later.\nAnd it usually gets different answers ranging from 300 euros to 5,000 euros with no logical explanation.\nThe Albanian web design market is unstructured: there are freelancers who build sites for 300 euros and agencies asking 3,000 euros for the same visual result."}
        </p>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Average website price in Albania by type
          </h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-[0.93rem]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04]">
                  <th className="px-4 py-3 text-left font-semibold text-white/80">Page type</th>
                  <th className="px-4 py-3 text-left font-semibold text-white/80">Average price</th>
                  <th className="px-4 py-3 text-left font-semibold text-white/80">What it includes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-white/65">
                <tr><td className="px-4 py-3">Presentation site (5–7 pages)</td><td className="px-4 py-3 text-accent">€400 – 800</td><td className="px-4 py-3">Design, basic SEO, 1 year hosting</td></tr>
                <tr><td className="px-4 py-3">Business website (10–20 pages)</td><td className="px-4 py-3 text-accent">€800 – 1,800</td><td className="px-4 py-3">CMS, blog, contact form</td></tr>
                <tr><td className="px-4 py-3">E-commerce (online store)</td><td className="px-4 py-3 text-accent">€1,200 – 4,000</td><td className="px-4 py-3">Products, payments, analytics</td></tr>
                <tr><td className="px-4 py-3">Landing page</td><td className="px-4 py-3 text-accent">€200 – 500</td><td className="px-4 py-3">1 page, optimized CTAs</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            What affects the price of a website
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">1. Design complexity.</strong>{"\nA site with custom design costs 2–3 times more than one built on a template. Original design requires real work hours."}</p>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">2. Technical features.</strong>{"\nOnline bookings, payment systems, CRM integrations. Every new feature adds development time."}</p>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">3. SEO and optimization.</strong>{"\nSites with good SEO are built differently: with precise structure, high speed, and optimized meta tags.\nThis takes extra time."}</p>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">4. Maintenance and hosting.</strong>{"\nGood hosting costs €100–300/year, monthly maintenance €50–200.\nWithout them, your site will slow down and run into security issues."}</p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            What to avoid when choosing a price
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">The freelancer with a very low price.</strong>{"\n€300–500 doesn't even cover the minimum time needed for quality work.\nYou'll usually get a modified template with no SEO and no optimization."}</p>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Contracts without specifications.</strong>{"\nIf the contract doesn't precisely list the pages, features, and deadline you'll get surprises with extra costs."}</p>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">&ldquo;Free&rdquo; hosting and domain.</strong>{"\nWhen someone offers you everything \"free,\" you'll pay for it with poor performance and limited control."}</p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            When is it worth investing more?
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
            {"If your business gets 60–70% of its customers online, your website is your main sales channel.\nAlbanian businesses that invest €1,200–3,000 in a professional website report an average return within 6–12 months.\n"}
            <Link href="/cmimet" className="text-accent underline underline-offset-4">See our full pricing</Link>
            {" or contact us for a quote based on your needs."}
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
      breadcrumbLabel="Sa kushton website?"
      path="/blog/sa-kushton-website-shqiperi"
      title="Sa kushton një website profesional në Shqipëri në 2026?"
      description={<>{"Çmimet reale të website-ve në Shqipëri për 2026."}<br className="max-md:hidden" />{" Zbuloni sa kushton faqja profesionale, çfarë përfshin dhe si të shmangni gabimet e shtrenjta."}</>}
      date="Maj 2026"
      readTime="6 min lexim"
      related={[
        { href: "/blog/sa-kushton-website-kosove", category: "Web Design", categoryColor: "rgba(234,206,113,0.95)", title: "Sa kushton një website profesional në Kosovë në 2026?" },
        { href: "/blog/web-design-tirane", category: "Web Design", categoryColor: "rgba(234,206,113,0.95)", title: "Web Design Tiranë: Si të zgjidhni agjenci profesionale" },
      ]}
    >
      <p className="whitespace-pre-line text-[1.05rem] leading-relaxed text-white/72">
        {"Kjo është pyetja që çdo biznesmen shqiptar e bën herët a vonë.\nDhe zakonisht merr përgjigje të ndryshme nga 300 euro te 5,000 euro pa asnjë shpjegim logjik.\nTregu shqiptar i web design-it është i pastrukturuar: ka freelancer që bëjnë faqe me 300 euro dhe agjenci që kërkojnë 3,000 euro për të njëjtin rezultat vizual."}
      </p>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Çmimi mesatar i website-ve në Shqipëri sipas llojit
        </h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-[0.93rem]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04]">
                <th className="px-4 py-3 text-left font-semibold text-white/80">Lloji i faqes</th>
                <th className="px-4 py-3 text-left font-semibold text-white/80">Çmimi mesatar</th>
                <th className="px-4 py-3 text-left font-semibold text-white/80">Çfarë përfshin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-white/65">
              <tr><td className="px-4 py-3">Faqe prezantuese (5–7 faqe)</td><td className="px-4 py-3 text-accent">400 – 800 €</td><td className="px-4 py-3">Dizajn, SEO bazë, hosting 1 vit</td></tr>
              <tr><td className="px-4 py-3">Website biznesi (10–20 faqe)</td><td className="px-4 py-3 text-accent">800 – 1,800 €</td><td className="px-4 py-3">CMS, blog, formular kontakti</td></tr>
              <tr><td className="px-4 py-3">E-commerce (dyqan online)</td><td className="px-4 py-3 text-accent">1,200 – 4,000 €</td><td className="px-4 py-3">Produkte, pagesa, analitikë</td></tr>
              <tr><td className="px-4 py-3">Landing page</td><td className="px-4 py-3 text-accent">200 – 500 €</td><td className="px-4 py-3">1 faqe, CTA të optimizuara</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Çfarë ndikon në çmimin e një website-i
        </h2>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">1. Kompleksiteti i dizajnit.</strong>{"\nNjë faqe me dizajn të personalizuar kushton 2–3 herë më shumë se një faqe e ndërtuar mbi template. Dizajni origjinal kërkon orë pune reale."}</p>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">2. Funksionet teknike.</strong>{"\nRezervimet online, sistemi i pagesave, integrimet me CRM çdo funksion i ri shton kohën e zhvillimit."}</p>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">3. SEO dhe optimizimi.</strong>{"\nFaqet me SEO të mirë ndërtohen ndryshe me strukturë të saktë, shpejtësi të lartë dhe meta të optimizuara.\nKjo kërkon kohë shtesë."}</p>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">4. Mirëmbajtja dhe hosting-u.</strong>{"\nHosting i mirë kushton 100–300 €/vit, mirëmbajtja mujore 50–200 €.\nPa to, faqja juaj do të ngadalësohet dhe do të ketë probleme sigurie."}</p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Çfarë të shmangni kur zgjidhni çmimin
        </h2>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Freelancer-i me çmim shumë të ulët.</strong>{"\n300–500 euro nuk mbulojnë as kohën minimale për punë cilësore.\nZakonisht merrni template të modifikuar pa SEO dhe pa optimizim."}</p>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Kontratat pa specifikime.</strong>{"\nNëse kontratat nuk listojnë saktë faqet, funksionet dhe afatin do të keni surpriza me kostot shtesë."}</p>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">&ldquo;Falas&rdquo; hosting dhe domain.</strong>{"\nKur dikush ju ofron gjithçka \"falas\", do ta paguani me performancë të dobët dhe kontroll të kufizuar."}</p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Kur ia vlen të investoni më shumë?
        </h2>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
          {"Nëse biznesi juaj merr 60–70% të klientëve nga interneti, faqja juaj është kanali kryesor i shitjeve.\nBizneset shqiptare që investojnë 1,200–3,000 euro në website profesional raportojnë kthim mesatar brenda 6–12 muajsh.\n"}
          <Link href="/cmimet" className="text-accent underline underline-offset-4">Shikoni çmimet tona të plota</Link>
          {" ose na kontaktoni për ofertë sipas nevojave tuaja."}
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
