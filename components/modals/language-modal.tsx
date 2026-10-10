"use client";

import type { SignLanguage } from "@/lib/sign-language";

export interface LanguageModalProps {
  isOpen: boolean;
  activeLanguage: SignLanguage;
  onSelectLanguage: (lang: SignLanguage) => void;
  onClose: () => void;
}

export function LanguageModal({
  isOpen,
  activeLanguage,
  onSelectLanguage,
  onClose,
}: LanguageModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lang-modal-title"
      onClick={onClose}
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 id="lang-modal-title">Choose Sign Language</h2>
            <p>Select the language profile for the Visual Sign Library and counter interaction.</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close language selector"
          >
            ×
          </button>
        </div>

        <div className="lang-options-grid">
          {/* Option 1: ISL */}
          <button
            type="button"
            className={`lang-option-card ${activeLanguage === "ISL" ? "selected" : ""}`}
            onClick={() => onSelectLanguage("ISL")}
            aria-pressed={activeLanguage === "ISL"}
          >
            <div className="lang-card-top">
              <span className="lang-badge">ISL · INDIA</span>
              {activeLanguage === "ISL" && (
                <span className="lang-check" aria-hidden="true">
                  ✓
                </span>
              )}
            </div>
            <h3>Indian Sign Language</h3>
            <p>
              34 authentic municipal counter signs tailored to Indian public service desks (ISLRTC baseline). Includes Hindi, Marathi, and Gujarati equivalents.
            </p>
            <div className="lang-meta-pills">
              <span className="lang-meta-pill">34 Signs</span>
              <span className="lang-meta-pill">Multilingual</span>
              <span className="lang-meta-pill">Municipal Focus</span>
            </div>
          </button>

          {/* Option 2: ASL */}
          <button
            type="button"
            className={`lang-option-card ${activeLanguage === "ASL" ? "selected" : ""}`}
            onClick={() => onSelectLanguage("ASL")}
            aria-pressed={activeLanguage === "ASL"}
          >
            <div className="lang-card-top">
              <span className="lang-badge">ASL · AMERICAN</span>
              {activeLanguage === "ASL" && (
                <span className="lang-check" aria-hidden="true">
                  ✓
                </span>
              )}
            </div>
            <h3>American Sign Language</h3>
            <p>
              36 ASL signs including complete single-handed fingerspelling (A–Z) and 10 essential counter communication signs.
            </p>
            <div className="lang-meta-pills">
              <span className="lang-meta-pill">26 Alphabet (A–Z)</span>
              <span className="lang-meta-pill">10 Counter Basics</span>
              <span className="lang-meta-pill">Single-Hand Priority</span>
            </div>
          </button>
        </div>

        <div className="modal-footer-note">
          <span>ℹ</span>
          <span>
            ISL and ASL are distinct, complete natural languages. Switching language updates the sign vocabulary, gesture descriptions, and visual cards immediately.
          </span>
        </div>
      </div>
    </div>
  );
}
