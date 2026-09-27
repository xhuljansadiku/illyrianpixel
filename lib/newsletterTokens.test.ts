import { beforeEach, describe, expect, it, vi } from "vitest";
import { newsletterToken, readSignedEmail, unsubscribeUrl, confirmUrl, verifyNewsletterToken } from "./newsletterTokens";

describe("newsletterTokens", () => {
  beforeEach(() => vi.stubEnv("NEWSLETTER_SECRET", "test-secret"));

  it("verifies a token only for the same email and purpose", () => {
    const t = newsletterToken("unsubscribe", "Ana@Example.com");
    expect(verifyNewsletterToken("unsubscribe", "ana@example.com", t)).toBe(true);
    expect(verifyNewsletterToken("unsubscribe", "other@example.com", t)).toBe(false);
    expect(verifyNewsletterToken("confirm", "ana@example.com", t)).toBe(false);
    expect(verifyNewsletterToken("unsubscribe", "ana@example.com", "garbage")).toBe(false);
  });

  it("round-trips signed links", () => {
    expect(readSignedEmail(new URL(unsubscribeUrl("ana@example.com")), "unsubscribe")).toBe("ana@example.com");
    expect(readSignedEmail(new URL(confirmUrl("ana@example.com")), "confirm")).toBe("ana@example.com");
    // Link çregjistrimi s'mund të përdoret si konfirmim
    expect(readSignedEmail(new URL(unsubscribeUrl("ana@example.com")), "confirm")).toBeNull();
  });

  it("rejects a link whose email was swapped", () => {
    const url = new URL(unsubscribeUrl("ana@example.com"));
    url.searchParams.set("e", Buffer.from("victim@example.com").toString("base64url"));
    expect(readSignedEmail(url, "unsubscribe")).toBeNull();
  });
});
