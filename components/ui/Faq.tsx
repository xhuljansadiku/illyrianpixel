import type { FaqItem } from "@/content/types";

/**
 * Accessible accordion built on native <details>/<summary>: works without
 * JavaScript, is keyboard operable and announces its expanded state.
 */
export function Faq({ items, className }: { items: FaqItem[]; className?: string }) {
  return (
    <div className={["faq", className].filter(Boolean).join(" ")}>
      {items.map((item) => (
        <details key={item.question} className="faq__item">
          <summary className="faq__question">
            <span>{item.question}</span>
            <span className="faq__icon" aria-hidden="true" />
          </summary>
          <div className="faq__answer">
            <p>{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
