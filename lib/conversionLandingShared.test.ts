import { describe, expect, it } from "vitest";
import { getCaseStudies } from "@/lib/caseStudies";
import { CLIENT_COUNTRIES } from "@/lib/clientLocations";
import { EXPERIENCE_SINCE_YEAR, getConversionTrustStatsDefault } from "@/lib/conversionLandingShared";

describe("getConversionTrustStatsDefault", () => {
  it("numrat dalin nga të dhënat reale, jo të shkruar me dorë", () => {
    for (const locale of ["sq", "en"] as const) {
      const s = getConversionTrustStatsDefault(locale);
      expect(s.primaryCount).toBe(new Date().getFullYear() - EXPERIENCE_SINCE_YEAR);
      expect(s.secondaryCount).toBe(getCaseStudies(locale).length);
      expect(s.tertiaryCount).toBe(CLIENT_COUNTRIES.length);
    }
  });
});
