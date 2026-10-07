export const EMAIL_TEMPLATE_KEYS = ["quote_reminder", "invoice_overdue", "stale_contact", "daily_summary", "payment_thank_you"] as const;
export type EmailTemplateKey = (typeof EMAIL_TEMPLATE_KEYS)[number];

export type EmailTemplate = {
  key: EmailTemplateKey;
  subject: string;
  intro: string;
  updated_at: string;
};

export const EMAIL_TEMPLATE_LABELS: Record<EmailTemplateKey, string> = {
  quote_reminder: "Kujtues oferte",
  invoice_overdue: "Kujtesë pagese (faturë e vonuar)",
  stale_contact: "Kontakte pa përgjigje",
  daily_summary: "Përmbledhja ditore (admin)",
  payment_thank_you: "Falënderim pas pagesës",
};

export const EMAIL_TEMPLATE_PLACEHOLDERS: Record<EmailTemplateKey, string[]> = {
  quote_reminder: ["{{number}}", "{{total}}"],
  invoice_overdue: ["{{number}}", "{{total}}"],
  stale_contact: ["{{count}}", "{{plural}}", "{{days}}"],
  daily_summary: [],
  payment_thank_you: ["{{number}}", "{{total}}"],
};

export function applyPlaceholders(text: string, vars: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? "");
}
