"use client";

export type Metrics = {
  sessions: number;
  phrases: number;
  signSelections: number;
  interpreterRequests: number;
  feedback: number;
  understood: number;
  totalDurationSeconds: number;
};

export interface ActivityMetricsViewProps {
  metrics: Metrics;
  feedbackChoice: string;
  onSubmitFeedback: (choice: string) => void;
  onResetMetrics: () => void;
}

export function ActivityMetricsView({
  metrics,
  feedbackChoice,
  onSubmitFeedback,
  onResetMetrics,
}: ActivityMetricsViewProps) {
  const metricCards = [
    { label: "Sessions started", value: metrics.sessions, icon: "↔", hint: "Terminal count" },
    { label: "Phrases displayed", value: metrics.phrases, icon: "▤", hint: "Terminal count" },
    { label: "Sign selections", value: metrics.signSelections, icon: "🖐", hint: "Drafted signs" },
    {
      label: "Interpreter drafts",
      value: metrics.interpreterRequests,
      icon: "◎",
      hint: "Local slips only",
    },
  ];

  return (
    <>
      <div className="subpage-heading">
        <div className="eyebrow">
          <span className="eyebrow-line" aria-hidden="true" /> LOCAL ACTIVITY
        </div>
        <h1>Evidence, not assumptions.</h1>
        <p>
          Counts represent local interactions on this terminal only. They are not an evaluation of sign recognition or demographic coverage.
        </p>
      </div>

      <div className="metric-grid">
        {metricCards.map((metric) => (
          <div className="panel metric-card" key={metric.label}>
            <div className="metric-top">
              <span>{metric.label}</span>
              <span className="metric-icon" aria-hidden="true">
                {metric.icon}
              </span>
            </div>
            <strong>{metric.value}</strong>
            <small>{metric.hint}</small>
          </div>
        ))}
      </div>

      <div className="panel evidence-panel">
        <div className="panel-heading">
          <div>
            <h2>Prototype verification checklist</h2>
            <p>Current operational status of features in this build.</p>
          </div>
          <span className="status-tag">Transparent status</span>
        </div>

        <div className="evidence-row">
          <span className="evidence-check" aria-hidden="true">
            ✓
          </span>
          <div>
            <strong>Visual Sign Language Selector</strong>
            <p>
              34 ISL-labelled entries and 36 ASL-labelled entries are browsable, searchable, and draftable; expert validation and visual assets are pending.
            </p>
          </div>
          <span className="evidence-state pending">Review pending</span>
        </div>

        <div className="evidence-row">
          <span className="evidence-check" aria-hidden="true">
            ✓
          </span>
          <div>
            <strong>Communication board &amp; Two-way interaction</strong>
            <p>
              Phrase filtering, selection, citizen sign draft confirmation, and browser voice playback are functional.
            </p>
          </div>
          <span className="evidence-state done">Verified</span>
        </div>

        <div className="evidence-row">
          <span className="evidence-pending" aria-hidden="true">
            !
          </span>
          <div>
            <strong>Camera ISL/ASL Recognition Model</strong>
            <p>
              The single-frame connector requires a configured, approved ISL/ASL-specific model endpoint. The separate MediaPipe demo only recognizes generic hand gestures and is not a substitute.
            </p>
          </div>
          <span className="evidence-state pending">Model required</span>
        </div>

        <div className="evidence-row">
          <span className="evidence-pending" aria-hidden="true">
            !
          </span>
          <div>
            <strong>External Interpreter Dispatch</strong>
            <p>
              A request webhook can be configured by an administrator. This is not a live video bridge, and provider acceptance does not guarantee interpreter availability.
            </p>
          </div>
          <span className="evidence-state pending">Provider required</span>
        </div>

        <button
          type="button"
          className="secondary-button reset-button"
          onClick={onResetMetrics}
        >
          Reset local activity data
        </button>
      </div>

      <div className="panel feedback-panel">
        <div>
          <div className="eyebrow muted">OPTIONAL FEEDBACK</div>
          <h2>Was the communication effective?</h2>
          <p>Select a response to record a local usability signal for staff review.</p>
        </div>
        <div
          className="feedback-actions"
          role="group"
          aria-label="Feedback options"
        >
          {["Understood", "Needed clarification", "Prefer human support"].map((choice) => (
            <button
              key={choice}
              type="button"
              className={`feedback-option ${feedbackChoice === choice ? "chosen" : ""}`}
              onClick={() => onSubmitFeedback(choice)}
              aria-pressed={feedbackChoice === choice}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
