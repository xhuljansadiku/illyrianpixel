import { afterEach, describe, expect, it, vi } from "vitest";
import { contactChannel, contactLocation, trackContactClick } from "@/lib/track";

// Element i rremë: `closest(selector)` kthen prindin që përputhet sipas hartës
function fakeEl(matches: Record<string, unknown>) {
  return {
    closest: (sel: string) => {
      for (const part of sel.split(",").map((s) => s.trim())) if (matches[part]) return matches[part];
      return null;
    },
  } as unknown as Element;
}

describe("contactChannel", () => {
  it("njeh kanalet", () => {
    expect(contactChannel("https://wa.me/355694726827?text=P%C3%ABrsh")).toBe("whatsapp");
    expect(contactChannel("https://api.whatsapp.com/send?phone=1")).toBe("whatsapp");
    expect(contactChannel("mailto:info@illyrianpixel.com")).toBe("email");
    expect(contactChannel("MAILTO:info@illyrianpixel.com")).toBe("email");
    expect(contactChannel("tel:+355694726827")).toBe("phone");
  });

  it("injoron linqet e tjera", () => {
    expect(contactChannel("/contact")).toBeNull();
    expect(contactChannel("https://illyrianpixel.com/wa.me")).toBeNull();
    expect(contactChannel(null)).toBeNull();
  });
});

describe("contactLocation", () => {
  it("data-track-location ka përparësi", () => {
    const el = fakeEl({ "[data-track-location]": { dataset: { trackLocation: "whatsapp_fab" } }, footer: {} });
    expect(contactLocation(el)).toBe("whatsapp_fab");
  });

  it("përndryshe zona e faqes", () => {
    expect(contactLocation(fakeEl({ footer: {} }))).toBe("footer");
    expect(contactLocation(fakeEl({ nav: {} }))).toBe("nav");
    expect(contactLocation(fakeEl({ '[role="dialog"]': {} }))).toBe("dialog");
    expect(contactLocation(fakeEl({}))).toBe("page");
  });
});

describe("trackContactClick", () => {
  const gtag = vi.fn();
  vi.stubGlobal("window", { gtag });
  afterEach(() => gtag.mockClear());

  const click = (href: string | null, matches: Record<string, unknown> = {}) => {
    const link = Object.assign(fakeEl(matches), { getAttribute: () => href });
    const target = { closest: (sel: string) => (sel === "a[href]" && href !== null ? link : null) };
    trackContactClick({ target } as unknown as MouseEvent);
  };

  it("dërgon kanalin dhe vendin — kurrë href-in me tekstin ose adresën", () => {
    click("https://wa.me/355694726827?text=Emri%20im", { footer: {} });
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith("event", "contact_click", { channel: "whatsapp", location: "footer" });
    expect(JSON.stringify(gtag.mock.calls)).not.toContain("wa.me");
  });

  it("s'dërgon asgjë për linqe të zakonshme ose klik jashtë linkut", () => {
    click("/cmimet");
    click(null);
    expect(gtag).not.toHaveBeenCalled();
  });
});
