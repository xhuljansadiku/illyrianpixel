import { createHmac, timingSafeEqual } from "crypto";

const SITE = "https://illyrianpixel.com";

type Purpose = "unsubscribe" | "confirm";

function secret(): string {
  const s = process.env.NEWSLETTER_SECRET || process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("NEWSLETTER_SECRET / ADMIN_SESSION_SECRET mungon");
  return s;
}

// Token HMAC i lidhur me email-in dhe qëllimin — s'kërkon kolonë në DB dhe s'mund
// të falsifikohet për email-e të tjera (ndryshe nga një ?email=... i thjeshtë).
export function newsletterToken(purpose: Purpose, email: string): string {
  return createHmac("sha256", secret())
    .update(`${purpose}:${email.trim().toLowerCase()}`)
    .digest("base64url");
}

export function verifyNewsletterToken(purpose: Purpose, email: string, token: string): boolean {
  const expected = Buffer.from(newsletterToken(purpose, email));
  const given = Buffer.from(token);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

function link(path: string, purpose: Purpose, email: string): string {
  const e = Buffer.from(email.trim().toLowerCase()).toString("base64url");
  return `${SITE}${path}?e=${e}&t=${newsletterToken(purpose, email)}`;
}

export const unsubscribeUrl = (email: string) => link("/api/newsletter/unsubscribe", "unsubscribe", email);
export const confirmUrl = (email: string) => link("/api/newsletter/confirm", "confirm", email);

// Header-at RFC 8058 — Gmail/Yahoo i kërkojnë për dërgues në masë (butoni "Unsubscribe" në klient)
export function unsubscribeHeaders(email: string): Record<string, string> {
  return {
    "List-Unsubscribe": `<${unsubscribeUrl(email)}>, <mailto:info@illyrianpixel.com?subject=unsubscribe>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

// Lexon ?e=&t= nga URL-ja dhe kthen email-in vetëm nëse token-i është i vlefshëm
export function readSignedEmail(url: URL, purpose: Purpose): string | null {
  const enc = url.searchParams.get("e") ?? "";
  const token = url.searchParams.get("t") ?? "";
  if (!enc || !token) return null;
  const email = Buffer.from(enc, "base64url").toString("utf8").slice(0, 254);
  if (!email.includes("@")) return null;
  return verifyNewsletterToken(purpose, email, token) ? email : null;
}
