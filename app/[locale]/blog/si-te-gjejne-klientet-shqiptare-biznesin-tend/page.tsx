import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { buildMetadata, buildBreadcrumb, seo } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import BlogArticleLayout from "@/components/BlogArticleLayout";

type Props = { params: { locale: string } | Promise<{ locale: string }> };

const SLUG = "si-te-gjejne-klientet-shqiptare-biznesin-tend";
const CATEGORY_COLOR = "rgba(125,211,252,0.9)";

const META: Record<Locale, { title: string; description: string; keywords: string[] }> = {
  sq: {
    title: "Si Ju Gjejnë Klientët Shqiptarë Online — Shqipëri, Kosovë, Diasporë",
    description:
      "Si kërkojnë online shqiptarët në Shqipëri, Kosovë dhe diasporë, dhe çfarë duhet të bëjë biznesi juaj për t'u gjetur nga e gjithë kjo audiencë.",
    keywords: ["si te gjejne klientet shqiptare", "seo shqiptare diaspore", "marketing per shqiptaret jashte vendit", "biznes shqiptar online"],
  },
  en: {
    title: "How Albanian Customers Find You Online — Albania, Kosovo, Diaspora",
    description:
      "How Albanians in Albania, Kosovo and the diaspora search online, and what your business needs to do to be found by this whole audience.",
    keywords: ["how albanians find businesses online", "albanian diaspora seo", "marketing to albanians abroad", "albanian business online"],
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
          breadcrumbLabel="How Albanian Customers Find You Online"
          path={`/blog/${SLUG}`}
          title="How Albanian customers find your business online, wherever they are"
          description="What your business needs to know to be found by this entire spread-out audience."
          date="July 2026"
          readTime="6 min read"
          related={[
            { href: "/blog/menaxho-biznesin-nga-diaspora", category: "Diaspora", categoryColor: CATEGORY_COLOR, title: "I run a business in Albania or Kosovo but live abroad — how to manage it online" },
            { href: "/blog/website-dygjuhesh-biznes-diaspore", category: "Diaspora", categoryColor: CATEGORY_COLOR, title: "A bilingual website (Albanian + local language) — why every diaspora Albanian business needs one" },
          ]}
        >
          <p className="whitespace-pre-line text-[1.05rem] leading-relaxed text-white/72">
            {"The Albanian-speaking audience today isn't concentrated in one country. It's split between Albania, Kosovo, and large communities in Germany, Switzerland, Italy, Belgium, the US and Canada.\nFor a business that wants to reach this audience, that means one important thing: your online strategy can't be thought of as only \"for Albania\" or only \"for the diaspora\" it has to cover both."}
          </p>

          <section className="space-y-4">
            <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
              Albanians search in Albanian, even from Munich or Toronto
            </h2>
            <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
              {"Someone in the diaspora searching for \"inheritance lawyer albania\" or \"money transfer albania germany\" types that search in Albanian, not in German.\nBusinesses with well-optimized Albanian content capture this traffic that competitors with foreign-language-only websites miss entirely."}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
              Different channels than Western markets
            </h2>
            <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
              {"Communication channels differ from Western markets. WhatsApp dominates for direct contact, even in the diaspora.\nFacebook groups (city-based, professional, diaspora groups in specific German or Swiss cities) are a strong referral source.\nGoogle Maps/Business Profile remains critical for anyone abroad trying to find a physical business in Albania or Kosovo before traveling or contacting family there."}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
              Community citations do double duty
            </h2>
            <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
              {"Mentions in Albanian community directories (business associations, Albanian-German/Swiss chambers of commerce, LinkedIn/Facebook groups of Albanian professionals abroad) have double value: they give you a real SEO backlink, and they put you directly in front of the audience you're targeting, not just in front of Google's algorithm."}
            </p>
            <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
              {"Typical case: a business in Tirana with regular diaspora customers (legal services, freight/shipping, or home construction/renovation for families living abroad) gains more from one well-placed post in a German diaspora Facebook group than from months of generic Google ads targeting only the domestic public."}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
              The practical structure we recommend
            </h2>
            <ul className="space-y-3 text-[1.02rem] leading-relaxed text-white/68">
              <li className="whitespace-pre-line">{"Albanian content as the foundation, not an afterthought."}</li>
              <li className="whitespace-pre-line">{"A visible WhatsApp button on every page."}</li>
              <li className="whitespace-pre-line">{"An active Google Business Profile with the correct address in Albania/Kosovo."}</li>
              <li className="whitespace-pre-line">{"At least one presence (post, listing, or partnership) in a diaspora community channel relevant to your specific business."}</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
              One audience, not three separate markets
            </h2>
            <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
              {"If your real audience spans Albania, Kosovo and the diaspora at once, don't split your strategy as if they were separate, unrelated markets.\nIt's the same audience, geographically spread out but united by language, culture and communication channels and that's exactly why you should approach it as one market, not several."}
            </p>
          </section>

          <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 md:p-9">
            <p className="font-display text-[1.1rem] text-white">Want to reach the whole Albanian-speaking market, not just one slice of it?</p>
            <p className="mt-2 text-[0.95rem] text-white/65">Free consultation, no obligation.</p>
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
        breadcrumbLabel="Si Ju Gjejnë Klientët Shqiptarë Online"
        path={`/blog/${SLUG}`}
        title="Si e gjejnë klientët shqiptarë biznesin tënd online, kudo që të jenë"
        description="Çfarë duhet të dijë biznesi juaj për t'u gjetur nga e gjithë kjo audiencë e shpërndarë."
        date="Korrik 2026"
        readTime="6 min lexim"
        related={[
          { href: "/blog/menaxho-biznesin-nga-diaspora", category: "Diasporë", categoryColor: CATEGORY_COLOR, title: "Kam biznes në Shqipëri ose Kosovë, jetoj jashtë — si e menaxhoj online pa qenë atje" },
          { href: "/blog/website-dygjuhesh-biznes-diaspore", category: "Diasporë", categoryColor: CATEGORY_COLOR, title: "Website dygjuhësh (shqip + gjuha e vendit) — pse i duhet çdo biznesi shqiptar në diasporë" },
        ]}
      >
        <p className="whitespace-pre-line text-[1.05rem] leading-relaxed text-white/72">
          {"Audienca shqiptare sot nuk është e përqendruar në një vend të vetëm. Është e ndarë mes Shqipërisë, Kosovës, dhe komuniteteve të mëdha në Gjermani, Zvicër, Itali, Belgjikë, SHBA e Kanada.\nPër një biznes që dëshiron t'i shërbejë kësaj audience, kjo do të thotë një gjë të rëndësishme: strategjia juaj online s'mund të mendohet vetëm 'për Shqipërinë' apo vetëm 'për diasporën', duhet të mbulojë të dyja."}
        </p>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Shqiptarët kërkojnë në shqip, edhe nga Mynihu apo Toronto
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
            {"Dikush në diasporë që kërkon 'avokat për çështje trashëgimie shqipëri' apo 'dërgesa parash shqipëri gjermani' e shkruan kërkimin në shqip, jo në gjermanisht.\nBizneset që kanë përmbajtje shqip të mirë-optimizuar kapin këtë trafik që konkurrentët me website vetëm në gjuhë të huaj e humbasin plotësisht."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Kanale të ndryshme nga tregjet perëndimore
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
            {"Kanalet e komunikimit ndryshojnë nga tregjet perëndimore. WhatsApp është mbizotërues për kontakt direkt, edhe në diasporë.\nGrupet e Facebook (qytetare, profesionale, të diasporës në qytete specifike gjermane apo zvicerane) janë burim i fortë referimi.\nGoogle Maps/Business Profile mbetet kritik për këdo që kërkon të gjejë një biznes fizik në Shqipëri apo Kosovë nga jashtë, para se të udhëtojë apo të kontaktojë familjen atje."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Citations e komunitetit japin dyfish vlerë
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
            {"Përmendjet në direktoret e komunitetit shqiptar (shoqata biznesi, dhoma tregtie shqiptaro-gjermane/zvicerane, grupe LinkedIn/Facebook të profesionistëve shqiptarë jashtë vendit) kanë vlerë të dyfishtë: japin backlink real për SEO, dhe ju vendosin drejtpërdrejt para audiencës që kërkoni, jo thjesht para algoritmit të Google."}
          </p>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
            {"Rasti tipik: një biznes në Tiranë me klientë të rregullt nga diaspora (p.sh. shërbime avokatie, transport mallrash, apo ndërtim/renovim shtëpish për familje që jetojnë jashtë) fiton më shumë nga një postim i mirë-shpërndarë në një grup Facebook të diasporës gjermane sesa nga muaj të tërë reklamash gjenerike Google drejtuar vetëm publikut brenda Shqipërisë."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Struktura praktike që rekomandojmë
          </h2>
          <ul className="space-y-3 text-[1.02rem] leading-relaxed text-white/68">
            <li className="whitespace-pre-line">{"Përmbajtje shqip si bazë, jo dytësore."}</li>
            <li className="whitespace-pre-line">{"Buton WhatsApp të dukshëm në çdo faqe."}</li>
            <li className="whitespace-pre-line">{"Prani aktive në Google Business Profile me adresën e saktë në Shqipëri/Kosovë."}</li>
            <li className="whitespace-pre-line">{"Të paktën një prezencë (postim, listim, apo partneritet) në një kanal komuniteti të diasporës relevant për biznesin tuaj specifik."}</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Një audiencë e vetme, jo tre tregje të veçanta
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
            {"Nëse audienca juaj reale përfshin Shqipërinë, Kosovën dhe diasporën njëkohësisht, mos e ndani strategjinë sikur të ishin tregje të veçanta e të pavarura.\nJanë e njëjta audiencë, e shpërndarë gjeografikisht por e bashkuar nga gjuha, kultura dhe kanalet e komunikimit, dhe kjo është pikërisht arsyeja pse duhet t'i qaseni si një treg i vetëm, jo disa."}
          </p>
        </section>

        <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 md:p-9">
          <p className="font-display text-[1.1rem] text-white">Doni të arrini gjithë tregun shqipfolës, jo vetëm një fetë të tij?</p>
          <p className="mt-2 text-[0.95rem] text-white/65">Konsultimi i parë është falas pa asnjë obligim.</p>
          <Link href="/contact" className="interactive-button ip-cta-primary ip-cta-primary--lg mt-5 inline-flex">
            Na kontaktoni këtu →
          </Link>
        </div>
      </BlogArticleLayout>
    </>
  );
}
