import { describe, expect, it } from "vitest";
import {
  getSignLibrary,
  getSignCategories,
  filterSigns,
  formatSignDraftMessage,
  validateSignDraft,
  type SignDraftItem,
} from "../lib/sign-language";

describe("Sign Language Profile & Filtering System", () => {
  it("strictly separates ISL and ASL libraries", () => {
    const islSigns = getSignLibrary("ISL");
    const aslSigns = getSignLibrary("ASL");

    expect(islSigns.length).toBe(34);
    expect(aslSigns.length).toBe(36);

    for (const sign of islSigns) {
      expect(sign.language).toBe("ISL");
      expect(sign.id.startsWith("isl-")).toBe(true);
    }

    for (const sign of aslSigns) {
      expect(sign.language).toBe("ASL");
      expect(sign.id.startsWith("asl-")).toBe(true);
    }
  });

  it("retrieves distinct categories per language", () => {
    const islCategories = getSignCategories("ISL");
    const aslCategories = getSignCategories("ASL");

    expect(islCategories[0]).toBe("All");
    expect(aslCategories[0]).toBe("All");

    expect(islCategories).toContain("Greetings");
    expect(islCategories).toContain("Services");
    expect(aslCategories).toContain("Fingerspelling (A-Z)");
    expect(aslCategories).toContain("Counter Basics");
  });

  it("filters signs accurately by query and category without cross-language leakage", () => {
    // Search for 'water' in ISL matches Drinking Water, Utility Bill, and Drink
    const islWater = filterSigns("ISL", "water");
    expect(islWater.length).toBe(3);
    const islWaterIds = islWater.map((s) => s.id);
    expect(islWaterIds).toContain("isl-water");
    expect(islWaterIds).toContain("isl-bill");
    expect(islWaterIds).toContain("isl-drink");

    // Search for 'water' in ASL
    const aslWater = filterSigns("ASL", "water");
    expect(aslWater.length).toBe(1);
    expect(aslWater[0].id).toBe("asl-water");
    expect(aslWater[0].language).toBe("ASL");

    // Search letter 'A' in ISL returns no results (no letter A in ISL municipal list)
    const islA = filterSigns("ISL", "Letter A");
    expect(islA.length).toBe(0);

    // Search letter 'A' in ASL returns letter A
    const aslA = filterSigns("ASL", "Letter A");
    expect(aslA.length).toBe(1);
    expect(aslA[0].id).toBe("asl-a");

    // Multilingual search in ISL
    const islHindi = filterSigns("ISL", "नमस्ते");
    expect(islHindi.length).toBe(1);
    expect(islHindi[0].id).toBe("isl-namaste");
  });

  it("formats and validates sign draft items into a structured message", () => {
    const emptyValidation = validateSignDraft([]);
    expect(emptyValidation.isValid).toBe(false);
    expect(emptyValidation.error).toBeDefined();

    const sampleDraft: SignDraftItem[] = [
      {
        id: "item-1",
        signId: "isl-namaste",
        language: "ISL",
        label: "Namaste",
        meaning: "Traditional Indian greeting / Welcome",
        handConfiguration: "Two hands flat at chest",
      },
      {
        id: "item-2",
        signId: "isl-water",
        language: "ISL",
        label: "Drinking Water",
        meaning: "Drinking water facility / Paani",
        handConfiguration: "Cupped hand toward mouth",
      },
    ];

    const validResult = validateSignDraft(sampleDraft);
    expect(validResult.isValid).toBe(true);
    expect(validResult.count).toBe(2);

    const formattedMessage = formatSignDraftMessage(sampleDraft);
    expect(formattedMessage).toBe(
      "[Namaste: Traditional Indian greeting / Welcome] [Drinking Water: Drinking water facility / Paani]",
    );
  });
});
