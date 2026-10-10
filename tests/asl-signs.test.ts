import { describe, expect, it } from "vitest";
import { ASL_SIGNS, type ASLSignEntry } from "../lib/asl-signs";

describe("ASL Signs Inventory", () => {
  it("contains 36 ASL signs (26 alphabet signs + 10 counter basics)", () => {
    expect(ASL_SIGNS.length).toBe(36);
  });

  it("verifies all alphabet signs (A-Z) are single-handed", () => {
    const alphabetSigns = ASL_SIGNS.filter((s) => s.category === "Fingerspelling (A-Z)");
    expect(alphabetSigns.length).toBe(26);

    for (const sign of alphabetSigns) {
      expect(sign.language).toBe("ASL");
      expect(sign.singleHanded).toBe(true);
      expect(sign.handCount).toBe(1);
      expect(sign.id.startsWith("asl-")).toBe(true);
      expect(sign.handConfiguration.length).toBeGreaterThan(10);
    }

    const letters = alphabetSigns.map((s) => s.rawId).sort();
    expect(letters).toEqual([
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
      "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
      "U", "V", "W", "X", "Y", "Z",
    ]);
  });

  it("verifies ASL Counter Basics have accurate single-handed vs two-handed classifications", () => {
    const basics = ASL_SIGNS.filter((s) => s.category === "Counter Basics");
    expect(basics.length).toBe(10);

    const helpSign = basics.find((s) => s.rawId === "help");
    expect(helpSign).toBeDefined();
    // ASL 'help' is two-handed: dominant fist on non-dominant palm lifting up
    expect(helpSign?.singleHanded).toBe(false);
    expect(helpSign?.handCount).toBe(2);

    const singleHandedBasics = basics.filter((s) => s.singleHanded);
    // 9 of the 10 basics are single-handed (hello, yes, no, please, thank-you, sorry, understand, water, toilet)
    expect(singleHandedBasics.length).toBe(9);
    for (const sign of singleHandedBasics) {
      expect(sign.handCount).toBe(1);
    }
  });

  it("ensures every ASL sign has a unique ID and non-empty label & meaning", () => {
    const ids = new Set<string>();
    for (const sign of ASL_SIGNS) {
      expect(ids.has(sign.id)).toBe(false);
      ids.add(sign.id);
      expect(sign.label.length).toBeGreaterThan(0);
      expect(sign.meaning.length).toBeGreaterThan(0);
    }
    expect(ids.size).toBe(36);
  });
});
