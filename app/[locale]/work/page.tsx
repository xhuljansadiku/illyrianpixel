import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProjectGrid } from "@/components/work/ProjectGrid";
import { getDictionary } from "@/content/dictionaries";
import { getProjects } from "@/content/projects";
import { resolveLocale, type PageProps } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const { meta } = getDictionary(locale);
  return buildMetadata({ locale, href: "/work", title: meta.work.title, description: meta.work.description });
}

export default async function WorkPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const dict = getDictionary(locale);
  const page = dict.workPage;
  const projects = getProjects(locale);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: dict.common.home, href: "/" },
          { name: page.eyebrow, href: "/work" },
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
      />

      <section className="section">
        <div className="container">
          <ProjectGrid projects={projects} locale={locale} dict={dict} headingLevel="h2" />
        </div>
      </section>

      <CtaBand
        title={dict.caseStudy.ctaTitle}
        text={dict.caseStudy.ctaText}
        primaryLabel={dict.common.startProject}
        secondaryLabel={dict.common.contactUs}
        source="work-cta"
      />
    </>
  );
}
