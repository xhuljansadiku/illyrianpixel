import type { TitledText } from "@/content/types";

/** Numbered principles/values in an open four-column layout. */
export function Principles({ items, headingLevel = "h3" }: { items: TitledText[]; headingLevel?: "h3" | "h2" }) {
  const Heading = headingLevel;
  return (
    <ol className="principles" role="list">
      {items.map((item, index) => (
        <li
          key={item.title}
          className="principle"
          data-reveal=""
          style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
        >
          <span className="principle__number" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <Heading className="principle__title">{item.title}</Heading>
          <p className="principle__text">{item.text}</p>
        </li>
      ))}
    </ol>
  );
}
