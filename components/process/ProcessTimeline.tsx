import { Link } from "@/i18n/navigation";

type TimelineStep = { id: string; title: string; short: string };

/**
 * Six-step process timeline. Desktop: horizontal, with a progress line that
 * follows the hovered/focused step. Mobile: vertical. The line draws itself
 * when the section scrolls into view. Each step links to its detailed
 * description on the process page. Interactivity is CSS-only.
 */
export function ProcessTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="timeline-wrap" data-reveal="self">
      <div className="timeline__track" aria-hidden="true">
        <div className="timeline__fill" />
      </div>
      <ol className="timeline" role="list">
        {steps.map((step, index) => (
          <li key={step.id} className="timeline__step" style={{ "--i": index } as React.CSSProperties}>
            <Link href={{ pathname: "/process", hash: step.id }} className="timeline__link">
              <span className="timeline__node" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="timeline__title">{step.title}</h3>
                <p className="timeline__text">{step.short}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
