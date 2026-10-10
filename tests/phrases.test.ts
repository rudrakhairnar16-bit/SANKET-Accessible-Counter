import { describe, expect, it } from "vitest";
import {
  phrases,
  filterPhrasesByCategory,
  type Category,
} from "../lib/phrases";

describe("SANKET phrase library", () => {
  it("has unique phrase identifiers", () => {
    const ids = phrases.map((phrase) => phrase.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("does not contain blank display messages or titles", () => {
    expect(
      phrases.every(
        (phrase) => phrase.message.trim().length > 0 && phrase.title.trim().length > 0
      )
    ).toBe(true);
  });

  it("uses only supported categories", () => {
    const supported = new Set(["Documents", "Application", "Waiting", "Help"]);
    expect(phrases.every((phrase) => supported.has(phrase.category))).toBe(true);
  });

  it("includes a clarification phrase for checking shared understanding", () => {
    expect(phrases.some((phrase) => phrase.id === "understood")).toBe(true);
  });

  it("contains an icon for every phrase card", () => {
    expect(phrases.every((phrase) => phrase.icon && phrase.icon.trim().length > 0)).toBe(true);
  });

  it("filters phrases correctly by category", () => {
    const all = filterPhrasesByCategory(phrases, "All");
    expect(all.length).toBe(phrases.length);

    const docPhrases = filterPhrasesByCategory(phrases, "Documents");
    expect(docPhrases.length).toBeGreaterThan(0);
    expect(docPhrases.every((p) => p.category === "Documents")).toBe(true);

    const appPhrases = filterPhrasesByCategory(phrases, "Application");
    expect(appPhrases.length).toBeGreaterThan(0);
    expect(appPhrases.every((p) => p.category === "Application")).toBe(true);

    const waitPhrases = filterPhrasesByCategory(phrases, "Waiting");
    expect(waitPhrases.length).toBeGreaterThan(0);
    expect(waitPhrases.every((p) => p.category === "Waiting")).toBe(true);

    const helpPhrases = filterPhrasesByCategory(phrases, "Help");
    expect(helpPhrases.length).toBeGreaterThan(0);
    expect(helpPhrases.every((p) => p.category === "Help")).toBe(true);
  });

  it("returns phrases within reasonable character limits for counter display", () => {
    // Phrases shouldn't be excessively verbose for a rapid public-service counter board
    for (const phrase of phrases) {
      expect(phrase.title.length).toBeLessThan(35);
      expect(phrase.message.length).toBeLessThan(120);
    }
  });
});
