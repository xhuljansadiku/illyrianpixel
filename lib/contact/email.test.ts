import { afterEach, describe, expect, it, vi } from "vitest";
import { buildInquiryEmail, escapeHtml, isEmailConfigured } from "./email";
import { normalizeContactInput } from "./schema";

const meta = { locale: "sv", source: "modal:hero", page: "/sv", receivedAt: new Date("2026-10-06T10:00:00Z") };

describe("escapeHtml", () => {
  it("escapes HTML-significant characters", () => {
    expect(escapeHtml(`<script>alert("x")</script> & 'y'`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;y&#39;",
    );
  });
});

describe("buildInquiryEmail", () => {
  const values = normalizeContactInput({
    name: "Anna <b>Svensson</b>",
    company: "Testbolaget AB",
    email: "anna@example.se",
    phone: "",
    service: "ecommerce",
    budget: "5k-10k",
    message: "Rad ett\n<img src=x onerror=alert(1)>",
  });

  it("never puts raw user HTML into the email body", () => {
    const { html } = buildInquiryEmail(values, meta);
    expect(html).not.toContain("<b>Svensson</b>");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
  });

  it("uses readable labels for service and budget", () => {
    const { text } = buildInquiryEmail(values, meta);
    expect(text).toContain("Service: E-Commerce");
    expect(text).toContain("Budget: €5,000–€10,000");
    expect(text).toContain("Language: Swedish");
  });

  it("keeps the subject on a single line", () => {
    const multiLine = normalizeContactInput({ ...values, company: "Evil\r\nBcc: victim@example.com" });
    // normalizeContactInput already collapses whitespace in single-line fields
    expect(buildInquiryEmail(multiLine, meta).subject).not.toMatch(/[\r\n]/);
  });
});

describe("isEmailConfigured", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("requires API key, recipient and sender", () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_TO_EMAIL", "hello@example.se");
    vi.stubEnv("CONTACT_FROM_EMAIL", "");
    expect(isEmailConfigured()).toBe(false);
    vi.stubEnv("CONTACT_FROM_EMAIL", "Nordic Pixel <hello@example.se>");
    expect(isEmailConfigured()).toBe(true);
  });
});
