"use client";

import type { UnifiedSignEntry } from "@/lib/sign-language";
import { SignVisual } from "@/components/sign-visual";

export interface SignDetailModalProps {
  sign: UnifiedSignEntry | null;
  onAddSignToDraft: (sign: UnifiedSignEntry) => void;
  onClose: () => void;
}

export function SignDetailModal({
  sign,
  onAddSignToDraft,
  onClose,
}: SignDetailModalProps) {
  if (!sign) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sign-detail-title"
      onClick={onClose}
    >
      <div
        className="modal-dialog sign-detail-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow muted">
              {sign.language} · {sign.category.toUpperCase()}
            </span>
            <h2 id="sign-detail-title">{sign.label}</h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close sign detail"
          >
            ×
          </button>
        </div>

        <div className="sign-detail-body">
          <div className="sign-detail-visual-box">
            <SignVisual sign={sign} />
          </div>

          <div className="sign-detail-meta">
            <div className="sign-detail-row">
              <span className="sign-detail-label">CONCEPT MEANING</span>
              <p className="sign-detail-value">{sign.meaning}</p>
            </div>

            <div className="sign-detail-row">
              <span className="sign-detail-label">HAND EXECUTION</span>
              <p className="sign-detail-value">
                <strong>{sign.handCount === 1 ? "Single-handed sign (1 Hand)" : "Two-handed coordinated sign (2 Hands)"}</strong>
                <br />
                {sign.handConfiguration}
              </p>
            </div>

            {sign.multilingual && (
              <div className="sign-detail-row">
                <span className="sign-detail-label">MULTILINGUAL LABELS (INDIA)</span>
                <p className="sign-detail-value">
                  <strong>
                    Hindi: {sign.multilingual.hindi} · Marathi: {sign.multilingual.marathi} · Gujarati: {sign.multilingual.gujarati}
                  </strong>
                </p>
              </div>
            )}

            <div className="sign-detail-row">
              <span className="sign-detail-label">VERIFICATION STATUS</span>
              <p className="sign-detail-value">
                {sign.verificationStatus === "metadata-review-pending-placeholder-active"
                  ? "Standard metadata active · Official ISLRTC/RID linguistic certification pending."
                  : sign.verificationStatus}
              </p>
            </div>
          </div>
        </div>

        <div className="sign-detail-actions">
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              onAddSignToDraft(sign);
              onClose();
            }}
          >
            + Add to Message Draft
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
