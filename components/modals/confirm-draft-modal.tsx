"use client";

import type { SignDraftItem, SignLanguage } from "@/lib/sign-language";

export interface ConfirmDraftModalProps {
  isOpen: boolean;
  draft: SignDraftItem[];
  activeLanguage: SignLanguage;
  draftMessagePreview: string;
  onConfirmSend: () => void;
  onRemoveDraftItem: (id: string) => void;
  onClose: () => void;
}

export function ConfirmDraftModal({
  isOpen,
  draft,
  activeLanguage,
  draftMessagePreview,
  onConfirmSend,
  onRemoveDraftItem,
  onClose,
}: ConfirmDraftModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onClick={onClose}
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow muted">FINAL REVIEW BEFORE PRESENTATION</span>
            <h2 id="confirm-modal-title">Confirm Sign Message Draft</h2>
            <p>
              Verify the sign sequence below. Once confirmed, this message is presented to the counter staff and added to the two-way session log.
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close draft confirmation modal"
          >
            ×
          </button>
        </div>

        <div className="confirm-modal-preview">
          <span className="field-label">
            COMPILED MESSAGE ({draft.length} {draft.length === 1 ? "SIGN" : "SIGNS"} · {activeLanguage}):
          </span>
          <div className="compiled-message-box" role="region" aria-label="Compiled draft message preview">
            <span className="compiled-text">{draftMessagePreview}</span>
          </div>

          <span className="field-label" style={{ marginTop: "14px" }}>
            SELECTED SIGN CONCEPTS ({draft.length}/10):
          </span>
          <div className="confirm-chips-list">
            {draft.map((item, idx) => (
              <div key={item.id} className="confirm-chip-row">
                <span className="confirm-chip-num">{idx + 1}</span>
                <div className="confirm-chip-text">
                  <strong>{item.label}</strong>
                  <span>{item.meaning}</span>
                </div>
                <button
                  type="button"
                  className="confirm-chip-remove"
                  onClick={() => onRemoveDraftItem(item.id)}
                  aria-label={`Remove sign ${item.label} from draft`}
                  title="Remove from draft"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-actions-row">
          <button
            type="button"
            className="primary-button"
            onClick={onConfirmSend}
            disabled={draft.length === 0}
          >
            ✓ Confirm &amp; Present to Staff
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Keep Editing
          </button>
        </div>
      </div>
    </div>
  );
}
