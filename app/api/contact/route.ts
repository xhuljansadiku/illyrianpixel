import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const RATE_LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 orë
const ipMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);
  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const BRAND = {
  name: "Illyrian Pixel",
  email: "info@illyrianpixel.com",
  website: "https://illyrianpixel.com",
  logo: "https://illyrianpixel.com/images/illyrianpixel_logo.png",
  whatsapp: "https://wa.me/355694726827",
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Shumë kërkesa. Provoni sërish pas 1 ore." },
        { status: 429 }
      );
    }

    const body = await req.json();

    const {
      name = "",
      email = "",
      phone = "",
      businessName = "",
      service = "",
      budget = "",
      timeline = "",
      message = "",
    } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, error: "Fushat kryesore mungojnë." },
        { status: 400 }
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeBusinessName = escapeHtml(businessName);
    const safeService = escapeHtml(service);
    const safeBudget = escapeHtml(budget);
    const safeTimeline = escapeHtml(timeline);
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

    const { error } = await supabase.from("contacts").insert([
      {
        name,
        email,
        phone,
        business_name: businessName,
        service,
        budget,
        timeline,
        message,
      },
    ]);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // EMAILI QË TË VJEN TY

    await resend.emails.send({
      from: `${BRAND.name} <${BRAND.email}>`,
      to: process.env.CONTACT_TO_EMAIL || BRAND.email,
      replyTo: email,
      subject: `Kërkesë e re nga ${name} — ${service}`,

      html: `
        <div style="margin:0;padding:0;background:#070707;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
          <div style="max-width:680px;margin:0 auto;padding:32px 18px;">

            <div style="background:#0f0f0f;border:1px solid #262626;border-radius:22px;overflow:hidden;">

              <div style="padding:28px;border-bottom:1px solid #262626;background:#0a0a0a;">

                <img 
                  src="${BRAND.logo}" 
                  alt="${BRAND.name}" 
                  width="140" 
                  style="display:block;margin-bottom:18px;" 
                />

                <p style="margin:0;color:#ab8339;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
                  Kërkesë e re nga website
                </p>

                <h1 style="margin:12px 0 0;font-size:28px;line-height:1.25;color:#ffffff;">
                  Kërkesë e re nga ${safeName}
                </h1>

              </div>

              <div style="padding:28px;">

                <table style="width:100%;border-collapse:collapse;">

                  <tr>
                    <td style="padding:12px 0;color:#a0a0a0;width:160px;">Emri</td>
                    <td style="padding:12px 0;color:#ffffff;font-weight:600;">${safeName}</td>
                  </tr>

                  <tr>
                    <td style="padding:12px 0;color:#a0a0a0;">Email</td>
                    <td style="padding:12px 0;color:#ffffff;">${safeEmail}</td>
                  </tr>

                  <tr>
                    <td style="padding:12px 0;color:#a0a0a0;">Telefon</td>
                    <td style="padding:12px 0;color:#ffffff;">${safePhone}</td>
                  </tr>

                  <tr>
                    <td style="padding:12px 0;color:#a0a0a0;">Biznesi</td>
                    <td style="padding:12px 0;color:#ffffff;">${safeBusinessName || "-"}</td>
                  </tr>

                  <tr>
                    <td style="padding:12px 0;color:#a0a0a0;">Shërbimi</td>
                    <td style="padding:12px 0;color:#ffffff;">${safeService}</td>
                  </tr>

                  <tr>
                    <td style="padding:12px 0;color:#a0a0a0;">Buxheti</td>
                    <td style="padding:12px 0;color:#ffffff;">${safeBudget}</td>
                  </tr>

                  <tr>
                    <td style="padding:12px 0;color:#a0a0a0;">Afati</td>
                    <td style="padding:12px 0;color:#ffffff;">${safeTimeline}</td>
                  </tr>

                </table>

                <div style="margin-top:24px;padding:22px;background:#151515;border:1px solid #262626;border-radius:18px;">

                  <p style="margin:0 0 12px;color:#ab8339;font-size:13px;font-weight:700;">
                    Mesazhi i klientit
                  </p>

                  <p style="margin:0;color:#e8e8e8;line-height:1.8;font-size:15px;">
                    ${safeMessage}
                  </p>

                </div>

                <div style="margin-top:28px;display:flex;gap:12px;flex-wrap:wrap;">

                  <a 
                    href="mailto:${safeEmail}" 
                    style="display:inline-block;background:#ab8339;color:#0a0a0a;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:700;"
                  >
                    Përgjigju klientit
                  </a>

                  <a 
                    href="${BRAND.website}" 
                    style="display:inline-block;background:#1a1a1a;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:700;border:1px solid #2a2a2a;"
                  >
                    Hap website-in
                  </a>

                </div>

              </div>

            </div>

          </div>
        </div>
      `,
    });

    // EMAILI QË I SHKON KLIENTIT

    await resend.emails.send({
      from: `${BRAND.name} <${BRAND.email}>`,
      to: email,
      subject: "Kërkesa juaj u pranua — Illyrian Pixel",

      html: `
        <div style="margin:0;padding:0;background:#070707;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
          <div style="max-width:680px;margin:0 auto;padding:32px 18px;">

            <div style="background:#0f0f0f;border:1px solid #262626;border-radius:22px;overflow:hidden;">

              <div style="padding:34px 30px;text-align:center;background:#0a0a0a;border-bottom:1px solid #262626;">

                <img 
                  src="${BRAND.logo}" 
                  alt="${BRAND.name}" 
                  width="150" 
                  style="display:block;margin:0 auto 20px;" 
                />

                <p style="margin:0;color:#ab8339;font-size:12px;letter-spacing:2px;text-transform:uppercase;">
                  Kërkesa u pranua
                </p>

                <h1 style="margin:14px 0 0;font-size:30px;line-height:1.2;color:#ffffff;">
                  Faleminderit, ${safeName}.
                </h1>

              </div>

              <div style="padding:32px;">

                <p style="margin:0;color:#d8d8d8;line-height:1.9;font-size:15px;">
                  Kërkesa juaj u pranua me sukses dhe ekipi ynë do t'ju kontaktojë sa më shpejt për të diskutuar projektin tuaj.
                </p>

                <div style="margin-top:26px;padding:22px;background:#151515;border:1px solid #262626;border-radius:18px;">

                  <p style="margin:0 0 14px;color:#ab8339;font-size:14px;font-weight:700;">
                    Përmbledhje e kërkesës suaj
                  </p>

                  <p style="margin:8px 0;color:#e8e8e8;">
                    <strong>Shërbimi:</strong> ${safeService}
                  </p>

                  <p style="margin:8px 0;color:#e8e8e8;">
                    <strong>Buxheti:</strong> ${safeBudget}
                  </p>

                  <p style="margin:8px 0;color:#e8e8e8;">
                    <strong>Afati:</strong> ${safeTimeline}
                  </p>

                </div>

                <div style="margin-top:30px;text-align:center;">

                  <a 
                    href="${BRAND.website}" 
                    style="display:inline-block;background:#ab8339;color:#0a0a0a;text-decoration:none;padding:15px 24px;border-radius:999px;font-weight:700;"
                  >
                    Vizito website-in
                  </a>

                </div>

                <div style="margin-top:18px;text-align:center;">

                  <a 
                    href="${BRAND.whatsapp}" 
                    style="display:inline-block;color:#ab8339;text-decoration:none;font-size:14px;"
                  >
                    Na kontakto në WhatsApp
                  </a>

                </div>

                <p style="margin:32px 0 0;color:#8a8a8a;line-height:1.8;font-size:13px;text-align:center;">

                  ${BRAND.name}<br />

                  <a 
                    href="${BRAND.website}" 
                    style="color:#ab8339;text-decoration:none;"
                  >
                    ${BRAND.website}
                  </a>

                  <br />

                  <a 
                    href="mailto:${BRAND.email}" 
                    style="color:#ab8339;text-decoration:none;"
                  >
                    ${BRAND.email}
                  </a>

                </p>

              </div>

            </div>

          </div>
        </div>
      `,
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Gabim në server." },
      { status: 500 }
    );
  }
}
