import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { PlaceholderAware } from "@/components/ui/RichText";
import { company, realValue } from "@/content/company";
import { getDictionary } from "@/content/dictionaries";
import { resolveLocale, type PageProps } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const { meta } = getDictionary(locale);
  return buildMetadata({ locale, href: "/contact", title: meta.contact.title, description: meta.contact.description });
}

export default async function ContactPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const page = dict.contactPage;
  const email = realValue(company.email);
  const phone = realValue(company.phone);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: dict.common.home, href: "/" },
          { name: page.eyebrow, href: "/contact" },
        ])}
      />

      <PageHero
        compact
        breadcrumbs={{
          label: dict.common.breadcrumbLabel,
          items: [{ label: dict.common.home, href: "/" }, { label: page.eyebrow }],
        }}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
      />

      <section className="section section--tight">
        <div className="container contact-layout">
          <div className="contact-card" id="form">
            <h2 className="contact-card__title">{page.formTitle}</h2>
            <ContactForm locale={locale} variant="page" source="contact-page" />
          </div>

          <aside className="contact-aside" aria-label={page.nextTitle}>
            <div>
              <h2 className="contact-aside__title">{page.nextTitle}</h2>
              <ol className="next-steps" role="list">
                {page.nextSteps.map((step) => (
                  <li key={step.title}>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="contact-direct">
              <h2 className="contact-aside__title" style={{ marginBottom: 0 }}>
                {page.directTitle}
              </h2>
              <dl>
                <div>
                  <dt>{page.emailLabel}</dt>
                  <dd>{email ? <a href={`mailto:${email}`}>{email}</a> : <PlaceholderAware value={company.email} />}</dd>
                </div>
                <div>
                  <dt>{page.phoneLabel}</dt>
                  <dd>
                    {phone ? (
                      <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a>
                    ) : (
                      <PlaceholderAware value={company.phone} />
                    )}
                  </dd>
                </div>
              </dl>
              <p className="contact-direct__note">{page.basedIn}</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
