import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import BlogArticleLayout from "@/components/BlogArticleLayout";

type Props = { params: { locale: string } | Promise<{ locale: string }> };

const META: Record<Locale, { title: string; description: string; keywords: string[] }> = {
  sq: {
    title: "Social Media Menaxhim Shqipëri: Çmime 2026",
    description:
      "Çmimet e menaxhimit të rrjeteve sociale në Shqipëri për 2026. Çfarë përfshin, sa kushton dhe si të zgjidhni agjencinë e duhur për biznesin tuaj.",
    keywords: ["social media menaxhim shqipëri", "menaxhim rrjete sociale tiranë", "instagram menaxhim shqipëri", "facebook marketing shqipëri"],
  },
  en: {
    title: "Social Media Management Albania: Prices 2026",
    description:
      "Pricing for social media management in Albania for 2026. What it includes, how much it costs, and how to choose the right agency for your business.",
    keywords: ["social media management albania", "social media management tirana", "instagram management albania", "facebook marketing albania"],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  const m = META[locale as Locale] ?? META.sq;
  return buildMetadata(m.title, m.description, "/blog/social-media-menaxhim-shqiperi", m.keywords);
}

export default async function Page({ params }: Props) {
  const { locale } = await Promise.resolve(params);

  if (locale === "en") {
    return (
      <BlogArticleLayout
        category="Social Media"
        categoryColor="rgba(147,197,253,0.9)"
        breadcrumbLabel="Social Media Management"
        path="/blog/social-media-menaxhim-shqiperi"
        title="Social Media Management in Albania: Prices and What to Expect"
        description="Pricing for professional social media management in Albania, what it includes, the main platforms, and how to choose the right agency."
        date="June 2026"
        readTime="7 min read"
        related={[
          { href: "/blog/google-ads-shqiperi", category: "Marketing", categoryColor: "rgba(252,211,77,0.9)", title: "Google Ads Albania: Real Prices and Expected Results" },
          { href: "/blog/web-design-tirane", category: "Web Design", categoryColor: "rgba(234,206,113,0.95)", title: "Web Design Tirana: How to Choose a Professional Agency" },
        ]}
      >
        <p className="whitespace-pre-line text-[1.05rem] leading-relaxed text-white/72">
          {"Social media isn't just posting photos.\nIt's strategy, consistency, and communicating with your audience every day.\nAlbanian businesses that manage their social media professionally get 3–5 times more engagement and noticeably more customers.\nBut the price of social media management depends on many factors."}
        </p>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            What professional social media management includes
          </h2>
          <ul className="space-y-3 text-[1.02rem] leading-relaxed text-white/68">
            <li className="whitespace-pre-line"><strong className="text-white">Content creation.</strong>{"\nPhotos, videos, copy everything that appears on your profile."}</li>
            <li className="whitespace-pre-line"><strong className="text-white">Editorial calendar.</strong>{"\nMonthly plan with themes, posting dates, and goals for each period."}</li>
            <li className="whitespace-pre-line"><strong className="text-white">Community management.</strong>{"\nResponding to comments and messages.\nBusinesses that ignore comments lose credibility."}</li>
            <li className="whitespace-pre-line"><strong className="text-white">Analytics and reporting.</strong>{"\nReach, engagement, clicks, leads the data drives the decisions."}</li>
            <li className="whitespace-pre-line"><strong className="text-white">Paid advertising.</strong>{"\nManaging Meta Ads campaigns (Facebook + Instagram) for fast growth."}</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Social media management prices in Albania 2026
          </h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-[0.93rem]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04]">
                  <th className="px-4 py-3 text-left font-semibold text-white/80">Package</th>
                  <th className="px-4 py-3 text-left font-semibold text-white/80">Price/month</th>
                  <th className="px-4 py-3 text-left font-semibold text-white/80">What it includes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-white/65">
                <tr><td className="px-4 py-3 text-white">Basic</td><td className="px-4 py-3 text-accent">€200 – 350</td><td className="px-4 py-3">3–4 posts/week, 1 platform</td></tr>
                <tr><td className="px-4 py-3 text-white">Standard</td><td className="px-4 py-3 text-accent">€350 – 600</td><td className="px-4 py-3">5–7 posts/week, 2 platforms, stories</td></tr>
                <tr><td className="px-4 py-3 text-white">Premium</td><td className="px-4 py-3 text-accent">€600 – 1,200</td><td className="px-4 py-3">Daily, 3 platforms, reels, ads</td></tr>
                <tr><td className="px-4 py-3 text-white">E-commerce</td><td className="px-4 py-3 text-accent">€800 – 1,500</td><td className="px-4 py-3">Direct sales, product catalog</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[0.9rem] text-white/45">* Prices don&apos;t include the paid ad budget (a minimum extra €200/month is recommended).</p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Main platforms for Albanian businesses
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Instagram:</strong>{"\nThe number 1 platform for businesses with a visual product.\nAlbania has high penetration, especially in the 18–45 age group."}</p>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Facebook:</strong>{"\nStill important for the 35+ audience.\nMeta ads are especially effective."}</p>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">TikTok:</strong>{"\nThe fastest-growing platform.\nIf your audience is 16–30 years old, TikTok should be a priority."}</p>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">LinkedIn:</strong>{"\nFor B2B businesses and professionals.\nOften overlooked by Albanian businesses, but with a very valuable audience."}</p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            How to choose the right agency
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Ask about strategy, not just posts.</strong>{"\nA serious agency starts with these questions:\nWho is the audience?\nWhat is the goal?\nHow is success measured?"}</p>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Understand account ownership.</strong>{"\nYour social media accounts should be yours.\nAlways keep admin access."}</p>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Avoid very long contracts with no results.</strong>{"\n3–6 month contracts are normal.\nAvoid 12 months with no way out."}</p>
          <p className="text-[1.02rem] leading-relaxed text-white/68">
            Discover our <Link href="/services/branding-content" className="text-accent underline underline-offset-4">branding and content strategy</Link> or check out our <Link href="/services/seo-google-ads" className="text-accent underline underline-offset-4">SEO & Google Ads package</Link>.
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
      category="Social Media"
      categoryColor="rgba(147,197,253,0.9)"
      breadcrumbLabel="Social Media Menaxhim"
      path="/blog/social-media-menaxhim-shqiperi"
      title="Social Media Menaxhim në Shqipëri: Çmime dhe çfarë të prisni"
      description="Çmimet e menaxhimit profesional të social media në Shqipëri, çfarë përfshin, platformat kryesore dhe si të zgjidhni agjencinë e duhur."
      date="Qershor 2026"
      readTime="7 min lexim"
      related={[
        { href: "/blog/google-ads-shqiperi", category: "Marketing", categoryColor: "rgba(252,211,77,0.9)", title: "Google Ads Shqipëri: Çmime reale dhe rezultate të pritshme" },
        { href: "/blog/web-design-tirane", category: "Web Design", categoryColor: "rgba(234,206,113,0.95)", title: "Web Design Tiranë: Si të zgjidhni agjenci profesionale" },
      ]}
    >
      <p className="whitespace-pre-line text-[1.05rem] leading-relaxed text-white/72">
        {"Social media nuk është vetëm postim fotosh.\nËshtë strategji, konsistencë dhe komunikim me audiencën tuaj çdo ditë.\nBizneset shqiptare që menaxhojnë rrjetet sociale profesionalisht kanë 3–5 herë më shumë angazhim dhe dukshëm më shumë klientë.\nPor çmimi i menaxhimit të social media varet nga shumë faktorë."}
      </p>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Çfarë përfshin menaxhimi profesional i social media
        </h2>
        <ul className="space-y-3 text-[1.02rem] leading-relaxed text-white/68">
          <li className="whitespace-pre-line"><strong className="text-white">Content creation.</strong>{"\nFotografitë, videot, tekstet gjithçka që shfaqet në profilin tuaj."}</li>
          <li className="whitespace-pre-line"><strong className="text-white">Kalendari editorial.</strong>{"\nPlan mujor me tema, datat e postimeve dhe objektivat për çdo periudhë."}</li>
          <li className="whitespace-pre-line"><strong className="text-white">Community management.</strong>{"\nPërgjigja ndaj komenteve dhe mesazheve.\nBizneset që i injorojnë komentet humbasin besueshmëri."}</li>
          <li className="whitespace-pre-line"><strong className="text-white">Analitika dhe raportimi.</strong>{"\nReach, engagement, klikime, leads të dhënat drejtojnë vendimet."}</li>
          <li className="whitespace-pre-line"><strong className="text-white">Reklamat e paguara.</strong>{"\nMenaxhimi i fushatave Meta Ads (Facebook + Instagram) për rritje të shpejtë."}</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Çmimet e menaxhimit social media në Shqipëri 2026
        </h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-[0.93rem]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04]">
                <th className="px-4 py-3 text-left font-semibold text-white/80">Paketa</th>
                <th className="px-4 py-3 text-left font-semibold text-white/80">Çmimi/muaj</th>
                <th className="px-4 py-3 text-left font-semibold text-white/80">Çfarë përfshin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-white/65">
              <tr><td className="px-4 py-3 text-white">Bazë</td><td className="px-4 py-3 text-accent">200 – 350 €</td><td className="px-4 py-3">3–4 postime/javë, 1 platformë</td></tr>
              <tr><td className="px-4 py-3 text-white">Standard</td><td className="px-4 py-3 text-accent">350 – 600 €</td><td className="px-4 py-3">5–7 postime/javë, 2 platforma, stories</td></tr>
              <tr><td className="px-4 py-3 text-white">Premium</td><td className="px-4 py-3 text-accent">600 – 1,200 €</td><td className="px-4 py-3">Çdo ditë, 3 platforma, reels, ads</td></tr>
              <tr><td className="px-4 py-3 text-white">E-commerce</td><td className="px-4 py-3 text-accent">800 – 1,500 €</td><td className="px-4 py-3">Shitje direkte, katalog produktesh</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-[0.9rem] text-white/45">* Çmimet nuk përfshijnë buxhetin e reklamave të paguara (rekomandohet min. 200 €/muaj shtesë).</p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Platformat kryesore për bizneset shqiptare
        </h2>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Instagram:</strong>{"\nPlatforma numër 1 për bizneset me produkt vizual.\nShqipëria ka penetrim të lartë, veçanërisht grupmoshat 18–45."}</p>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Facebook:</strong>{"\nAkoma e rëndësishme për audiencë 35+.\nReklamat Meta janë veçanërisht efektive."}</p>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">TikTok:</strong>{"\nPlatforma me rritjen më të shpejtë.\nNëse audienca juaj është 16–30 vjeçe, TikTok duhet të jetë prioritet."}</p>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">LinkedIn:</strong>{"\nPër biznese B2B dhe profesionistë.\nShpesh e neglizhuar nga bizneset shqiptare, por me audiencë shumë të vlefshme."}</p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Si të zgjidhni agjencinë e duhur
        </h2>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Pyesni për strategji, jo vetëm postime.</strong>{"\nAgjencia serioze fillon me pyetjet:\nKush është audienca?\nCili është objektivi?\nSi matet suksesi?"}</p>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Kuptoni pronësinë e llogarive.</strong>{"\nLlogaritë e social media duhet të jenë tuajat.\nKeni gjithmonë aksesin e administratorit."}</p>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68"><strong className="text-white">Shmangni kontratat shumë të gjata pa rezultate.</strong>{"\nKontratat 3–6 mujore janë normale.\n12 muaj pa mundësi largimi shmangeni."}</p>
        <p className="text-[1.02rem] leading-relaxed text-white/68">
          Zbuloni <Link href="/services/branding-content" className="text-accent underline underline-offset-4">strategjinë tonë të branding dhe content</Link> ose shikoni <Link href="/services/seo-google-ads" className="text-accent underline underline-offset-4">paketën SEO & Google Ads</Link>.
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
