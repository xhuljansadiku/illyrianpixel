import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StartProjectButton } from "@/components/contact/StartProjectButton";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Faq } from "@/components/ui/Faq";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDictionary } from "@/content/dictionaries";
import { SERVICE_IDS, getService, isServiceId } from "@/content/services";
import { Link } from "@/i18n/navigation";
import { resolveLocale, type PageProps } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/structured-data";

type ServicePageProps = PageProps<{ service: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_IDS.map((service) => ({ service }));
}

async function load(params: ServicePageProps["params"]) {
  const { locale: rawLocale, service: id } = await params;
  const locale = resolveLocale(rawLocale);
  if (!isServiceId(id)) notFound();
  return { locale, service: getService(locale, id) };
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { locale, service } = await load(params);
  return buildMetadata({
    locale,
    href: service.href,
    title: service.metaTitle,
    description: service.metaDescription,
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { locale, service } = await load(params);
  const dict = getDictionary(locale);
  const labels = dict.servicePage;
  const related = service.related.map((id) => getService(locale, id));

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            locale,
            href: service.href,
            name: service.title,
            description: service.metaDescription,
            serviceType: service.shortTitle,
          }),
          breadcrumbSchema(locale, [
            { name: dict.common.home, href: "/" },
            { name: labels.servicesCrumb, href: "/services" },
            { name: service.title, href: service.href },
          ]),
          faqSchema(service.faqs),
        ]}
      />

      <PageHero
        breadcrumbs={{
          label: dict.common.breadcrumbLabel,
          items: [
            { label: dict.common.home, href: "/" },
            { label: labels.servicesCrumb, href: "/services" },
            { label: service.title },
          ],
        }}
        before={
          <span className="service-hero__number" aria-hidden="true">
            {service.number}
          </span>
        }
        title={service.title}
        lead={service.intro}
      >
        <StartProjectButton size="lg" icon="arrow" source={`service:${service.id}`}>
          {dict.common.startProject}
        </StartProjectButton>
        <Button href="/services" variant="secondary" size="lg">
          {dict.common.allServices}
        </Button>
      </PageHero>

      <section className="section" aria-labelledby="included-title">
        <div className="container">
          <div className="section-header">
            <SectionHeading id="included-title" title={labels.included} lead={labels.includedLead} />
          </div>
          <ul className="included-grid" role="list">
            {service.included.map((item) => (
              <li key={item.title} className="included-item" data-reveal="">
                <span className="included-item__index" aria-hidden="true" />
                <h3 className="included-item__title">{item.title}</h3>
                <p className="included-item__text">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--subtle">
        <div className="container split split--even">
          <div data-reveal="">
            <h2 className="h3" style={{ marginBottom: "var(--space-6)" }}>
              {labels.fit}
            </h2>
            <ul className="check-list" role="list">
              {service.fit.map((item) => (
                <li key={item}>
                  <Icon name="check" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {service.tools.length > 0 && (
              <div style={{ marginTop: "var(--space-8)" }}>
                <h2 className="h4" style={{ marginBottom: "var(--space-4)" }}>
                  {labels.tools}
                </h2>
                <ul className="tool-list" role="list">
                  {service.tools.map((tool) => (
                    <li key={tool} className="tech-chip">
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div data-reveal="">
            <h2 className="h3" style={{ marginBottom: "var(--space-6)" }}>
              {labels.approach}
            </h2>
            <ol className="approach-list" role="list">
              {service.approach.map((step) => (
                <li key={step.title}>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="service-faq-title">
        <div className="container faq-layout">
          <div className="faq-layout__intro">
            <SectionHeading id="service-faq-title" eyebrow={service.shortTitle} title={labels.faq} />
          </div>
          <Faq items={service.faqs} />
        </div>
      </section>

      <section className="section section--bordered" aria-labelledby="related-title">
        <div className="container">
          <div className="section-header">
            <SectionHeading id="related-title" title={labels.related} />
          </div>
          <div className="related-grid">
            {related.map((item) => (
              <article key={item.id} className="card card--interactive related-card">
                <span className="related-card__number" aria-hidden="true">
                  {item.number}
                </span>
                <h3 className="card__title">
                  <Link href={item.href} className="card__link">
                    {item.title}
                  </Link>
                </h3>
                <p className="card__text">{item.summary}</p>
                <div className="card__footer">
                  <span className="arrow-link" aria-hidden="true">
                    <span className="arrow-link__label">{dict.common.exploreService}</span>
                    <Icon name="arrow-right" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={labels.ctaTitle}
        text={labels.ctaText}
        primaryLabel={dict.common.startProject}
        secondaryLabel={dict.common.contactUs}
        source={`service-cta:${service.id}`}
      />
    </>
  );
}
