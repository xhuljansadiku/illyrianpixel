import crypto from "crypto";
import { describe, expect, it } from "vitest";
import {
  generateTotpSecret,
  verifyTotp,
  generateRecoveryCodes,
  hashRecoveryCode,
  generateDeviceToken,
  hashDeviceToken,
  totpUri,
} from "./totp";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

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

// Independent RFC 6238 reference implementation — deliberately not imported
// from totp.ts, so this actually validates the algorithm's output against
// the spec instead of just checking the module agrees with itself.
function referenceTotp(secret: string, counter: number): string {
  const key = base32Decode(secret);
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const hmac = crypto.createHmac("sha1", key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    (hmac[offset + 1] << 16) |
    (hmac[offset + 2] << 8) |
    hmac[offset + 3];
  return String(code % 1_000_000).padStart(6, "0");
}

describe("totp", () => {
  it("generates a base32 secret of plausible length", () => {
    const secret = generateTotpSecret();
    expect(secret).toMatch(/^[A-Z2-7]+$/);
    expect(secret.length).toBeGreaterThanOrEqual(30);
  });

  it("accepts the RFC 6238 code for the current time step", () => {
    const secret = generateTotpSecret();
    const counter = Math.floor(Date.now() / 1000 / 30);
    const code = referenceTotp(secret, counter);
    expect(verifyTotp(secret, code)).toBe(true);
  });

  it("accepts a code from one step in the past or future (clock drift window)", () => {
    const secret = generateTotpSecret();
    const counter = Math.floor(Date.now() / 1000 / 30);
    expect(verifyTotp(secret, referenceTotp(secret, counter - 1))).toBe(true);
    expect(verifyTotp(secret, referenceTotp(secret, counter + 1))).toBe(true);
  });

  it("rejects a code outside the drift window", () => {
    const secret = generateTotpSecret();
    const counter = Math.floor(Date.now() / 1000 / 30);
    expect(verifyTotp(secret, referenceTotp(secret, counter - 5))).toBe(false);
  });

  it("rejects a code generated with a different secret", () => {
    const secretA = generateTotpSecret();
    const secretB = generateTotpSecret();
    const counter = Math.floor(Date.now() / 1000 / 30);
    expect(verifyTotp(secretA, referenceTotp(secretB, counter))).toBe(false);
  });

  it("rejects malformed tokens outright", () => {
    const secret = generateTotpSecret();
    expect(verifyTotp(secret, "abc")).toBe(false);
    expect(verifyTotp(secret, "12345")).toBe(false);
    expect(verifyTotp(secret, "1234567")).toBe(false);
    expect(verifyTotp(secret, "")).toBe(false);
  });

  it("rejects an empty/invalid secret", () => {
    expect(verifyTotp("", "123456")).toBe(false);
  });

  it("builds a valid otpauth:// URI", () => {
    const uri = totpUri("ABCDEFGH", "admin", "Illyrian Pixel");
    expect(uri).toBe(
      "otpauth://totp/Illyrian%20Pixel:admin?secret=ABCDEFGH&issuer=Illyrian%20Pixel&algorithm=SHA1&digits=6&period=30"
    );
  });

  it("generates the requested number of recovery codes in XXXX-XXXX form", () => {
    const codes = generateRecoveryCodes(10);
    expect(codes).toHaveLength(10);
    for (const code of codes) expect(code).toMatch(/^[A-Z2-7]{4}-[A-Z2-7]{4}$/);
    // No duplicates among 10 random codes (would indicate a broken RNG)
    expect(new Set(codes).size).toBe(10);
  });

  it("hashes recovery codes deterministically, case/whitespace-insensitively", () => {
    const a = hashRecoveryCode("abcd-1234");
    const b = hashRecoveryCode("ABCD-1234");
    const c = hashRecoveryCode(" ABCD-1234 ");
    expect(a).toBe(b);
    expect(b).toBe(c);
    expect(a).toHaveLength(64); // sha256 hex
  });

  it("device tokens are random and hash deterministically", () => {
    const t1 = generateDeviceToken();
    const t2 = generateDeviceToken();
    expect(t1).not.toBe(t2);
    expect(hashDeviceToken(t1)).toBe(hashDeviceToken(t1));
    expect(hashDeviceToken(t1)).not.toBe(hashDeviceToken(t2));
  });
});
