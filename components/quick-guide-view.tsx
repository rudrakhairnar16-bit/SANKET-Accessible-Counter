"use client";

export interface QuickGuideViewProps {
  largeText: boolean;
  contrast: boolean;
  onSavePreferences: (nextLarge: boolean, nextContrast: boolean) => void;
}

export function QuickGuideView({
  largeText,
  contrast,
  onSavePreferences,
}: QuickGuideViewProps) {
  const guideItems = [
    {
      n: "01",
      title: "Ask, don't assume",
      copy: "Ask the person their preferred mode of communication. Everyone's language needs and preferences are unique.",
      icon: "💬",
    },
    {
      n: "02",
      title: "Keep messages simple",
      copy: "Share one clear concept at a time. Use the counter board to display text and allow sufficient time to read.",
      icon: "🧩",
    },
    {
      n: "03",
      title: "Confirm meaning",
      copy: "Clarify and repeat when needed. Confirm understanding with the person rather than assuming a guessed meaning.",
      icon: "✓",
    },
    {
      n: "04",
      title: "Escalate with care",
      copy: "When meaning is uncertain—or high stakes are involved—escalate through your facility's human interpreter protocol.",
      icon: "🤝",
    },
  ];

  return (
    <>
      <div className="subpage-heading">
        <div className="eyebrow">
          <span className="eyebrow-line" aria-hidden="true" /> A QUICK GUIDE
        </div>
        <h1>Small steps. Shared understanding.</h1>
        <p>
          Practical ways to make public counter interactions calmer, clearer, and more respectful.
        </p>
      </div>

      <div className="guide-grid">
        {guideItems.map((item) => (
          <article className="panel guide-card" key={item.n}>
            <div className="guide-card-top">
              <span className="guide-number">{item.n}</span>
              <span className="guide-icon" aria-hidden="true">
                {item.icon}
              </span>
            </div>
            <h2>{item.title}</h2>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>

      <div className="note-banner">
        <span className="note-icon" aria-hidden="true">
          ℹ
        </span>
        <div>
          <strong>Important linguistic distinction</strong>
          <p>
            Text boards, icons, and browser voice synthesis are communication aids. They are not Indian Sign Language. Sign language content should only be claimed as ISL when validated by qualified Deaf community members and linguists.
          </p>
        </div>
      </div>

      <div className="panel reference-resources-panel">
        <div className="eyebrow muted">EXTERNAL REFERENCE RESOURCES</div>
        <h2>Use language-specific, trusted references</h2>
        <p>
          These official learning resources open separately. They are references, not assets bundled into SANKET; check the provider&apos;s reuse terms and confirm each sign with a qualified signer before adding it to the library.
        </p>
        <div className="reference-link-row">
          <a
            href="https://divyangjan.depwd.gov.in/islrtc/"
            target="_blank"
            rel="noreferrer"
          >
            Official Indian Sign Language Dictionary ↗
          </a>
          <a
            href="https://islrtc.nic.in/"
            target="_blank"
            rel="noreferrer"
          >
            ISLRTC website and interpreter resources ↗
          </a>
          <a
            href="https://gallaudet.edu/asl-connect/topics/"
            target="_blank"
            rel="noreferrer"
          >
            Gallaudet ASL Connect learning resources ↗
          </a>
        </div>
      </div>

      <div className="panel preferences-panel">
        <div>
          <h3>Accessibility preferences</h3>
          <p>
            Adjust visual display settings to your comfort. Choices are preserved in this browser.
          </p>
        </div>
        <div className="preference-actions">
          <button
            type="button"
            className={`secondary-button ${largeText ? "selected-control" : ""}`}
            onClick={() => onSavePreferences(!largeText, contrast)}
            aria-pressed={largeText}
          >
            Aa {largeText ? "Larger text: On" : "Larger text"}
          </button>
          <button
            type="button"
            className={`secondary-button ${contrast ? "selected-control" : ""}`}
            onClick={() => onSavePreferences(largeText, !contrast)}
            aria-pressed={contrast}
          >
            ◐ {contrast ? "High contrast: On" : "High contrast"}
          </button>
        </div>
      </div>
    </>
  );
}
