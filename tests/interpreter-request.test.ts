import { describe, expect, it } from "vitest";
import { validateInterpreterDraft, type InterpreterRequestDraft } from "../lib/phrases";

describe("Interpreter request draft validation", () => {
  it("approves a complete and valid draft", () => {
    const draft: InterpreterRequestDraft = {
      counterNumber: "Counter 4",
      service: "General enquiry",
      assistanceType: "Indian Sign Language (ISL) Interpreter",
      urgency: "Standard",
      notes: "Citizen requested ISL interpreter for scheme guidelines.",
    };
    const res = validateInterpreterDraft(draft);
    expect(res.isValid).toBe(true);
    expect(Object.keys(res.errors).length).toBe(0);
  });

  it("fails if counter identifier is missing or blank", () => {
    const missingCounter: Partial<InterpreterRequestDraft> = {
      counterNumber: "",
      assistanceType: "Indian Sign Language (ISL) Interpreter",
    };
    const res = validateInterpreterDraft(missingCounter);
    expect(res.isValid).toBe(false);
    expect(res.errors.counterNumber).toBeDefined();

    const whitespaceCounter: Partial<InterpreterRequestDraft> = {
      counterNumber: "   ",
      assistanceType: "Indian Sign Language (ISL) Interpreter",
    };
    const resWhitespace = validateInterpreterDraft(whitespaceCounter);
    expect(resWhitespace.isValid).toBe(false);
    expect(resWhitespace.errors.counterNumber).toBeDefined();
  });

  it("fails if assistance type is missing", () => {
    const missingAssistance: Partial<InterpreterRequestDraft> = {
      counterNumber: "Desk A",
      assistanceType: "",
    };
    const res = validateInterpreterDraft(missingAssistance);
    expect(res.isValid).toBe(false);
    expect(res.errors.assistanceType).toBeDefined();
  });

  it("allows optional notes to be empty", () => {
    const withoutNotes: Partial<InterpreterRequestDraft> = {
      counterNumber: "Counter 2",
      assistanceType: "Speech-to-Text Transcriber",
      urgency: "Standard",
      notes: "",
    };
    const res = validateInterpreterDraft(withoutNotes);
    expect(res.isValid).toBe(true);
  });
});
