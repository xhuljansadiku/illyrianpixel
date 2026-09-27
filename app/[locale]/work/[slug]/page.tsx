import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export default async function WorkSlugRedirectPage(props: Props) {
  const params = await props.params;
  redirect({ href: `/projektet/${params.slug}`, locale: params.locale });
}

