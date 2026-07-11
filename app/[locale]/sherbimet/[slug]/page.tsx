import type { Metadata } from "next";
import { permanentRedirect, notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { serviceCategories, serviceCategoryBySlug } from "@/lib/serviceCategories";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type RouteParams = { locale: Locale; slug: string };

type Props = { params: RouteParams | Promise<RouteParams> };

export function generateStaticParams() {
  return serviceCategories.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const category = serviceCategoryBySlug(slug);
  if (!category) {
    return buildMetadata("Shërbimet", "Kategori shërbimesh premium.");
  }
  return buildMetadata(category.title, category.short);
}

export default async function SherbimetCategoryPage({ params }: Props) {
  const { locale, slug } = await Promise.resolve(params);
  const category = serviceCategoryBySlug(slug);
  if (!category) notFound();
  permanentRedirect(getPathname({ locale, href: `/services/${category.slug}` }));
}
