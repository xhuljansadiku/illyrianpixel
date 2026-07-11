import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import BlogArticleLayout from "@/components/BlogArticleLayout";

type Props = { params: { locale: string } | Promise<{ locale: string }> };

const META: Record<Locale, { title: string; description: string; keywords: string[] }> = {
  sq: {
    title: "Si të hapni dyqan online në Shqipëri 2026",
    description:
      "Udhëzues i plotë për hapjen e dyqanit online në Shqipëri. Platformat, kostot, pagesat dhe çfarë keni nevojë për t'ia nisur sot.",
    keywords: ["dyqan online shqipëri", "e-commerce shqipëri", "shitje online shqipëri", "woocommerce shqipëri"],
  },
  en: {
    title: "How to Open an Online Store in Albania 2026",
    description:
      "A complete guide to launching an online store in Albania. Platforms, costs, payments, and what you need to get started today.",
    keywords: ["online store albania", "e-commerce albania", "sell online albania", "woocommerce albania"],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  const m = META[locale as Locale] ?? META.sq;
  return buildMetadata(m.title, m.description, "/blog/dyqan-online-shqiperi", m.keywords);
}

export default async function Page({ params }: Props) {
  const { locale } = await Promise.resolve(params);

  if (locale === "en") {
    return (
      <BlogArticleLayout
        category="E-Commerce"
        categoryColor="rgba(196,181,253,0.9)"
        breadcrumbLabel="Online Store Albania"
        path="/blog/dyqan-online-shqiperi"
        title="How to Open an Online Store in Albania: Complete 2026 Guide"
        description={<>{"A practical guide to opening an online store in Albania."}<br className="max-md:hidden" />{" Platforms, payments, real costs, and the first steps to start selling online today."}</>}
        date="May 2026"
        readTime="8 min read"
        related={[
          { href: "/blog/sa-kushton-website-shqiperi", category: "Web Design", categoryColor: "rgba(234,206,113,0.95)", title: "How Much Does a Professional Website Cost in Albania in 2026?" },
          { href: "/blog/google-ads-shqiperi", category: "Marketing", categoryColor: "rgba(252,211,77,0.9)", title: "Google Ads Albania: Real Prices and Expected Results" },
        ]}
      >
        <p className="whitespace-pre-line text-[1.05rem] leading-relaxed text-white/72">
          {"Your physical store closes at 6 PM.\nYour online store never closes.\nThe Albanian e-commerce market is growing 25–30% every year, Albanians are buying more and more online.\nIf you're a business owner without an online store, your competitors are taking those sales every single day."}
        </p>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Step 1: Choose the right platform
          </h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-[0.93rem]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04]">
                  <th className="px-4 py-3 text-left font-semibold text-white/80">Platform</th>
                  <th className="px-4 py-3 text-left font-semibold text-white/80">Cost</th>
                  <th className="px-4 py-3 text-left font-semibold text-white/80">Ideal for</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-white/65">
                <tr><td className="px-4 py-3 text-white">WooCommerce</td><td className="px-4 py-3">€500–2,000</td><td className="px-4 py-3">Many products, full control</td></tr>
                <tr><td className="px-4 py-3 text-white">Shopify</td><td className="px-4 py-3">$29–79/month</td><td className="px-4 py-3">Fast launch, no technical knowledge</td></tr>
                <tr><td className="px-4 py-3 text-white">Custom solution</td><td className="px-4 py-3">€2,000–8,000</td><td className="px-4 py-3">Specific needs, complex integrations</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-[1.02rem] leading-relaxed text-white/68">
            For most Albanian businesses, <strong className="text-white">WooCommerce</strong> is the optimal solution — a reasonable price and full flexibility.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Step 2: Choosing online payments
          </h2>
          <p className="text-[1.02rem] leading-relaxed text-white/68">This is the main obstacle for Albanian businesses, but there are solutions:</p>
          <ul className="space-y-2 text-[1.02rem] leading-relaxed text-white/68">
            <li><strong className="text-white">Stripe</strong>: Available in Albania. Fee: 1.5% + €0.25/transaction.</li>
            <li><strong className="text-white">PayPal</strong>: Globally recognized, ideal if you sell internationally.</li>
            <li><strong className="text-white">Local card</strong>: Raiffeisen, BKT, Credins offer integrated terminals.</li>
            <li><strong className="text-white">Cash on Delivery</strong>: Still very popular with Albanians. Don&apos;t remove it from your options.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Step 3: What you need technically
          </h2>
          <ul className="space-y-2 text-[1.02rem] text-white/68">
            {["A domain (.com or .al)", "Fast hosting (don't cut corners here)", "SSL certificate (HTTPS)", "Product management system", "Payment integration", "SEO-optimized product pages", "Order confirmation email", "Return policy and terms of service"].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 text-accent">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            How much does an online store cost? Real costs
          </h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-[0.93rem]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04]">
                  <th className="px-4 py-3 text-left font-semibold text-white/80">Expense</th>
                  <th className="px-4 py-3 text-left font-semibold text-white/80">Minimum cost</th>
                  <th className="px-4 py-3 text-left font-semibold text-white/80">Realistic cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-white/65">
                <tr><td className="px-4 py-3">Design & development</td><td className="px-4 py-3">€700</td><td className="px-4 py-3">€1,000–4,000</td></tr>
                <tr><td className="px-4 py-3">Hosting (year)</td><td className="px-4 py-3">€100</td><td className="px-4 py-3">€200–400</td></tr>
                <tr><td className="px-4 py-3">Product photography</td><td className="px-4 py-3">€300</td><td className="px-4 py-3">€500–1,000</td></tr>
                <tr><td className="px-4 py-3">Initial marketing</td><td className="px-4 py-3">€200/month</td><td className="px-4 py-3">€400–800/month</td></tr>
              </tbody>
            </table>
          </div>
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
      category="E-Commerce"
      categoryColor="rgba(196,181,253,0.9)"
      breadcrumbLabel="Dyqan Online Shqipëri"
      path="/blog/dyqan-online-shqiperi"
      title="Si të hapni dyqan online në Shqipëri: Udhëzues i plotë 2026"
      description={<>{"Udhëzues praktik për hapjen e dyqanit online në Shqipëri."}<br className="max-md:hidden" />{" Platformat, pagesat, kostot reale dhe hapat e parë për të filluar shitjet online sot."}</>}
      date="Maj 2026"
      readTime="8 min lexim"
      related={[
        { href: "/blog/sa-kushton-website-shqiperi", category: "Web Design", categoryColor: "rgba(234,206,113,0.95)", title: "Sa kushton një website profesional në Shqipëri në 2026?" },
        { href: "/blog/google-ads-shqiperi", category: "Marketing", categoryColor: "rgba(252,211,77,0.9)", title: "Google Ads Shqipëri: Çmime reale dhe rezultate të pritshme" },
      ]}
    >
      <p className="whitespace-pre-line text-[1.05rem] leading-relaxed text-white/72">
        {"Dyqani juaj fizik mbyllet në 18:00.\nDyqani online nuk mbyllet kurrë.\nTregu shqiptar i e-commerce po rritet me 25–30% çdo vit shqiptarët po blejnë gjithnjë e më shumë online.\nNëse jeni pronar biznesi pa dyqan online, konkurrentët tuaj po marrin ato shitje çdo ditë."}
      </p>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Hapi 1: Zgjidhni platformën e duhur
        </h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-[0.93rem]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04]">
                <th className="px-4 py-3 text-left font-semibold text-white/80">Platforma</th>
                <th className="px-4 py-3 text-left font-semibold text-white/80">Kosto</th>
                <th className="px-4 py-3 text-left font-semibold text-white/80">Ideal për</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-white/65">
              <tr><td className="px-4 py-3 text-white">WooCommerce</td><td className="px-4 py-3">500–2,000 €</td><td className="px-4 py-3">Produkte të shumta, kontroll i plotë</td></tr>
              <tr><td className="px-4 py-3 text-white">Shopify</td><td className="px-4 py-3">29–79 $/muaj</td><td className="px-4 py-3">Nisje e shpejtë, pa njohuri teknike</td></tr>
              <tr><td className="px-4 py-3 text-white">Zgjidhje e personalizuar</td><td className="px-4 py-3">2,000–8,000 €</td><td className="px-4 py-3">Nevoja specifike, integrime komplekse</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-[1.02rem] leading-relaxed text-white/68">
          Për shumicën e bizneseve shqiptare, <strong className="text-white">WooCommerce</strong> është zgjidhja optimale çmim i arsyeshëm dhe fleksibilitet i plotë.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Hapi 2: Zgjidhja e pagesave online
        </h2>
        <p className="text-[1.02rem] leading-relaxed text-white/68">Ky është pengesa kryesore për bizneset shqiptare, por ka zgjidhje:</p>
        <ul className="space-y-2 text-[1.02rem] leading-relaxed text-white/68">
          <li><strong className="text-white">Stripe</strong>: Disponueshëm në Shqipëri. Komisioni: 1.5% + 0.25€/transaksion.</li>
          <li><strong className="text-white">PayPal</strong>: I njohur globalisht, ideal nëse shisni ndërkombëtarisht.</li>
          <li><strong className="text-white">Kartë lokale</strong>: Raiffeisen, BKT, Credins ofrojnë terminale të integruara.</li>
          <li><strong className="text-white">Cash on Delivery</strong>: Ende shumë e preferuar nga shqiptarët. Mos e hiqni nga opsionet.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Hapi 3: Çfarë duhet teknikisht
        </h2>
        <ul className="space-y-2 text-[1.02rem] text-white/68">
          {["Domenin (.com ose .al)", "Hosting të shpejtë (nuk kurseni këtu)", "Certifikatë SSL (HTTPS)", "Sistem menaxhimi produktesh", "Integrim pagese", "Faqe produkti të optimizuara për SEO", "Konfirmim emaili porosie", "Politikë kthimi dhe kushte shërbimi"].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 text-accent">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Sa kushton dyqani online? Kosto reale
        </h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-[0.93rem]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04]">
                <th className="px-4 py-3 text-left font-semibold text-white/80">Shpenzim</th>
                <th className="px-4 py-3 text-left font-semibold text-white/80">Kosto minimale</th>
                <th className="px-4 py-3 text-left font-semibold text-white/80">Kosto realiste</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-white/65">
              <tr><td className="px-4 py-3">Dizajn & zhvillim</td><td className="px-4 py-3">700 €</td><td className="px-4 py-3">1,000–4,000 €</td></tr>
              <tr><td className="px-4 py-3">Hosting (vit)</td><td className="px-4 py-3">100 €</td><td className="px-4 py-3">200–400 €</td></tr>
              <tr><td className="px-4 py-3">Fotografi produktesh</td><td className="px-4 py-3">300 €</td><td className="px-4 py-3">500–1,000 €</td></tr>
              <tr><td className="px-4 py-3">Marketing fillestar</td><td className="px-4 py-3">200 €/muaj</td><td className="px-4 py-3">400–800 €/muaj</td></tr>
            </tbody>
          </table>
        </div>
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
