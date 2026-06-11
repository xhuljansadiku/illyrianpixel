export const NEWSLETTER_BRAND = {
  name: "Illyrian Pixel",
  from: "Illyrian Pixel <info@illyrianpixel.com>",
  website: "https://illyrianpixel.com",
  logo: "https://illyrianpixel.com/images/illyrianpixel_logo.png",
  whatsapp: "https://wa.me/355694726827",
};

export function welcomeEmailHtml(code: string, whatsappUrl: string = NEWSLETTER_BRAND.whatsapp): string {
  const BRAND = { ...NEWSLETTER_BRAND, whatsapp: whatsappUrl };
  return `<!DOCTYPE html>
<html lang="sq">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kodi juaj 10% — Illyrian Pixel</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#e0e0e0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0e0e0e,#161410);padding:40px 48px 32px;border-bottom:1px solid rgba(171,131,57,0.2);">
            <img src="${BRAND.logo}" alt="Illyrian Pixel" height="36" style="height:36px;width:auto;display:block;margin-bottom:24px;" />
            <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;line-height:1.2;letter-spacing:-0.01em;">
              Kodi juaj i zbritjes është gati.
            </h1>
            <p style="margin:12px 0 0;font-size:15px;color:rgba(255,255,255,0.55);line-height:1.6;">
              Faleminderit që u abonuat. Ja 10% zbritje për çdo shërbim të Illyrian Pixel.
            </p>
          </td>
        </tr>

        <!-- Discount Code Block -->
        <tr>
          <td style="padding:40px 48px;">
            <p style="margin:0 0 16px;font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:rgba(171,131,57,0.7);">Kodi juaj ekskluziv</p>
            <div style="background:linear-gradient(135deg,#0a0a0a,#131008);border:1.5px solid rgba(171,131,57,0.45);border-radius:12px;padding:24px 32px;text-align:center;margin-bottom:28px;">
              <span style="font-family:'Courier New',Courier,monospace;font-size:32px;font-weight:700;letter-spacing:0.12em;color:#ab8339;">${code}</span>
            </div>
            <p style="margin:0 0 8px;font-size:14px;color:rgba(255,255,255,0.55);line-height:1.65;">
              Ky kod ju jep 10% zbritje në çdo shërbim &nbsp;Website, SEO, Google Ads, Branding, Social Media ose E-Commerce.
            </p>
            <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.35);line-height:1.6;">
              Thjesht citoni kodin kur të kontaktoni ose vendosini direkt në formularin e kontaktit.
            </p>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:0 48px 40px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#ab8339;border-radius:8px;">
                  <a href="${BRAND.website}/contact" style="display:inline-block;padding:14px 32px;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#0a0a0a;text-decoration:none;">
                    Rezervo konsultë falas →
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:16px 0 0;font-size:12px;color:rgba(255,255,255,0.3);">
              Konsultimi fillestar është gjithmonë falas dhe pa detyrim.
            </p>
          </td>
        </tr>

        <!-- Services quick links -->
        <tr>
          <td style="padding:28px 48px;border-top:1px solid rgba(255,255,255,0.06);">
            <p style="margin:0 0 14px;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.28);">Shërbime</p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:16px;"><a href="${BRAND.website}/services/website" style="font-size:13px;color:rgba(255,255,255,0.5);text-decoration:none;">Website</a></td>
                <td style="padding-right:16px;"><a href="${BRAND.website}/services/ecommerce" style="font-size:13px;color:rgba(255,255,255,0.5);text-decoration:none;">E-Commerce</a></td>
                <td style="padding-right:16px;"><a href="${BRAND.website}/services/seo" style="font-size:13px;color:rgba(255,255,255,0.5);text-decoration:none;">SEO</a></td>
                <td><a href="${BRAND.website}/services/google-ads" style="font-size:13px;color:rgba(255,255,255,0.5);text-decoration:none;">Google Ads</a></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
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

type ReminderContact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  follow_up_date: string | null;
  assigned_to: string | null;
};

export function followUpReminderEmailHtml(contacts: ReminderContact[]): string {
  const BRAND = NEWSLETTER_BRAND;
  const today = new Date().toISOString().slice(0, 10);

  const rows = contacts
    .map((c) => {
      const overdue = c.follow_up_date !== null && c.follow_up_date < today;
      const dateLabel = c.follow_up_date
        ? new Date(`${c.follow_up_date}T00:00:00`).toLocaleDateString("sq-AL", { day: "2-digit", month: "2-digit", year: "numeric" })
        : "—";
      let statusLabel = "";
      if (c.follow_up_date) {
        if (c.follow_up_date < today) statusLabel = " (vonuar)";
        else if (c.follow_up_date === today) statusLabel = " (sot)";
        else {
          const days = Math.round((new Date(`${c.follow_up_date}T00:00:00`).getTime() - new Date(`${today}T00:00:00`).getTime()) / 86400000);
          statusLabel = days === 1 ? " (nesër)" : ` (pas ${days} ditësh)`;
        }
      }
      return `<tr>
        <td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px;color:#ffffff;">${c.name}</td>
        <td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px;color:rgba(255,255,255,0.6);">${c.phone || c.email}</td>
        <td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px;color:${overdue ? "#f87171" : "rgba(255,255,255,0.6)"};">${dateLabel}${statusLabel}</td>
        <td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px;color:rgba(255,255,255,0.6);">${c.assigned_to || "—"}</td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="sq">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kontaktet për ndjekje sot</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#e0e0e0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#111111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0e0e0e,#161410);padding:40px 48px 32px;border-bottom:1px solid rgba(171,131,57,0.2);">
            <img src="${BRAND.logo}" alt="Illyrian Pixel" height="36" style="height:36px;width:auto;display:block;margin-bottom:24px;" />
            <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;line-height:1.3;letter-spacing:-0.01em;">Kontakte për ndjekje sot</h1>
            <p style="margin:12px 0 0;font-size:14px;color:rgba(255,255,255,0.5);">${contacts.length} kontakt${contacts.length === 1 ? "" : "e"} kanë afat ndjekjeje brenda 48 orëve të ardhshme (ose të vonuara).</p>
          </td>
        </tr>

        <!-- Table -->
        <tr>
          <td style="padding:24px 48px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
              <thead>
                <tr>
                  <th align="left" style="padding:0 16px 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.35);">Emri</th>
                  <th align="left" style="padding:0 16px 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.35);">Kontakt</th>
                  <th align="left" style="padding:0 16px 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.35);">Data</th>
                  <th align="left" style="padding:0 16px 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.35);">Caktuar tek</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:0 48px 40px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#ab8339;border-radius:8px;">
                  <a href="${BRAND.website}/admin" style="display:inline-block;padding:14px 32px;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#0a0a0a;text-decoration:none;">
                    Hap panelin →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 48px;border-top:1px solid rgba(255,255,255,0.05);background:#0d0d0d;">
            <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.22);line-height:1.7;">
              Illyrian Pixel · Njoftim automatik ditor
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export type BroadcastTracking = {
  broadcastId: string;
  email: string;
};

