import Image from "next/image";
import type { Project } from "@/content/projects";
import type { ServiceId } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { Icon } from "../ui/Icon";
import { PlaceholderAware } from "../ui/RichText";
import { ProjectMockup } from "./ProjectMockup";

type ProjectCardProps = {
  project: Project;
  serviceNames: Record<ServiceId, string>;
  labels: { viewCaseStudy: string; placeholder: string };
  headingLevel?: "h2" | "h3";
  priority?: boolean;
};

export function ProjectCard({ project, serviceNames, labels, headingLevel = "h3", priority }: ProjectCardProps) {
  const Heading = headingLevel;
  const href = { pathname: "/work/[slug]" as const, params: { slug: project.slug } };

  return (
    <article className="project-card">
      <div className={`project-card__media theme-bg--${project.theme}`}>
        {project.images?.cover ? (
          <Image
            src={project.images.cover}
            alt={project.imageAlt}
            fill
            sizes="(min-width: 1024px) 60vw, (min-width: 768px) 50vw, 100vw"
            priority={priority}
          />
        ) : (
          <ProjectMockup kind={project.mockup} theme={project.theme} />
        )}
        {project.placeholder && <span className="badge badge--placeholder project-card__badge">{labels.placeholder}</span>}
      </div>

      <div className="project-card__body">
        <ul className="project-card__meta" role="list">
          <li>
            <PlaceholderAware value={project.industry} />
          </li>
          {project.services.map((service) => (
            <li key={service}>{serviceNames[service]}</li>
          ))}
        </ul>
        <Heading className="project-card__title">
          <Link href={href} className="project-card__link">
            <PlaceholderAware value={project.client} />
          </Link>
        </Heading>
        <p className="project-card__summary">
          <PlaceholderAware value={project.summary} />
        </p>
        <span className="arrow-link project-card__cta" aria-hidden="true">
          <span className="arrow-link__label">{labels.viewCaseStudy}</span>
          <Icon name="arrow-right" />
        </span>
      </div>
    </article>
  );
}
