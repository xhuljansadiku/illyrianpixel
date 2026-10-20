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

  it("signs broadcast tracking links and rejects unsigned or reused ones", async () => {
    const { broadcastEmailHtml } = await import("./newsletterEmail");
    const html = broadcastEmailHtml("Tema", "Mesazh", undefined, {
      broadcastId: "11111111-2222-3333-4444-555555555555",
      email: "Ana@Example.com",
    });
    const src = html.match(/track\/open\?([^"]+)"/)?.[1].replaceAll("&amp;", "&");
    expect(src).toContain("t=");
    const pixel = new URL(`https://illyrianpixel.com/api/newsletter/track/open?${src}`);
    expect(readSignedEmail(pixel, "track")).toBe("Ana@Example.com");

    // Pa token (linqet e vjetra / ngjarje të rreme) → s'regjistrohet
    pixel.searchParams.delete("t");
    expect(readSignedEmail(pixel, "track")).toBeNull();
    // Token-i i çregjistrimit s'vlen për tracking
    const unsub = new URL(unsubscribeUrl("ana@example.com"));
    expect(readSignedEmail(unsub, "track")).toBeNull();
  });
});
