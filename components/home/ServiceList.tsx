import type { Service } from "@/content/services";
import { Link } from "@/i18n/navigation";
import { Icon } from "../ui/Icon";

type ServiceListProps = {
  services: Service[];
  moreLabel: string;
  headingLevel?: "h3" | "h2";
};

/**
 * Editorial list of services: number, title, short description and arrow.
 * The whole row is clickable; only the title is the link's accessible name.
 */
export function ServiceList({ services, moreLabel, headingLevel = "h3" }: ServiceListProps) {
  const Heading = headingLevel;
  return (
    <ol className="service-list" role="list" data-reveal="">
      {services.map((service) => (
        <li key={service.id} className="service-row">
          <span className="service-row__number" aria-hidden="true">
            {service.number}
          </span>
          <div>
            <Heading className="service-row__title">
              <Link href={service.href} className="service-row__link">
                {service.title}
              </Link>
            </Heading>
            <p className="service-row__summary">{service.summary}</p>
            <span className="service-row__more" aria-hidden="true">
              {moreLabel}
              <Icon name="arrow-right" />
            </span>
          </div>
          <span className="service-row__arrow" aria-hidden="true">
            <Icon name="arrow-right" />
          </span>
        </li>
      ))}
    </ol>
  );
}
