import { describe, expect, it } from "vitest";
import { buildWhatsAppChatHref, DEFAULT_WHATSAPP_E164 } from "./whatsappPrefill";

describe("buildWhatsAppChatHref", () => {
  it("strips formatting characters down to digits only", () => {
    const href = buildWhatsAppChatHref("+355 69 472 6827");
    expect(href.startsWith("https://wa.me/355694726827?text=")).toBe(true);
  });

  it("falls back to the default number when given an empty string", () => {
    const href = buildWhatsAppChatHref("");
    expect(href.startsWith(`https://wa.me/${DEFAULT_WHATSAPP_E164}?text=`)).toBe(true);
  });

  it("falls back to the default number when given a string with no digits", () => {
    const href = buildWhatsAppChatHref("not-a-number");
    expect(href.startsWith(`https://wa.me/${DEFAULT_WHATSAPP_E164}?text=`)).toBe(true);
  });

  it("URL-encodes the prefill message", () => {
    const href = buildWhatsAppChatHref(DEFAULT_WHATSAPP_E164);
    expect(href).toContain("%0A"); // encoded newline between message lines
    expect(href).not.toContain("\n");
  });
});
