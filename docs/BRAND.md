# Nordic Pixel — brand guidelines

A short reference for anyone designing, writing or building for Nordic Pixel.

## Positioning

> We build digital experiences that grow businesses.
> *Vi bygger digitala upplevelser som får företag att växa.*

Strategy + design + technology + marketing + growth — under one roof, as a long-term partner.
Scandinavian: clear, precise, calm and premium. Never a cheap freelancer, a SaaS product or a generic IT firm.

## Logo

The mark is a pixel-built **N** on a 5 × 5 grid. The top-right pixel is Swedish yellow — "the pixel".

| File (`public/brand/`)            | Use                                     |
| --------------------------------- | --------------------------------------- |
| `nordic-pixel-mark.svg`           | Full colour on light backgrounds        |
| `nordic-pixel-mark-white.svg`     | On dark/blue backgrounds (white + yellow) |
| `nordic-pixel-mark-blue.svg`      | One-colour blue                         |
| `nordic-pixel-mark-black.svg`     | One-colour black (print, stamps)        |
| `nordic-pixel-app-icon.svg`       | Favicon, app icon, social avatar        |

- **Wordmark:** "Nordic Pixel" in Manrope Bold (≈750 weight), tracking −0.03em, set to the right of the mark.
- **Clear space:** at least one pixel cell (⅕ of the mark's width) on every side.
- **Minimum size:** 16 px for the mark (it is designed to stay legible at 16 × 16).
- **Don't:** recolour the accent pixel, add gradients or shadows, rotate, outline or combine the logo with other brand marks.
- For print, produce outlined vector artwork of the wordmark in a design tool.

## Colour

Blue leads, yellow accents. Approximate share of any page: **70 % neutral · 20–25 % blue · 5–10 % yellow**.

| Token               | Hex       | Role                                           |
| ------------------- | --------- | ---------------------------------------------- |
| `--np-blue`         | `#006AA7` | Primary: buttons, links, active elements       |
| `--np-blue-dark`    | `#00527F` | Hover states                                   |
| `--np-blue-deep`    | `#001F3F` | Dark sections, CTA bands                       |
| `--np-yellow`       | `#FECC00` | Accent: the pixel, small highlights, CTA on dark |
| `--np-yellow-dark`  | `#D9AD00` | Yellow hover                                   |
| `--np-dark`         | `#0B1117` | Headings, footer                               |
| `--np-gray-900/700/500/300/100` | `#17212B` `#334155` `#64748B` `#CBD5E1` `#F1F5F9` | Text and UI |
| `--np-off-white`    | `#F7F9FC` | Subtle section backgrounds                     |

Contrast (WCAG AA): blue on white 5.8:1 ✓ · white on blue 5.8:1 ✓ · dark text on yellow 12.5:1 ✓ ·
yellow on deep navy 10.9:1 ✓ · **yellow on white 1.5:1 ✗ — never use yellow for text on light backgrounds.**

## Typography

- **Manrope** for headings — bold, tight tracking (−0.025 to −0.035em), balanced line breaks.
- **Inter** for body and UI — 16–18 px body, line height 1.6–1.7.
- Scale: H1 40→80 px, H2 32→56 px, H3 22→32 px (fluid with the viewport).
- Eyebrow labels: 13 px, uppercase, +0.12em tracking, preceded by a yellow 8 px square.

## Brand details

- **The pixel:** a small yellow square — in eyebrows, as the full stop of the hero headline, on the last
  step of the process, in the footer. Use it sparingly; one per view is usually enough.
- **Nordic grid:** hairline grid lines that fade out; pixel clusters in blue tones.
- **Shapes:** squares and soft rectangles (radius 10–24 px). Avoid blobs, heavy gradients and glassmorphism.
- **Motion:** subtle fade-ups and line draws, 150–700 ms, easing `cubic-bezier(.2,.7,.2,1)`; always respect reduced motion.

## Imagery

No stock photos of handshakes or generic AI imagery. Use real project screenshots in device frames,
abstract interface illustrations, or the pixel/grid system. Real team and office photography is welcome when available.

## Voice

Confident, clear, concise, friendly and premium. Swedish copy addresses the reader as **du**.
Prefer concrete benefits over adjectives: *"Clear strategy. Better digital experiences. Measurable growth."*

Never claim to be "the best", "world-class" or "revolutionary", and never invent clients, reviews,
results, awards, certifications, years of experience, partnerships or statistics. Use `[PLACEHOLDERS]`
until real information exists.
