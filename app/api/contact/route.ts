import { NextResponse } from "next/server";
import { getPathname } from "@/i18n/navigation";
import { isLocale, type Locale } from "@/i18n/routing";
import { isEmailConfigured, sendInquiryEmail } from "@/lib/contact/email";
import { checkRateLimit, clientIp } from "@/lib/contact/rate-limit";
import { hasErrors, normalizeContactInput, validateContact } from "@/lib/contact/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 20_000;
/** Humans need more than a couple of seconds to fill in the form. */
const MIN_FILL_TIME_MS = 2_500;
const MAX_LINKS_IN_MESSAGE = 3;
const RATE_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 };

type ErrorCode = "invalid_request" | "forbidden" | "too_large" | "validation" | "rate_limited" | "not_configured" | "delivery_failed";

/**
 * POST /api/contact — project inquiries.
 *
 * Accepts JSON (the JavaScript form) and regular form posts (no-JS fallback,
 * answered with a redirect to the thank-you page). Spam protection: same-origin
 * check, honeypot, minimum fill time, link limit and per-IP rate limiting.
 */
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  let locale: Locale = "sv";

  const fail = (status: number, error: ErrorCode, extra?: Record<string, unknown>) =>
    isJson
      ? NextResponse.json({ ok: false, error, ...extra }, { status })
      : NextResponse.redirect(new URL(getPathname({ locale, href: "/contact" }), request.url), 303);

  const succeed = () =>
    isJson
      ? NextResponse.json({ ok: true })
      : NextResponse.redirect(new URL(getPathname({ locale, href: "/contact/thanks" }), request.url), 303);

  // Only accept submissions from our own pages.
  const origin = request.headers.get("origin");
  if (origin) {
    let sameOrigin = false;
    try {
      sameOrigin = new URL(origin).host === request.headers.get("host");
    } catch {
      sameOrigin = false;
    }
    if (!sameOrigin) return fail(403, "forbidden");
  }

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return fail(413, "too_large");

  let raw: Record<string, unknown>;
  try {
    const parsed: unknown = isJson ? await request.json() : Object.fromEntries(await request.formData());
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return fail(400, "invalid_request");
    raw = parsed as Record<string, unknown>;
  } catch {
    return fail(400, "invalid_request");
  }

  if (isLocale(raw.locale)) locale = raw.locale;

  // Bots: answer as if everything went fine, but drop the submission.
  const honeypot = typeof raw.website === "string" ? raw.website.trim() : "";
  const startedAt = Number(raw.startedAt);
  const filledTooFast = Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_FILL_TIME_MS;
  if (honeypot || filledTooFast) return succeed();

  const values = normalizeContactInput(raw);
  const errors = validateContact(values);
  if (hasErrors(errors)) return fail(400, "validation", { errors });

  const linkCount = values.message.match(/https?:\/\/|www\./gi)?.length ?? 0;
  if (linkCount > MAX_LINKS_IN_MESSAGE) return succeed();

  if (!checkRateLimit(`contact:${clientIp(request)}`, RATE_LIMIT)) return fail(429, "rate_limited");

  const meta = {
    locale,
    source: typeof raw.source === "string" ? raw.source.slice(0, 80) : undefined,
    page: typeof raw.page === "string" && raw.page.startsWith("/") ? raw.page.slice(0, 200) : undefined,
    receivedAt: new Date(),
  };

  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      // Local development without e-mail credentials: log instead of sending.
      console.info("[contact] E-mail delivery is not configured; inquiry logged instead:", { ...values, ...meta });
      return succeed();
    }
    console.error("[contact] Set RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL to deliver inquiries.");
    return fail(503, "not_configured");
  }

  try {
    await sendInquiryEmail(values, meta);
    return succeed();
  } catch (error) {
    console.error("[contact] Delivery failed:", error);
    return fail(502, "delivery_failed");
  }
}
