// Teste integrimi për /api/contact (2026-10-21) — Supabase, Resend, Telegram, WhatsApp dhe rate
// limit janë mock: asgjë s'shkon në prodhim. Mbulojnë rastet e docs/QA_CHECKLIST.md §2.
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  insertError: null as null | { message: string },
  inserted: [] as Record<string, unknown>[],
  rateAllowed: true,
  emails: [] as { to: string; subject: string; html: string }[],
  emailThrows: false,
  telegram: [] as string[],
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      insert: async (rows: Record<string, unknown>[]) => {
        if (!state.insertError) state.inserted.push(...rows);
        return { error: state.insertError };
      },
    }),
  }),
}));
vi.mock("resend", () => ({
  Resend: class {
    emails = {
      send: async (msg: { to: string; subject: string; html: string }) => {
        if (state.emailThrows) throw new Error("resend down");
        state.emails.push(msg);
      },
    };
  },
}));
vi.mock("@/lib/rateLimit", () => ({
  getClientIp: () => "1.2.3.4",
  checkRateLimit: async () => state.rateAllowed,
}));
vi.mock("@/lib/telegram", () => ({
  sendTelegramMessage: async (text: string) => void state.telegram.push(text),
  escapeTelegramHtml: (v: string) => v,
}));
vi.mock("@/lib/whatsapp", () => ({ sendWhatsAppMessage: async () => {} }));
vi.mock("@/lib/activityLog", () => ({ logActivity: async () => {} }));

const { POST } = await import("./route");

const valid = { name: "Test Klient", email: "test@example.com", message: "Dua një website për biznesin tim." };
const post = (body: unknown) =>
  POST(new Request("http://localhost/api/contact", { method: "POST", body: JSON.stringify(body) }));

beforeEach(() => {
  state.insertError = null;
  state.inserted = [];
  state.rateAllowed = true;
  state.emails = [];
  state.emailThrows = false;
  state.telegram = [];
});

describe("POST /api/contact", () => {
  it("1. dërgim i vlefshëm pa telefon → 200, ruhet, 2 email-e", async () => {
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    expect(state.inserted).toHaveLength(1);
    expect(state.inserted[0]).toMatchObject({ phone: "", budget: "", timeline: "" });
    expect(state.emails).toHaveLength(2);
    // pa telefon → Telegram jep link email-i, jo wa.me bosh
    expect(state.telegram[0]).toContain("mailto:test@example.com");
    expect(state.telegram[0]).not.toContain("wa.me/\"");
  });

  it("2. fushë e detyrueshme bosh → 400, asgjë s'ruhet", async () => {
    for (const missing of ["name", "email", "message"]) {
      const res = await post({ ...valid, [missing]: "" });
      expect(res.status).toBe(400);
    }
    expect(state.inserted).toHaveLength(0);
  });

  it("3. email i pavlefshëm → 400", async () => {
    const res = await post({ ...valid, email: "jo-email" });
    expect(res.status).toBe(400);
    expect(state.inserted).toHaveLength(0);
  });

  it("4. gabim në DB → 500 dhe success: false (kurrë sukses i rremë)", async () => {
    state.insertError = { message: "db down" };
    const res = await post(valid);
    expect(res.status).toBe(500);
    expect((await res.json()).success).toBe(false);
    expect(state.emails).toHaveLength(0);
  });

  it("5. Resend dështon → kontakti ruhet, kthen sukses (lead-i s'humbet)", async () => {
    state.emailThrows = true;
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(state.inserted).toHaveLength(1);
  });

  it("6. honeypot i mbushur → sukses i rremë, asgjë s'ruhet", async () => {
    const res = await post({ ...valid, website: "http://spam.example" });
    expect(await res.json()).toEqual({ success: true });
    expect(state.inserted).toHaveLength(0);
    expect(state.emails).toHaveLength(0);
  });

  it("11. rate limit → 429, asgjë s'ruhet", async () => {
    state.rateAllowed = false;
    const res = await post(valid);
    expect(res.status).toBe(429);
    expect(state.inserted).toHaveLength(0);
  });

  it("body jo-JSON → 400", async () => {
    const res = await POST(new Request("http://localhost/api/contact", { method: "POST", body: "{" }));
    expect(res.status).toBe(400);
  });

  it("email i konfirmimit në anglisht kur forma vjen nga /en", async () => {
    await post({ ...valid, sourcePath: "/en/contact" });
    const toClient = state.emails.find((e) => e.to === valid.email)!;
    expect(toClient.subject).toBe("We received your request — Illyrian Pixel");
    expect(toClient.html).toContain("Thank you");
  });

  it("email i konfirmimit në shqip si parazgjedhje", async () => {
    await post({ ...valid, sourcePath: "/contact" });
    const toClient = state.emails.find((e) => e.to === valid.email)!;
    expect(toClient.subject).toBe("Kërkesa juaj u pranua — Illyrian Pixel");
    expect(toClient.html).toContain("Faleminderit");
  });

  it("buxheti 'Mbi €2,000' e shënon kontaktin si PRIORITET", async () => {
    await post({ ...valid, budget: "Mbi €2,000" });
    const toAdmin = state.emails.find((e) => e.to !== valid.email)!;
    expect(toAdmin.subject).toContain("PRIORITET");
  });

  it("pa shërbim → subject 'pa shërbim', jo vizë bosh", async () => {
    await post(valid);
    const toAdmin = state.emails.find((e) => e.to !== valid.email)!;
    expect(toAdmin.subject).toBe("Kërkesë e re nga Test Klient — pa shërbim");
  });
});
