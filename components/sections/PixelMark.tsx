/**
 * Large 5 × 5 pixel rendition of the logo "N", used on the 404 page (with one
 * pixel missing) and the thank-you page (complete, with the yellow accent).
 */
const N_CELLS = new Set([0, 5, 10, 15, 20, 6, 12, 18, 9, 14, 19, 24, 4]);
const ACCENT = 4;

export function PixelMark({ missing }: { missing?: number }) {
  let order = 0;
  return (
    <div className="pixel-mark" aria-hidden="true">
      {Array.from({ length: 25 }, (_, index) => {
        const isOn = N_CELLS.has(index);
        if (missing === index) return <span key={index} className="is-missing" />;
        if (!isOn) return <span key={index} />;
        const className = index === ACCENT ? "is-on is-accent" : "is-on";
        return <span key={index} className={className} style={{ "--i": order++ } as React.CSSProperties} />;
      })}
    </div>
  );
}
