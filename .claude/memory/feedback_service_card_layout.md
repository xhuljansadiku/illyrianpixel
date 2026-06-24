---
name: feedback_service_card_layout
description: Card layout choice depends on content density — compact grid for short overview teasers, banner/bento for richer content
metadata:
  type: feedback
---

Superseded 2026-06-24: the blanket preference for horizontal banner cards no longer holds. On `/sherbimet` (6 short service teasers), the user confirmed a compact vertical grid (`ServiceCompactCard`: icon, ordinal, title, 2-line description, CTA) reads better than the old horizontal `ServiceBannerCard` — banner-style doesn't scale past a few entries and forces excessive scrolling for a short-teaser "overview" page.

**Why:** Card shape should match content density and item count, not a fixed direction. Short teaser lists (many items, little text each) favor compact grids for fast scanning. Dense comparison content (price + feature list + CTA, e.g. `ServicePackageCard` on `/cmimet`) still needs a taller vertical "bento" card — that pattern was never banner-style and is unaffected by this.

**How to apply:** For new "overview/teaser" listings with several short items, default to a compact grid card (see [[ambient-service-icons-pattern]] for the matching hero treatment), not the old banner pattern. For dense comparison/pricing content, keep the existing bento-card pattern. Don't apply either as a universal rule — check the content shape first.
