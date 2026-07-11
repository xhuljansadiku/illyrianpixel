import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import BlogArticleLayout from "@/components/BlogArticleLayout";

export const metadata: Metadata = buildMetadata(
  "Google Ads Shqipëri: Çmime dhe rezultate 2026",
  "Çmimet reale të Google Ads në Shqipëri dhe çfarë të prisni. Si funksionojnë reklamat në Google për bizneset shqiptare dhe kur ia vlen.",
  "/blog/google-ads-shqiperi",
  ["google ads shqipëri", "reklama google shqipëri", "google ads tiranë", "ppc shqipëri"]
);

export default function Page() {
  return (
    <BlogArticleLayout
      category="Marketing"
      categoryColor="rgba(252,211,77,0.9)"
      breadcrumbLabel="Google Ads Shqipëri"
      path="/blog/google-ads-shqiperi"
      title={<>Google Ads Shqipëri<br />Çmime reale dhe rezultate të pritshme</>}
      description="Çmimet reale të Google Ads në Shqipëri, gabimet kryesore dhe si ta menaxhoni buxhetin tuaj reklamues për ROI maksimal në tregun shqiptar."
      date="Maj 2026"
      readTime="7 min lexim"
      related={[
        { href: "/blog/seo-tirane", category: "SEO", categoryColor: "rgba(167,243,208,0.9)", title: "SEO Tiranë: Si të dilni i pari në Google në 2026" },
        { href: "/blog/social-media-menaxhim-shqiperi", category: "Social Media", categoryColor: "rgba(147,197,253,0.9)", title: "Social Media Menaxhim në Shqipëri: Çmime dhe çfarë të prisni" },
      ]}
    >
      <p className="whitespace-pre-line text-[1.05rem] leading-relaxed text-white/72">
        {"Google Ads është kanali më i drejtpërdrejtë i marketingut dixhital paguani dhe shfaqeni menjëherë para klientëve që kërkojnë saktësisht atë që ofroni.\nPor shumë biznese shqiptare humbasin para me Google Ads sepse nuk i konfigurojnë si duhet.\nJa çmimet reale dhe çfarë mund të prisni."}
      </p>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Çmimi mesatar i Google Ads sipas industrisë në Shqipëri
        </h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-[0.93rem]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04]">
                <th className="px-4 py-3 text-left font-semibold text-white/80">Industria</th>
                <th className="px-4 py-3 text-left font-semibold text-white/80">CPC mesatar (€)</th>
                <th className="px-4 py-3 text-left font-semibold text-white/80">Konkurrenca</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-white/65">
              <tr><td className="px-4 py-3">Avokat / Noter</td><td className="px-4 py-3 text-accent">1.50 – 3.00</td><td className="px-4 py-3">E lartë</td></tr>
              <tr><td className="px-4 py-3">Klinikë / Spital</td><td className="px-4 py-3 text-accent">0.80 – 2.00</td><td className="px-4 py-3">E mesme</td></tr>
              <tr><td className="px-4 py-3">Pasuri e paluajtshme</td><td className="px-4 py-3 text-accent">1.00 – 2.50</td><td className="px-4 py-3">E lartë</td></tr>
              <tr><td className="px-4 py-3">Web design / IT</td><td className="px-4 py-3 text-accent">0.50 – 1.50</td><td className="px-4 py-3">E mesme</td></tr>
              <tr><td className="px-4 py-3">Restorant</td><td className="px-4 py-3 text-accent">0.20 – 0.60</td><td className="px-4 py-3">E ulët</td></tr>
              <tr><td className="px-4 py-3">Mode / Rrobaqepësi</td><td className="px-4 py-3 text-accent">0.30 – 0.80</td><td className="px-4 py-3">E ulët</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          5 gabimet që humbasin para në Google Ads
        </h2>
        <ol className="space-y-3 text-[1.02rem] leading-relaxed text-white/68">
          <li className="whitespace-pre-line"><strong className="text-white">1. Fjalë kyçe shumë të gjera.</strong>{"\n\"Makinë\" si fjalë kyçe do t'ju kushtojë shumë.\n\"Blerje makinë Tiranë 2026\" është shumë më efektive."}</li>
          <li className="whitespace-pre-line"><strong className="text-white">2. Pa negative keywords.</strong>{"\nReklamat tuaja shfaqen edhe për kërkime krejtësisht të palidhura ha buxhetin pa rezultat."}</li>
          <li className="whitespace-pre-line"><strong className="text-white">3. Dërgimi i trafikut në faqen kryesore.</strong>{"\nÇdo reklamë duhet të shkojë në landing page specifike."}</li>
          <li className="whitespace-pre-line"><strong className="text-white">4. Pa gjurmim konvertimesh.</strong>{"\nNëse nuk dini cilat reklama sjellin klientë, jeni duke fluturuar verbërisht."}</li>
          <li className="whitespace-pre-line"><strong className="text-white">5. Buxheti shumë i shpërndarë.</strong>{"\nFokusohuni në 2–3 shërbime kryesore dhe dominoni ato fjalë kyçe."}</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Google Ads vs SEO: Cila strategji për ju?
        </h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-[0.93rem]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04]">
                <th className="px-4 py-3 text-left font-semibold text-white/80">Kriteri</th>
                <th className="px-4 py-3 text-left font-semibold text-white/80">Google Ads</th>
                <th className="px-4 py-3 text-left font-semibold text-white/80">SEO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-white/65">
              <tr><td className="px-4 py-3">Kur shihen rezultate</td><td className="px-4 py-3">Menjëherë</td><td className="px-4 py-3">3–6 muaj</td></tr>
              <tr><td className="px-4 py-3">Kosto</td><td className="px-4 py-3">Vazhduese</td><td className="px-4 py-3">Investim fillestar</td></tr>
              <tr><td className="px-4 py-3">Qëndrueshmëria</td><td className="px-4 py-3">Ndalon me buxhetin</td><td className="px-4 py-3">Vazhdon pafund</td></tr>
              <tr><td className="px-4 py-3">Kontrolli</td><td className="px-4 py-3">I plotë</td><td className="px-4 py-3">I kufizuar</td></tr>
            </tbody>
          </table>
        </div>
        <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
          <strong className="text-white">Rekomandimi ynë:</strong>{"\nFilloni me Google Ads për rezultate të shpejta, ndërkohë ndërtoni SEO-in organik.\nZbuloni "}<Link href="/services/seo-google-ads" className="text-accent underline underline-offset-4">strategjinë tonë SEO & Google Ads</Link>.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
          Çmimi i menaxhimit profesional të Google Ads
        </h2>
        <ul className="space-y-2 text-[1.02rem] text-white/68">
          <li><span className="text-accent font-semibold">Paketa bazë:</span> 150–400 €/muaj + buxheti i reklamave</li>
          <li><span className="text-accent font-semibold">Paketa e mesme:</span> 400–700 €/muaj</li>
          <li><span className="text-accent font-semibold">Paketa avancuara:</span> 700–1,500 €/muaj</li>
        </ul>
        <p className="whitespace-pre-line text-[0.95rem] text-white/55">{"Buxheti minimal i reklamave i rekomanduar: 300 €/muaj.\nMenaxhimi profesional ia vlen kur buxheti kalon 500 €/muaj."}</p>
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
