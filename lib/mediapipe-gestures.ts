/**
 * Normalizes MediaPipe's built-in generic hand-gesture labels.
 * These labels are NOT ISL/ASL vocabulary and must never be auto-translated.
 */
export const MEDIAPIPE_GENERIC_GESTURES: Readonly<Record<string, string>> = {
  Closed_Fist: "Closed fist",
  Open_Palm: "Open palm",
  Pointing_Up: "Pointing up",
  Thumb_Down: "Thumb down",
  Thumb_Up: "Thumb up",
  Victory: "Victory / two fingers",
  ILoveYou: "I-love-you handshape (generic model label)",
};

export type GenericGesturePrediction = {
  category: string;
  label: string;
  confidence: number;
  scope: "generic-hand-gesture";
  warning: string;
};

export function normalizeGenericGesturePrediction(
  category: unknown,
  confidence: unknown,
  threshold = 0.65,
): GenericGesturePrediction | null {
  if (typeof category !== "string" || !(category in MEDIAPIPE_GENERIC_GESTURES)) return null;
  if (typeof confidence !== "number" || !Number.isFinite(confidence) || confidence < threshold || confidence > 1) return null;
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) return null;

  return {
    category,
    label: MEDIAPIPE_GENERIC_GESTURES[category],
    confidence,
    scope: "generic-hand-gesture",
    warning: "Generic hand-gesture classification only. This is not an ISL/ASL sign translation and must not be used as one.",
  };
}
