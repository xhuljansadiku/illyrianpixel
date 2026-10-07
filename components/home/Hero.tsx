import type { Dictionary } from "@/content/dictionaries";
import { LogoMark } from "../brand/Logo";
import { StartProjectButton } from "../contact/StartProjectButton";
import { Button } from "../ui/Button";

const GRID_COLUMNS = 8;
const GRID_ROWS = 7;

/**
 * Lit cells trace the "N" of the logo mark at large scale, drawn in order:
 * left stroke top→bottom, diagonal, right stroke bottom→top, then the accent.
 */
const LIT_CELLS: { col: number; row: number; tone?: "soft" | "accent" }[] = [
  { col: 3, row: 0 },
  { col: 3, row: 1 },
  { col: 3, row: 2 },
  { col: 3, row: 3 },
  { col: 3, row: 4 },
  { col: 4, row: 1 },
  { col: 5, row: 2 },
  { col: 6, row: 3 },
  { col: 7, row: 4 },
  { col: 7, row: 3 },
  { col: 7, row: 2 },
  { col: 7, row: 1 },
  { col: 7, row: 0, tone: "accent" },
  { col: 1, row: 3, tone: "soft" },
  { col: 2, row: 1, tone: "soft" },
  { col: 6, row: 6, tone: "soft" },
];

function PixelGrid() {
  const lookup = new Map(LIT_CELLS.map((cell, index) => [`${cell.col}:${cell.row}`, { ...cell, index }]));

  return (
    <div className="pixel-grid">
      {Array.from({ length: GRID_COLUMNS * GRID_ROWS }, (_, index) => {
        const col = index % GRID_COLUMNS;
        const row = Math.floor(index / GRID_COLUMNS);
        const cell = lookup.get(`${col}:${row}`);
        const className = [
          "pixel-grid__cell",
          cell && "is-lit",
          cell?.tone === "soft" && "is-soft",
          cell?.tone === "accent" && "is-accent",
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <span
            key={index}
            className={className}
            style={cell ? ({ "--i": cell.index } as React.CSSProperties) : undefined}
          />
        );
      })}
    </div>
  );
}

function HeroVisual({ url, disciplines }: { url: string; disciplines: string[] }) {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-visual__panel">
        <PixelGrid />
      </div>

      <div className="browser hero-visual__browser">
        <div className="browser__bar">
          <span className="browser__dots">
            <span />
            <span />
            <span />
          </span>
          <span className="browser__url">{url}</span>
        </div>
        <div className="browser__body">
          <div className="mock-nav">
            <span className="mock-nav__logo" />
            <span className="mock-nav__links">
              <span />
              <span />
              <span />
            </span>
          </div>
          <div className="mock-hero">
            <div className="mock-hero__text">
              <span className="mock-line mock-line--title" style={{ width: "92%" }} />
              <span className="mock-line mock-line--title" style={{ width: "70%" }} />
              <span className="mock-line" style={{ width: "86%", marginTop: 6 }} />
              <span className="mock-line" style={{ width: "64%" }} />
              <span className="mock-button" />
            </div>
            <div className="mock-image" />
          </div>
          <div className="mock-cards">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      <div className="hero-visual__card">
        <ul>
          {disciplines.map((discipline) => (
            <li key={discipline}>{discipline}</li>
          ))}
        </ul>
      </div>

      <div className="hero-visual__mark">
        <LogoMark />
      </div>
    </div>
  );
}

export function Hero({ dict }: { dict: Dictionary }) {
  const hero = dict.home.hero;
  // The yellow "pixel" doubles as the headline's full stop; it stays attached
  // to the last word so it never wraps onto a line of its own.
  const words = hero.title.trim().split(" ");
  const lastWord = (words.pop() ?? "").replace(/[.!]$/, "");

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="grid-backdrop" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__content">
          <p className="eyebrow animate-in">{hero.eyebrow}</p>
          <h1 id="hero-title" className="hero__title">
            {words.join(" ")} <span className="hero__title-end">{lastWord}</span>
          </h1>
          <p className="lead hero__lead animate-in" style={{ "--delay": "120ms" } as React.CSSProperties}>
            {hero.lead}
          </p>
          <div
            className="btn-group btn-group--stack-mobile hero__actions animate-in"
            style={{ "--delay": "200ms" } as React.CSSProperties}
          >
            <StartProjectButton size="lg" icon="arrow" source="hero">
              {dict.common.startProject}
            </StartProjectButton>
            <Button href="/work" variant="secondary" size="lg">
              {dict.common.viewOurWork}
            </Button>
          </div>
          <p className="hero__note animate-in" style={{ "--delay": "280ms" } as React.CSSProperties}>
            {hero.note}
          </p>
        </div>

        <HeroVisual url={hero.visual.url} disciplines={hero.visual.disciplines} />
      </div>
    </section>
  );
}
