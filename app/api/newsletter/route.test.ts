// `isNew` vendos nëse klienti numëron `newsletter_signup`: vetëm abonentët e rinj, jo riprovimet.
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  existing: null as null | { email: string; unsubscribed: boolean; confirmed_at: string | null },
  inserted: [] as Record<string, unknown>[],
  insertError: null as null | { message: string },
  emails: 0,
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: state.existing }) }) }),
      insert: async (row: Record<string, unknown>) => {
        if (!state.insertError) state.inserted.push(row);
        return { error: state.insertError };
      },
    }),
  }),
}));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: async () => void state.emails++ };
  },
}));
vi.mock("@/lib/rateLimit", () => ({ getClientIp: () => "1.2.3.4", checkRateLimit: async () => true }));
vi.mock("@/lib/siteSettings", () => ({
  getSiteSettings: async () => ({ newsletter_discount_code: "KOD10", whatsapp_number: "355" }),
}));
vi.mock("@/lib/activityLog", () => ({ logActivity: async () => {} }));
vi.mock("@/lib/newsletterTokens", () => ({ unsubscribeHeaders: () => ({}) }));
vi.mock("@/lib/newsletterEmail", () => ({ NEWSLETTER_BRAND: { from: "x", name: "x" }, welcomeEmailHtml: () => "" }));

const { POST } = await import("./route");
const subscribe = () =>
  POST(new Request("http://localhost/api/newsletter", { method: "POST", body: JSON.stringify({ email: "test@example.com" }) }));

beforeEach(() => {
  state.existing = null;
  state.inserted = [];
  state.insertError = null;
  state.emails = 0;
});

describe("POST /api/newsletter", () => {
  it("abonent i ri → isNew: true", async () => {
    expect(await (await subscribe()).json()).toEqual({ success: true, code: "KOD10", isNew: true });
    expect(state.inserted).toHaveLength(1);
    expect(state.emails).toBe(1);
  });

  it("ende pa konfirmuar → ridërgon email-in, por s'është i ri", async () => {
    state.existing = { email: "test@example.com", unsubscribed: false, confirmed_at: null };
    const body = await (await subscribe()).json();
    expect(body.isNew).toBe(false);
    expect(state.inserted).toHaveLength(0);
    expect(state.emails).toBe(1);
  });

  it("tashmë i konfirmuar → s'është i ri dhe s'ka email", async () => {
    state.existing = { email: "test@example.com", unsubscribed: false, confirmed_at: "2026-01-01" };
    const body = await (await subscribe()).json();
    expect(body.success).toBe(true);
    expect(body.isNew).toBeFalsy();
    expect(state.emails).toBe(0);
  });

  it("gabim në DB → 500, pa sukses", async () => {
    state.insertError = { message: "db down" };
    const res = await subscribe();
    expect(res.status).toBe(500);
    expect((await res.json()).success).toBe(false);
  });
});
