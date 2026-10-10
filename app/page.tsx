"use client";

import { useState, useEffect, useMemo, type FormEvent } from "react";
import {
  phrases,
  type Category,
  type Phrase,
  formatDurationLong,
  validateCustomMessage,
  validateInterpreterDraft,
} from "@/lib/phrases";
import {
  getSignCategories,
  filterSigns,
  formatSignDraftMessage,
  validateSignDraft,
  type SignLanguage,
  type UnifiedSignEntry,
  type SignDraftItem,
} from "@/lib/sign-language";
import { CounterWorkspace } from "@/components/counter-workspace";
import { CommunicationView, type CounterMessage } from "@/components/communication-view";
import { SignSelectorView } from "@/components/sign-selector-view";
import { InterpreterRequestView } from "@/components/interpreter-request-view";
import { QuickGuideView } from "@/components/quick-guide-view";
import { ActivityMetricsView, type Metrics } from "@/components/activity-metrics-view";
import { LanguageModal } from "@/components/modals/language-modal";
import { SignDetailModal } from "@/components/modals/sign-detail-modal";
import { ConfirmDraftModal } from "@/components/modals/confirm-draft-modal";

export type { Metrics, CounterMessage };

type Section = "counter" | "communication" | "signs" | "interpreter" | "learning" | "impact";

const sections: { id: Section; label: string; icon: string }[] = [
  { id: "counter", label: "Counter", icon: "▦" },
  { id: "communication", label: "Communication", icon: "↔" },
  { id: "signs", label: "Sign Selector", icon: "🖐" },
  { id: "interpreter", label: "Interpreter", icon: "◎" },
  { id: "learning", label: "Quick guide", icon: "✳" },
  { id: "impact", label: "Activity", icon: "▥" },
];

const emptyMetrics: Metrics = {
  sessions: 0,
  phrases: 0,
  signSelections: 0,
  interpreterRequests: 0,
  feedback: 0,
  understood: 0,
  totalDurationSeconds: 0,
};

const initialMessages: CounterMessage[] = [
  {
    id: "msg-1",
    sender: "Staff",
    sourceType: "phrase-card",
    text: "Welcome. How can I help you today at Counter 1?",
    timestamp: "Ready",
  },
];

