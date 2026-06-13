// Email-e të brenduara që dërgohen nga admin paneli (përgjigje direkte + oferta).
import { NEWSLETTER_BRAND } from "@/lib/newsletterEmail";
import { quoteTotals, formatMoney, quotePublicUrl, QUOTE_KIND_LABELS, type QuoteRecord } from "@/lib/quotes";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function shell(title: string, body: string): string {
  const BRAND = NEWSLETTER_BRAND;
  return `<!DOCTYPE html>
<html lang="sq">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#e0e0e0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
        <tr>
          <td style="background:linear-gradient(135deg,#0e0e0e,#161410);padding:36px 48px 28px;border-bottom:1px solid rgba(171,131,57,0.2);">
            <img src="${BRAND.logo}" alt="Illyrian Pixel" height="36" style="height:36px;width:auto;display:block;margin-bottom:20px;" />
            <h1 style="margin:0;font-size:23px;font-weight:700;color:#ffffff;line-height:1.3;letter-spacing:-0.01em;">${escapeHtml(title)}</h1>
          </td>
        </tr>
        ${body}
        <tr>
          <td style="padding:24px 48px;border-top:1px solid rgba(255,255,255,0.05);background:#0d0d0d;">
            <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.22);line-height:1.7;">
              Illyrian Pixel · Agjenci Dixhitale Premium · Tiranë, Shqipëri<br>
              <a href="${BRAND.website}" style="color:rgba(171,131,57,0.5);text-decoration:none;">illyrianpixel.com</a>
              &nbsp;·&nbsp;
              <a href="${BRAND.whatsapp}" style="color:rgba(171,131,57,0.5);text-decoration:none;">WhatsApp</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// Email-i i dërguar klientit pas pranimit të ofertës, me linkun e portalit personal.
export function clientPortalLinkEmailHtml(clientName: string, portalUrl: string): string {
  const body = `
        <tr>
          <td style="padding:36px 48px;">
            <p style="margin:0 0 18px;font-size:15px;color:rgba(255,255,255,0.8);">Përshëndetje ${escapeHtml(clientName)},</p>
            <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.75);line-height:1.8;">
              Faleminderit për besimin! Ofertën tuaj e pranuam dhe nisëm punën. Mund të ndiqni progresin e projektit
              dhe faturat tuaja në çdo kohë nga portali juaj personal:
            </p>
            <table cellpadding="0" cellspacing="0" style="margin-top:24px;">
              <tr>
                <td style="background:#ab8339;border-radius:8px;">
                  <a href="${portalUrl}" style="display:inline-block;padding:13px 28px;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#0a0a0a;text-decoration:none;">
                    Hap portalin tim →
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:24px 0 0;font-size:14px;color:rgba(255,255,255,0.5);line-height:1.7;">
              Me respekt,<br>
              <span style="color:#ab8339;font-weight:600;">Ekipi i Illyrian Pixel</span>
            </p>
          </td>
        </tr>`;
  return shell("Portali juaj — Illyrian Pixel", body);
}

export function replyEmailHtml(subject: string, message: string, recipientName: string): string {
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br>");
  const body = `
        <tr>
          <td style="padding:36px 48px;">
            <p style="margin:0 0 18px;font-size:15px;color:rgba(255,255,255,0.8);">Përshëndetje ${escapeHtml(recipientName)},</p>
            <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.75);line-height:1.8;">${safeMessage}</p>
            <p style="margin:28px 0 0;font-size:14px;color:rgba(255,255,255,0.5);line-height:1.7;">
              Me respekt,<br>
              <span style="color:#ab8339;font-weight:600;">Ekipi i Illyrian Pixel</span>
            </p>
          </td>
        </tr>`;
  return shell(subject, body);
}

export function quoteEmailHtml(quote: QuoteRecord): string {
  const totals = quoteTotals(quote.items, quote.discount, quote.tax_rate);
  const kindLabel = QUOTE_KIND_LABELS[quote.kind];

  const itemRows = quote.items
    .map(
      (it) => `<tr>
        <td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px;color:rgba(255,255,255,0.8);">${escapeHtml(it.description)}</td>
        <td align="center" style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px;color:rgba(255,255,255,0.6);">${it.qty}</td>
        <td align="right" style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px;color:rgba(255,255,255,0.6);">${formatMoney(it.price)}</td>
        <td align="right" style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px;color:#ffffff;">${formatMoney(it.qty * it.price)}</td>
      </tr>`
    )
    .join("");

  const totalRow = (label: string, value: string, strong = false) => `<tr>
    <td colspan="3" align="right" style="padding:6px 14px;font-size:${strong ? 14 : 13}px;color:rgba(255,255,255,${strong ? "0.85" : "0.5"});${strong ? "font-weight:700;" : ""}">${label}</td>
    <td align="right" style="padding:6px 14px;font-size:${strong ? 16 : 13}px;color:${strong ? "#ab8339" : "rgba(255,255,255,0.75)"};${strong ? "font-weight:700;" : ""}">${value}</td>
  </tr>`;

  const body = `
        <tr>
          <td style="padding:32px 48px 8px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:13px;color:rgba(255,255,255,0.5);line-height:1.8;">
                  <span style="color:rgba(171,131,57,0.8);font-weight:600;text-transform:uppercase;font-size:11px;letter-spacing:0.15em;">${kindLabel} ${escapeHtml(quote.number)}</span><br>
                  Për: <span style="color:#ffffff;">${escapeHtml(quote.client_name)}</span>${quote.client_business ? ` · ${escapeHtml(quote.client_business)}` : ""}<br>
                  Data: ${new Date(`${quote.issued_at}T00:00:00`).toLocaleDateString("sq-AL")}${quote.due_at ? ` · Vlen deri më: ${new Date(`${quote.due_at}T00:00:00`).toLocaleDateString("sq-AL")}` : ""}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 48px 8px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#0d0d0d;border:1px solid rgba(255,255,255,0.07);border-radius:10px;overflow:hidden;">
              <thead>
                <tr style="background:#131313;">
                  <th align="left" style="padding:10px 14px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:rgba(255,255,255,0.35);">Përshkrimi</th>
                  <th align="center" style="padding:10px 14px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:rgba(255,255,255,0.35);">Sasia</th>
                  <th align="right" style="padding:10px 14px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:rgba(255,255,255,0.35);">Çmimi</th>
                  <th align="right" style="padding:10px 14px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:rgba(255,255,255,0.35);">Totali</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
                ${totalRow("Nëntotali", formatMoney(totals.subtotal))}
                ${totals.discount > 0 ? totalRow("Zbritje", `-${formatMoney(totals.discount)}`) : ""}
                ${quote.tax_rate > 0 ? totalRow(`TVSH (${quote.tax_rate}%)`, formatMoney(totals.tax)) : ""}
                ${totalRow("Totali", formatMoney(totals.total), true)}
              </tbody>
            </table>
          </td>
        </tr>
        ${
          quote.notes
            ? `<tr><td style="padding:16px 48px 8px;"><p style="margin:0;font-size:13px;color:rgba(255,255,255,0.5);line-height:1.7;">${escapeHtml(quote.notes).replaceAll("\n", "<br>")}</p></td></tr>`
            : ""
        }
        <tr>
          <td style="padding:24px 48px 40px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#ab8339;border-radius:8px;">
                  <a href="${quote.public_token ? quotePublicUrl(quote.public_token) : NEWSLETTER_BRAND.whatsapp}" style="display:inline-block;padding:13px 28px;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#0a0a0a;text-decoration:none;">
                    ${quote.public_token ? (quote.kind === "quote" ? "Shiko & prano ofertën →" : "Shiko faturën online →") : "Konfirmo në WhatsApp →"}
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:14px 0 0;font-size:12px;color:rgba(255,255,255,0.3);">Për çdo pyetje, përgjigjuni direkt këtij email-i ose na shkruani në <a href="${NEWSLETTER_BRAND.whatsapp}" style="color:rgba(171,131,57,0.6);text-decoration:none;">WhatsApp</a>.</p>
          </td>
        </tr>`;

  return shell(`${kindLabel} ${quote.number} — Illyrian Pixel`, body);
}

// ── Kujtues i sjellshëm për ofertë pa përgjigje ──────────────────────────────
export function quoteReminderEmailHtml(quote: QuoteRecord): string {
  const totals = quoteTotals(quote.items, quote.discount, quote.tax_rate);
  const url = quote.public_token ? quotePublicUrl(quote.public_token) : NEWSLETTER_BRAND.website;
  const body = `
        <tr>
          <td style="padding:36px 48px;">
            <p style="margin:0 0 16px;font-size:15px;color:rgba(255,255,255,0.8);">Përshëndetje ${escapeHtml(quote.client_name)},</p>
            <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.7);line-height:1.8;">
              Para disa ditësh ju dërguam ofertën <strong style="color:#ffffff;">${escapeHtml(quote.number)}</strong>
              me vlerë <strong style="color:#ab8339;">${formatMoney(totals.total)}</strong>.
              Donim thjesht të sigurohemi që e keni marrë dhe të pyesim nëse keni ndonjë pyetje.
            </p>
            <p style="margin:16px 0 0;font-size:14px;color:rgba(255,255,255,0.5);line-height:1.7;">
              Mund ta shihni dhe pranoni online me një klik — ose na shkruani për çdo përshtatje.
            </p>
            <table cellpadding="0" cellspacing="0" style="margin-top:24px;">
              <tr>
                <td style="background:#ab8339;border-radius:8px;">
                  <a href="${url}" style="display:inline-block;padding:13px 28px;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#0a0a0a;text-decoration:none;">
                    Shiko ofertën →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
  return shell(`Një kujtesë e vogël — oferta ${quote.number}`, body);
}

