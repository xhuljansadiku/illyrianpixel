import { afterEach, describe, expect, it, vi } from "vitest";
import { isAuthorizedCron, secureCompare } from "./secureCompare";

describe("secureCompare", () => {
  it("matches equal strings only", () => {
    expect(secureCompare("abc", "abc")).toBe(true);
    expect(secureCompare("abc", "abd")).toBe(false);
    expect(secureCompare("abc", "abcd")).toBe(false);
    expect(secureCompare("", "")).toBe(true);
  });
});

describe("isAuthorizedCron", () => {
  afterEach(() => vi.unstubAllEnvs());
  const req = (auth?: string) => new Request("https://x", { headers: auth ? { authorization: auth } : {} });

  it("rejects everything when CRON_SECRET is missing", () => {
    vi.stubEnv("CRON_SECRET", "");
    expect(isAuthorizedCron(req("Bearer undefined"))).toBe(false);
    expect(isAuthorizedCron(req("Bearer "))).toBe(false);
  });

  it("accepts only the exact bearer token", () => {
    vi.stubEnv("CRON_SECRET", "s3cret");
    expect(isAuthorizedCron(req("Bearer s3cret"))).toBe(true);
    expect(isAuthorizedCron(req("Bearer wrong"))).toBe(false);
    expect(isAuthorizedCron(req())).toBe(false);
  });
});
