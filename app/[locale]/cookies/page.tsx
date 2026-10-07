import type { Metadata } from "next";
import { LegalPage, legalMetadata } from "@/components/sections/LegalPage";
import { resolveLocale, type PageProps } from "@/lib/page";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return legalMetadata(resolveLocale((await params).locale), "cookies");
}

export default async function CookiesPage({ params }: PageProps) {
  return <LegalPage locale={resolveLocale((await params).locale)} id="cookies" />;
}
