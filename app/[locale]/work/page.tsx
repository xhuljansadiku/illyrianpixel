import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type Props = { params: { locale: Locale } | Promise<{ locale: Locale }> };

export default async function WorkRedirectPage({ params }: Props) {
  const { locale } = await Promise.resolve(params);
  redirect({ href: "/projektet", locale });
}

