import type { Metadata } from "next";
import { StartProjectButton } from "@/components/contact/StartProjectButton";
import { Principles } from "@/components/home/Principles";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDictionary } from "@/content/dictionaries";
import { resolveLocale, type PageProps } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, organizationSchema } from "@/lib/structured-data";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const { meta } = getDictionary(locale);
  return buildMetadata({ locale, href: "/about", title: meta.about.title, description: meta.about.description });
}

export default async function AboutPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const page = dict.aboutPage;

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(dict.meta.home.description),
          breadcrumbSchema(locale, [
            { name: dict.common.home, href: "/" },
            { name: page.eyebrow, href: "/about" },
          ]),
        ]}
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
        <StartProjectButton size="lg" icon="arrow" source="about-hero">
          {dict.common.startProject}
        </StartProjectButton>
        <Button href="/services" variant="secondary" size="lg">
          {dict.common.allServices}
        </Button>
      </PageHero>

      <section className="section" aria-labelledby="story-title">
        <div className="container split">
          <h2 id="story-title" className="section-title">
            {page.storyTitle}
          </h2>
          <div className="about-story__text" data-reveal="">
            {page.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--bordered" aria-labelledby="values-title">
        <div className="container">
          <SectionHeading id="values-title" title={page.valuesTitle} />
          <Principles items={page.values} />
        </div>
      </section>

      <section className="section section--flush-top" aria-labelledby="capabilities-title">
        <div className="container">
          <div className="capabilities theme-dark" data-reveal="">
            <div>
              <h2 id="capabilities-title" className="h2">
                {page.capabilitiesTitle}
              </h2>
              <p className="capabilities__lead">{page.capabilitiesLead}</p>
            </div>
            <ul className="capability-list" role="list">
              {page.capabilities.map((capability) => (
                <li key={capability}>{capability}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--subtle" aria-labelledby="nordic-title">
        <div className="container">
          <div className="nordic-statement" data-reveal="">
            <p className="eyebrow">Nordic Pixel</p>
            <h2 id="nordic-title">{page.nordicTitle}</h2>
            <p className="nordic-statement__text">{page.nordicText}</p>
          </div>
        </div>
      </section>

      <CtaBand
        title={dict.home.finalCta.title}
        text={dict.home.finalCta.text}
        primaryLabel={dict.common.startProject}
        secondaryLabel={dict.common.contactUs}
        source="about-cta"
      />
    </>
  );
}
