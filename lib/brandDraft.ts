// Emri i biznesit nga hero-ja te formulari i kontaktit (2026-11-08). Mbahet në memorie, jo në URL:
// çdo URL e faqes shkon te Google Analytics, ndërsa ky është tekst që e ka shkruar vizitori.
type BrandDraft = { business: string; style: string };

let draft: BrandDraft | null = null;

export function setBrandDraft(next: BrandDraft): void {
  draft = next;
}

/** Kthen emrin një herë, që formulari të mos e mbushë sërish në vizitat e mëpasshme. */
export function takeBrandDraft(): BrandDraft | null {
  const current = draft;
  draft = null;
  return current;
}
