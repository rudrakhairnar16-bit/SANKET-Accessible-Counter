import { describe, expect, it } from "vitest";
import { validateCustomMessage } from "../lib/phrases";

describe("Custom message validation", () => {
  it("accepts valid messages under maximum character limit", () => {
    const sample = "Please provide your Aadhaar or voter card.";
    const res = validateCustomMessage(sample);
    expect(res.isValid).toBe(true);
    expect(res.length).toBe(sample.length);
    expect(res.remaining).toBe(240 - sample.length);
    expect(res.error).toBeUndefined();
  });

  it("accepts an empty message string", () => {
    const res = validateCustomMessage("");
    expect(res.isValid).toBe(true);
    expect(res.length).toBe(0);
    expect(res.remaining).toBe(240);
  });

  it("accepts a message exactly at the 240 character limit", () => {
    const exact240 = "A".repeat(240);
    const res = validateCustomMessage(exact240);
    expect(res.isValid).toBe(true);
    expect(res.length).toBe(240);
    expect(res.remaining).toBe(0);
  });

  it("rejects messages exceeding the 240 character limit", () => {
    const overLimit = "B".repeat(241);
    const res = validateCustomMessage(overLimit);
    expect(res.isValid).toBe(false);
    expect(res.length).toBe(241);
    expect(res.remaining).toBe(-1);
    expect(res.error).toContain("240");
  });

  it("handles special characters and punctuation safely without distortion", () => {
    const special = "Form #10-B: Please sign at (X) & wait here! <>=/?";
    const res = validateCustomMessage(special);
    expect(res.isValid).toBe(true);
    expect(res.length).toBe(special.length);
  });
});