// ── Kujtesë pagese për faturë të vonuar ──────────────────────────────────────
export function invoiceOverdueEmailHtml(quote: QuoteRecord): string {
  const totals = quoteTotals(quote.items, quote.discount, quote.tax_rate);
  const url = quote.public_token ? quotePublicUrl(quote.public_token) : NEWSLETTER_BRAND.website;
  const dueLabel = quote.due_at
    ? new Date(`${quote.due_at}T00:00:00`).toLocaleDateString("sq-AL")
    : "";
  const body = `
        <tr>
          <td style="padding:36px 48px;">
            <p style="margin:0 0 16px;font-size:15px;color:rgba(255,255,255,0.8);">Përshëndetje ${escapeHtml(quote.client_name)},</p>
            <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.7);line-height:1.8;">
              Kjo është një kujtesë miqësore se fatura <strong style="color:#ffffff;">${escapeHtml(quote.number)}</strong>
              me vlerë <strong style="color:#ab8339;">${formatMoney(totals.total)}</strong>${dueLabel ? ` kishte afat pagese deri më <strong style="color:#ffffff;">${dueLabel}</strong>` : " ka kaluar afatin e pagesës"}.
            </p>
            <p style="margin:16px 0 0;font-size:14px;color:rgba(255,255,255,0.5);line-height:1.7;">
              Nëse pagesa është kryer tashmë, ju lutemi injoroni këtë email. Për çdo pyetje a vështirësi, na shkruani — gjejmë zgjidhje bashkë.
            </p>
            <table cellpadding="0" cellspacing="0" style="margin-top:24px;">
              <tr>
                <td style="background:#ab8339;border-radius:8px;">
                  <a href="${url}" style="display:inline-block;padding:13px 28px;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#0a0a0a;text-decoration:none;">
                    Shiko faturën →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
  return shell(`Kujtesë pagese — fatura ${quote.number}`, body);
}

// ── Njoftim për adminin kur klienti përgjigjet ───────────────────────────────
export function adminQuoteResponseEmailHtml(
  quote: QuoteRecord,
  action: "accept" | "decline",
  note: string | null
): string {
  const totals = quoteTotals(quote.items, quote.discount, quote.tax_rate);
  const accepted = action === "accept";
  const body = `
        <tr>
          <td style="padding:36px 48px;">
            <p style="margin:0;font-size:16px;color:${accepted ? "#34d399" : "#f87171"};font-weight:700;">
              ${accepted ? "💰 OFERTA U PRANUA" : "✖️ Oferta u refuzua"}
            </p>
            <p style="margin:16px 0 0;font-size:15px;color:rgba(255,255,255,0.75);line-height:1.8;">
              <strong style="color:#ffffff;">${escapeHtml(quote.client_name)}</strong>${quote.client_business ? ` (${escapeHtml(quote.client_business)})` : ""}
              ${accepted ? "pranoi" : "refuzoi"} ${quote.kind === "invoice" ? "faturën" : "ofertën"}
              <strong style="color:#ffffff;">${escapeHtml(quote.number)}</strong>
              me vlerë <strong style="color:#ab8339;">${formatMoney(totals.total)}</strong>.
            </p>
            ${note ? `<p style="margin:16px 0 0;padding:14px 18px;background:#0d0d0d;border:1px solid rgba(255,255,255,0.08);border-radius:8px;font-size:14px;color:rgba(255,255,255,0.6);line-height:1.7;">💬 "${escapeHtml(note)}"</p>` : ""}
            <table cellpadding="0" cellspacing="0" style="margin-top:24px;">
              <tr>
                <td style="background:#ab8339;border-radius:8px;">
                  <a href="${NEWSLETTER_BRAND.website}/admin" style="display:inline-block;padding:13px 28px;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#0a0a0a;text-decoration:none;">
                    Hap panelin →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
  return shell(
    accepted ? `💰 ${quote.number} u pranua nga ${quote.client_name}` : `${quote.number} u refuzua`,
    body
  );
}

