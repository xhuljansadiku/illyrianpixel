import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import BlogArticleLayout from "@/components/BlogArticleLayout";

export const metadata: Metadata = buildMetadata(
  "Sa kushton website profesional në Shqipëri 2026?",
  "Çmimet reale të website-ve në Shqipëri për 2026. Zbuloni sa kushton faqja profesionale, çfarë përfshin dhe si të shmangni gabimet e shtrenjta.",
  "/blog/sa-kushton-website-shqiperi",
  ["sa kushton website shqipëri 2026", "çmimi website shqipëri", "web design çmim", "agjenci web tiranë"]
);

export default function Page() {
  return (
    <BlogArticleLayout
      category="Web Design"
      categoryColor="rgba(234,206,113,0.95)"
      title="Sa kushton një website profesional në Shqipëri në 2026?"
      description={<>{"Çmimet reale të website-ve në Shqipëri për 2026."}<br className="max-md:hidden" />{" Zbuloni sa kushton faqja profesionale, çfarë përfshin dhe si të shmangni gabimet e shtrenjta."}</>}
      date="Maj 2026"
      readTime="6 min lexim"
      related={[
        { href: "/blog/web-design-tirane", category: "Web Design", categoryColor: "rgba(234,206,113,0.95)", title: "Web Design Tiranë — Si të zgjidhni agjenci profesionale" },
        { href: "/blog/seo-tirane", category: "SEO", categoryColor: "rgba(167,243,208,0.9)", title: "SEO Tiranë — Si të dilni i pari në Google në 2026" },
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
