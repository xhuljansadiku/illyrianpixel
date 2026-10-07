import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { FaqSection, ProposalSection, TechSection, TestimonialsSection } from "@/components/home/HomeSections";
import { Principles } from "@/components/home/Principles";
import { ServiceList } from "@/components/home/ServiceList";
import { TrustBand } from "@/components/home/TrustBand";
import { ProcessTimeline } from "@/components/process/ProcessTimeline";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectGrid } from "@/components/work/ProjectGrid";
import { getDictionary } from "@/content/dictionaries";
import { getProjects } from "@/content/projects";
import { getServices } from "@/content/services";
import { resolveLocale, type PageProps } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, organizationSchema, websiteSchema } from "@/lib/structured-data";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const { meta } = getDictionary(locale);
  return buildMetadata({
    locale,
    href: "/",
    title: meta.home.title,
    description: meta.home.description,
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const home = dict.home;
  const services = getServices(locale);
  const projects = getProjects(locale).slice(0, 3);

  return (
    <>
      <JsonLd
        data={[organizationSchema(dict.meta.home.description), websiteSchema(locale), faqSchema(dict.faq)]}
      />

      <Hero dict={dict} />
      <TrustBand dict={dict} />

      <section className="section" id="services" aria-labelledby="services-title">
        <div className="container services-layout">
          <div className="services-layout__intro">
            <SectionHeading
              id="services-title"
              eyebrow={home.services.eyebrow}
              title={home.services.title}
              lead={home.services.lead}
            />
            <Button href="/services" variant="secondary" icon="arrow">
              {dict.common.allServices}
            </Button>
          </div>
          <ServiceList services={services} moreLabel={dict.common.exploreService} />
        </div>
      </section>

      <section className="section section--bordered" aria-labelledby="why-title">
        <div className="container">
          <SectionHeading id="why-title" eyebrow={home.why.eyebrow} title={home.why.title} />
          <p className="why__statement">{home.why.statement}</p>
          <Principles items={home.why.principles} />
        </div>
      </section>

      <section className="section section--subtle" aria-labelledby="work-title">
        <div className="container">
          <div className="section-header">
            <SectionHeading id="work-title" eyebrow={home.work.eyebrow} title={home.work.title} lead={home.work.lead} />
            {projects.length > 0 && (
              <Button href="/work" variant="secondary" icon="arrow">
                {dict.common.allWork}
              </Button>
            )}
          </div>
          <ProjectGrid projects={projects} locale={locale} dict={dict} />
        </div>
      </section>

      <section className="section" aria-labelledby="process-title">
        <div className="container">
          <div className="section-header">
            <SectionHeading
              id="process-title"
              eyebrow={home.process.eyebrow}
              title={home.process.title}
              lead={home.process.lead}
            />
            <Button href="/process" variant="secondary" icon="arrow">
              {home.process.cta}
            </Button>
          </div>
          <ProcessTimeline steps={dict.processSteps} />
        </div>
      </section>

      <TechSection dict={dict} />
      <TestimonialsSection dict={dict} locale={locale} />
      <ProposalSection dict={dict} />
      <FaqSection dict={dict} items={dict.faq} />

      <CtaBand
        title={home.finalCta.title}
        text={home.finalCta.text}
        primaryLabel={dict.common.startProject}
        secondaryLabel={dict.common.contactUs}
        source="final-cta"
      />
    </>
  );
}
