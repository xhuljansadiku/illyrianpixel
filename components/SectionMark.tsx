type SectionMarkProps = {
  label: string;
};

export default function SectionMark({ label }: SectionMarkProps) {
  return (
    <div className="cadence-label mb-4 inline-flex items-center gap-3">
      <span className="noir-mark" aria-hidden />
      <span className="eyebrow">{label}</span>
    </div>
  );
}
