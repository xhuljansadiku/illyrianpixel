import type { Metadata } from "next";
import { StartProjectButton } from "@/components/contact/StartProjectButton";
import { FaqSection } from "@/components/home/HomeSections";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDictionary } from "@/content/dictionaries";
import { resolveLocale, type PageProps } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const { meta } = getDictionary(locale);
  return buildMetadata({ locale, href: "/process", title: meta.process.title, description: meta.process.description });
}

export default async function ProcessPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const page = dict.processPage;
  // Timeline- and collaboration-related questions from the general FAQ.
  const faqs = [dict.faq[0], dict.faq[1], dict.faq[2], dict.faq[6]];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: dict.common.home, href: "/" },
          { name: page.eyebrow, href: "/process" },
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
        <StartProjectButton size="lg" icon="arrow" source="process-hero">
          {dict.common.startProject}
        </StartProjectButton>
      </PageHero>

      <section className="section section--tight">
        <div className="container">
          <ol className="process-steps" role="list">
            {dict.processSteps.map((step, index) => (
              <li key={step.id} id={step.id} className="process-step">
                <div>
                  <span className="process-step__number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="process-step__title">
                    <span className="sr-only">
                      {page.stepLabel} {index + 1}:{" "}
                    </span>
                    {step.title}
                  </h2>
                </div>
                <p className="process-step__description" data-reveal="">
                  {step.description}
                </p>
                <div data-reveal="">
                  <p className="process-step__label">{page.deliverablesLabel}</p>
                  <ul className="check-list" role="list">
                    {step.deliverables.map((item) => (
                      <li key={item}>
                        <Icon name="check" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="process-step__role">
                    <strong>{page.roleLabel}:</strong> {step.role}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--subtle" aria-labelledby="models-title">
        <div className="container">
          <div className="section-header">
            <SectionHeading id="models-title" title={page.modelsTitle} lead={page.modelsLead} />
          </div>
          <ul className="model-grid" role="list">
            {page.models.map((model) => (
              <li key={model.title} className="card model-card" data-reveal="">
                <span className="model-card__index" aria-hidden="true" />
                <h3 className="card__title">{model.title}</h3>
                <p className="card__text">{model.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FaqSection dict={dict} items={faqs} />

      <CtaBand
        title={dict.home.finalCta.title}
        text={dict.home.finalCta.text}
        primaryLabel={dict.common.startProject}
        secondaryLabel={dict.common.contactUs}
        source="process-cta"
      />
    </>
  );
}
