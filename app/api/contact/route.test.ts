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
  telegramHangs: false,
  afterTasks: [] as (() => unknown)[],
}));

// `after()` kërkon runtime-in e Next: këtu detyrat mbahen në radhë që testi të zgjedhë kur ekzekutohen
vi.mock("next/server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/server")>()),
  after: (task: () => unknown) => void state.afterTasks.push(task),
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
  sendTelegramMessage: async (text: string) => {
    if (state.telegramHangs) await new Promise(() => {});
    state.telegram.push(text);
  },
  escapeTelegramHtml: (v: string) => v,
}));
vi.mock("@/lib/whatsapp", () => ({ sendWhatsAppMessage: async () => {} }));
vi.mock("@/lib/activityLog", () => ({ logActivity: async () => {} }));

const { POST } = await import("./route");
const { createMathChallenge } = await import("@/lib/mathCheck");

const ch = createMathChallenge();
const valid = { name: "Test Klient", email: "test@example.com", message: "Dua një website për biznesin tim.", checkToken: ch.token, checkAnswer: String(ch.a + ch.b) };
const send = (body: unknown) =>
  POST(new Request("http://localhost/api/contact", { method: "POST", body: JSON.stringify(body) }));
const runAfterTasks = () => Promise.all(state.afterTasks.splice(0).map((task) => task()));
// Përgjigjja + njoftimet që dalin pas saj
const post = async (body: unknown) => {
  const res = await send(body);
  await runAfterTasks();
  return res;
};

beforeEach(() => {
  state.telegramHangs = false;
  state.afterTasks = [];
  state.insertError = null;
  state.inserted = [];
  state.rateAllowed = true;
  state.emails = [];
  state.emailThrows = false;
  state.telegram = [];
});

describe("POST /api/contact", () => {
  it("0. pyetja me 2 numra gabim ose mungon → 400, asgjë s’ruhet", async () => {
    for (const bad of [{ checkAnswer: String(ch.a + ch.b + 1) }, { checkToken: undefined }, { checkToken: "1.x.y" }]) {
      const res = await post({ ...valid, ...bad });
      expect(res.status).toBe(400);
    }
    expect(state.inserted).toHaveLength(0);
    expect(state.telegram).toHaveLength(0);
  });

  it("1. dërgim i vlefshëm pa telefon → 200, ruhet, 2 email-e", async () => {
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, saved: true });
    expect(state.inserted).toHaveLength(1);
    expect(state.inserted[0]).toMatchObject({ phone: "", budget: "", timeline: "" });
    expect(state.emails).toHaveLength(2);
    // pa telefon → Telegram jep link email-i, jo wa.me bosh
    expect(state.telegram[0]).toContain("mailto:test@example.com");
    expect(state.telegram[0]).not.toContain("wa.me/\"");
  });

  it("përgjigjet pasi ruan kërkesën, pa pritur asnjë njoftim", async () => {
    const res = await send(valid);
    expect(await res.json()).toEqual({ success: true, saved: true });
    expect(state.inserted).toHaveLength(1);
    expect(state.emails).toHaveLength(0);
    expect(state.telegram).toHaveLength(0);

    await runAfterTasks();
    expect(state.emails).toHaveLength(2);
    expect(state.telegram).toHaveLength(1);
  });

  it("një njoftim që ngec nuk i ndalon email-et", async () => {
    state.telegramHangs = true;
    await send(valid);
    void runAfterTasks();
    await vi.waitFor(() => expect(state.emails).toHaveLength(2));
  });

  it("ruan burimin e vizitorit me kërkesën", async () => {
    await post({ ...valid, attribution: { utm_source: "google", utm_medium: "cpc", landing_path: "/cmimet", referrer_host: "google.com", click_source: "google_ads" } });
    expect(state.inserted[0]).toMatchObject({ utm_source: "google", utm_medium: "cpc", landing_path: "/cmimet", referrer_host: "google.com", click_source: "google_ads" });
  });

  it("ruan kërkesën edhe pa burim", async () => {
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect(state.inserted[0]).not.toHaveProperty("utm_source");
  });

  it("burimi i manipuluar s'prek fushat e tjera dhe s'e prish kërkesën", async () => {
    const res = await post({ ...valid, attribution: { name: "Tjeter", deleted_at: "2020-01-01", utm_source: "<b>x</b>", click_source: "fake" } });
    expect(res.status).toBe(200);
    expect(state.inserted[0]).toMatchObject({ name: valid.name, utm_source: "bx/b" });
    expect(state.inserted[0]).not.toHaveProperty("deleted_at");
    expect(state.inserted[0]).not.toHaveProperty("click_source");

    const notObject = await post({ ...valid, attribution: "tekst" });
    expect(notObject.status).toBe(200);
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
    expect(state.telegram).toHaveLength(0);
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
