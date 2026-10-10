"use client";

import { StaticImageRecognitionTool } from "@/components/static-image-recognition";
import { phrases, type Category, type Phrase } from "@/lib/phrases";
import type { SignLanguage } from "@/lib/sign-language";

export interface CounterMessage {
  id: string;
  sender: "Citizen" | "Staff";
  sourceType: "sign-language" | "typed-text" | "phrase-card" | "tts";
  language?: SignLanguage;
  text: string;
  signTags?: { id: string; label: string; meaning: string }[];
  timestamp: string;
}

export interface CommunicationViewProps {
  activeLanguage: SignLanguage;
  category: Category;
  selectedPhrase: Phrase;
  customMessage: string;
  customMessageValidation: { isValid: boolean; length: number; remaining: number; error?: string };
  conversation: CounterMessage[];
  isSpeaking: boolean;
  speechSupported: boolean;
  onSetCategory: (cat: Category) => void;
  onSelectPhrase: (phrase: Phrase) => void;
  onChangeCustomMessage: (text: string) => void;
  onSendStaffResponse: (text: string) => void;
  onSpeak: (text: string) => void;
  onStopSpeech: () => void;
  onResetConversation: () => void;
  onNavigate: (section: "signs" | "interpreter") => void;
}

export function CommunicationView({
  activeLanguage,
  category,
  selectedPhrase,
  customMessage,
  customMessageValidation,
  conversation,
  isSpeaking,
  speechSupported,
  onSetCategory,
  onSelectPhrase,
  onChangeCustomMessage,
  onSendStaffResponse,
  onSpeak,
  onStopSpeech,
  onResetConversation,
  onNavigate,
}: CommunicationViewProps) {
  const filteredPhrases = phrases.filter(
    (phrase) => category === "All" || phrase.category === category
  );

  const latestMessage = conversation[conversation.length - 1];
  const activeDisplayText =
    customMessage.trim() ||
    (latestMessage ? latestMessage.text : selectedPhrase.message);

  return (
    <>
      <div className="subpage-heading">
        <div className="eyebrow">
          <span className="eyebrow-line" aria-hidden="true" /> SHARED COMMUNICATION BOARD
        </div>
        <h1>Say it clearly.</h1>
        <p>
          Two-way communication between citizens and counter staff with sign language messages, quick phrases, and text-to-speech.
        </p>
      </div>

      <div
        className="assistive-tools-grid static-recognition-grid"
        role="region"
        aria-label="Optional AI recognition tools"
      >
        <StaticImageRecognitionTool key={activeLanguage} language={activeLanguage} />
      </div>

      <div className="communication-layout">
        {/* Left Panel: Message Library & Input */}
        <div className="panel phrase-panel">
          <div className="panel-heading">
            <div>
              <h2>Message library &amp; quick phrases</h2>
              <p>Select a phrase or write custom text to display.</p>
            </div>
            <span className="count-chip">{filteredPhrases.length} phrases</span>
          </div>

          <div
            className="filter-row"
            role="group"
            aria-label="Filter phrases by category"
          >
            {(["All", "Documents", "Application", "Waiting", "Help"] as Category[]).map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className={`filter-chip ${category === item ? "selected" : ""}`}
                  onClick={() => onSetCategory(item)}
                  aria-pressed={category === item}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <div className="phrase-list" role="list">
            {filteredPhrases.map((phrase) => (
              <button
                key={phrase.id}
                type="button"
                role="listitem"
                className={`phrase-row ${selectedPhrase.id === phrase.id ? "chosen" : ""}`}
                onClick={() => onSelectPhrase(phrase)}
                aria-pressed={selectedPhrase.id === phrase.id}
              >
                <span className="phrase-emoji" aria-hidden="true">
                  {phrase.icon}
                </span>
                <span className="phrase-label">
                  <strong>{phrase.title}</strong>
                  <small>{phrase.category}</small>
                </span>
                <span className="phrase-select" aria-hidden="true">
                  {selectedPhrase.id === phrase.id ? "✓" : "+"}
                </span>
              </button>
            ))}
          </div>

          {/* Custom Message & Reply Box */}
          <div className="custom-message">
            <label htmlFor="custom-message">Staff reply or custom message</label>
            <textarea
              id="custom-message"
              rows={2}
              maxLength={240}
              placeholder="Type a message or response to display on counter screen…"
              value={customMessage}
              onChange={(e) => onChangeCustomMessage(e.target.value)}
              aria-invalid={!customMessageValidation.isValid}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "6px",
              }}
            >
              <button
                type="button"
                className="secondary-button"
                style={{ padding: "6px 12px", fontSize: "11px" }}
                disabled={!customMessage.trim()}
                onClick={() => onSendStaffResponse(customMessage)}
              >
                Post as Staff Reply
              </button>
              <span className="character-count" aria-live="polite">
                {customMessage.length}/240
              </span>
            </div>
          </div>

          {/* Sign Language Shortcut */}
          <div
            style={{
              marginTop: "18px",
              padding: "14px",
              background: "#f1f8f5",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong
                style={{
                  fontSize: "12px",
                  color: "var(--teal-dark)",
                  display: "block",
                }}
              >
                Citizen Sign Selector
              </strong>
              <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                Active: {activeLanguage === "ISL" ? "Indian Sign Language" : "American Sign Language"}
              </span>
            </div>
            <button
              type="button"
              className="primary-button"
              style={{ padding: "8px 12px", fontSize: "11px" }}
              onClick={() => onNavigate("signs")}
            >
              Open Sign Library 🖐
            </button>
          </div>
        </div>

        {/* Right Panel: Counter Screen Display Preview */}
        <div className="panel display-panel">
          <div className="display-top">
            <span className="display-live">
              <span aria-hidden="true" /> ACTIVE COUNTER SCREEN
            </span>
            <span className="display-privacy">Counter 1 · Public Display</span>
          </div>

          {/* Main Display Message */}
          <div className="message-display" aria-live="polite">
            <div className="display-illustration" aria-hidden="true">
              {latestMessage?.sourceType === "sign-language"
                ? "🖐"
                : customMessage.trim()
                ? "✍️"
                : selectedPhrase.icon}
            </div>
            <div className="display-kicker">
              {latestMessage?.sourceType === "sign-language"
                ? `CITIZEN · ${latestMessage.language} SIGN MESSAGE`
                : customMessage.trim()
                ? "STAFF · CUSTOM MESSAGE"
                : selectedPhrase.category.toUpperCase()}
            </div>
            <h2>{activeDisplayText}</h2>
            {latestMessage?.signTags && (
              <div
                className="chat-tags"
                style={{ justifyContent: "center", margin: "10px 0" }}
              >
                {latestMessage.signTags.map((tag) => (
                  <span key={tag.id} className="chat-tag">
                    <strong>{tag.label}:</strong> {tag.meaning}
                  </span>
                ))}
              </div>
            )}
            <p>Take your time. You can ask to repeat or clarify any message at any point.</p>
          </div>

          {/* Actions for active message */}
          <div className="display-actions">
            {isSpeaking ? (
              <button
                type="button"
                className="primary-button btn-stop"
                onClick={onStopSpeech}
              >
                ■ Stop voice
              </button>
            ) : (
              <button
                type="button"
                className="primary-button"
                onClick={() => onSpeak(activeDisplayText)}
              >
                ▶ Speak message aloud
              </button>
            )}
            {customMessage && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => onChangeCustomMessage("")}
              >
                Clear text
              </button>
            )}
          </div>

          {!speechSupported && (
            <div className="detail-note" style={{ margin: "14px 0 0" }}>
              Note: Text-to-speech is not supported by your current browser. The visual display remains active.
            </div>
          )}

          {/* Two-Way Conversation History */}
          <div style={{ marginTop: "18px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <strong
                style={{
                  fontSize: "11px",
                  letterSpacing: "1px",
                  color: "var(--muted)",
                }}
              >
                RECENT COUNTER EXCHANGES
              </strong>
              {conversation.length > 1 && (
                <button
                  type="button"
                  className="text-button"
                  style={{ fontSize: "10px" }}
                  onClick={onResetConversation}
                >
                  Clear history
                </button>
              )}
            </div>
            <div className="two-way-thread">
              {conversation.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-entry ${
                    msg.sender === "Citizen" ? "chat-citizen" : "chat-staff"
                  }`}
                >
                  <div className="chat-meta">
                    <span>
                      {msg.sender === "Citizen"
                        ? `👤 CITIZEN (${msg.language || "SIGN"})`
                        : "🏛️ COUNTER STAFF"}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div className="chat-text">{msg.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="clarify-box">
            <span aria-hidden="true">↔</span>
            <div>
              <strong>Confirm understanding</strong>
              <p>Use this prompt to confirm that both people understood the interaction.</p>
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  const understoodPhrase = phrases.find((p) => p.id === "understood");
                  if (understoodPhrase) onSelectPhrase(understoodPhrase);
                }}
              >
                Show confirmation phrase →
              </button>
            </div>
          </div>

          <div className="display-footer">
            <span>Support tools are aids, not a substitute for qualified sign language interpretation.</span>
            <button
              type="button"
              onClick={() => onNavigate("interpreter")}
            >
              Need an interpreter?
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
