import { describe, expect, it } from "vitest";
import { ISL_MUNICIPAL_SIGNS, type ISLSignEntry } from "../lib/isl-signs";

describe("ISL Municipal Signs Inventory", () => {
  it("contains exactly 34 ISL-labelled municipal entries", () => {
    expect(ISL_MUNICIPAL_SIGNS.length).toBe(34);
  });

  it("ensures every sign has language set to ISL and unique IDs", () => {
    const ids = new Set<string>();
    const rawIds = new Set<string>();

    for (const sign of ISL_MUNICIPAL_SIGNS) {
      expect(sign.language).toBe("ISL");
      expect(sign.id.startsWith("isl-")).toBe(true);
      expect(ids.has(sign.id)).toBe(false);
      expect(rawIds.has(sign.rawId)).toBe(false);
      ids.add(sign.id);
      rawIds.add(sign.rawId);
    }

    expect(ids.size).toBe(34);
    expect(rawIds.size).toBe(34);
  });

  it("verifies categories match the 6 municipal domain categories", () => {
    const expectedCategories = new Set([
      "Greetings",
      "Basic",
      "Services",
      "Documents",
      "Civic",
      "Daily Life",
    ]);

    const actualCategories = new Set(ISL_MUNICIPAL_SIGNS.map((s) => s.category));
    expect(actualCategories).toEqual(expectedCategories);

    // Verify sign count per category
    expect(ISL_MUNICIPAL_SIGNS.filter((s) => s.category === "Greetings").length).toBe(4);
    expect(ISL_MUNICIPAL_SIGNS.filter((s) => s.category === "Basic").length).toBe(7);
    expect(ISL_MUNICIPAL_SIGNS.filter((s) => s.category === "Services").length).toBe(5);
    expect(ISL_MUNICIPAL_SIGNS.filter((s) => s.category === "Documents").length).toBe(5);
    expect(ISL_MUNICIPAL_SIGNS.filter((s) => s.category === "Civic").length).toBe(10);
    expect(ISL_MUNICIPAL_SIGNS.filter((s) => s.category === "Daily Life").length).toBe(3);
  });

  it("verifies all entries contain descriptive hand configurations and non-empty intended meanings", () => {
    for (const sign of ISL_MUNICIPAL_SIGNS) {
      expect(sign.label.length).toBeGreaterThan(0);
      expect(sign.meaning.length).toBeGreaterThan(0);
      expect(sign.handConfiguration.length).toBeGreaterThan(10);
      expect([1, 2]).toContain(sign.handCount);
      expect(sign.multilingual.hindi.length).toBeGreaterThan(0);
      expect(sign.multilingual.marathi.length).toBeGreaterThan(0);
      expect(sign.multilingual.gujarati.length).toBeGreaterThan(0);
    }
  });

  it("truthfully marks visual status as active placeholder until authentic assets are bundled", () => {
    for (const sign of ISL_MUNICIPAL_SIGNS) {
      expect(sign.verificationStatus).toBe("metadata-review-pending-placeholder-active");
      expect(sign.imagePath).toBeNull();
      expect(sign.animationPath).toBeNull();
    }
  });
});
