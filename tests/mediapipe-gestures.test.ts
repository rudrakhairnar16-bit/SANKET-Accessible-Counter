import { describe, expect, it } from "vitest";
import { normalizeGenericGesturePrediction } from "../lib/mediapipe-gestures";

describe("MediaPipe generic gesture result normalization", () => {
  it("accepts a known generic gesture above the confidence threshold", () => {
    expect(normalizeGenericGesturePrediction("Open_Palm", 0.91)).toMatchObject({
      category: "Open_Palm",
      label: "Open palm",
      confidence: 0.91,
      scope: "generic-hand-gesture",
    });
  });

  it("rejects unknown categories instead of inventing a meaning", () => {
    expect(normalizeGenericGesturePrediction("Please", 0.99)).toBeNull();
  });

  it("rejects low-confidence predictions", () => {
    expect(normalizeGenericGesturePrediction("Thumb_Up", 0.4)).toBeNull();
  });

  it("rejects non-finite and out-of-range confidence values", () => {
    expect(normalizeGenericGesturePrediction("Victory", Number.NaN)).toBeNull();
    expect(normalizeGenericGesturePrediction("Victory", 1.1)).toBeNull();
    expect(normalizeGenericGesturePrediction("Victory", -0.1)).toBeNull();
  });

  it("rejects the model's None category", () => {
    expect(normalizeGenericGesturePrediction("None", 0.99)).toBeNull();
  });
});
