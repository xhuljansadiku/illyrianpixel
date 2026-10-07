import type { ReactNode } from "react";
import { Breadcrumbs, type BreadcrumbItem } from "../ui/Breadcrumbs";

type PageHeroProps = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  breadcrumbs?: { items: BreadcrumbItem[]; label: string };
  /** Small line under the lead (dates, reading time, …). */
  meta?: ReactNode;
  compact?: boolean;
  /** Extra content above the title (e.g. a service number or badge). */
  before?: ReactNode;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, lead, breadcrumbs, meta, compact, before, children }: PageHeroProps) {
  return (
    <section className={`page-hero${compact ? " page-hero--compact" : ""}`}>
      <div className="grid-backdrop" aria-hidden="true" />
      <div className="page-hero__pixels" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="container">
        <div className="page-hero__inner">
          {breadcrumbs && <Breadcrumbs items={breadcrumbs.items} label={breadcrumbs.label} />}
          {before}
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="page-hero__title">{title}</h1>
          {lead && <p className="lead page-hero__lead">{lead}</p>}
          {meta && <div className="page-hero__meta">{meta}</div>}
          {children && <div className="btn-group btn-group--stack-mobile page-hero__actions">{children}</div>}
        </div>
      </div>
    </section>
  );
}
