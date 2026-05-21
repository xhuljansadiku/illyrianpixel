---
name: feedback_service_card_layout
description: User prefers horizontal banner-style service cards over vertical grid cards
metadata:
  type: feedback
---

User strongly prefers the horizontal banner card layout (`ServiceBannerCard`) over the previous vertical dark grid (`ServiceOverviewLuxCard`).

**Why:** The horizontal layout (image/visual on one side, title + description + CTA button on the other) feels more premium and readable. Alternating the visual side (left/right on odd/even) adds visual rhythm.

**How to apply:** When adding new services or redesigning card sections, default to the horizontal `ServiceBannerCard` pattern. The gold-filled button (`bg-[#D4AF37]` with dark text) is preferred over outline-only buttons for CTAs in cards.
