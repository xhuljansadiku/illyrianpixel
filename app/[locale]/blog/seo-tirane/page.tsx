import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import BlogArticleLayout from "@/components/BlogArticleLayout";

type Props = { params: { locale: string } | Promise<{ locale: string }> };

const META: Record<Locale, { title: string; description: string; keywords: string[] }> = {
  sq: {
    title: "SEO Tiranë: Si dilni i pari në Google 2026",
    description:
      "SEO profesional në Tiranë. Mësoni si bizneset shqiptare dalin në faqen e parë të Google dhe çfarë kërkon strategji SEO që funksionon.",
    keywords: ["seo tiranë", "seo shqipëri", "google ranking tiranë", "optimizim motorë kërkimi"],
  },
  en: {
    title: "SEO Tirana: How to Rank First on Google in 2026",
    description:
      "Professional SEO in Tirana. Learn how Albanian businesses reach the first page of Google and what an SEO strategy that actually works requires.",
    keywords: ["seo tirana", "seo albania", "google ranking tirana", "search engine optimization albania"],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  const m = META[locale as Locale] ?? META.sq;
  return buildMetadata(m.title, m.description, "/blog/seo-tirane", m.keywords);
}

export default async function Page({ params }: Props) {
  const { locale } = await Promise.resolve(params);

  if (locale === "en") {
    return (
      <BlogArticleLayout
        category="SEO"
        categoryColor="rgba(167,243,208,0.9)"
        breadcrumbLabel="SEO Tirana"
        path="/blog/seo-tirane"
        title="SEO Tirana: How to Rank First on Google in 2026"
        description="How Albanian businesses reach page one of Google and what an SEO strategy that delivers real results in the Albanian market requires."
        date="May 2026"
        readTime="7 min read"
        related={[
          { href: "/blog/google-ads-shqiperi", category: "Marketing", categoryColor: "rgba(252,211,77,0.9)", title: "Google Ads Albania: Real Prices and Expected Results" },
          { href: "/blog/sa-kushton-website-shqiperi", category: "Web Design", categoryColor: "rgba(234,206,113,0.95)", title: "How Much Does a Professional Website Cost in Albania in 2026?" },
        ]}
      >
        <p className="whitespace-pre-line text-[1.05rem] leading-relaxed text-white/72">
          {"If your business doesn't show up on the first page of Google when someone searches for your service in Tirana, that search goes to your competitor.\nSEO Tirana isn't a luxury it's the basic need of any business that wants customers from the internet.\nAnd in 2026, with the growth of online searches by Albanians, the opportunity is huge."}
        </p>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            What SEO is and why it matters for businesses in Tirana
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
            {"SEO (Search Engine Optimization) is the process of optimizing your site so it ranks high on Google when potential customers search for your service.\nUnlike paid ads, organic traffic from SEO has no cost per click."}
          </p>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
            {"Practical example: If you run a dental clinic and someone searches \"dentist Tirana\", you want to be the one who shows up first.\nEvery day without good SEO, you lose customers who are searching for exactly what you offer."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            How SEO works in the Albanian market in 2026
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Local keywords are true gold.</strong>{"\nAlbanians increasingly search in Albanian. \"Lawyer Tirana\", \"bakery Durrës\", \"web design Albania\" these searches have relatively low competition compared to Western markets."}</p>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Google My Business is mandatory.</strong>{"\nWithout photos, hours, reviews, and accurate categories, you're practically invisible for local searches."}</p>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Site speed matters critically.</strong>{"\nIf your site loads within 3 seconds, you're fine.\nIf not, Google ranks you lower regardless of content quality."}</p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            5 SEO steps that work in 2026
          </h2>
          <ol className="space-y-3 text-[1.02rem] leading-relaxed text-white/68">
            <li className="whitespace-pre-line"><strong className="text-white">1. Keyword research.</strong>{"\nBefore anything else, know what your customers are searching for not what you think they search for."}</li>
            <li className="whitespace-pre-line"><strong className="text-white">2. Technical page optimization.</strong>{"\nCore Web Vitals (LCP, FCP, CLS) are metrics Google measures directly."}</li>
            <li className="whitespace-pre-line"><strong className="text-white">3. Optimized content.</strong>{"\nBlog articles, service pages, FAQs every page needs a clear SEO purpose."}</li>
            <li className="whitespace-pre-line"><strong className="text-white">4. Local link building.</strong>{"\nLinks from Albanian directories and local media increase your site's authority."}</li>
            <li className="whitespace-pre-line"><strong className="text-white">5. Local SEO and citations.</strong>{"\nYour name, address, and phone number must be identical across every platform."}</li>
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            How long does it take to see SEO results?
          </h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-[0.93rem]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04]">
                  <th className="px-4 py-3 text-left font-semibold text-white/80">Period</th>
                  <th className="px-4 py-3 text-left font-semibold text-white/80">What to expect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-white/65">
                <tr><td className="px-4 py-3">3–4 months</td><td className="px-4 py-3">First ranking movements</td></tr>
                <tr><td className="px-4 py-3">6 months</td><td className="px-4 py-3">Organic traffic grows 30–50%</td></tr>
                <tr><td className="px-4 py-3">12 months</td><td className="px-4 py-3">Consolidated, stable results</td></tr>
              </tbody>
            </table>
          </div>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
            {"SEO is a long-term investment businesses that invest today will dominate the Albanian digital market in the years ahead.\n"}
            <Link href="/services/seo-google-ads" className="text-accent underline underline-offset-4">Discover how we can help you with SEO and Google Ads</Link>{"."}</p>
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
      category="SEO"
      categoryColor="rgba(167,243,208,0.9)"
      breadcrumbLabel="SEO Tiranë"
      path="/blog/seo-tirane"
      title="SEO Tiranë: Si të dilni i pari në Google në 2026"
      description="Si bizneset shqiptare dalin në faqen e parë të Google dhe çfarë kërkon strategji SEO që jep rezultate reale në tregun shqiptar."
      date="Maj 2026"
      readTime="7 min lexim"
      related={[
        { href: "/blog/google-ads-shqiperi", category: "Marketing", categoryColor: "rgba(252,211,77,0.9)", title: "Google Ads Shqipëri: Çmime reale dhe rezultate të pritshme" },
        { href: "/blog/sa-kushton-website-shqiperi", category: "Web Design", categoryColor: "rgba(234,206,113,0.95)", title: "Sa kushton një website profesional në Shqipëri në 2026?" },
      ]}
    >
      <p className="whitespace-pre-line text-[1.05rem] leading-relaxed text-white/72">
        {"Nëse biznesi juaj nuk shfaqet në faqen e parë të Google kur dikush kërkon shërbimin tuaj në Tiranë, ai kërkim shkon tek konkurrenti juaj.\nSEO Tiranë nuk është luks është nevoja bazë e çdo biznesi që dëshiron klientë nga interneti.\nDhe në 2026, me rritjen e kërkimeve online nga shqiptarët, mundësia është e madhe."}
      </p>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Çfarë është SEO dhe pse ka rëndësi për bizneset në Tiranë
        </h2>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
          {"SEO (Search Engine Optimization) është procesi i optimizimit të faqes suaj që të shfaqet lart në Google kur klientët potencialë kërkojnë shërbimin tuaj.\nNdryshe nga reklamat e paguara, trafiku organik nga SEO nuk ka kosto për klikim."}
        </p>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
          {"Shembull praktik: Nëse keni klinikë dentare dhe dikush kërkon \"dentist Tiranë\", doni të jeni ju që shfaqeni i pari.\nÇdo ditë pa SEO të mirë, humbni klientë që po kërkojnë saktësisht atë që ofroni."}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Si funksionon SEO në tregun shqiptar 2026
        </h2>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Fjalët kyçe lokale janë ari i vërtetë.</strong>{"\nShqiptarët kërkojnë gjithnjë e më shumë në gjuhën shqipe. \"Avokat Tiranë\", \"bukëpjekës Durrës\", \"web design Shqipëri\" këto kërkime kanë konkurrencë relativisht të ulët krahasuar me tregjet perëndimore."}</p>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Google My Business është i detyrueshëm.</strong>{"\nPa foto, orare, reviews dhe kategori të sakta jeni praktikisht të padukshëm për kërkimet lokale."}</p>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Shpejtësia e faqes ka rëndësi kritike.</strong>{"\nNëse faqja juaj hapet brenda 3 sekondave, jeni mirë.\nNëse jo, Google ju ul në renditje pavarësisht cilësisë së përmbajtjes."}</p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          5 hapat e SEO-it që funksionojnë në 2026
        </h2>
        <ol className="space-y-3 text-[1.02rem] leading-relaxed text-white/68">
          <li className="whitespace-pre-line"><strong className="text-white">1. Hulumtimi i fjalëve kyçe.</strong>{"\nPara gjithçkaje, dini çfarë kërkojnë klientët tuaj jo çfarë mendoni ju."}</li>
          <li className="whitespace-pre-line"><strong className="text-white">2. Optimizimi teknik i faqes.</strong>{"\nCore Web Vitals (LCP, FCP, CLS) janë metrika që Google mat drejtpërdrejt."}</li>
          <li className="whitespace-pre-line"><strong className="text-white">3. Përmbajtje e optimizuar.</strong>{"\nArtikujt e blogut, faqet e shërbimeve, FAQ çdo faqe duhet të ketë qëllim të qartë SEO."}</li>
          <li className="whitespace-pre-line"><strong className="text-white">4. Link building lokal.</strong>{"\nLidhjet nga direktoritë shqiptare dhe media lokale rrisin autoritetin e faqes suaj."}</li>
          <li className="whitespace-pre-line"><strong className="text-white">5. SEO lokale dhe citations.</strong>{"\nEmri, adresa dhe numri i telefonit duhet të jenë identikë në çdo platformë."}</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Sa kohë duhet për rezultate SEO?
        </h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-[0.93rem]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04]">
                <th className="px-4 py-3 text-left font-semibold text-white/80">Periudha</th>
                <th className="px-4 py-3 text-left font-semibold text-white/80">Çfarë prisni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-white/65">
              <tr><td className="px-4 py-3">3–4 muaj</td><td className="px-4 py-3">Lëvizje të para në renditje</td></tr>
              <tr><td className="px-4 py-3">6 muaj</td><td className="px-4 py-3">Trafiku organik rritet 30–50%</td></tr>
              <tr><td className="px-4 py-3">12 muaj</td><td className="px-4 py-3">Rezultate të konsoliduara dhe të qëndrueshme</td></tr>
            </tbody>
          </table>
        </div>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
          {"SEO është investim afatgjatë bizneset që investojnë sot do të dominojnë tregun digital shqiptar në vitet e ardhshme.\n"}
          <Link href="/services/seo-google-ads" className="text-accent underline underline-offset-4">Zbuloni si mund t&apos;ju ndihmojmë me SEO dhe Google Ads</Link>{"."}</p>
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
