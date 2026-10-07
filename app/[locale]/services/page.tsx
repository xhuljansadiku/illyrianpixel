import type { Metadata } from "next";
import { StartProjectButton } from "@/components/contact/StartProjectButton";
import { FaqSection } from "@/components/home/HomeSections";
import { ProcessTimeline } from "@/components/process/ProcessTimeline";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDictionary } from "@/content/dictionaries";
import { getServices } from "@/content/services";
import { Link } from "@/i18n/navigation";
import { resolveLocale, type PageProps } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const { meta } = getDictionary(locale);
  return buildMetadata({ locale, href: "/services", title: meta.services.title, description: meta.services.description });
}

export default async function ServicesPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const page = dict.servicesPage;
  const services = getServices(locale);
  // Service-related questions from the general FAQ.
  const faqs = [dict.faq[3], dict.faq[4], dict.faq[5], dict.faq[7], dict.faq[8]];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: dict.common.home, href: "/" },
          { name: page.eyebrow, href: "/services" },
        ])}
      />

      <PageHero
        breadcrumbs={{
          label: dict.common.breadcrumbLabel,
          items: [{ label: dict.common.home, href: "/" }, { label: page.eyebrow }],
        }}
        eyebrow={page.eyebrow}
        title={page.title}
        lead={page.lead}
      >
        <StartProjectButton size="lg" icon="arrow" source="services-hero">
          {dict.common.startProject}
        </StartProjectButton>
      </PageHero>

      <section className="section section--tight">
        <div className="container">
          <ol className="service-blocks" role="list">
            {services.map((service) => (
              <li key={service.id} className="service-block" id={service.id} data-reveal="">
                <div>
                  <span className="service-block__number">{service.number}</span>
                  <h2 className="service-block__title">
                    <Link href={service.href}>{service.title}</Link>
                  </h2>
                  <p className="service-block__summary">{service.intro}</p>
                  <div className="service-block__link">
                    <Link href={service.href} className="arrow-link">
                      <span className="arrow-link__label">{dict.common.exploreService}</span>
                      <Icon name="arrow-right" />
                      <span className="sr-only">: {service.title}</span>
                    </Link>
                  </div>
                </div>
                <div>
                  <p className="service-block__label">{page.includedLabel}</p>
                  <ul className="check-list" role="list">
                    {service.included.slice(0, 4).map((item) => (
                      <li key={item.title}>
                        <Icon name="check" />
                        <span>{item.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="container">
          <div className="whole-band theme-dark" data-reveal="">
            <div className="grid-backdrop" aria-hidden="true" />
            <div style={{ position: "relative" }}>
              <h2 className="h2">{page.wholeTitle}</h2>
              <p className="whole-band__text">{page.wholeText}</p>
            </div>
            <ul className="check-list" role="list" style={{ position: "relative" }}>
              {page.wholePoints.map((point) => (
                <li key={point}>
                  <Icon name="check" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--bordered" aria-labelledby="process-title">
        <div className="container">
          <div className="section-header">
            <SectionHeading
              id="process-title"
              eyebrow={dict.home.process.eyebrow}
              title={dict.home.process.title}
              lead={dict.home.process.lead}
            />
            <Button href="/process" variant="secondary" icon="arrow">
              {dict.home.process.cta}
            </Button>
          </div>
          <ProcessTimeline steps={dict.processSteps} />
        </div>
      </section>

      <FaqSection dict={dict} items={faqs} />

      <CtaBand
        title={dict.home.finalCta.title}
        text={dict.home.finalCta.text}
        primaryLabel={dict.common.startProject}
        secondaryLabel={dict.common.contactUs}
        source="services-cta"
      />
    </>
  );
}
