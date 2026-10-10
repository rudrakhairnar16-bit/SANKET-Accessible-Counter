"use client";

import { phrases, type Phrase, formatDuration } from "@/lib/phrases";
import type { SignLanguage } from "@/lib/sign-language";

export interface CounterWorkspaceProps {
  activeLanguage: SignLanguage;
  sessionActive: boolean;
  sessionSeconds: number;
  service: string;
  onSetService: (service: string) => void;
  onStartSession: () => void;
  onShowPhrase: (phrase: Phrase) => void;
  onNavigate: (section: "signs" | "communication" | "learning") => void;
}

export function CounterWorkspace({
  activeLanguage,
  sessionActive,
  sessionSeconds,
  service,
  onSetService,
  onStartSession,
  onShowPhrase,
  onNavigate,
}: CounterWorkspaceProps) {
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" aria-hidden="true" /> ACCESSIBLE PUBLIC SERVICES
          </div>
          <h1>
            A better way to
            <br />
            <em>understand each other.</em>
          </h1>
          <p className="heading-copy">
            A calm, clear workspace supporting two-way communication between citizens and counter staff with authentic sign language selection and instant text display.
          </p>
        </div>
        <div className="heading-art" aria-hidden="true">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-bubble bubble-one">Hi!</div>
          <div className="art-bubble bubble-two">✓</div>
          <div className="art-center">
            <span>↔</span>
          </div>
          <div className="art-caption">
            COMMUNICATION
            <br />
            IS A SHARED SPACE
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className="status-banner">
        <div className="status-icon" aria-hidden="true">
          🖐
        </div>
        <div>
          <strong>Visual Sign Language Selector is Ready ({activeLanguage})</strong>
          <p>
            {activeLanguage === "ISL"
              ? "Browse 34 ISL-labelled municipal entries with gesture descriptions and multilingual labels. Meanings need expert review."
              : "Browse 36 ASL signs including single-handed fingerspelling (A–Z) and counter vocabulary."}
          </p>
        </div>
        <button
          type="button"
          className="banner-link"
          onClick={() => onNavigate("signs")}
        >
          Browse signs <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="section-title-row">
        <div>
          <div className="eyebrow muted">START HERE</div>
          <h2>Set up this interaction</h2>
        </div>
        <span
          className={`session-badge ${sessionActive ? "active" : ""}`}
          role="status"
          aria-live="polite"
        >
          <span aria-hidden="true" />
          {sessionActive
            ? `Session in progress (${formatDuration(sessionSeconds)})`
            : "No active session"}
        </span>
      </div>

      <div className="setup-grid">
        <div className="panel service-panel">
          <div className="panel-top">
            <div className="step-number" aria-hidden="true">
              01
            </div>
            <div>
              <h3>Choose a service</h3>
              <p>Select context to highlight relevant counter phrases.</p>
            </div>
          </div>
          <label className="field-label" htmlFor="service">
            SERVICE TYPE
          </label>
          <select
            id="service"
            value={service}
            onChange={(e) => onSetService(e.target.value)}
          >
            <option>General enquiry</option>
            <option>Document submission</option>
            <option>Application status</option>
            <option>Certificate services</option>
            <option>Waiting and queue</option>
          </select>
          <div className="service-hint">
            <span aria-hidden="true">✳</span>
            <span>
              {service === "Document submission"
                ? "Document checklist phrases and sign tokens are ready."
                : service === "Application status"
                ? "Status update phrases are ready."
                : service === "Waiting and queue"
                ? "Waiting and queue phrases are ready."
                : "A general set of communication phrases is ready."}
            </span>
          </div>
        </div>

        <div className="panel session-panel">
          <div className="panel-top">
            <div className="step-number" aria-hidden="true">
              02
            </div>
            <div>
              <h3>Start a session</h3>
              <p>Keep the interaction focused, timed, and private.</p>
            </div>
          </div>
          <div className="session-summary">
            <div
              className={`session-avatar ${sessionActive ? "avatar-active" : ""}`}
              aria-hidden="true"
            >
              {sessionActive ? "✓" : "↔"}
            </div>
            <div>
              <strong>
                {sessionActive
                  ? `Interaction active (${formatDuration(sessionSeconds)})`
                  : "Ready when you are"}
              </strong>
              <span>
                {sessionActive
                  ? "Use the sign selector, message board, or draft human assistance."
                  : "No personal details or logs stored."}
              </span>
            </div>
          </div>
          <button
            type="button"
            className={`primary-button full-button ${sessionActive ? "end-button" : ""}`}
            onClick={onStartSession}
          >
            {sessionActive ? "End session" : "Start counter session"}{" "}
            <span aria-hidden="true">{sessionActive ? "×" : "→"}</span>
          </button>
        </div>
      </div>

      {/* Quick Access to Signs & Messages */}
      <div className="section-title-row compact">
        <div>
          <div className="eyebrow muted">FAST ACCESS</div>
          <h2>Common municipal signs &amp; phrases</h2>
        </div>
        <button
          type="button"
          className="text-button"
          onClick={() => onNavigate("signs")}
        >
          Open visual sign library <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="quick-grid">
        {phrases.slice(0, 4).map((phrase) => (
          <button
            key={phrase.id}
            type="button"
            className="quick-card"
            onClick={() => onShowPhrase(phrase)}
            aria-label={`Select phrase: ${phrase.title}`}
          >
            <span className="quick-icon" aria-hidden="true">
              {phrase.icon}
            </span>
            <span className="quick-title">{phrase.title}</span>
            <span className="quick-arrow" aria-hidden="true">
              ↗
            </span>
          </button>
        ))}
      </div>

      {/* Privacy and Local Terminal Notice */}
      <div className="recognition-note">
        <span className="note-icon" aria-hidden="true">
          ℹ
        </span>
        <p>
          <strong>Counter Privacy &amp; Safety:</strong> The core counter workflow runs locally on this device. Live camera tracking and microphone audio capture are decommissioned for this release. Optional still-image recognition sends an image only after explicit consent and only when an administrator-configured service is available. Use the Visual Sign Selector for manual communication; sign-language meanings still require qualified review.
        </p>
      </div>
    </>
  );
}
