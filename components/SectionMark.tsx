type SectionMarkProps = {
  label: string;
  /** Extra classes for the label (e.g. wider letter-spacing). */
  eyebrowClassName?: string;
};

export default function SectionMark({ label, eyebrowClassName }: SectionMarkProps) {
  return (
    <div className="cadence-label mb-4 inline-flex items-center gap-3">
      <span className="noir-mark" aria-hidden>
        <span className="noir-mark-orbit" />
      </span>
      <span className={eyebrowClassName ? `eyebrow ${eyebrowClassName}` : "eyebrow"}>{label}</span>
    </div>
  );
}
