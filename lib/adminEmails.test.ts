import { describe, expect, it } from "vitest";
import { escapeHtml } from "./adminEmails";

describe("escapeHtml", () => {
  it("escapes the five HTML-significant characters", () => {
    expect(escapeHtml("<script>alert('x')</script>")).toBe(
      "&lt;script&gt;alert(&#039;x&#039;)&lt;/script&gt;"
    );
  });

  it("neutralizes an attribute-breakout attempt", () => {
    const input = `"><img src=x onerror=alert(1)>`;
    const escaped = escapeHtml(input);
    expect(escaped).not.toContain("<img");
    expect(escaped).not.toContain('"');
  });

  it("leaves plain text untouched", () => {
    expect(escapeHtml("Përshëndetje Ada, faleminderit!")).toBe("Përshëndetje Ada, faleminderit!");
  });

  it("escapes ampersands without double-escaping the entities it just produced", () => {
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
  });
});
