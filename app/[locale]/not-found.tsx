import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { PixelMark } from "@/components/sections/PixelMark";
import { Button } from "@/components/ui/Button";
import { getDictionary } from "@/content/dictionaries";
import { Link } from "@/i18n/navigation";
import { isLocale, routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "404",
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  const requested = await getLocale();
  const locale = isLocale(requested) ? requested : routing.defaultLocale;
  const dict = getDictionary(locale);
  const copy = dict.notFound;

  return (
    <section className="message-page">
      <div className="container message-page__inner">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 className="message-page__title">{copy.title}</h1>
          <p className="lead message-page__text">{copy.text}</p>
          <div className="btn-group btn-group--stack-mobile message-page__actions">
            <Button href="/" icon="arrow">
              {dict.common.backToHome}
            </Button>
            <Button href="/contact" variant="secondary">
              {dict.common.contactUs}
            </Button>
          </div>
          <nav className="message-page__links" aria-labelledby="not-found-links">
            <h2 id="not-found-links">{copy.linksTitle}</h2>
            <ul role="list">
              <li>
                <Link href="/services" className="inline-link">
                  {dict.nav.items.services}
                </Link>
              </li>
              <li>
                <Link href="/work" className="inline-link">
                  {dict.nav.items.work}
                </Link>
              </li>
              <li>
                <Link href="/insights" className="inline-link">
                  {dict.nav.items.insights}
                </Link>
              </li>
              <li>
                <Link href="/about" className="inline-link">
                  {dict.nav.items.about}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <PixelMark missing={12} />
      </div>
    </section>
  );
}
