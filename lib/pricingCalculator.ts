// Llogaritja e kalkulatorit te /cmimet (2026-10-21), e nxjerrë nga PricingCalculator që të testohet.
import { paybackClients } from "@/lib/pricingPsychology";

export type CalculatorExtra = { price: number; monthly?: boolean };

/** Nën këtë vlerë për klient (p.sh. fusha bosh) s'shfaqet numri i klientëve — do dilte "599 klientë" */
export const MIN_CLIENT_VALUE = 10;

/** "€1,199" → 1199, "Nga €1,200" → 1200 (kalkulatori e tregon si "nga") */
export function parseCalculatorPrice(price: string): number {
  return Number(price.replace(/[^\d]/g, "")) || 0;
}

export function calculatorEstimate(price: string, monthly: boolean, extras: CalculatorExtra[], clientValue: number) {
  const basePrice = parseCalculatorPrice(price);
  // Shtesat vlejnë vetëm për projektet një-herë; mirëmbajtja mujore shfaqet veç, s'hyn në total
  const extrasOnce = monthly ? 0 : extras.filter((e) => !e.monthly).reduce((sum, e) => sum + e.price, 0);
  const extrasMonthly = monthly ? 0 : extras.filter((e) => e.monthly).reduce((sum, e) => sum + e.price, 0);
  const total = basePrice + extrasOnce;
  return {
    total,
    extrasMonthly,
    isFrom: /nga|from/i.test(price),
    paybackCount: clientValue >= MIN_CLIENT_VALUE ? paybackClients(total, clientValue) : null,
  };
}
