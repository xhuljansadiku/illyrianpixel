import { Button } from "../ui/Button";
import { StartProjectButton } from "../contact/StartProjectButton";

type CtaBandProps = {
  title: string;
  text: string;
  primaryLabel: string;
  /** Secondary action — defaults to the contact page. */
  secondaryLabel?: string;
  source?: string;
  headingLevel?: "h2" | "h3";
};

/** Deep Nordic blue call to action with white type and small yellow accents. */
export function CtaBand({ title, text, primaryLabel, secondaryLabel, source = "cta-band", headingLevel = "h2" }: CtaBandProps) {
  const Heading = headingLevel;
  return (
    <section className="cta-band theme-dark">
      <div className="grid-backdrop" aria-hidden="true" />
      <div className="cta-band__pixels" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="container cta-band__inner" data-reveal="">
        <div>
          <Heading className="cta-band__title">{title}</Heading>
          <p className="cta-band__text">{text}</p>
        </div>
        <div className="btn-group btn-group--stack-mobile cta-band__actions">
          <StartProjectButton variant="yellow" size="lg" icon="arrow" source={source}>
            {primaryLabel}
          </StartProjectButton>
          {secondaryLabel && (
            <Button href="/contact" variant="ghost" size="lg">
              {secondaryLabel}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
