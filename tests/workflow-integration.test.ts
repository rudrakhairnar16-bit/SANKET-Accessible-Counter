import { describe, expect, it } from "vitest";
import {
  getSignLibrary,
  filterSigns,
  formatSignDraftMessage,
  validateSignDraft,
  type SignDraftItem,
} from "../lib/sign-language";
import {
  formatDuration,
  formatDurationLong,
  validateCustomMessage,
  validateInterpreterDraft,
} from "../lib/phrases";

describe("Citizen & Staff Workflow Integration Tests", () => {
  describe("Sign Drafting & Compilation Flow", () => {
    it("assembles multiple ISL signs into a structured conceptual draft message", () => {
      const islSigns = getSignLibrary("ISL");
      const namaste = islSigns.find((s) => s.id === "isl-namaste")!;
      const form = islSigns.find((s) => s.id === "isl-form")!;
      const water = islSigns.find((s) => s.id === "isl-water")!;

      const draft: SignDraftItem[] = [
        {
          id: "draft-1",
          signId: namaste.id,
          language: "ISL",
          label: namaste.label,
          meaning: namaste.meaning,
          handConfiguration: namaste.handConfiguration,
        },
        {
          id: "draft-2",
          signId: form.id,
          language: "ISL",
          label: form.label,
          meaning: form.meaning,
          handConfiguration: form.handConfiguration,
        },
        {
          id: "draft-3",
          signId: water.id,
          language: "ISL",
          label: water.label,
          meaning: water.meaning,
          handConfiguration: water.handConfiguration,
        },
      ];

      const validation = validateSignDraft(draft);
      expect(validation.isValid).toBe(true);
      expect(validation.count).toBe(3);

      const message = formatSignDraftMessage(draft);
      expect(message).toContain("[Namaste: Traditional Indian greeting / Welcome]");
      expect(message).toContain("[Application Form: Municipal service application / Form fill-up]");
      expect(message).toContain("[Drinking Water: Drinking water facility / Paani]");
    });

    it("rejects an empty draft submission with a descriptive error message", () => {
      const emptyDraft: SignDraftItem[] = [];
      const validation = validateSignDraft(emptyDraft);
      expect(validation.isValid).toBe(false);
      expect(validation.count).toBe(0);
      expect(validation.error).toContain("Draft contains no signs");
      expect(formatSignDraftMessage(emptyDraft)).toBe("");
    });

    it("enforces the 10-sign maximum limit per draft for counter communication clarity", () => {
      const aslSigns = getSignLibrary("ASL");
      const overflowDraft: SignDraftItem[] = Array.from({ length: 11 }, (_, i) => ({
        id: `draft-${i}`,
        signId: aslSigns[i % aslSigns.length].id,
        language: "ASL",
        label: aslSigns[i % aslSigns.length].label,
        meaning: aslSigns[i % aslSigns.length].meaning,
        handConfiguration: aslSigns[i % aslSigns.length].handConfiguration,
      }));

      const validation = validateSignDraft(overflowDraft);
      expect(validation.isValid).toBe(false);
      expect(validation.count).toBe(11);
      expect(validation.error).toContain("Maximum 10 signs permitted");
    });
  });

  describe("Multilingual Sign Search & Filtering", () => {
    it("searches signs by English label, meaning, and Indian regional language names", () => {
      // English label
      const searchCert = filterSigns("ISL", "Certificate");
      expect(searchCert.length).toBeGreaterThanOrEqual(1);
      expect(searchCert[0].id).toBe("isl-certificate");

      // Hindi label
      const searchHindi = filterSigns("ISL", "नमस्ते");
      expect(searchHindi.length).toBe(1);
      expect(searchHindi[0].id).toBe("isl-namaste");

      // Marathi label
      const searchMarathi = filterSigns("ISL", "तक्रार");
      expect(searchMarathi.length).toBe(1);
      expect(searchMarathi[0].id).toBe("isl-complaint");

      // Case-insensitive query with whitespace
      const searchTrimmed = filterSigns("ISL", "  pOLicE  ");
      expect(searchTrimmed.length).toBe(1);
      expect(searchTrimmed[0].id).toBe("isl-police");
    });

    it("strictly isolates search queries so ASL searches never return ISL signs and vice versa", () => {
      // "Namaste" is unique to ISL municipal vocabulary
      expect(filterSigns("ISL", "Namaste").length).toBe(1);
      expect(filterSigns("ASL", "Namaste").length).toBe(0);

      // Letter A is unique to ASL alphabet vocabulary
      expect(filterSigns("ASL", "Letter A").length).toBe(1);
      expect(filterSigns("ISL", "Letter A").length).toBe(0);
    });
  });

  describe("Staff Response & Counter Message Validation", () => {
    it("validates character boundaries on custom messages", () => {
      expect(validateCustomMessage("").isValid).toBe(true);
      expect(validateCustomMessage("Short message").isValid).toBe(true);
      expect(validateCustomMessage("a".repeat(240)).isValid).toBe(true);

      const invalid = validateCustomMessage("a".repeat(241));
      expect(invalid.isValid).toBe(false);
      expect(invalid.error).toContain("limit of 240 characters");
      expect(invalid.remaining).toBe(-1);
    });

    it("formats counter session durations accurately across boundary values", () => {
      expect(formatDuration(0)).toBe("00:00");
      expect(formatDuration(45)).toBe("00:45");
      expect(formatDuration(60)).toBe("01:00");
      expect(formatDuration(330)).toBe("05:30");
      expect(formatDuration(3665)).toBe("61:05");

      expect(formatDurationLong(0)).toBe("0s");
      expect(formatDurationLong(45)).toBe("45s");
      expect(formatDurationLong(60)).toBe("1m");
      expect(formatDurationLong(330)).toBe("5m 30s");
    });

    it("validates required fields for interpreter request slips", () => {
      const valid = validateInterpreterDraft({
        counterNumber: "Counter 2",
        assistanceType: "Indian Sign Language (ISL) Interpreter",
      });
      expect(valid.isValid).toBe(true);
      expect(Object.keys(valid.errors).length).toBe(0);

      const missingCounter = validateInterpreterDraft({
        counterNumber: "",
        assistanceType: "Indian Sign Language (ISL) Interpreter",
      });
      expect(missingCounter.isValid).toBe(false);
      expect(missingCounter.errors.counterNumber).toBeDefined();

      const missingType = validateInterpreterDraft({
        counterNumber: "Counter 2",
        assistanceType: "",
      });
      expect(missingType.isValid).toBe(false);
      expect(missingType.errors.assistanceType).toBeDefined();
    });
  });
});
