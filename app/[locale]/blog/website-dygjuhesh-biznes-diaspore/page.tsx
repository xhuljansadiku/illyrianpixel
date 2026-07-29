import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { buildMetadata, buildBreadcrumb, seo } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import BlogArticleLayout from "@/components/BlogArticleLayout";

type Props = { params: { locale: string } | Promise<{ locale: string }> };

const SLUG = "website-dygjuhesh-biznes-diaspore";
const CATEGORY_COLOR = "rgba(125,211,252,0.9)";

const META: Record<Locale, { title: string; description: string; keywords: string[] }> = {
  sq: {
    title: "Website Dygjuhësh për Biznesin Shqiptar në Diasporë",
    description:
      "Pse çdo biznes i hapur nga shqiptarë në Gjermani, Zvicër apo SHBA ka nevojë për website dygjuhësh që flet të dyja audiencat.",
    keywords: ["website dygjuhësh shqip gjermanisht", "biznes shqiptar gjermani", "website biznesi diasporë", "përkthim website shqip"],
  },
  en: {
    title: "Bilingual Websites for Albanian Diaspora Businesses",
    description:
      "Why every business started by Albanians in Germany, Switzerland or the US needs a bilingual website that speaks to both audiences.",
    keywords: ["bilingual website albanian german", "albanian business germany", "diaspora business website", "albanian english website"],
  },
};

function articleSchema(locale: Locale) {
  const m = META[locale];
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: m.title,
    description: m.description,
    author: { "@type": "Organization", name: "Illyrian Pixel" },
    publisher: { "@type": "Organization", name: "Illyrian Pixel" },
    datePublished: "2026-07-25",
    mainEntityOfPage: `${seo.siteUrl}${locale === "en" ? "/en" : ""}/blog/${SLUG}`,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  const m = META[(locale as Locale) in META ? (locale as Locale) : "sq"];
  return buildMetadata(m.title, m.description, `/blog/${SLUG}`, m.keywords, locale as Locale);
}

