// Tipet dhe llogaritjet e përbashkëta për Oferta & Fatura (client + server safe).

export type QuoteItem = {
  description: string;
  qty: number;
  price: number;
};

export type QuoteRecord = {
  id: number;
  number: string;
  kind: "quote" | "invoice";
  contact_id: string | null;
  client_name: string;
  client_email: string | null;
  client_business: string | null;
  items: QuoteItem[];
  discount: number;
  tax_rate: number;
  notes: string | null;
  status: "draft" | "sent" | "accepted" | "rejected" | "paid";
  issued_at: string;
  due_at: string | null;
  created_at: string;
  updated_at: string;
  public_token?: string | null;
  accepted_at?: string | null;
  declined_at?: string | null;
  client_note?: string | null;
  reminders_sent?: number;
  last_reminder_at?: string | null;
  viewed_at?: string | null;
  view_count?: number;
};

export type RecurringInvoice = {
  id: number;
  contact_id: string | null;
  client_name: string;
  client_email: string | null;
  client_business: string | null;
  items: QuoteItem[];
  discount: number;
  tax_rate: number;
  notes: string | null;
  day_of_month: number;
  active: boolean;
  last_generated: string | null;
  created_at: string;
};

export function quotePublicUrl(token: string): string {
  return `https://illyrianpixel.com/oferta/${token}`;
}

export const QUOTE_STATUS_LABELS: Record<QuoteRecord["status"], string> = {
  draft: "Draft",
  sent: "Dërguar",
  accepted: "Pranuar",
  rejected: "Refuzuar",
  paid: "Paguar",
};

export const QUOTE_KIND_LABELS: Record<QuoteRecord["kind"], string> = {
  quote: "Ofertë",
  invoice: "Faturë",
};

export function parseQuoteItems(raw: unknown): QuoteItem[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 30) return null;
  const items: QuoteItem[] = [];
  for (const it of raw as { description?: unknown; qty?: unknown; price?: unknown }[]) {
    const description = String(it?.description ?? "").trim().slice(0, 300);
    const qty = Number(it?.qty);
    const price = Number(it?.price);
    if (!description || !Number.isFinite(qty) || qty <= 0 || !Number.isFinite(price) || price < 0) return null;
    items.push({ description, qty, price });
  }
  return items;
}

export function quoteTotals(items: QuoteItem[], discount: number, taxRate: number) {
  const subtotal = items.reduce((sum, it) => sum + (Number(it.qty) || 0) * (Number(it.price) || 0), 0);
  const afterDiscount = Math.max(0, subtotal - (Number(discount) || 0));
  const tax = afterDiscount * ((Number(taxRate) || 0) / 100);
  return {
    subtotal,
    discount: Math.min(subtotal, Number(discount) || 0),
    tax,
    total: afterDiscount + tax,
  };
}

export function formatMoney(value: number): string {
  return `€${value.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
