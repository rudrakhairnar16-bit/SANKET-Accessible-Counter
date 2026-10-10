"use client";

import { SignVisual } from "@/components/sign-visual";
import type { UnifiedSignEntry, SignDraftItem, SignLanguage } from "@/lib/sign-language";

export interface SignSelectorViewProps {
  activeLanguage: SignLanguage;
  signCategory: string;
  availableSignCategories: string[];
  signSearchQuery: string;
  filteredSignsList: UnifiedSignEntry[];
  signDraft: SignDraftItem[];
  onSetSignCategory: (category: string) => void;
  onSetSignSearchQuery: (query: string) => void;
  onAddSignToDraft: (sign: UnifiedSignEntry) => void;
  onInspectSign: (sign: UnifiedSignEntry) => void;
  onRemoveDraftItem: (id: string) => void;
  onClearSignDraft: () => void;
  onOpenConfirmModal: () => void;
}

export function SignSelectorView({
  activeLanguage,
  signCategory,
  availableSignCategories,
  signSearchQuery,
  filteredSignsList,
  signDraft,
  onSetSignCategory,
  onSetSignSearchQuery,
  onAddSignToDraft,
  onInspectSign,
  onRemoveDraftItem,
  onClearSignDraft,
  onOpenConfirmModal,
}: SignSelectorViewProps) {
  return (
    <>
      <div className="subpage-heading">
        <div className="eyebrow">
          <span className="eyebrow-line" aria-hidden="true" /> VISUAL SIGN LANGUAGE SELECTOR
        </div>
        <h1>Browse authentic sign language library.</h1>
        <p>
          Explore verified hand configurations, view sign details, and assemble a message draft for the counter screen.
        </p>
      </div>

      {/* Language Banner & Search Bar */}
      <div className="sign-library-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 style={{ margin: 0, font: "700 18px Manrope, sans-serif" }}>
              {activeLanguage === "ISL"
                ? "Indian Sign Language (ISL) — 34 Municipal Signs"
                : "American Sign Language (ASL) — 36 entries · review pending"}
            </h2>
            <span className="count-chip">{filteredSignsList.length} signs shown</span>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--muted)" }}>
            {activeLanguage === "ISL"
              ? "ISLRTC civic vocabulary corpus mapped to public service counter needs."
              : "Standard fingerspelling manual alphabet (A–Z) and essential counter vocabulary."}
          </p>
        </div>

        <div className="sign-search-bar">
          <label htmlFor="sign-search" className="sr-only">
            Search signs
          </label>
          <input
            id="sign-search"
            type="text"
            className="sign-search-input"
            placeholder={`Search ${activeLanguage} signs by name, meaning, or gesture…`}
            value={signSearchQuery}
            onChange={(e) => onSetSignSearchQuery(e.target.value)}
          />
          {signSearchQuery && (
            <button
              type="button"
              className="sign-search-clear"
              onClick={() => onSetSignSearchQuery("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div
        className="sign-categories"
        role="group"
        aria-label="Filter signs by category"
      >
        {availableSignCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`filter-chip ${signCategory === cat ? "selected" : ""}`}
            onClick={() => onSetSignCategory(cat)}
            aria-pressed={signCategory === cat}
          >
            {cat}
          </button>
        ))}
        {signCategory !== "All" && (
          <button
            type="button"
            className="text-button"
            style={{ marginLeft: "6px" }}
            onClick={() => onSetSignCategory("All")}
          >
            Reset filter
          </button>
        )}
      </div>

      {/* Sign Grid */}
      {filteredSignsList.length === 0 ? (
        <div className="panel" style={{ padding: "40px 20px", textAlign: "center" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔍</div>
          <h3 style={{ margin: "0 0 8px" }}>
            No {activeLanguage} signs matched &ldquo;{signSearchQuery}&rdquo;
          </h3>
          <p style={{ color: "var(--muted)", fontSize: "12px", margin: "0 0 16px" }}>
            Try searching for another keyword, or clear your query and category filter.
          </p>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              onSetSignSearchQuery("");
              onSetSignCategory("All");
            }}
          >
            Clear search &amp; filters
          </button>
        </div>
      ) : (
        <div className="sign-grid">
          {filteredSignsList.map((sign) => {
            const isDrafted = signDraft.some((item) => item.signId === sign.id);
            return (
              <article
                key={sign.id}
                className={`sign-card ${isDrafted ? "in-draft" : ""}`}
              >
                {/* Visual Demonstration or Honest Placeholder */}
                <div className="sign-card-visual">
                  <SignVisual sign={sign} compact />
                </div>

                {/* Sign Info */}
                <div className="sign-card-info">
                  <div className="sign-card-header">
                    <h3 className="sign-card-title">{sign.label}</h3>
                    <span className="sign-card-id">
                      {sign.language} · {sign.rawId}
                    </span>
                  </div>
                  <div className="sign-card-meaning">{sign.meaning}</div>
                  {sign.multilingual && (
                    <div className="sign-card-multi">
                      <span>{sign.multilingual.hindi}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{sign.multilingual.marathi}</span>
                    </div>
                  )}
                  <div className="sign-card-gesture">
                    <strong>Hand gesture:</strong> {sign.handConfiguration}
                  </div>
                </div>

                {/* Actions */}
                <div className="sign-card-actions">
                  <button
                    type="button"
                    className="primary-button sign-select-btn"
                    onClick={() => onAddSignToDraft(sign)}
                    aria-label={`Select ${sign.label} to add to draft`}
                  >
                    + Select sign
                  </button>
                  <button
                    type="button"
                    className="sign-inspect-btn"
                    onClick={() => onInspectSign(sign)}
                    aria-label={`Inspect full details of ${sign.label}`}
                  >
                    Details
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Sticky Draft Tray (Displays when user has selected signs) */}
      {signDraft.length > 0 && (
        <div
          className="draft-tray"
          role="region"
          aria-label="Sign message draft"
        >
          <div className="draft-tray-inner">
            <div className="draft-info">
              <div className="draft-title-row">
                <strong>Citizen Communication Draft ({activeLanguage})</strong>
                <span className="draft-count-badge">
                  {signDraft.length} / 10 signs
                </span>
              </div>
              <div className="draft-items-preview">
                {signDraft.map((item) => (
                  <span key={item.id} className="draft-chip">
                    <span>{item.label}</span>
                    <button
                      type="button"
                      className="draft-chip-del"
                      onClick={() => onRemoveDraftItem(item.id)}
                      aria-label={`Remove ${item.label} from draft`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="draft-tray-actions">
              <button
                type="button"
                className="draft-confirm-btn"
                onClick={onOpenConfirmModal}
              >
                ✓ Review &amp; Confirm Draft ({signDraft.length})
              </button>
              <button
                type="button"
                className="draft-clear-btn"
                onClick={onClearSignDraft}
              >
                Clear draft
              </button>
            </div>
          </div>
          <div className="draft-disclaimer">
            Notice: Signs are combined as conceptual message items. Concatenating signs does not constitute grammatical sign-language translation.
          </div>
        </div>
      )}
    </>
  );
}
