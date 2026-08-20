import type { Metadata } from "next";
import { buildMetadata, seo as seoConfig, buildBreadcrumb } from "@/lib/seo";
import DiasporaHubPage from "@/components/DiasporaHubPage";
import type { Locale } from "@/i18n/routing";

type RouteParams = { locale: Locale };
type Props = { params: RouteParams | Promise<RouteParams> };

const META = {
  title: "Website për Biznese Shqiptare në Diasporë",
  desc: "Ndërtojmë website për biznese shqiptare në Gjermani, Britaninë e Madhe, Zvicër, Itali, SHBA dhe Kanada. Konsultim falas, plan brenda 24h, komunikim 100% në shqip.",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await Promise.resolve(params);
  return buildMetadata(META.title, META.desc, "/diaspora", undefined, locale, { sqOnly: true });
}

export const revalidate = 300;

export default function DiasporaIndexPage() {
  const breadcrumbSchema = buildBreadcrumb([
    { name: "Ballina", url: seoConfig.siteUrl },
    { name: "Diasporë", url: `${seoConfig.siteUrl}/diaspora` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <DiasporaHubPage />
    </>
  );
}
