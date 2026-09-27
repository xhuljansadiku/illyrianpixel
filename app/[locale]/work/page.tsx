import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale }> };

export default async function WorkRedirectPage(props: Props) {
  const { locale } = await props.params;
  redirect({ href: "/projektet", locale });
}

