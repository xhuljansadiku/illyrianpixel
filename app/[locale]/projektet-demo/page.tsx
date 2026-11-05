import type { Metadata } from "next";
import { getCaseStudies } from "@/lib/caseStudies";
import ProjektetDemoClient from "@/components/ProjektetDemoClient";
import type { Locale } from "@/i18n/routing";

/** DEMO (2026-11-05): 4 pamje për /projektet — fshihet pasi pronari zgjedh një */
export const metadata: Metadata = {
  title: "Demo · Projektet",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: Locale }> };

export default async function ProjektetDemoPage(props: Props) {
  const { locale } = await props.params;
  return <ProjektetDemoClient projects={getCaseStudies(locale)} />;
}