export function broadcastEmailHtml(
  subject: string,
  message: string,
  whatsappUrl: string = NEWSLETTER_BRAND.whatsapp,
  tracking?: BroadcastTracking
): string {
  const BRAND = { ...NEWSLETTER_BRAND, whatsapp: whatsappUrl };

  // Open/click tracking — vetëm kur dërgohet si broadcast i regjistruar
  const enc = tracking ? Buffer.from(tracking.email).toString("base64url") : "";
  const wrap = (url: string) =>
    tracking
      ? `${NEWSLETTER_BRAND.website}/api/newsletter/track/click?b=${tracking.broadcastId}&e=${enc}&u=${encodeURIComponent(url)}`
      : url;
  const pixel = tracking
    ? `<img src="${NEWSLETTER_BRAND.website}/api/newsletter/track/open?b=${tracking.broadcastId}&e=${enc}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;" />`
    : "";

  const safeMessage = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replaceAll("\n", "<br>");

  return `<!DOCTYPE html>
<html lang="sq">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#e0e0e0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0e0e0e,#161410);padding:40px 48px 32px;border-bottom:1px solid rgba(171,131,57,0.2);">
            <img src="${BRAND.logo}" alt="Illyrian Pixel" height="36" style="height:36px;width:auto;display:block;margin-bottom:24px;" />
            <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;line-height:1.3;letter-spacing:-0.01em;">${subject}</h1>
          </td>
        </tr>

        <!-- Message -->
        <tr>
          <td style="padding:40px 48px;">
            <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.75);line-height:1.8;">${safeMessage}</p>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:0 48px 40px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#ab8339;border-radius:8px;">
                  <a href="${wrap(BRAND.website)}" style="display:inline-block;padding:14px 32px;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#0a0a0a;text-decoration:none;">
                    Vizito website-in →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 48px;border-top:1px solid rgba(255,255,255,0.05);background:#0d0d0d;">
            <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.22);line-height:1.7;">
              Illyrian Pixel · Agjenci Dixhitale Premium · Tiranë, Shqipëri<br>
              <a href="${wrap(BRAND.website)}" style="color:rgba(171,131,57,0.5);text-decoration:none;">illyrianpixel.com</a>
              &nbsp;·&nbsp;
              <a href="${wrap(BRAND.whatsapp)}" style="color:rgba(171,131,57,0.5);text-decoration:none;">WhatsApp</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
  ${pixel}
</body>
</html>`;
}
