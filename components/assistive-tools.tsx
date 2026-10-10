"use client";

/**
 * SANKET Assistive Tools (Reference & Future Roadmap Stubs)
 * 
 * In compliance with the project owner's directive and release safety rules:
 * - Live camera capture (getUserMedia) and MediaPipe streams are decommissioned from the current release.
 * - Live microphone speech recognition (SpeechRecognition) is decommissioned from the current release.
 * - This prevents deceptive simulated states, unexpected permission popups, and false recognition.
 * - Ordinary text input and the verified Visual Sign Selector remain fully operational in the main interface.
 * - Technical roadmaps for future multi-modal recognition are documented in `docs/ROADMAP.md`.
 */

export function DecommissionedAssistiveToolsNotice() {
  return (
    <div className="assistive-tool-card" role="region" aria-label="Device Hardware Status">
      <div className="assistive-tool-heading">
        <div>
          <span className="eyebrow muted">PRIVACY-FIRST TERMINAL</span>
          <h3>Device Hardware Status</h3>
        </div>
        <span className="tool-status available">Local Mode Active</span>
      </div>
      <p style={{ margin: "8px 0 0", fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>
        To protect citizen privacy and guarantee zero false translations in public service, camera tracking and microphone audio capture are decommissioned for this release.
        Citizens communicate directly using the verified <strong>Visual Sign Selector</strong> and staff respond using verified quick phrases or typed messages.
      </p>
    </div>
  );
}

// Deprecated stubs to preserve type safety in historical test references without activating hardware
export function SpeechInput({ disabled = true }: { onTranscript?: (text: string) => void; disabled?: boolean }) {
  return (
    <section className="assistive-tool-card" aria-label="Speech recognition status">
      <div className="assistive-tool-heading">
        <div>
          <span className="eyebrow muted">AUDIO INPUT STATUS</span>
          <h3>Speech-to-text</h3>
        </div>
        <span className="tool-status unavailable">Disabled by Policy</span>
      </div>
      <p style={{ margin: "8px 0 0", fontSize: "12px", color: "var(--muted)" }}>
        Microphone speech capture is decommissioned for this release to protect privacy. Please type staff messages directly.
      </p>
    </section>
  );
}

export function CameraRecognitionTool({ language = "ISL" }: { language?: "ISL" | "ASL"; onReviewSuggestion?: (label: string) => void }) {
  return (
    <section className="assistive-tool-card" aria-label="Camera recognition status">
      <div className="assistive-tool-heading">
        <div>
          <span className="eyebrow muted">CAMERA RECOGNITION STATUS</span>
          <h3>Camera Gesture Recognition</h3>
        </div>
        <span className="tool-status unavailable">Disabled by Policy</span>
      </div>
      <p style={{ margin: "8px 0 0", fontSize: "12px", color: "var(--muted)" }}>
        Live camera streaming for {language} is decommissioned for this release. Continuous sign recognition is scheduled for future phases (see docs/ROADMAP.md). Use the Visual Sign Selector.
      </p>
    </section>
  );
}
