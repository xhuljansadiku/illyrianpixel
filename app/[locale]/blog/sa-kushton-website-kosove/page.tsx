import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import BlogArticleLayout from "@/components/BlogArticleLayout";

type Props = { params: { locale: string } | Promise<{ locale: string }> };

const META: Record<Locale, { title: string; description: string; keywords: string[] }> = {
  sq: {
    title: "Sa kushton website profesional në Kosovë 2026?",
    description:
      "Çmimet reale të website-ve në Kosovë (Prishtinë, Prizren, Pejë) për 2026. Çfarë përfshin një faqe profesionale dhe si e zgjidhni agjencinë e duhur.",
    keywords: ["sa kushton website kosovë", "çmimi website prishtinë", "web design kosovë çmim", "agjenci web prishtinë"],
  },
  en: {
    title: "How Much Does a Professional Website Cost in Kosovo in 2026?",
    description:
      "Real website pricing in Kosovo (Pristina, Prizren, Peja) for 2026. What a professional website includes and how to choose the right agency.",
    keywords: ["website cost kosovo 2026", "web design pristina price", "website price kosovo", "web agency pristina"],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  const m = META[locale as Locale] ?? META.sq;
  return buildMetadata(m.title, m.description, "/blog/sa-kushton-website-kosove", m.keywords);
}

export default async function Page({ params }: Props) {
  const { locale } = await Promise.resolve(params);

  if (locale === "en") {
    return (
      <BlogArticleLayout
        category="Web Design"
        categoryColor="rgba(234,206,113,0.95)"
        breadcrumbLabel="Website Cost Kosovo?"
        path="/blog/sa-kushton-website-kosove"
        title="How Much Does a Professional Website Cost in Kosovo in 2026?"
        description={<>{"Real website pricing in Kosovo (Pristina, Prizren, Peja) for 2026."}<br className="max-md:hidden" />{" What a professional website includes and how to choose the right agency."}</>}
        date="July 2026"
        readTime="6 min read"
        related={[
          { href: "/blog/sa-kushton-website-shqiperi", category: "Web Design", categoryColor: "rgba(234,206,113,0.95)", title: "How Much Does a Professional Website Cost in Albania in 2026?" },
          { href: "/blog/menaxho-biznesin-nga-diaspora", category: "Diaspora", categoryColor: "rgba(125,211,252,0.9)", title: "I run a business in Albania or Kosovo but live abroad: how to manage it online" },
        ]}
      >
        <p className="whitespace-pre-line text-[1.05rem] leading-relaxed text-white/72">
          {"In Kosovo, the question \"how much does a website cost\" often gets even more contradictory answers than in Albania: anywhere from €250 to €4,000 with no explanation of what actually changes between offers.\nThe web design market in Pristina, Prizren or Peja is still relatively small and unstructured, so prices vary by the provider's experience, not always by real quality."}
        </p>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Average website price in Kosovo by type
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
          <p className="text-[0.85rem] text-white/45">
            Prices are similar to the Albanian market since most serious agencies serve both countries with the same team and rates.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Does it matter if the agency is based in Pristina or Tirana?
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
            {"Honest answer: no, as long as the process is fully online (video calls, WhatsApp, digital documents) and the agency has a proven portfolio with real Kosovo clients, not only Albanian ones.\nLanguage, currency (euro in both countries) and business culture are practically identical, so physical distance isn't a real obstacle. What matters is the portfolio and the process, not the office address."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            What to avoid when choosing a price
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Offers under €250.</strong>{"\nUsually a cheap template with no SEO and no support after launch."}</p>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Contracts without specifications.</strong>{"\nIf pages, features and the deadline aren't listed precisely, expect surprise extra costs."}</p>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Promises of &ldquo;#1 on Google&rdquo; within weeks.</strong>{"\nNo one can honestly guarantee that timeline."}</p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            The diaspora angle Kosovo has more than most
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
            {"Kosovo has an especially large diaspora in Switzerland and Germany that keeps close business ties with family and partners back home.\nIf you have clients or partners in the diaspora, a bilingual website (Albanian + German) widens your reach significantly from day one."}
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
      breadcrumbLabel="Sa kushton website Kosovë?"
      path="/blog/sa-kushton-website-kosove"
      title="Sa kushton një website profesional në Kosovë në 2026?"
      description={<>{"Çmimet reale të website-ve në Kosovë (Prishtinë, Prizren, Pejë) për 2026."}<br className="max-md:hidden" />{" Çfarë përfshin një faqe profesionale dhe si e zgjidhni agjencinë e duhur."}</>}
      date="Korrik 2026"
      readTime="6 min lexim"
      related={[
        { href: "/blog/sa-kushton-website-shqiperi", category: "Web Design", categoryColor: "rgba(234,206,113,0.95)", title: "Sa kushton një website profesional në Shqipëri në 2026?" },
        { href: "/blog/menaxho-biznesin-nga-diaspora", category: "Diasporë", categoryColor: "rgba(125,211,252,0.9)", title: "Kam biznes në Shqipëri ose Kosovë, jetoj jashtë: si e menaxhoj online pa qenë atje" },
      ]}
    >
      <p className="whitespace-pre-line text-[1.05rem] leading-relaxed text-white/72">
        {"Në Kosovë, pyetja 'sa kushton një website' merr shpesh përgjigje edhe më kontradiktore se në Shqipëri: nga 250 € te 4.000 € pa asnjë shpjegim se çfarë ndryshon mes ofertave.\nTregu i web design-it në Prishtinë, Prizren apo Pejë është ende relativisht i vogël dhe i pastrukturuar, ndaj çmimet variojnë sipas përvojës së ofruesit, jo gjithmonë sipas cilësisë reale."}
      </p>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Çmimi mesatar i website-ve në Kosovë sipas llojit
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
        <p className="text-[0.85rem] text-white/45">
          Çmimet janë të ngjashme me tregun shqiptar, meqë shumica e agjencive serioze punojnë njëkohësisht me klientë në të dy vendet me të njëjtën ekip dhe tarifa.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          A ka rëndësi nëse agjencia është nga Prishtina apo Tirana?
        </h2>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
          {"Përgjigja e ndershme: jo, për sa kohë procesi është plotësisht online (call-e video, WhatsApp, dokumente të dixhitalizuara) dhe agjencia ka portofol të dëshmuar me klientë konkretë nga Kosova, jo vetëm nga Shqipëria.\nGjuha, monedha (euro në të dyja vendet) dhe kultura e biznesit janë praktikisht identike, ndaj distanca fizike s'është pengesë reale. Ajo që ka rëndësi është portofoli dhe procesi, jo adresa e zyrës."}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Çfarë të shmangni kur zgjidhni çmimin
        </h2>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Oferta nën 250 €.</strong>{"\nZakonisht template i lirë pa SEO dhe pa mbështetje pas lansimit."}</p>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Kontratat pa specifikime.</strong>{"\nNëse faqet, funksionet dhe afati s'listohen saktë, pritni surpriza me kosto shtesë."}</p>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Premtime për &ldquo;#1 në Google&rdquo; brenda javësh.</strong>{"\nAsnjëri s'mund ta garantojë me ndershmëri këtë afat."}</p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Diaspora, avantazhi që Kosova e ka më të theksuar
        </h2>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
          {"Kosova ka një diasporë veçanërisht të madhe në Zvicër dhe Gjermani që mban lidhje të forta biznesi me familjen dhe partnerët në vend.\nNëse keni klientë apo partnerë në diasporë, një website dygjuhësh (shqip + gjermanisht) e zgjeron ndjeshëm rrezen e biznesit tuaj që në fillim."}
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
