import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Heading level — h2 for page sections, h1 only in page heroes. */
  as?: "h1" | "h2" | "h3";
  id?: string;
  align?: "start" | "center";
  className?: string;
  titleClassName?: string;
  children?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Heading = "h2",
  id,
  align = "start",
  className,
  titleClassName = "section-title",
  children,
}: SectionHeadingProps) {
  return (
    <div
      className={["section-heading", align === "center" && "section-heading--center", className]
        .filter(Boolean)
        .join(" ")}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Heading id={id} className={titleClassName}>
        {title}
      </Heading>
      {lead && <p className="lead">{lead}</p>}
      {children}
    </div>
  );
}
