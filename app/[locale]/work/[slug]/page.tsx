import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PlaceholderAware } from "@/components/ui/RichText";
import { DeviceScreenMockup, ProjectMockup } from "@/components/work/ProjectMockup";
import { getDictionary } from "@/content/dictionaries";
import { PROJECT_SLUGS, getProject, getProjects, type Project } from "@/content/projects";
import { getServices } from "@/content/services";
import { Link } from "@/i18n/navigation";
import { resolveLocale, type PageProps } from "@/lib/page";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";

type CaseStudyProps = PageProps<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECT_SLUGS.map((slug) => ({ slug }));
}

async function load(params: CaseStudyProps["params"]) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const project = getProject(locale, slug);
  if (!project) notFound();
  return { locale, project };
}

export async function generateMetadata({ params }: CaseStudyProps): Promise<Metadata> {
  const { locale, project } = await load(params);
  const { meta } = getDictionary(locale);
  return buildMetadata({
    locale,
    href: { pathname: "/work/[slug]", params: { slug: project.slug } },
    title: project.placeholder ? meta.work.title : project.client,
    description: project.placeholder ? meta.work.description : project.summary,
    // Placeholder case studies must never be indexed.
    noindex: project.placeholder,
  });
}

function DeviceShot({ project, device, label }: { project: Project; device: "desktop" | "tablet" | "mobile"; label: string }) {
  const src = project.images?.[device];
  return (
    <figure className={`device device--${device}`}>
      <div className="device__frame">
        <div className="device__screen">
          {src ? (
            <Image src={src} alt={`${project.imageAlt} — ${label}`} fill sizes="(min-width: 768px) 50vw, 100vw" />
          ) : (
            <DeviceScreenMockup device={device} kind={project.mockup} />
          )}
        </div>
      </div>
      <figcaption className="device__caption">
        {src ? label : <span className="is-placeholder">[{label.toUpperCase()} SCREENSHOT]</span>}
      </figcaption>
    </figure>
  );
}

export default async function CaseStudyPage({ params }: CaseStudyProps) {
  const { locale, project } = await load(params);
  const dict = getDictionary(locale);
  const labels = dict.caseStudy;
  const services = getServices(locale).filter((service) => project.services.includes(service.id));
  const all = getProjects(locale);
  const next = all[(all.findIndex((item) => item.slug === project.slug) + 1) % all.length];
  const href = { pathname: "/work/[slug]" as const, params: { slug: project.slug } };

  return (
    <>
      {!project.placeholder && (
        <JsonLd
          data={breadcrumbSchema(locale, [
            { name: dict.common.home, href: "/" },
            { name: labels.workCrumb, href: "/work" },
            { name: project.client, href },
          ])}
        />
      )}

      <PageHero
        breadcrumbs={{
          label: dict.common.breadcrumbLabel,
          items: [
            { label: dict.common.home, href: "/" },
            { label: labels.workCrumb, href: "/work" },
            { label: project.client },
          ],
        }}
        before={
          project.placeholder ? (
            <p style={{ marginBottom: "var(--space-5)" }}>
              <span className="badge badge--placeholder">{dict.common.placeholder}</span>{" "}
              <span className="text-small text-muted">{dict.common.placeholderNote}</span>
            </p>
          ) : undefined
        }
        title={<PlaceholderAware value={project.client} />}
        lead={<PlaceholderAware value={project.summary} />}
      />

      <section className="section section--tight">
        <div className="container">
          <div className={`case-cover theme-bg--${project.theme}`} data-reveal="">
            {project.images?.cover ? (
              <Image src={project.images.cover} alt={project.imageAlt} fill sizes="100vw" priority />
            ) : (
              <ProjectMockup kind={project.mockup} theme={project.theme} />
            )}
          </div>

          <dl className="case-meta">
            <div>
              <dt>{labels.client}</dt>
              <dd>
                <PlaceholderAware value={project.client} />
              </dd>
            </div>
            <div>
              <dt>{labels.industry}</dt>
              <dd>
                <PlaceholderAware value={project.industry} />
              </dd>
            </div>
            <div>
              <dt>{labels.location}</dt>
              <dd>
                <PlaceholderAware value={project.location} />
              </dd>
            </div>
            <div>
              <dt>{labels.services}</dt>
              <dd>
                {services.map((service, index) => (
                  <span key={service.id}>
                    {index > 0 && ", "}
                    <Link href={service.href} className="inline-link">
                      {service.shortTitle}
                    </Link>
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="container">
          {[
            { title: labels.challenge, text: project.challenge },
            { title: labels.strategy, text: project.strategy },
            { title: labels.solution, text: project.solution },
          ].map((block) => (
            <div key={block.title} className="case-section" data-reveal="">
              <h2 className="case-section__title">{block.title}</h2>
              <p className="case-section__text">
                <PlaceholderAware value={block.text} />
              </p>
            </div>
          ))}

          {project.results.length > 0 && (
            <div className="case-section" data-reveal="">
              <h2 className="case-section__title">{labels.results}</h2>
              <ul className="case-results" role="list">
                {project.results.map((result, index) => (
                  <li key={index} className="case-result">
                    <span className="case-result__value">
                      <PlaceholderAware value={result.value} />
                    </span>
                    <span className="case-result__label">
                      <PlaceholderAware value={result.label} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="case-section" data-reveal="">
            <h2 className="case-section__title">{labels.gallery}</h2>
            <div className="device-gallery">
              <DeviceShot project={project} device="desktop" label={labels.desktop} />
              <DeviceShot project={project} device="tablet" label={labels.tablet} />
              <DeviceShot project={project} device="mobile" label={labels.mobile} />
            </div>
          </div>

          {project.url && (
            <div className="case-section">
              <span />
              <div>
                <Button externalHref={project.url} variant="secondary" icon="arrow-up-right">
                  {labels.visitSite}
                </Button>
              </div>
            </div>
          )}

          {next && next.slug !== project.slug && (
            <nav className="case-next" aria-label={labels.nextProject}>
              <div>
                <p className="case-next__label">{labels.nextProject}</p>
                <p className="case-next__title">
                  <Link href={{ pathname: "/work/[slug]", params: { slug: next.slug } }}>
                    <PlaceholderAware value={next.client} />
                  </Link>
                </p>
              </div>
              <Link href="/work" className="arrow-link">
                <span className="arrow-link__label">{labels.backToWork}</span>
                <Icon name="arrow-right" />
              </Link>
            </nav>
          )}
        </div>
      </section>

      <CtaBand
        title={labels.ctaTitle}
        text={labels.ctaText}
        primaryLabel={dict.common.startProject}
        secondaryLabel={dict.common.contactUs}
        source={`case:${project.slug}`}
      />
    </>
  );
}