export default async function Page({ params }: Props) {
  const { locale } = await Promise.resolve(params);
  const breadcrumbSchema = buildBreadcrumb([
    { name: "Home", url: seo.siteUrl },
    { name: "Blog", url: `${seo.siteUrl}/blog` },
    { name: META[locale as Locale]?.title ?? META.sq.title, url: `${seo.siteUrl}/blog/${SLUG}` },
  ]);

  if (locale === "en") {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema("en")) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <BlogArticleLayout
          category="Diaspora"
          categoryColor={CATEGORY_COLOR}
          breadcrumbLabel="Bilingual Websites for Diaspora Businesses"
          path={`/blog/${SLUG}`}
          title="A bilingual website (Albanian + local language): why every diaspora Albanian business needs one"
          description="How to build a site that speaks both languages without splitting your credibility."
          date="July 2026"
          readTime="6 min read"
          related={[
            { href: "/blog/menaxho-biznesin-nga-diaspora", category: "Diaspora", categoryColor: CATEGORY_COLOR, title: "I run a business in Albania or Kosovo but live abroad: how to manage it online" },
            { href: "/blog/si-te-gjejne-klientet-shqiptare-biznesin-tend", category: "Diaspora", categoryColor: CATEGORY_COLOR, title: "How Albanian customers find your business online, wherever they are" },
          ]}
        >
          <p className="whitespace-pre-line text-[1.05rem] leading-relaxed text-white/72">
            {"If you started a business in Germany, Switzerland, Austria or the US, you actually have two audiences at once: local customers/partners who expect a professional website in their own language, and the Albanian community, customers, employees, subcontractors, who find you and trust you faster when the site speaks Albanian too."}
          </p>

          <section className="space-y-4">
            <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
              Picking one language costs you half the opportunity
            </h2>
            <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
              {"Many Albanian diaspora businesses choose only one language and lose half the opportunity.\nA construction company in Germany with a German-only website struggles to attract Albanian workers or subcontractors who know the quality of Albanian craftsmanship but prefer to communicate in their own language.\nThe reverse is also true: an Albanian-only website loses credibility with German customers who expect a professional local standard."}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
              Real translation, not a &quot;Google Translate&quot; widget
            </h2>
            <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
              {"The right solution isn't a translate widget bolted on top of the page automatic translations are obvious and lower trust instantly.\nThe right solution is real bilingual structure: every page translated by a person, separate URLs for each language (e.g. domain.com and domain.com/en), and a clear signal to Google (hreflang) about which page serves which visitor."}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
              A pattern we&apos;ve built before
            </h2>
            <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
              {"We've built exactly this for clients like Hauswerk Niederbayern (a construction company in Straubing, Germany) and Suli Group Trockenbau businesses founded by Albanians operating in the German market but with an Albanian team and contact network.\nA bilingual website gave them more accurate inquiries from both sides, without wasting time on calls just to clarify the language."}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
              What this looks like in practice
            </h2>
            <ul className="space-y-3 text-[1.02rem] leading-relaxed text-white/68">
              <li className="whitespace-pre-line">{"Homepage and services fully translated not just the headings."}</li>
              <li className="whitespace-pre-line">{"A phone/WhatsApp number that works for both audiences."}</li>
              <li className="whitespace-pre-line">{"Prices shown in the right currency for each market (EUR for Germany/Switzerland, CHF added if you're in Switzerland)."}</li>
              <li className="whitespace-pre-line">{"Proof of work / portfolio shown in both languages."}</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
              The SEO upside is real, not theoretical
            </h2>
            <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
              {"Google indexes each language separately, which means you rank simultaneously for German/English searches (from local customers) and Albanian searches (from the community and families searching for \"Albanian construction company Germany\" or similar).\nA single-language website shuts off half of that traffic from the start."}
            </p>
          </section>

          <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 md:p-9">
            <p className="font-display text-[1.1rem] text-white">Still running a single-language website in the diaspora?</p>
            <p className="mt-2 text-[0.95rem] text-white/65">
              {"Real bilingual structure (not auto-translate) is a small investment compared to the number of customers it opens up. Free consultation, no obligation."}
            </p>
            <Link href="/contact" className="interactive-button ip-cta-primary ip-cta-primary--lg mt-5 inline-flex">
              Contact us here →
            </Link>
          </div>
        </BlogArticleLayout>
      </>
    );
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema("sq")) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BlogArticleLayout
        category="Diasporë"
        categoryColor={CATEGORY_COLOR}
        breadcrumbLabel="Website Dygjuhësh për Biznesin në Diasporë"
        path={`/blog/${SLUG}`}
        title="Website dygjuhësh (shqip + gjuha e vendit): pse i duhet çdo biznesi shqiptar në diasporë"
        description="Si ndërton një website që flet të dyja gjuhët pa e ndarë besueshmërinë."
        date="Korrik 2026"
        readTime="6 min lexim"
        related={[
          { href: "/blog/menaxho-biznesin-nga-diaspora", category: "Diasporë", categoryColor: CATEGORY_COLOR, title: "Kam biznes në Shqipëri ose Kosovë, jetoj jashtë: si e menaxhoj online pa qenë atje" },
          { href: "/blog/si-te-gjejne-klientet-shqiptare-biznesin-tend", category: "Diasporë", categoryColor: CATEGORY_COLOR, title: "Si e gjejnë klientët shqiptarë biznesin tënd online, kudo që të jenë" },
        ]}
      >
        <p className="whitespace-pre-line text-[1.05rem] leading-relaxed text-white/72">
          {"Nëse keni hapur biznes në Gjermani, Zvicër, Austri apo SHBA, keni në fakt dy audienca njëherësh: klientët/partnerët vendas që presin një website profesional në gjuhën e tyre, dhe komunitetin shqiptar, klientë, punonjës, nënkontraktorë, që ju gjejnë dhe ju besojnë më shpejt kur website-i flet edhe shqip."}
        </p>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Të zgjedhësh vetëm një gjuhë ju kushton gjysmën e mundësisë
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
            {"Shumë biznese shqiptare në diasporë zgjidhin vetëm një gjuhë dhe humbasin gjysmën e mundësisë.\nNjë kompani ndërtimi në Gjermani me website vetëm gjermanisht e ka të vështirë të tërheqë punonjës apo nënkontraktorë shqiptarë që e njohin cilësinë e punës shqiptare por parapëlqejnë të komunikojnë në gjuhën e tyre.\nAnasjelltas, një website vetëm shqip humbet besueshmërinë tek klientët gjermanë që presin standard lokal profesional."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Përkthim i vërtetë, jo widget &quot;Google Translate&quot;
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
            {"Zgjidhja e saktë nuk është një widget 'Google Translate' i ngjitur sipër faqes, përkthimet automatike janë të dukshme dhe ulin besueshmërinë menjëherë.\nZgjidhja është strukturë e vërtetë dygjuhëshe: çdo faqe e përkthyer nga një njeri, URL të veçanta për secilën gjuhë (p.sh. domain.com dhe domain.com/en), dhe sinjalizim i qartë tek Google (hreflang) se cila faqe i shërben cilit vizitor."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Modeli që e kemi ndërtuar tashmë
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
            {"E kemi ndërtuar këtë saktësisht për klientë si Hauswerk Niederbayern (kompani ndërtimi në Straubing, Gjermani) dhe Suli Group Trockenbau, biznese të themeluara nga shqiptarë që operojnë në tregun gjerman por kanë ekip dhe rrjet kontaktesh shqiptar.\nWebsite dygjuhësh u dha atyre kërkesa më të sakta nga të dyja anët, pa humbur kohë me telefonata për të sqaruar gjuhën."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Si duket kjo në praktikë
          </h2>
          <ul className="space-y-3 text-[1.02rem] leading-relaxed text-white/68">
            <li className="whitespace-pre-line">{"Faqja kryesore dhe shërbimet plotësisht të përkthyera, jo vetëm titujt."}</li>
            <li className="whitespace-pre-line">{"Numri i telefonit/WhatsApp funksional për të dyja audiencat."}</li>
            <li className="whitespace-pre-line">{"Çmimet e paraqitura në monedhën e duhur për secilin treg (EUR për Gjermani/Zvicër, mund të shtohet CHF nëse jeni në Zvicër)."}</li>
            <li className="whitespace-pre-line">{"Dëshmi/portofol që tregojnë cilësinë e punës në të dyja gjuhët."}</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Përfitimi SEO është real, jo teorik
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
            {"Google e indekson secilën gjuhë veç e veç, që do të thotë se rankoni njëkohësisht për kërkime gjermane/angleze (nga klientë vendas) dhe kërkime shqipe (nga komuniteti dhe familjet që kërkojnë 'firma ndërtimi shqiptare gjermani' apo të ngjashme).\nNjë website vetëm-gjuhësh ju mbyll gjysmën e këtij trafiku që në start."}
          </p>
        </section>

        <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 md:p-9">
          <p className="font-display text-[1.1rem] text-white">Ende me website vetëm në një gjuhë në diasporë?</p>
          <p className="mt-2 text-[0.95rem] text-white/65">
            {"Dygjuhësia e vërtetë (jo përkthim automatik) është investim i vogël krahasuar me numrin e klientëve që hapni prej saj. Konsultim falas, pa asnjë obligim."}
          </p>
          <Link href="/contact" className="interactive-button ip-cta-primary ip-cta-primary--lg mt-5 inline-flex">
            Na kontaktoni këtu →
          </Link>
        </div>
      </BlogArticleLayout>
    </>
  );
}
