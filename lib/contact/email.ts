import { FORM_COPY } from "@/content/form";
import type { BudgetOption, ContactValues, ServiceOption } from "./schema";

/**
 * Inquiry notification e-mail, sent through Resend's REST API from the server.
 * API keys only ever live in server-side environment variables.
 *
 *   RESEND_API_KEY      – Resend API key
 *   CONTACT_TO_EMAIL    – where inquiries are delivered (comma-separated for several)
 *   CONTACT_FROM_EMAIL  – verified sender, e.g. "Nordic Pixel <hello@your-domain.se>"
 */

export type InquiryMeta = {
  locale: string;
  source?: string;
  page?: string;
  receivedAt: Date;
};

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.CONTACT_FROM_EMAIL);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Strips characters that could break out of a single-line header such as the subject. */
function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export function buildInquiryEmail(values: ContactValues, meta: InquiryMeta) {
  const labels = FORM_COPY.en;
  const service = labels.services[values.service as ServiceOption] ?? values.service;
  const budget = labels.budgets[values.budget as BudgetOption] ?? values.budget;

  const rows: [string, string][] = [
    ["Name", values.name],
    ["Company", values.company || "—"],
    ["Email", values.email],
    ["Phone", values.phone || "—"],
    ["Service", service],
    ["Budget", budget],
    ["Language", meta.locale === "en" ? "English" : "Swedish"],
    ["Source", [meta.source, meta.page].filter(Boolean).join(" · ") || "—"],
    ["Received", meta.receivedAt.toISOString()],
  ];

  const subject = singleLine(`New project inquiry: ${values.name}${values.company ? ` (${values.company})` : ""} — ${service}`).slice(0, 180);

  const text = [
    "New project inquiry via the Nordic Pixel website",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    values.message,
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#f7f9fc;font-family:Arial,Helvetica,sans-serif;color:#17212b;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
      <tr><td style="height:4px;background:#006aa7;"></td></tr>
      <tr>
        <td style="padding:28px 28px 8px;">
          <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#006aa7;font-weight:bold;">Nordic Pixel · New inquiry</p>
          <h1 style="margin:10px 0 0;font-size:22px;line-height:1.3;color:#0b1117;">${escapeHtml(values.name)}${values.company ? ` · ${escapeHtml(values.company)}` : ""}</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
            ${rows
              .map(
                ([label, value]) =>
                  `<tr><td style="padding:8px 0;color:#64748b;width:120px;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 0;color:#0b1117;font-weight:bold;">${escapeHtml(value)}</td></tr>`,
              )
              .join("")}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 28px 28px;">
          <div style="padding:18px;border-radius:12px;background:#f0f6fb;font-size:15px;line-height:1.6;color:#17212b;">${escapeHtml(values.message).replace(/\n/g, "<br />")}</div>
          <p style="margin:20px 0 0;font-size:13px;color:#64748b;">Reply directly to this email to answer ${escapeHtml(values.name)}.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}

export async function sendInquiryEmail(values: ContactValues, meta: InquiryMeta): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = (process.env.CONTACT_TO_EMAIL ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || to.length === 0 || !from) throw new Error("Email delivery is not configured");

  const { subject, text, html } = buildInquiryEmail(values, meta);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, reply_to: values.email, subject, text, html }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend responded with ${response.status}: ${detail.slice(0, 300)}`);
  }
}