export default function Home() {
  const [section, setSection] = useState<Section>("counter");
  const [category, setCategory] = useState<Category>("All");
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase>(phrases[0]);
  const [service, setService] = useState("General enquiry");
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [interpreterStatus, setInterpreterStatus] = useState<"Not requested" | "Request drafted">("Not requested");
  const [draftStage, setDraftStage] = useState<"form" | "review" | "drafted">("form");
  const [counterNumber, setCounterNumber] = useState("Counter 1");
  const [assistanceType, setAssistanceType] = useState("Indian Sign Language (ISL) Interpreter");
  const [urgency, setUrgency] = useState<"Standard" | "High Priority (Citizen waiting)">("Standard");
  const [draftNotes, setDraftNotes] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [customMessage, setCustomMessage] = useState("");
  const [toast, setToast] = useState("");
  const [metrics, setMetrics] = useState<Metrics>(emptyMetrics);
  const [largeText, setLargeText] = useState(false);
  const [contrast, setContrast] = useState(false);
  const [feedbackChoice, setFeedbackChoice] = useState("");
  const [online, setOnline] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  // Language & Visual Sign Selector State
  const [activeLanguage, setActiveLanguage] = useState<SignLanguage>("ISL");
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [signSearchQuery, setSignSearchQuery] = useState("");
  const [signCategory, setSignCategory] = useState("All");
  const [signDraft, setSignDraft] = useState<SignDraftItem[]>([]);
  const [inspectingSign, setInspectingSign] = useState<UnifiedSignEntry | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [conversation, setConversation] = useState<CounterMessage[]>(initialMessages);

  // Check speech synthesis support on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSpeechSupported("speechSynthesis" in window);
    }
  }, []);

  // Session duration timer with proper cleanup
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (sessionActive) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionActive]);

  // Online status, localStorage restoration and Service Worker registration
  useEffect(() => {
    if (typeof window === "undefined") return;
    setOnline(navigator.onLine);
    const updateOnline = () => setOnline(navigator.onLine);
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    try {
      const saved = localStorage.getItem("sanket-metrics");
      if (saved) setMetrics({ ...emptyMetrics, ...JSON.parse(saved) });
      const prefs = localStorage.getItem("sanket-prefs");
      if (prefs) {
        const p = JSON.parse(prefs);
        setLargeText(Boolean(p.largeText));
        setContrast(Boolean(p.contrast));
        if (p.language === "ISL" || p.language === "ASL") {
          setActiveLanguage(p.language);
        }
      }
      if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
        navigator.serviceWorker.register("/sw.js").catch(() => undefined);
      }
    } catch {
      // Local storage may be restricted. Core communication still functions.
    }
    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
    };
  }, []);

  const customMessageValidation = useMemo(
    () => validateCustomMessage(customMessage, 240),
    [customMessage]
  );

  // Available sign categories for current active language
  const availableSignCategories = useMemo(
    () => getSignCategories(activeLanguage),
    [activeLanguage]
  );

  // Filtered signs based on active language, search, and category
  const filteredSignsList = useMemo(
    () => filterSigns(activeLanguage, signSearchQuery, signCategory),
    [activeLanguage, signSearchQuery, signCategory]
  );

  // Formatted draft message
  const draftMessagePreview = useMemo(
    () => formatSignDraftMessage(signDraft),
    [signDraft]
  );

  function updateMetrics(change: Partial<Metrics>) {
    setMetrics((current) => {
      const next: Metrics = {
        sessions: Math.max(0, current.sessions + (change.sessions ?? 0)),
        phrases: Math.max(0, current.phrases + (change.phrases ?? 0)),
        signSelections: Math.max(0, current.signSelections + (change.signSelections ?? 0)),
        interpreterRequests: Math.max(0, current.interpreterRequests + (change.interpreterRequests ?? 0)),
        feedback: Math.max(0, current.feedback + (change.feedback ?? 0)),
        understood: Math.max(0, current.understood + (change.understood ?? 0)),
        totalDurationSeconds: Math.max(0, current.totalDurationSeconds + (change.totalDurationSeconds ?? 0)),
      };
      try {
        localStorage.setItem("sanket-metrics", JSON.stringify(next));
      } catch {
        /* Optional metrics only. */
      }
      return next;
    });
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3500);
  }

  function switchLanguage(lang: SignLanguage) {
    setActiveLanguage(lang);
    setSignCategory("All");
    setSignSearchQuery("");
    setShowLanguageModal(false);
    try {
      const prefs = localStorage.getItem("sanket-prefs");
      const current = prefs ? JSON.parse(prefs) : {};
      localStorage.setItem("sanket-prefs", JSON.stringify({ ...current, language: lang }));
    } catch {}
    notify(`Active sign language set to ${lang === "ISL" ? "Indian Sign Language (ISL)" : "American Sign Language (ASL)"}.`);
  }

  function startSession() {
    if (!sessionActive) {
      setSessionActive(true);
      setSessionSeconds(0);
      updateMetrics({ sessions: 1 });
      notify("Session started on this device.");
    } else {
      const durationFormatted = formatDurationLong(sessionSeconds);
      setSessionActive(false);
      updateMetrics({ totalDurationSeconds: sessionSeconds });
      setSelectedPhrase(phrases[0]);
      setCustomMessage("");
      setSignDraft([]);
      setInterpreterStatus("Not requested");
      setDraftStage("form");
      notify(`Session ended (${durationFormatted}). No conversation transcript was saved.`);
      setSessionSeconds(0);
    }
  }

  function showPhrase(phrase: Phrase) {
    setSelectedPhrase(phrase);
    setSection("communication");
    updateMetrics({ phrases: 1 });
  }

  function speak(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      notify("Text-to-speech is not supported in this browser. Message is displayed on screen.");
      return;
    }
    const trimmed = text.trim();
    if (!trimmed) {
      notify("No message content to speak.");
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(trimmed);
      utterance.lang = "en-IN";
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
      notify("Voice playback encountered a browser limitation.");
    }
  }

  function stopSpeech() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    notify("Audio playback stopped.");
  }

  function addSignToDraft(sign: UnifiedSignEntry) {
    if (signDraft.length >= 10) {
      notify("Draft limit reached (10 signs maximum). Send or clear draft to add more.");
      return;
    }
    const newItem: SignDraftItem = {
      id: `draft-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      signId: sign.id,
      language: sign.language,
      label: sign.label,
      meaning: sign.meaning,
      handConfiguration: sign.handConfiguration,
    };
    setSignDraft((prev) => [...prev, newItem]);
    updateMetrics({ signSelections: 1 });
    notify(`Added sign "${sign.label}" to message draft.`);
  }

  function removeDraftItem(itemId: string) {
    setSignDraft((prev) => prev.filter((item) => item.id !== itemId));
    notify("Sign removed from draft.");
  }

  function clearSignDraft() {
    setSignDraft([]);
    notify("Sign draft cleared.");
  }

  function handleConfirmSendDraft() {
    const validation = validateSignDraft(signDraft);
    if (!validation.isValid) {
      notify(validation.error || "Cannot send empty draft.");
      return;
    }

    const messageText = formatSignDraftMessage(signDraft);
    const newMsg: CounterMessage = {
      id: `msg-${Date.now()}`,
      sender: "Citizen",
      sourceType: "sign-language",
      language: activeLanguage,
      text: messageText,
      signTags: signDraft.map((s) => ({ id: s.signId, label: s.label, meaning: s.meaning })),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversation((prev) => [...prev, newMsg]);
    setShowConfirmModal(false);
    setSignDraft([]);
    setSection("communication");
    notify("Citizen sign message confirmed and presented on counter screen.");
  }

  function handleSendStaffResponse(textToSend: string) {
    if (!textToSend.trim()) return;
    const newMsg: CounterMessage = {
      id: `msg-${Date.now()}`,
      sender: "Staff",
      sourceType: "typed-text",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setConversation((prev) => [...prev, newMsg]);
    setCustomMessage("");
    notify("Staff reply added to counter screen.");
  }

  function handleReviewDraft(e?: FormEvent) {
    if (e) e.preventDefault();
    const validation = validateInterpreterDraft({
      counterNumber,
      assistanceType,
    });
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }
    setFormErrors({});
    setDraftStage("review");
  }

  function confirmDraft() {
    setInterpreterStatus("Request drafted");
    setDraftStage("drafted");
    updateMetrics({ interpreterRequests: 1 });
    notify("Interpreter request drafted locally on this device.");
  }

  function resetDraft() {
    setInterpreterStatus("Not requested");
    setDraftStage("form");
    setCounterNumber("Counter 1");
    setDraftNotes("");
    setFormErrors({});
    notify("Local request status reset.");
  }

  function submitFeedback(choice: string) {
    if (feedbackChoice === choice) return;
    const previous = feedbackChoice;
    setFeedbackChoice(choice);
    if (previous === "") {
      updateMetrics({
        feedback: 1,
        understood: choice === "Understood" ? 1 : 0,
      });
    } else {
      updateMetrics({
        understood: choice === "Understood" ? 1 : previous === "Understood" ? -1 : 0,
      });
    }
    notify("Feedback saved on this device only.");
  }

  function savePreferences(nextLarge: boolean, nextContrast: boolean) {
    setLargeText(nextLarge);
    setContrast(nextContrast);
    try {
      const prefs = localStorage.getItem("sanket-prefs");
      const current = prefs ? JSON.parse(prefs) : {};
      localStorage.setItem("sanket-prefs", JSON.stringify({ ...current, largeText: nextLarge, contrast: nextContrast }));
    } catch {
      /* Non-critical preferences. */
    }
  }

  return (
    <div className={`app-shell ${largeText ? "large-text" : ""} ${contrast ? "high-contrast" : ""}`}>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      {/* Main Sidebar */}
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            S
          </div>
          <div>
            <strong>SANKET</strong>
            <span>COUNTER ACCESS</span>
          </div>
        </div>
        <div className="side-label">WORKSPACE</div>
        <nav className="nav-list" aria-label="Primary sections">
          {sections.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${section === item.id ? "active" : ""}`}
              onClick={() => setSection(item.id)}
              aria-current={section === item.id ? "page" : undefined}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.id === "signs" && signDraft.length > 0 && (
                <span className="draft-chip-pill" aria-label={`${signDraft.length} signs in draft`}>
                  {signDraft.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="support-card">
            <div className="support-icon" aria-hidden="true">
              ?
            </div>
            <strong>Communication support</strong>
            <p>If automated communication is unclear, ask for an interpreter or assistance.</p>
            <button className="text-button" onClick={() => setSection("learning")}>
              How it works <span aria-hidden="true">→</span>
            </button>
          </div>
          <div className="privacy-mini">
            <span className="privacy-dot" aria-hidden="true" /> Local terminal · Ephemeral
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="main-column">
        <header className="topbar">
          <div className="breadcrumb">
            <span>SANKET</span>
            <span className="crumb-slash" aria-hidden="true">
              /
            </span>
            <span>Public Counter</span>
            <span className="crumb-slash" aria-hidden="true">
              /
            </span>
            <strong>{sections.find((s) => s.id === section)?.label}</strong>
          </div>

          <div className="top-actions">
            {/* Language Profile Switcher Button */}
            <button
              className="lang-switcher-pill"
              onClick={() => setShowLanguageModal(true)}
              aria-label={`Current language profile: ${activeLanguage === "ISL" ? "Indian Sign Language" : "American Sign Language"}. Click to switch.`}
              title="Switch sign language profile"
            >
              <span className="lang-flag" aria-hidden="true">
                {activeLanguage === "ISL" ? "🇮🇳" : "🇺🇸"}
              </span>
              <span className="lang-text">
                <span className="lang-lbl">ACTIVE SIGN PROFILE</span>
                <span className="lang-val">{activeLanguage === "ISL" ? "ISL (Indian Sign)" : "ASL (American Sign)"}</span>
              </span>
              <span className="lang-arrow" aria-hidden="true">
                ▾
              </span>
            </button>

            <span className={`connection-pill ${online ? "online" : "offline"}`} role="status">
              <span aria-hidden="true" />
              {online ? "Device online" : "Offline mode"}
            </span>
            <button
              className="icon-button"
              aria-label="Toggle larger text"
              aria-pressed={largeText}
              title="Toggle larger text"
              onClick={() => savePreferences(!largeText, contrast)}
            >
              Aa
            </button>
            <button
              className="icon-button contrast-icon"
              aria-label="Toggle high contrast"
              aria-pressed={contrast}
              title="Toggle high contrast"
              onClick={() => savePreferences(largeText, !contrast)}
            >
              ◐
            </button>
            <button className="help-button" onClick={() => setSection("learning")}>
              Help <span aria-hidden="true">↗</span>
            </button>
          </div>
        </header>

        <main className="content" id="main-content" tabIndex={-1}>
          {section === "counter" && (
            <CounterWorkspace
              activeLanguage={activeLanguage}
              sessionActive={sessionActive}
              sessionSeconds={sessionSeconds}
              service={service}
              onSetService={setService}
              onStartSession={startSession}
              onShowPhrase={showPhrase}
              onNavigate={setSection}
            />
          )}

          {section === "communication" && (
            <CommunicationView
              activeLanguage={activeLanguage}
              category={category}
              selectedPhrase={selectedPhrase}
              customMessage={customMessage}
              customMessageValidation={customMessageValidation}
              conversation={conversation}
              isSpeaking={isSpeaking}
              speechSupported={speechSupported}
              onSetCategory={setCategory}
              onSelectPhrase={setSelectedPhrase}
              onChangeCustomMessage={setCustomMessage}
              onSendStaffResponse={handleSendStaffResponse}
              onSpeak={speak}
              onStopSpeech={stopSpeech}
              onResetConversation={() => {
                setConversation(initialMessages);
                notify("Conversation history reset.");
              }}
              onNavigate={setSection}
            />
          )}

          {section === "signs" && (
            <SignSelectorView
              activeLanguage={activeLanguage}
              signCategory={signCategory}
              availableSignCategories={availableSignCategories}
              signSearchQuery={signSearchQuery}
              filteredSignsList={filteredSignsList}
              signDraft={signDraft}
              onSetSignCategory={setSignCategory}
              onSetSignSearchQuery={setSignSearchQuery}
              onAddSignToDraft={addSignToDraft}
              onInspectSign={setInspectingSign}
              onRemoveDraftItem={removeDraftItem}
              onClearSignDraft={clearSignDraft}
              onOpenConfirmModal={() => setShowConfirmModal(true)}
            />
          )}

          {section === "interpreter" && (
            <InterpreterRequestView
              counterNumber={counterNumber}
              assistanceType={assistanceType}
              urgency={urgency}
              draftNotes={draftNotes}
              service={service}
              draftStage={draftStage}
              interpreterStatus={interpreterStatus}
              formErrors={formErrors}
              onSetCounterNumber={setCounterNumber}
              onSetAssistanceType={setAssistanceType}
              onSetUrgency={setUrgency}
              onSetDraftNotes={setDraftNotes}
              onReviewDraft={handleReviewDraft}
              onConfirmDraft={confirmDraft}
              onResetDraft={resetDraft}
              onSetDraftStage={setDraftStage}
            />
          )}

          {section === "learning" && (
            <QuickGuideView
              largeText={largeText}
              contrast={contrast}
              onSavePreferences={savePreferences}
            />
          )}

          {section === "impact" && (
            <ActivityMetricsView
              metrics={metrics}
              feedbackChoice={feedbackChoice}
              onSubmitFeedback={submitFeedback}
              onResetMetrics={() => {
                setMetrics(emptyMetrics);
                setFeedbackChoice("");
                try {
                  localStorage.removeItem("sanket-metrics");
                } catch {}
                notify("Local activity data reset.");
              }}
            />
          )}
        </main>

        <footer className="app-footer">
          <span>© SANKET Counter Access · Accessible Municipal Interaction</span>
          <span>
            <span className="privacy-dot" aria-hidden="true" /> Privacy-first by design
          </span>
          <button type="button" onClick={() => setSection("learning")}>
            Accessibility guide
          </button>
        </footer>
      </div>

      {/* Modal 1: Choose Sign Language */}
      <LanguageModal
        isOpen={showLanguageModal}
        activeLanguage={activeLanguage}
        onSelectLanguage={switchLanguage}
        onClose={() => setShowLanguageModal(false)}
      />

      {/* Modal 2: Sign Details Inspection */}
      <SignDetailModal
        sign={inspectingSign}
        onAddSignToDraft={addSignToDraft}
        onClose={() => setInspectingSign(null)}
      />

      {/* Modal 3: Confirm & Review Draft */}
      <ConfirmDraftModal
        isOpen={showConfirmModal}
        draft={signDraft}
        activeLanguage={activeLanguage}
        draftMessagePreview={draftMessagePreview}
        onConfirmSend={handleConfirmSendDraft}
        onRemoveDraftItem={removeDraftItem}
        onClose={() => setShowConfirmModal(false)}
      />

      {/* Toast Notification Container */}
      {toast && (
        <aside className="toast" role="status" aria-live="polite">
          <span aria-hidden="true">✓</span> {toast}
        </aside>
      )}
    </div>
  );
}
