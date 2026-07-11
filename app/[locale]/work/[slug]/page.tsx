import { redirect } from "next/navigation";

type Props = { params: { slug: string } };

export default function WorkSlugRedirectPage({ params }: Props) {
  redirect(`/projektet/${params.slug}`);
}

