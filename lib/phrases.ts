export type Category = "All" | "Documents" | "Application" | "Waiting" | "Help";

export type Phrase = {
  id: string;
  category: Exclude<Category, "All">;
  title: string;
  message: string;
  icon: string;
};

export const phrases: Phrase[] = [
  { id: "welcome", category: "Help", title: "Welcome", message: "Welcome. How can I help you today?", icon: "👋" },
  { id: "need-help", category: "Help", title: "I can help", message: "I am here to help. Please choose a message or request an interpreter.", icon: "🤝" },
  { id: "documents", category: "Documents", title: "Show documents", message: "Please show the documents needed for your application.", icon: "📄" },
  { id: "missing", category: "Documents", title: "Missing document", message: "One document may be missing. Would you like me to explain which one?", icon: "🗂️" },
  { id: "received", category: "Application", title: "Documents received", message: "Your documents have been received.", icon: "✅" },
  { id: "status", category: "Application", title: "Check status", message: "Would you like to check your application status?", icon: "🔎" },
  { id: "wait", category: "Waiting", title: "Please wait", message: "Please wait here. I will update you shortly.", icon: "🕒" },
  { id: "turn", category: "Waiting", title: "Your turn soon", message: "You are next. Please stay nearby.", icon: "➡️" },
  { id: "repeat", category: "Help", title: "Repeat please", message: "Could you please repeat or show me that again?", icon: "🔁" },
  { id: "understood", category: "Help", title: "Confirm meaning", message: "I want to make sure I understood correctly. Is this right?", icon: "💬" },
];

export function filterPhrasesByCategory(list: Phrase[], category: Category): Phrase[] {
  if (category === "All") return list;
  return list.filter((p) => p.category === category);
}

export function formatDuration(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function formatDurationLong(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  if (seconds === 0) return `${minutes}m`;
  return `${minutes}m ${seconds}s`;
}

export function validateCustomMessage(text: string, maxLength = 240): {
  isValid: boolean;
  length: number;
  remaining: number;
  error?: string;
} {
  const length = text.length;
  if (length > maxLength) {
    return {
      isValid: false,
      length,
      remaining: maxLength - length,
      error: `Message exceeds maximum limit of ${maxLength} characters.`,
    };
  }
  return {
    isValid: true,
    length,
    remaining: maxLength - length,
  };
}

export type InterpreterRequestDraft = {
  counterNumber: string;
  service: string;
  assistanceType: string;
  urgency: "Standard" | "High Priority (Citizen waiting)";
  notes: string;
  createdAt?: string;
};

export function validateInterpreterDraft(draft: Partial<InterpreterRequestDraft>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  if (!draft.counterNumber || draft.counterNumber.trim().length === 0) {
    errors.counterNumber = "Counter or desk identifier is required.";
  }
  if (!draft.assistanceType || draft.assistanceType.trim().length === 0) {
    errors.assistanceType = "Assistance type must be selected.";
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

