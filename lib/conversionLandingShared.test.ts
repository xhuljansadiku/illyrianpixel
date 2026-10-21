import { describe, expect, it } from "vitest";
import { getCaseStudies } from "@/lib/caseStudies";
import { CLIENT_CITIES, CLIENT_COUNTRIES } from "@/lib/clientLocations";
import { getConversionTrustStatsDefault } from "@/lib/conversionLandingShared";

describe("getConversionTrustStatsDefault", () => {
  it("numrat dalin nga të dhënat reale, jo të shkruar me dorë", () => {
    for (const locale of ["sq", "en"] as const) {
      const s = getConversionTrustStatsDefault(locale);
      expect(s.primaryCount).toBe(getCaseStudies(locale).length);
      expect(s.secondaryCount).toBe(CLIENT_COUNTRIES.length);
      expect(s.tertiaryCount).toBe(CLIENT_CITIES.length);
    }
  });
});
