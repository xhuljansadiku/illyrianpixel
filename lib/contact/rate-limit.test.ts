import { beforeEach, describe, expect, it } from "vitest";
import { checkRateLimit, clientIp, resetRateLimit } from "./rate-limit";

const options = { limit: 3, windowMs: 60_000 };

describe("checkRateLimit", () => {
  beforeEach(() => resetRateLimit());

  it("allows requests up to the limit, then blocks", () => {
    const now = 1_000_000;
    expect(checkRateLimit("ip-1", options, now)).toBe(true);
    expect(checkRateLimit("ip-1", options, now + 1)).toBe(true);
    expect(checkRateLimit("ip-1", options, now + 2)).toBe(true);
    expect(checkRateLimit("ip-1", options, now + 3)).toBe(false);
  });

  it("tracks keys independently", () => {
    const now = 2_000_000;
    for (let i = 0; i < 3; i++) checkRateLimit("ip-a", options, now + i);
    expect(checkRateLimit("ip-a", options, now + 10)).toBe(false);
    expect(checkRateLimit("ip-b", options, now + 10)).toBe(true);
  });

  it("allows requests again once the window has passed", () => {
    const now = 3_000_000;
    for (let i = 0; i < 3; i++) checkRateLimit("ip-1", options, now + i);
    expect(checkRateLimit("ip-1", options, now + 30_000)).toBe(false);
    expect(checkRateLimit("ip-1", options, now + 61_000)).toBe(true);
  });
});

describe("clientIp", () => {
  it("uses the first x-forwarded-for address", () => {
    const request = new Request("https://example.se", { headers: { "x-forwarded-for": "203.0.113.7, 10.0.0.1" } });
    expect(clientIp(request)).toBe("203.0.113.7");
  });

  it("falls back to x-real-ip and then 'unknown'", () => {
    expect(clientIp(new Request("https://example.se", { headers: { "x-real-ip": "198.51.100.2" } }))).toBe("198.51.100.2");
    expect(clientIp(new Request("https://example.se"))).toBe("unknown");
  });
});
