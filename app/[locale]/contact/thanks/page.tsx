import type { Metadata } from "next";
import { PixelMark } from "@/components/sections/PixelMark";
import { Button } from "@/components/ui/Button";
import { getDictionary } from "@/content/dictionaries";
import { resolveLocale, type PageProps } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";

// Landing page for inquiries sent without JavaScript (and a clean URL for
// conversion tracking later). Not indexed.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const { meta } = getDictionary(locale);
  return buildMetadata({
    locale,
    href: "/contact/thanks",
    title: meta.thanks.title,
    description: meta.thanks.description,
    noindex: true,
  });
}

export default async function ThanksPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const page = dict.thanksPage;

  return (
    <section className="message-page">
      <div className="container message-page__inner">
        <div>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1 className="message-page__title">{page.title}</h1>
          <p className="lead message-page__text">{page.text}</p>
          <div className="btn-group btn-group--stack-mobile message-page__actions">
            <Button href="/" icon="arrow">
              {dict.common.backToHome}
            </Button>
            <Button href="/process" variant="secondary">
              {page.secondary}
            </Button>
          </div>
        </div>
        <PixelMark />
      </div>
    </section>
  );
}
