/**
 * Nordic Pixel brand mark: a pixel-built "N" on a 5 × 5 grid. The top-right
 * pixel is Swedish yellow in the full-colour version. Drawn as one path so it
 * stays seamless and recognisable down to 16 × 16 px.
 *
 * Variants: color (blue + yellow) · blue · black · white.
 */
export type LogoVariant = "color" | "blue" | "black" | "white";

/** The "N" (without the accent pixel) on a 20 × 20 grid. */
export const MARK_PATH = "M0 0H4V4H8V8H12V12H16V4H20V20H16V16H12V12H8V8H4V20H0Z";
/** The accent pixel (top-right cell). */
export const MARK_ACCENT = { x: 16, y: 0, size: 4 } as const;

export const BRAND_COLORS = {
  blue: "#006AA7",
  yellow: "#FECC00",
  black: "#0B1117",
  white: "#FFFFFF",
} as const;

function markColors(variant: LogoVariant) {
  switch (variant) {
    case "white":
      return { body: BRAND_COLORS.white, accent: BRAND_COLORS.yellow };
    case "black":
      return { body: BRAND_COLORS.black, accent: BRAND_COLORS.black };
    case "blue":
      return { body: BRAND_COLORS.blue, accent: BRAND_COLORS.blue };
    default:
      return { body: BRAND_COLORS.blue, accent: BRAND_COLORS.yellow };
  }
}

type LogoMarkProps = {
  variant?: LogoVariant;
  size?: number;
  className?: string;
  /** Accessible name; omit when the mark sits next to the visible wordmark. */
  title?: string;
};

export function LogoMark({ variant = "color", size = 26, className, title }: LogoMarkProps) {
  const { body, accent } = markColors(variant);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width={size}
      height={size}
      className={className}
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true, focusable: false })}
    >
      <path d={MARK_PATH} fill={body} />
      <rect x={MARK_ACCENT.x} y={MARK_ACCENT.y} width={MARK_ACCENT.size} height={MARK_ACCENT.size} fill={accent} />
    </svg>
  );
}

/**
 * Mark + wordmark, rendered inside an element with the `logo` class (usually
 * the home link). The wordmark is live text so it stays crisp and selectable.
 */
export function LogoLockup({ variant = "color" }: { variant?: LogoVariant }) {
  return (
    <>
      <LogoMark variant={variant} className="logo__mark" />
      <span className="logo__text">Nordic Pixel</span>
    </>
  );
}
