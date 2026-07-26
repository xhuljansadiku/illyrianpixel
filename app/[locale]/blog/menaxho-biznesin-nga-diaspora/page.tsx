import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { buildMetadata, buildBreadcrumb, seo } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import BlogArticleLayout from "@/components/BlogArticleLayout";

type Props = { params: { locale: string } | Promise<{ locale: string }> };

const SLUG = "menaxho-biznesin-nga-diaspora";
const CATEGORY_COLOR = "rgba(125,211,252,0.9)";

const META: Record<Locale, { title: string; description: string; keywords: string[] }> = {
  sq: {
    title: "Menaxho Biznesin nga Diaspora — Udhëzues 2026",
    description:
      "Si e menaxhoni biznesin në Shqipëri ose Kosovë kur jetoni jashtë. Website si zyra juaj digjitale 24/7, pa qenë atje çdo ditë.",
    keywords: ["biznes shqiptar diasporë", "menaxho biznesin nga jashtë", "website biznesi shqiptar gjermani", "administro biznesin online shqipëri"],
  },
  en: {
    title: "Managing Your Albanian Business From Abroad — 2026 Guide",
    description:
      "How to run your business in Albania or Kosovo while living abroad. A website as your 24/7 digital office, without being there every day.",
    keywords: ["albanian business abroad", "manage business from diaspora", "albanian business website germany", "remote business management albania"],
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
          breadcrumbLabel="Managing Your Business From Abroad"
          path={`/blog/${SLUG}`}
          title="I run a business in Albania or Kosovo but live abroad — how to manage it online"
          description="A website as your digital office that keeps working while you sleep in a different timezone."
          date="July 2026"
          readTime="6 min read"
          related={[
            { href: "/blog/website-dygjuhesh-biznes-diaspore", category: "Diaspora", categoryColor: CATEGORY_COLOR, title: "A bilingual website (Albanian + local language) — why every diaspora Albanian business needs one" },
            { href: "/blog/si-te-gjejne-klientet-shqiptare-biznesin-tend", category: "Diaspora", categoryColor: CATEGORY_COLOR, title: "How Albanian customers find your business online, wherever they are" },
          ]}
        >
          <p className="whitespace-pre-line text-[1.05rem] leading-relaxed text-white/72">
            {"Thousands of Albanians and Kosovars now live in Germany, Switzerland, Austria, the US or Canada, while their business a restaurant, a shop, a construction company stays back home.\nThe challenge is the same for everyone: how do you run a business when you're physically 2,000 km away, in a different timezone, and can't be there every day to supervise everything?"}
          </p>

          <section className="space-y-4">
            <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
              Why phone calls and Facebook alone stop being enough
            </h2>
            <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
              {"The traditional solution has been a phone and one trusted person on the ground usually family who answers everything.\nThat works up to a point, but it has real limits: the person back home can't reply to every Facebook message in real time, doesn't always know the latest prices, and new customers often give up before getting an answer."}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
              A website as your digital office, working 24/7
            </h2>
            <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
              {"A well-built website becomes your digital office running 24/7, no matter where you are or what time it is there.\nA customer in Tirana sees your exact prices, services and hours at 10pm while you're asleep in Munich.\nThey don't wait for a reply the information is already there."}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
              What this kind of website actually needs
            </h2>
            <ul className="space-y-3 text-[1.02rem] leading-relaxed text-white/68">
              <li className="whitespace-pre-line"><strong className="text-white">Clear service/pricing pages</strong>{" that don't need frequent manual updates."}</li>
              <li className="whitespace-pre-line"><strong className="text-white">A direct WhatsApp button</strong>{" that rings your phone wherever you are not a local number someone else has to keep answering."}</li>
              <li className="whitespace-pre-line"><strong className="text-white">Google Maps and accurate opening hours</strong>{" for the physical location back home."}</li>
              <li className="whitespace-pre-line"><strong className="text-white">A simple admin panel</strong>{" a trusted person in Albania can use to upload photos or change a price themselves, without asking you every time."}</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
              Your role changes and that&apos;s the point
            </h2>
            <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
              {"You're no longer the one answering every single message you're the one making strategic decisions, while the website and one local person with admin access handle the day-to-day.\nMany diaspora business owners tell us the same thing: \"The website gave me my time back I don't have to be on the phone every minute anymore.\""}
            </p>
            <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
              {"Reporting is the part people forget. If you're abroad, you want to know what's happening without being there: how many contact messages came in this month, which services are requested most, which cities or countries your customers are searching from.\nA simple dashboard with these numbers gives you real control, without having to call someone just to ask \"how's it going?\""}
            </p>
          </section>

          <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 md:p-9">
            <p className="font-display text-[1.1rem] text-white">Running a business back home while living abroad?</p>
            <p className="mt-2 text-[0.95rem] text-white/65">
              {"For most of the diaspora business owners we've helped, a proper website pays for itself within 2-3 months. Free consultation, no obligation."}
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
        breadcrumbLabel="Menaxho Biznesin nga Diaspora"
        path={`/blog/${SLUG}`}
        title="Kam biznes në Shqipëri ose Kosovë, jetoj jashtë — si e menaxhoj online pa qenë atje"
        description="Website si zyra juaj digjitale që punon edhe kur ju flini në një timezone tjetër."
        date="Korrik 2026"
        readTime="6 min lexim"
        related={[
          { href: "/blog/website-dygjuhesh-biznes-diaspore", category: "Diasporë", categoryColor: CATEGORY_COLOR, title: "Website dygjuhësh (shqip + gjuha e vendit) — pse i duhet çdo biznesi shqiptar në diasporë" },
          { href: "/blog/si-te-gjejne-klientet-shqiptare-biznesin-tend", category: "Diasporë", categoryColor: CATEGORY_COLOR, title: "Si e gjejnë klientët shqiptarë biznesin tënd online, kudo që të jenë" },
        ]}
      >
        <p className="whitespace-pre-line text-[1.05rem] leading-relaxed text-white/72">
          {"Mijëra shqiptarë e kosovarë jetojnë sot në Gjermani, Zvicër, Austri, SHBA apo Kanada, ndërsa biznesi i tyre, restoranti, dyqani, kompania e ndërtimit, mbetet në Shqipëri apo Kosovë.\nSfida është e njëjtë për të gjithë: si e menaxhon një biznes kur je fizikisht 2.000 km larg, në një timezone tjetër, dhe s'mund të jesh atje çdo ditë për të mbikëqyrur gjithçka?"}
        </p>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Pse thjesht telefoni dhe Facebook nuk mjaftojnë më
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
            {"Zgjidhja tradicionale ka qenë telefoni dhe një person besnik në vend, zakonisht familje, që përgjigjet për gjithçka.\nKjo funksionon deri në një pikë, por ka limite reale: personi në Shqipëri nuk mund t'i përgjigjet çdo mesazhi Facebook në kohë reale, nuk di gjithmonë çmimet e sakta të përditësuara, dhe klientët e rinj shpesh dorëzohen para se të marrin përgjigje."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Website si zyra juaj digjitale, 24/7
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
            {"Website-i i mirë-ndërtuar bëhet zyra juaj digjitale që punon 24/7, pavarësisht ku jeni ju apo çfarë ore është atje.\nKlienti në Tiranë sheh çmimet, shërbimet dhe orarin e saktë në orën 22:00 kur ju jeni në gjumë në Mynih.\nNuk pret që dikush t'i përgjigjet, informacioni është aty, gati."}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Çfarë duhet të ketë realisht ky lloj website-i
          </h2>
          <ul className="space-y-3 text-[1.02rem] leading-relaxed text-white/68">
            <li className="whitespace-pre-line"><strong className="text-white">Faqe shërbimesh/çmimesh të qarta</strong>{" që s'kanë nevojë përditësim të shpeshtë manual."}</li>
            <li className="whitespace-pre-line"><strong className="text-white">Buton direkt WhatsApp</strong>{" që bie në telefonin tuaj kudo që jeni jo në një numër lokal që dikush tjetër duhet ta mbajë."}</li>
            <li className="whitespace-pre-line"><strong className="text-white">Google Maps dhe orari i saktë</strong>{" i biznesit në vend."}</li>
            <li className="whitespace-pre-line"><strong className="text-white">Panel administrimi i thjeshtë</strong>{" që një person i besuar në Shqipëri mund ta përdorë vetë për të ngarkuar foto apo ndryshuar një çmim, pa ju pyetur çdo herë."}</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-[clamp(1.4rem,2.8vw,1.9rem)] leading-tight text-white">
            Roli juaj ndryshon dhe kjo është pika
          </h2>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
            {"Nuk jeni më ai që përgjigjet çdo mesazhi, jeni ai që merr vendimet strategjike, ndërsa website-i dhe një person lokal me akses admin trajtojnë ditën-për-ditë.\nShumë pronarë biznesesh në diasporë na thonë të njëjtën gjë: \"Website-i më dha kohën time mbrapsht, tani s'më duhet të jem në telefon çdo minutë.\""}
          </p>
          <p className="whitespace-pre-line text-[1.02rem] leading-relaxed text-white/68">
            {"Raportimi është pjesa që shpesh harrohet. Nëse jeni jashtë, doni të dini çfarë ndodh pa qenë atje: sa mesazhe kontakti vijnë në muaj, cilat shërbime kërkohen më shumë, nga cilat qytete apo vende po ju gjejnë klientët.\nNjë panel i thjeshtë me këto numra ju jep kontroll real, pa pasur nevojë të thërrisni dikë për të pyetur \"si po shkon?\""}
          </p>
        </section>

        <div className="rounded-2xl border border-white/12 bg-white/[0.02] p-6 md:p-9">
          <p className="font-display text-[1.1rem] text-white">Drejtoni biznes në atdhe ndërsa jetoni jashtë?</p>
          <p className="mt-2 text-[0.95rem] text-white/65">
            {"Për shumicën e bizneseve që kemi ndihmuar në këtë situatë, website-i i duhur shlyhet vetë brenda 2-3 muajve. Konsultim falas, pa asnjë obligim."}
          </p>
          <Link href="/contact" className="interactive-button ip-cta-primary ip-cta-primary--lg mt-5 inline-flex">
            Na kontaktoni këtu →
          </Link>
        </div>
      </BlogArticleLayout>
    </>
  );
}