// ── Përmbledhja ditore e automatizimeve për adminin ──────────────────────────
export function adminDailySummaryHtml(summary: {
  remindedQuotes: string[];
  remindedInvoices: string[];
  generatedInvoices: string[];
  publishedPosts: number;
  sentBroadcasts?: string[];
}): string {
  const line = (label: string, items: string[]) =>
    items.length
      ? `<p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.7);line-height:1.7;">
           <strong style="color:#ab8339;">${label}:</strong> ${items.map(escapeHtml).join(", ")}
         </p>`
      : "";
  const body = `
        <tr>
          <td style="padding:36px 48px;">
            <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.6);line-height:1.7;">
              Automatizimet e sotme u kryen me sukses:
            </p>
            ${line("📨 Kujtues oferte u dërguan", summary.remindedQuotes)}
            ${line("💸 Kujtues pagese u dërguan", summary.remindedInvoices)}
            ${line("🔁 Fatura të rikurruese u gjeneruan", summary.generatedInvoices)}
            ${line("✉️ Broadcast-e të planifikuara u dërguan", summary.sentBroadcasts ?? [])}
            ${summary.publishedPosts > 0 ? `<p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.7);"><strong style="color:#ab8339;">📝 Artikuj të publikuar:</strong> ${summary.publishedPosts}</p>` : ""}
            <table cellpadding="0" cellspacing="0" style="margin-top:24px;">
              <tr>
                <td style="background:#ab8339;border-radius:8px;">
                  <a href="${NEWSLETTER_BRAND.website}/admin" style="display:inline-block;padding:13px 28px;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#0a0a0a;text-decoration:none;">
                    Hap panelin →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`;
  return shell("Përmbledhja e automatizimeve të sotme", body);
}
