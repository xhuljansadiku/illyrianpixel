// TOTP (RFC 6238) me Node crypto — pa varësi të jashtme.
// Përdoret vetëm në server (API routes me runtime nodejs).
import crypto from "crypto";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function generateTotpSecret(): string {
  const bytes = crypto.randomBytes(20);
  let bits = 0;
  let value = 0;
  let output = "";
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  return output;
}

function base32Decode(input: string): Buffer {
  const clean = input.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const char of clean) {
    value = (value << 5) | BASE32_ALPHABET.indexOf(char);
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

function hotp(secret: Buffer, counter: number): string {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const hmac = crypto.createHmac("sha1", secret).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    (hmac[offset + 1] << 16) |
    (hmac[offset + 2] << 8) |
    hmac[offset + 3];
  return String(code % 1_000_000).padStart(6, "0");
}

export function verifyTotp(secret: string, token: string, window = 1): boolean {
  const clean = String(token).replace(/\s/g, "");
  if (!/^\d{6}$/.test(clean)) return false;
  const key = base32Decode(secret);
  if (key.length === 0) return false;
  const counter = Math.floor(Date.now() / 1000 / 30);
  for (let i = -window; i <= window; i++) {
    const expected = hotp(key, counter + i);
    if (crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(clean))) return true;
  }
  return false;
}

export function totpUri(secret: string, account = "admin", issuer = "Illyrian Pixel"): string {
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}

// Kodet e rezervës (recovery codes) — gjenerohen si tekst i thjeshtë (p.sh. ABCD-1234-EFGH),
// ruhen të hash-uara (SHA-256) në bazën e të dhënave, kurrë në tekst të thjeshtë.
export function generateRecoveryCodes(count = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const bytes = crypto.randomBytes(8); // 8 base32 chars needed for the XXXX-XXXX format below
    let raw = "";
    for (const byte of bytes) raw += BASE32_ALPHABET[byte & 31];
    codes.push(`${raw.slice(0, 4)}-${raw.slice(4, 8)}`);
  }
  return codes;
}

export function hashRecoveryCode(code: string): string {
  const clean = code.trim().toUpperCase().replace(/\s+/g, "");
  return crypto.createHash("sha256").update(clean).digest("hex");
}

// Token për pajisje "të besuara" — lejon kalimin e 2FA për një periudhë (p.sh. 90 ditë).
export function generateDeviceToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashDeviceToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
