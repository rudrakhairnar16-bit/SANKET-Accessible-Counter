import { describe, expect, it } from "vitest";
import { ISL_MUNICIPAL_SIGNS } from "../lib/isl-signs";
import { ASL_SIGNS } from "../lib/asl-signs";
import { phrases, filterPhrasesByCategory } from "../lib/phrases";
import {
  MEDIAPIPE_GENERIC_GESTURES,
  normalizeGenericGesturePrediction,
} from "../lib/mediapipe-gestures";

describe("Accessibility & Semantics Quality Assurance", () => {
  describe("Sign Language Inventory Linguistic Metadata Completeness", () => {
    const allSigns = [...ISL_MUNICIPAL_SIGNS, ...ASL_SIGNS];

    it("verifies every sign entry contains descriptive meaning, valid category, and non-empty hand configuration", () => {
      for (const sign of allSigns) {
        expect(sign.id.trim()).not.toBe("");
        expect(sign.label.trim()).not.toBe("");
        expect(sign.meaning.trim()).not.toBe("");
        expect(sign.category.trim()).not.toBe("");
        expect(sign.handConfiguration.trim()).not.toBe("");
        expect([1, 2]).toContain(sign.handCount);
      }
    });

    it("verifies all ASL fingerspelling manual alphabet signs (A–Z) are declared single-handed", () => {
      const alphabetSigns = ASL_SIGNS.filter((s) => s.category === "Fingerspelling (A-Z)");
      expect(alphabetSigns.length).toBe(26);
      for (const sign of alphabetSigns) {
        expect(sign.handCount).toBe(1);
        expect(sign.singleHanded).toBe(true);
      }
    });

    it("verifies ISL municipal signs retain multilingual Indian regional names", () => {
      expect(ISL_MUNICIPAL_SIGNS.length).toBe(34);
      for (const sign of ISL_MUNICIPAL_SIGNS) {
        expect(sign.multilingual).toBeDefined();
        expect(sign.multilingual.hindi.trim()).not.toBe("");
        expect(sign.multilingual.marathi.trim()).not.toBe("");
        expect(sign.multilingual.gujarati.trim()).not.toBe("");
      }
    });

    it("ensures verificationStatus accurately reflects unverified/review-pending status across all entries", () => {
      for (const sign of allSigns) {
        expect(sign.verificationStatus).toBe("metadata-review-pending-placeholder-active");
        expect(sign.verificationStatus).not.toContain("certified");
        expect(sign.verificationStatus).not.toContain("expert-approved");
      }
    });
  });

  describe("Phrase Library & Categorization Semantics", () => {
    it("verifies all standard counter phrases have non-empty titles, messages, and icons", () => {
      expect(phrases.length).toBeGreaterThanOrEqual(10);
      for (const phrase of phrases) {
        expect(phrase.id.trim()).not.toBe("");
        expect(phrase.title.trim()).not.toBe("");
        expect(phrase.message.trim()).not.toBe("");
        expect(phrase.icon.trim()).not.toBe("");
        expect(["Documents", "Application", "Waiting", "Help"]).toContain(phrase.category);
      }
    });

    it("accurately filters phrases by category and preserves all phrases when 'All' is selected", () => {
      const all = filterPhrasesByCategory(phrases, "All");
      expect(all.length).toBe(phrases.length);

      const docs = filterPhrasesByCategory(phrases, "Documents");
      expect(docs.length).toBeGreaterThan(0);
      for (const p of docs) {
        expect(p.category).toBe("Documents");
      }

      const waiting = filterPhrasesByCategory(phrases, "Waiting");
      expect(waiting.length).toBeGreaterThan(0);
      for (const p of waiting) {
        expect(p.category).toBe("Waiting");
      }
    });
  });

  describe("MediaPipe Gesture Safety Boundaries", () => {
    it("strictly maps known canned gestures to descriptive English labels and attaches explicit warning", () => {
      const pred = normalizeGenericGesturePrediction("Open_Palm", 0.92);
      expect(pred).not.toBeNull();
      expect(pred?.category).toBe("Open_Palm");
      expect(pred?.label).toBe("Open palm");
      expect(pred?.scope).toBe("generic-hand-gesture");
      expect(pred?.warning).toContain("Generic hand-gesture classification only");
    });

    it("rejects unknown or unlisted gesture labels", () => {
      expect(normalizeGenericGesturePrediction("Not_A_Gesture", 0.99)).toBeNull();
      expect(normalizeGenericGesturePrediction(1234, 0.99)).toBeNull();
      expect(normalizeGenericGesturePrediction(null, 0.99)).toBeNull();
    });

    it("rejects confidence scores below the threshold or outside [0, 1]", () => {
      expect(normalizeGenericGesturePrediction("Open_Palm", 0.60, 0.65)).toBeNull();
      expect(normalizeGenericGesturePrediction("Open_Palm", -0.1)).toBeNull();
      expect(normalizeGenericGesturePrediction("Open_Palm", 1.5)).toBeNull();
      expect(normalizeGenericGesturePrediction("Open_Palm", Number.NaN)).toBeNull();
    });

    it("maintains all 7 canned MediaPipe gestures in its lookup dictionary", () => {
      const keys = Object.keys(MEDIAPIPE_GENERIC_GESTURES);
      expect(keys).toContain("Closed_Fist");
      expect(keys).toContain("Open_Palm");
      expect(keys).toContain("Pointing_Up");
      expect(keys).toContain("Thumb_Down");
      expect(keys).toContain("Thumb_Up");
      expect(keys).toContain("Victory");
      expect(keys).toContain("ILoveYou");
    });
  });
});
