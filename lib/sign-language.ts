import { ISL_MUNICIPAL_SIGNS, type ISLSignEntry } from "./isl-signs";
import { ASL_SIGNS, type ASLSignEntry } from "./asl-signs";

export type SignLanguage = "ISL" | "ASL";

export interface UnifiedSignEntry {
  id: string;
  rawId: string;
  language: SignLanguage;
  label: string;
  meaning: string;
  category: string;
  handCount: 1 | 2;
  singleHanded?: boolean;
  handConfiguration: string;
  multilingual?: {
    hindi: string;
    marathi: string;
    gujarati: string;
  };
  imagePath: string | null;
  animationPath: string | null;
  verificationStatus: string;
  sourceDataset: string;
}

export type SignDraftItem = {
  id: string; // unique draft item id
  signId: string; // foreign key to sign
  language: SignLanguage;
  label: string;
  meaning: string;
  handConfiguration: string;
};

/**
 * Returns strictly isolated sign library for the chosen language.
 * Never merges or cross-pollinates ISL and ASL entries.
 */
export function getSignLibrary(language: SignLanguage): UnifiedSignEntry[] {
  if (language === "ISL") {
    return ISL_MUNICIPAL_SIGNS.map((s) => ({
      ...s,
      singleHanded: s.handCount === 1,
    }));
  }
  return ASL_SIGNS.map((s) => ({
    ...s,
  }));
}

/**
 * Returns all distinct categories for a given sign language profile.
 */
export function getSignCategories(language: SignLanguage): string[] {
  const library = getSignLibrary(language);
  const categories = Array.from(new Set(library.map((s) => s.category)));
  return ["All", ...categories];
}

/**
 * Search and filter signs within the active sign language profile.
 * Guarantees language separation: an ISL search never returns ASL signs and vice versa.
 */
export function filterSigns(
  language: SignLanguage,
  query: string,
  category: string = "All",
): UnifiedSignEntry[] {
  const library = getSignLibrary(language);
  const trimmed = query.trim().toLowerCase();

  return library.filter((sign) => {
    // 1. Language must match
    if (sign.language !== language) return false;

    // 2. Category filter
    if (category !== "All" && sign.category !== category) return false;

    // 3. Search query
    if (!trimmed) return true;

    const matchLabel = sign.label.toLowerCase().includes(trimmed);
    const matchMeaning = sign.meaning.toLowerCase().includes(trimmed);
    const matchRaw = sign.rawId.toLowerCase().includes(trimmed);
    const matchConfig = sign.handConfiguration.toLowerCase().includes(trimmed);
    const matchMulti =
      sign.multilingual &&
      (sign.multilingual.hindi.includes(trimmed) ||
        sign.multilingual.marathi.includes(trimmed) ||
        sign.multilingual.gujarati.includes(trimmed));

    return Boolean(matchLabel || matchMeaning || matchRaw || matchConfig || matchMulti);
  });
}

/**
 * Formats a sequence of selected signs into a clear counter communication draft.
 * Explicitly states that signs are combined as communication concepts.
 */
export function formatSignDraftMessage(draft: SignDraftItem[]): string {
  if (draft.length === 0) return "";
  return draft.map((item) => `[${item.label}: ${item.meaning}]`).join(" ");
}

/**
 * Validates a sign draft before user sends it to the counter screen.
 */
export function validateSignDraft(draft: SignDraftItem[]): {
  isValid: boolean;
  count: number;
  error?: string;
} {
  const count = draft.length;
  if (count === 0) {
    return {
      isValid: false,
      count: 0,
      error: "Draft contains no signs. Select at least one sign to proceed.",
    };
  }
  if (count > 10) {
    return {
      isValid: false,
      count,
      error: "Maximum 10 signs permitted per message draft to maintain counter clarity.",
    };
  }
  return {
    isValid: true,
    count,
  };
}
