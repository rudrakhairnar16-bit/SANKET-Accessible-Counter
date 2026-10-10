"use client";

import type { FormEvent } from "react";

export interface InterpreterRequestViewProps {
  counterNumber: string;
  assistanceType: string;
  urgency: "Standard" | "High Priority (Citizen waiting)";
  draftNotes: string;
  service: string;
  draftStage: "form" | "review" | "drafted";
  interpreterStatus: "Not requested" | "Request drafted";
  formErrors: Record<string, string>;
  onSetCounterNumber: (value: string) => void;
  onSetAssistanceType: (value: string) => void;
  onSetUrgency: (value: "Standard" | "High Priority (Citizen waiting)") => void;
  onSetDraftNotes: (value: string) => void;
  onReviewDraft: (e?: FormEvent) => void;
  onConfirmDraft: () => void;
  onResetDraft: () => void;
  onSetDraftStage: (stage: "form" | "review" | "drafted") => void;
}

export function InterpreterRequestView({
  counterNumber,
  assistanceType,
  urgency,
  draftNotes,
  service,
  draftStage,
  interpreterStatus,
  formErrors,
  onSetCounterNumber,
  onSetAssistanceType,
  onSetUrgency,
  onSetDraftNotes,
  onReviewDraft,
  onConfirmDraft,
  onResetDraft,
  onSetDraftStage,
}: InterpreterRequestViewProps) {
  return (
    <>
      <div className="subpage-heading">
        <div className="eyebrow">
          <span className="eyebrow-line" aria-hidden="true" /> HUMAN SUPPORT
        </div>
        <h1>Bring in a person.</h1>
        <p>
          When communication is complex or clarification is needed, qualified human assistance should be requested.
        </p>
      </div>

      <div className="interpreter-layout">
        <div className="panel interpreter-main">
          <div className="interpreter-symbol" aria-hidden="true">
            ◎
          </div>
          <div className="eyebrow muted">INTERPRETER ASSISTANCE</div>
          <h2>AI must never be the only route forward.</h2>
          <p className="interpreter-copy">
            This prototype always supports a local request draft. An optional administrator-configured webhook can dispatch a request, but it does not create a live video call or guarantee interpreter availability. Follow your office escalation procedure.
          </p>

          <div className="request-status" role="status">
            <div
              className={`status-symbol ${interpreterStatus === "Request drafted" ? "status-done" : ""}`}
              aria-hidden="true"
            >
              {interpreterStatus === "Request drafted" ? "✓" : "1"}
            </div>
            <div>
              <strong>
                {interpreterStatus === "Request drafted"
                  ? "Request Drafted Locally"
                  : "No Request Drafted"}
              </strong>
              <p>
                {interpreterStatus === "Request drafted"
                  ? "This record is stored in this browser only. No external transmission occurred."
                  : "Fill in the details below to prepare a local assistance slip."}
              </p>
            </div>
          </div>

          {draftStage === "form" && (
            <form className="interpreter-form" onSubmit={onReviewDraft} noValidate>
              <div>
                <label className="field-label" htmlFor="counter-num">
                  COUNTER / DESK IDENTIFIER *
                </label>
                <input
                  id="counter-num"
                  type="text"
                  value={counterNumber}
                  onChange={(e) => onSetCounterNumber(e.target.value)}
                  placeholder="e.g. Counter 3"
                  className={formErrors.counterNumber ? "input-error" : ""}
                  aria-invalid={Boolean(formErrors.counterNumber)}
                  aria-describedby={formErrors.counterNumber ? "counter-num-err" : undefined}
                />
                {formErrors.counterNumber && (
                  <span id="counter-num-err" className="field-error" role="alert">
                    {formErrors.counterNumber}
                  </span>
                )}
              </div>

              <div>
                <label className="field-label" htmlFor="assistance-type">
                  TYPE OF ASSISTANCE NEEDED *
                </label>
                <select
                  id="assistance-type"
                  value={assistanceType}
                  onChange={(e) => onSetAssistanceType(e.target.value)}
                >
                  <option>Indian Sign Language (ISL) Interpreter</option>
                  <option>American Sign Language (ASL) Interpreter</option>
                  <option>Tactile / DeafBlind Communication Support</option>
                  <option>Speech-to-Text Transcriber</option>
                  <option>General Communication Assistant</option>
                </select>
              </div>

              <div>
                <label className="field-label" htmlFor="urgency">
                  PRIORITY
                </label>
                <select
                  id="urgency"
                  value={urgency}
                  onChange={(e) =>
                    onSetUrgency(
                      e.target.value as "Standard" | "High Priority (Citizen waiting)"
                    )
                  }
                >
                  <option>Standard</option>
                  <option>High Priority (Citizen waiting)</option>
                </select>
              </div>

              <div>
                <label className="field-label" htmlFor="draft-notes">
                  REASON / CONTEXT (OPTIONAL, DO NOT ENTER SENSITIVE DATA)
                </label>
                <textarea
                  id="draft-notes"
                  rows={2}
                  maxLength={150}
                  placeholder="e.g. Complex documentation review or rights clarification"
                  value={draftNotes}
                  onChange={(e) => onSetDraftNotes(e.target.value)}
                />
                <span className="character-count">{draftNotes.length}/150 characters</span>
              </div>

              <button type="submit" className="primary-button">
                Review request draft <span aria-hidden="true">→</span>
              </button>
            </form>
          )}

          {draftStage === "review" && (
            <div className="draft-card" role="region" aria-label="Review draft details">
              <h3>Review Local Assistance Draft</h3>
              <div className="draft-row">
                <span>Counter / Desk:</span>
                <strong>{counterNumber}</strong>
              </div>
              <div className="draft-row">
                <span>Service Context:</span>
                <strong>{service}</strong>
              </div>
              <div className="draft-row">
                <span>Assistance Type:</span>
                <strong>{assistanceType}</strong>
              </div>
              <div className="draft-row">
                <span>Priority:</span>
                <strong>{urgency}</strong>
              </div>
              {draftNotes && (
                <div className="draft-row">
                  <span>Context:</span>
                  <strong>{draftNotes}</strong>
                </div>
              )}
              <p style={{ margin: "14px 0 0", fontSize: "11px", color: "var(--muted)" }}>
                Notice: Confirming will save this record locally on this counter device. No outside API will be contacted.
              </p>
              <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="primary-button"
                  onClick={onConfirmDraft}
                >
                  Confirm &amp; Save Local Draft
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => onSetDraftStage("form")}
                >
                  Back to Edit
                </button>
              </div>
            </div>
          )}

          {draftStage === "drafted" && (
            <div className="draft-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--teal)",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                <span aria-hidden="true">✓</span> Local draft saved
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--muted)" }}>
                Draft record for <strong>{assistanceType}</strong> at <strong>{counterNumber}</strong> is ready on this device. Present this notification to on-site personnel according to established facility procedure.
              </p>
              <div style={{ marginTop: "14px", display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => onSetDraftStage("review")}
                >
                  View draft summary
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={onResetDraft}
                >
                  Reset draft
                </button>
              </div>
              <div className="provider-dispatch-box">
                <strong>Future Remote Interpreter Integration</strong>
                <p>
                  Video Remote Interpreting (VRI) through verified human interpreter services is scheduled for future phases (see docs/ROADMAP.md). Please follow facility on-site escalation procedures.
                </p>
              </div>
            </div>
          )}

          {draftStage === "form" && interpreterStatus === "Request drafted" && (
            <button
              type="button"
              className="secondary-button full-button spaced"
              onClick={onResetDraft}
            >
              Reset local status
            </button>
          )}
        </div>

        <div className="panel safety-panel">
          <div className="safety-icon" aria-hidden="true">
            ✳
          </div>
          <h3>When to escalate</h3>
          <ul>
            <li>Either person is unsure what was intended or communicated.</li>
            <li>The interaction involves legal rights, consent, health, or sensitive personal data.</li>
            <li>The citizen requests an interpreter or preferred communication partner.</li>
            <li>Communication tools are not meeting the person&apos;s access needs.</li>
          </ul>
          <div className="safety-rule">
            Never make citizen access to public services contingent on successful AI interpretation.
          </div>
        </div>
      </div>
    </>
  );
}
