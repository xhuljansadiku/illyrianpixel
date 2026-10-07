import { describe, expect, it } from "vitest";
import { hasErrors, normalizeContactInput, validateContact, validateField } from "./schema";

const valid = {
  name: "Anna Svensson",
  company: "Testbolaget AB",
  email: "anna@example.se",
  phone: "070-123 45 67",
  service: "website",
  budget: "3k-5k",
  message: "Vi behöver en ny webbplats med bokningsfunktion.",
};

describe("normalizeContactInput", () => {
  it("trims values and drops non-string input", () => {
    const values = normalizeContactInput({ ...valid, name: "  Anna   Svensson ", company: 42, extra: "x" });
    expect(values.name).toBe("Anna Svensson");
    expect(values.company).toBe("");
    expect(values).not.toHaveProperty("extra");
  });

  it("keeps line breaks in the message but normalizes CRLF", () => {
    expect(normalizeContactInput({ message: "Rad ett\r\nRad två" }).message).toBe("Rad ett\nRad två");
  });
});

describe("validateContact", () => {
  it("accepts a complete inquiry", () => {
    expect(validateContact(normalizeContactInput(valid))).toEqual({});
  });

  it("accepts an inquiry without the optional fields", () => {
    const errors = validateContact(normalizeContactInput({ ...valid, company: "", phone: "" }));
    expect(hasErrors(errors)).toBe(false);
  });

  it("reports every missing required field", () => {
    expect(validateContact(normalizeContactInput({}))).toEqual({
      name: "required",
      email: "required",
      service: "required",
      budget: "required",
      message: "required",
    });
  });

  it("rejects unknown service and budget options", () => {
    const errors = validateContact(normalizeContactInput({ ...valid, service: "hacking", budget: "1M" }));
    expect(errors).toEqual({ service: "invalid", budget: "invalid" });
  });
});

describe("validateField", () => {
  it.each([
    ["anna@example.se", null],
    ["anna.svensson+web@foretag.co.uk", null],
    ["anna@example", "invalid"],
    ["anna example.se", "invalid"],
    ["@example.se", "invalid"],
  ])("email %s → %s", (email, expected) => {
    expect(validateField("email", email)).toBe(expected);
  });

  it.each([
    ["070-123 45 67", null],
    ["+46 70 123 45 67", null],
    ["(08) 123 456", null],
    ["12345", "invalid"],
    ["call me maybe", "invalid"],
    ["+46 70 123 45 67 89 01 23", "invalid"],
  ])("phone %s → %s", (phone, expected) => {
    expect(validateField("phone", phone)).toBe(expected);
  });

  it("enforces message length", () => {
    expect(validateField("message", "Hej!")).toBe("too_short");
    expect(validateField("message", "x".repeat(5001))).toBe("too_long");
  });

  it("enforces name length", () => {
    expect(validateField("name", "A")).toBe("too_short");
    expect(validateField("name", "A".repeat(101))).toBe("too_long");
  });
});
