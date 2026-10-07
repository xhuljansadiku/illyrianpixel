import { describe, expect, it } from "vitest";
import { csvEscape, rowsToCsv } from "./backup";

describe("csvEscape", () => {
  it("returns an empty string for null or undefined", () => {
    expect(csvEscape(null)).toBe("");
    expect(csvEscape(undefined)).toBe("");
  });

  it("leaves a plain value without commas/quotes/newlines untouched", () => {
    expect(csvEscape("Ada")).toBe("Ada");
    expect(csvEscape(42)).toBe("42");
  });

  it("wraps a value containing a comma in quotes", () => {
    expect(csvEscape("Tiranë, Shqipëri")).toBe('"Tiranë, Shqipëri"');
  });

  it("wraps and doubles internal quotes", () => {
    expect(csvEscape('Say "hi"')).toBe('"Say ""hi"""');
  });

  it("wraps a value containing a newline", () => {
    expect(csvEscape("line1\nline2")).toBe('"line1\nline2"');
  });

  it("serializes objects/arrays as JSON before escaping", () => {
    expect(csvEscape({ a: 1 })).toBe('"{""a"":1}"');
    // JSON.stringify([1,2]) is itself "[1,2]" — the comma triggers quoting too
    expect(csvEscape([1, 2])).toBe('"[1,2]"');
    // a single-element array has no comma, so it round-trips unquoted
    expect(csvEscape([1])).toBe("[1]");
  });
});

describe("rowsToCsv", () => {
  it("returns an empty string for an empty row set", () => {
    expect(rowsToCsv([])).toBe("");
  });

  it("uses the first row's keys as the header, in order", () => {
    const csv = rowsToCsv([{ id: 1, name: "Ada" }]);
    expect(csv.split("\n")[0]).toBe("id,name");
  });

  it("emits one CSV line per row, escaping each cell", () => {
    const csv = rowsToCsv([
      { id: 1, name: "Ada" },
      { id: 2, name: "Tiranë, Shqipëri" },
    ]);
    const lines = csv.split("\n");
    expect(lines).toHaveLength(3); // header + 2 rows
    expect(lines[1]).toBe("1,Ada");
    expect(lines[2]).toBe('2,"Tiranë, Shqipëri"');
  });
});
