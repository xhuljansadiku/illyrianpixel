import type { Dictionary } from "@/content/dictionaries";
import { TESTIMONIALS } from "@/content/social-proof";
import type { Locale } from "@/i18n/routing";
import { StartProjectButton } from "../contact/StartProjectButton";
import { Faq } from "../ui/Faq";
import { Icon } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";

/** "Built with modern technology" — only tools that are actually offered, as a calm list. */
export function TechSection({ dict }: { dict: Dictionary }) {
  const tech = dict.home.tech;
  return (
    <section className="section section--bordered" aria-labelledby="tech-title">
      <div className="container">
        <div className="section-header">
          <SectionHeading id="tech-title" eyebrow={tech.eyebrow} title={tech.title} lead={tech.lead} />
        </div>
        <ul className="tech-rows" role="list" data-reveal="">
          {tech.groups.map((group) => (
            <li key={group.title} className="tech-row">
              <h3 className="tech-row__title">{group.title}</h3>
              <ul className="tech-list" role="list">
                {group.items.map((item) => (
                  <li key={item} className="tech-chip">
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Real testimonials only. While there are none, an honest invitation instead. */
export function TestimonialsSection({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const copy = dict.home.testimonials;

  if (TESTIMONIALS.length > 0) {
    return (
      <section className="section section--subtle" aria-labelledby="testimonials-title">
        <div className="container">
          <div className="section-header">
            <SectionHeading id="testimonials-title" eyebrow={copy.eyebrow} title={copy.title} />
          </div>
          <div className="testimonial-grid">
            {TESTIMONIALS.map((testimonial) => (
              <figure key={testimonial.name} className="card testimonial" data-reveal="">
                <blockquote className="testimonial__quote">“{testimonial.quote[locale]}”</blockquote>
                <figcaption className="testimonial__author">
                  <span className="testimonial__name">{testimonial.name}</span>
                  <span className="testimonial__role">
                    {testimonial.role[locale]}, {testimonial.company}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section section--subtle" aria-labelledby="testimonials-title">
      <div className="container">
        <div className="testimonial-cta" data-reveal="">
          <span className="testimonial-cta__mark" aria-hidden="true">
            <Icon name="quote" size={30} />
          </span>
          <h2 id="testimonials-title" className="testimonial-cta__title">
            {copy.emptyTitle}
          </h2>
          <p className="testimonial-cta__text">{copy.emptyText}</p>
          <StartProjectButton icon="arrow" size="lg" source="testimonials">
            {dict.common.startProject}
          </StartProjectButton>
        </div>
      </div>
    </section>
  );
}

/** Pricing teaser without aggressive prices: every proposal is tailored. */
export function ProposalSection({ dict }: { dict: Dictionary }) {
  const copy = dict.home.proposal;
  return (
    <section className="section" aria-labelledby="proposal-title">
      <div className="container proposal">
        <SectionHeading id="proposal-title" eyebrow={copy.eyebrow} title={copy.title} lead={copy.text} />
        <div className="card proposal__card" data-reveal="">
          <ul className="check-list" role="list">
            {copy.points.map((point) => (
              <li key={point}>
                <Icon name="check" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <StartProjectButton icon="arrow" block="mobile" source="proposal">
            {copy.cta}
          </StartProjectButton>
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ dict, items }: { dict: Dictionary; items: Dictionary["faq"] }) {
  const copy = dict.home.faq;
  return (
    <section className="section section--bordered" aria-labelledby="faq-title">
      <div className="container faq-layout">
        <div className="faq-layout__intro">
          <SectionHeading id="faq-title" eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />
        </div>
        <Faq items={items} />
      </div>
    </section>
  );
}
