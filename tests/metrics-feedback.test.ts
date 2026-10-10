import { describe, expect, it } from "vitest";

type Metrics = {
  sessions: number;
  phrases: number;
  interpreterRequests: number;
  feedback: number;
  understood: number;
  totalDurationSeconds: number;
};

const emptyMetrics: Metrics = {
  sessions: 0,
  phrases: 0,
  interpreterRequests: 0,
  feedback: 0,
  understood: 0,
  totalDurationSeconds: 0,
};

function applyMetricsChange(current: Metrics, change: Partial<Metrics>): Metrics {
  return {
    sessions: Math.max(0, current.sessions + (change.sessions ?? 0)),
    phrases: Math.max(0, current.phrases + (change.phrases ?? 0)),
    interpreterRequests: Math.max(0, current.interpreterRequests + (change.interpreterRequests ?? 0)),
    feedback: Math.max(0, current.feedback + (change.feedback ?? 0)),
    understood: Math.max(0, current.understood + (change.understood ?? 0)),
    totalDurationSeconds: Math.max(0, current.totalDurationSeconds + (change.totalDurationSeconds ?? 0)),
  };
}

describe("Metrics and feedback logic", () => {
  it("initializes with zeroed metrics", () => {
    expect(emptyMetrics.sessions).toBe(0);
    expect(emptyMetrics.phrases).toBe(0);
    expect(emptyMetrics.interpreterRequests).toBe(0);
    expect(emptyMetrics.feedback).toBe(0);
    expect(emptyMetrics.understood).toBe(0);
    expect(emptyMetrics.totalDurationSeconds).toBe(0);
  });

  it("increments sessions and duration correctly", () => {
    let m = applyMetricsChange(emptyMetrics, { sessions: 1 });
    expect(m.sessions).toBe(1);

    m = applyMetricsChange(m, { totalDurationSeconds: 150 });
    expect(m.totalDurationSeconds).toBe(150);

    m = applyMetricsChange(m, { totalDurationSeconds: 90 });
    expect(m.totalDurationSeconds).toBe(240);
  });

  it("handles feedback transition without double counting", () => {
    let state = {
      feedbackChoice: "",
      metrics: emptyMetrics,
    };

    function simulateSubmitFeedback(choice: string) {
      if (state.feedbackChoice === choice) return;
      const prev = state.feedbackChoice;
      state.feedbackChoice = choice;
      if (prev === "") {
        state.metrics = applyMetricsChange(state.metrics, {
          feedback: 1,
          understood: choice === "Understood" ? 1 : 0,
        });
      } else {
        state.metrics = applyMetricsChange(state.metrics, {
          understood: choice === "Understood" ? 1 : prev === "Understood" ? -1 : 0,
        });
      }
    }

    // First click: Understood
    simulateSubmitFeedback("Understood");
    expect(state.metrics.feedback).toBe(1);
    expect(state.metrics.understood).toBe(1);

    // Repeated click: Understood (should NOT increment further)
    simulateSubmitFeedback("Understood");
    expect(state.metrics.feedback).toBe(1);
    expect(state.metrics.understood).toBe(1);

    // Switch to Needed clarification: feedback count remains 1, understood decrements to 0
    simulateSubmitFeedback("Needed clarification");
    expect(state.metrics.feedback).toBe(1);
    expect(state.metrics.understood).toBe(0);

    // Switch back to Understood: feedback count remains 1, understood back to 1
    simulateSubmitFeedback("Understood");
    expect(state.metrics.feedback).toBe(1);
    expect(state.metrics.understood).toBe(1);
  });

  it("prevents negative values in metrics", () => {
    const updated = applyMetricsChange(emptyMetrics, {
      sessions: -5,
      phrases: -10,
    });
    expect(updated.sessions).toBe(0);
    expect(updated.phrases).toBe(0);
  });
});
