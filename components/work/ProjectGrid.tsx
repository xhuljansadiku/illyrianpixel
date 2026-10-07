import type { Dictionary } from "@/content/dictionaries";
import type { Project } from "@/content/projects";
import { getServices } from "@/content/services";
import type { ServiceId } from "@/content/types";
import type { Locale } from "@/i18n/routing";
import { StartProjectButton } from "../contact/StartProjectButton";
import { ProjectCard } from "./ProjectCard";

type ProjectGridProps = {
  projects: Project[];
  locale: Locale;
  dict: Dictionary;
  headingLevel?: "h2" | "h3";
  featured?: boolean;
};

/** Project cards, or an honest empty state while there are no case studies yet. */
export function ProjectGrid({ projects, locale, dict, headingLevel = "h3", featured = true }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="work-empty" data-reveal="">
        <p className="work-empty__title">{dict.home.work.emptyTitle}</p>
        <p className="work-empty__text">{dict.home.work.emptyText}</p>
        <StartProjectButton icon="arrow" source="work-empty">
          {dict.common.startProject}
        </StartProjectButton>
      </div>
    );
  }

  const serviceNames = Object.fromEntries(getServices(locale).map((service) => [service.id, service.shortTitle])) as Record<
    ServiceId,
    string
  >;

  return (
    <div className={`project-grid${featured ? " project-grid--featured" : ""}`}>
      {projects.map((project, index) => (
        <div key={project.slug} className="project-grid__item" data-reveal="">
          <ProjectCard
            project={project}
            serviceNames={serviceNames}
            labels={{ viewCaseStudy: dict.common.viewCaseStudy, placeholder: dict.common.placeholder }}
            headingLevel={headingLevel}
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}
