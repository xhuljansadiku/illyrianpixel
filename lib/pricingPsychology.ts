// Llogaritjet e "framing"-ut te kartat e çmimeve (2026-10-20, strategjia e çmimeve):
// pagesa e ndarë (50/50), këstet (40/30/30) nga €899, "kthehet me ~N klientë" dhe "≈ €X/ditë".
// Të gjitha nxirren nga çmimi real i paketës (me ndryshimet e adminit) — asnjë numër i shpikur.
import type { ServiceCategory } from "@/lib/serviceCategories";

/** Vlera mesatare e një klienti të ri — e njëjta që kalkulatori përdor si parazgjedhje */
export const AVG_CLIENT_VALUE = 300;
/** Mbi këtë çmim (pagesë një herë) ofrohen 3 këste në vend të 50/50 — vendim i userit 2026-10-20:
 *  projektet e vogla 50/50; mbi €1,000: 40% në fillim · 30% pas aprovimit të dizajnit · 30% para lansimit */
export const INSTALLMENTS_ABOVE = 1000;

const ONE_OFF_SLUGS = new Set<ServiceCategory["slug"]>(["website", "ecommerce", "branding-content"]);
const PAYBACK_SLUGS = new Set<ServiceCategory["slug"]>(["website", "ecommerce"]);

/** "€1,199" → 1199. "Nga €1,200", "Ofertë" → null (s'është çmim fiks). */
export function parseEuro(price: string): number | null {
  const m = /^€\s?([\d.,]+)$/.exec(price.trim());
  if (!m) return null;
  const n = Number(m[1].replace(/[.,](?=\d{3}\b)/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : null;
}

export const formatEuro = (n: number) =>
  `€${Number.isInteger(n) ? n.toLocaleString("en-US") : n.toFixed(1)}`;

export type PaymentPlan =
  | { kind: "split"; now: number; launch: number }
  | { kind: "installments"; parts: [number, number, number] };

/** 50% tani / 50% në lansim; mbi €1,000: 40% · 30% · 30%. Pjesët mblidhen gjithmonë te çmimi i plotë. */
export function paymentPlan(amount: number): PaymentPlan {
  if (amount > INSTALLMENTS_ABOVE) {
    const a = Math.round(amount * 0.4);
    const b = Math.round(amount * 0.3);
    return { kind: "installments", parts: [a, b, amount - a - b] };
  }
  const now = Math.ceil(amount / 2);
  return { kind: "split", now, launch: amount - now };
}

/** Sa klientë të rinj e mbulojnë investimin (rrumbullakosur lart — kurrë më optimist se e vërteta) */
export const paybackClients = (amount: number, clientValue = AVG_CLIENT_VALUE) =>
  Math.max(1, Math.ceil(amount / clientValue));

/** Kosto ditore e një pakete mujore, me 1 shifër pas presjes (€249 → 8.3) */
export const perDay = (monthly: number) => Math.round((monthly / 30) * 10) / 10;

export type PriceFraming = {
  plan?: PaymentPlan;
  payback?: number;
  perDay?: number;
};

/** Çfarë framing-u i takon një pakete sipas kategorisë */
export function priceFraming(slug: ServiceCategory["slug"], price: string, recurring: boolean): PriceFraming {
  const amount = parseEuro(price);
  if (!amount) return {};
  if (recurring) return { perDay: perDay(amount) };
  if (!ONE_OFF_SLUGS.has(slug)) return {};
  return {
    plan: paymentPlan(amount),
    payback: PAYBACK_SLUGS.has(slug) ? paybackClients(amount) : undefined,
  };
}
