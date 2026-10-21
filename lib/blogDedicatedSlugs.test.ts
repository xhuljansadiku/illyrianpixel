import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { DEDICATED_BLOG_SLUGS } from "@/lib/blogDedicatedSlugs";

describe("DEDICATED_BLOG_SLUGS", () => {
  it("përputhet saktësisht me dosjet te app/[locale]/blog/ (përndryshe i njëjti URL gjenerohet dy herë)", () => {
    const dirs = readdirSync(path.resolve(__dirname, "../app/[locale]/blog"), { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith("["))
      .map((d) => d.name)
      .sort();
    expect([...DEDICATED_BLOG_SLUGS].sort()).toEqual(dirs);
  });
});
