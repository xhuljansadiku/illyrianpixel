import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type Props = { params: { locale: Locale; slug: string } };

export default function WorkSlugRedirectPage({ params }: Props) {
  redirect({ href: `/projektet/${params.slug}`, locale: params.locale });
}

