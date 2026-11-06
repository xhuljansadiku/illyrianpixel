import { createHmac, randomBytes, timingSafeEqual } from "crypto";

// Pyetje e thjeshtë me 2 numra te formulari i kontaktit (2026-11-06), kundër bot-eve.
// Pa gjendje në server: përgjigjja s'shkon te klienti, vetëm një nënshkrim HMAC i saj.
const SECRET = process.env.CONTACT_CHECK_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "dev-only";
const TTL_MS = 2 * 60 * 60 * 1000; // 2 orë për të plotësuar formularin

const sign = (answer: number, exp: number, nonce: string) =>
  createHmac("sha256", SECRET).update(`${answer}.${exp}.${nonce}`).digest("hex");

export function createMathChallenge() {
  const a = 1 + Math.floor(Math.random() * 9);
  const b = 1 + Math.floor(Math.random() * 9);
  const exp = Date.now() + TTL_MS;
  const nonce = randomBytes(8).toString("hex");
  return { a, b, token: `${exp}.${nonce}.${sign(a + b, exp, nonce)}` };
}

export function verifyMathChallenge(token: unknown, answer: unknown): boolean {
  if (typeof token !== "string") return false;
  const n = Number(String(answer ?? "").trim());
  if (!Number.isInteger(n)) return false;
  const [expStr, nonce, sig] = token.split(".");
  const exp = Number(expStr);
  if (!nonce || !sig || !Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = Buffer.from(sign(n, exp, nonce));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
