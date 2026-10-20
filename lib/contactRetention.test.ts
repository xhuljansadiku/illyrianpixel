import { describe, expect, it } from "vitest";
import { selectExpiredContacts } from "./contactRetention";

const CUTOFF = "2024-10-20T05:00:00.000Z";

describe("selectExpiredContacts", () => {
  it("expires old contacts with no sign of an ongoing relationship", () => {
    expect(selectExpiredContacts([{ id: "a", follow_up_date: null }], new Set(), CUTOFF)).toEqual(["a"]);
  });

  it("keeps clients and contacts with recent notes or quotes", () => {
    const candidates = [
      { id: "client", follow_up_date: null },
      { id: "old", follow_up_date: null },
    ];
    expect(selectExpiredContacts(candidates, new Set(["client"]), CUTOFF)).toEqual(["old"]);
  });

  it("keeps contacts with a follow-up planned inside the retention window", () => {
    const candidates = [
      { id: "planned", follow_up_date: "2026-11-01" },
      { id: "stale-plan", follow_up_date: "2023-01-15" },
    ];
    expect(selectExpiredContacts(candidates, new Set(), CUTOFF)).toEqual(["stale-plan"]);
  });
});
