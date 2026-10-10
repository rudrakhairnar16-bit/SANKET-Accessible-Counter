> **Historical execution notice (2026-10-08):** Tables in this planning document may contain historical execution results. They are not current v1.2.2 evidence. Current evidence is in `docs/FINAL_TEST_REPORT.md` and `docs/FINAL_RELEASE_REPORT.md`.

> **Historical evidence notice (2026-10-08):** Any PASS/verification results in this document refer to an earlier project state/environment. They are not current v1.2.2 runtime evidence. See `docs/FINAL_RELEASE_REPORT.md` for the current verification boundary.

# SANKET Accessibility Test Plan

**Document Version:** 1.2.0  
**Status:** Approved for Pre-Submission Prototype  
**Scope:** SANKET Counter Access Web Application (Public Service Counter Interface)  

---

## 1. Executive Summary & Philosophy

SANKET is engineered as an inclusive civic counter interface designed to facilitate bidirectional communication between Deaf / hard-of-hearing citizens and public administration staff. Because the application serves citizens with sensory and cognitive differences, accessibility is a foundational architecture requirement, not an afterthought.

This test plan defines the testing methodology, standards compliance criteria, automated tool coverage, manual verification protocols, and ethical testing boundaries.

### Key Testing Principles
1. **Zero Fabrication:** Automated tests evaluate DOM syntax and ARIA attributes; they do *not* prove usability by real people. Screen-reader and user tests are reported as "NOT RUN" unless physically conducted with human evaluators.
2. **Predictable Linear Focus:** Public service counters are high-stress environments. Keyboard users must navigate without traps, unexpected jumps, or ambiguous controls.
3. **No Hidden Hardware Invocations:** Following the removal of live camera and microphone workflows in v1.2, browser permissions must remain untouched (`camera=()`, `microphone=()`).

---

## 2. Standards & Conformance Targets

* **Standard:** W3C Web Content Accessibility Guidelines (WCAG) 2.2 Level AA.
* **Jurisdictional Guidelines:** Rights of Persons with Disabilities Act (RPwD Act 2016, India) / GIGW 3.0 (Guidelines for Indian Government Websites).
* **Target Conformance Level:** Level AA Compliance across all core counter workflows.

---

## 3. Evaluation Dimensions & Test Procedures

### 3.1 Keyboard-Only Navigation & Focus Order
* **Criteria:** WCAG 2.1.1 (Keyboard), 2.1.2 (No Keyboard Trap), 2.4.3 (Focus Order), 2.4.7 (Focus Visible).
* **Test Procedure:**
  1. Disconnect mouse/pointing device.
  2. Use `Tab`, `Shift+Tab`, `Enter`, `Space`, and Arrow keys across the entire interface.
  3. Verify that the skip link (`#main-content`) is the first focusable element.
  4. Ensure focus ring is distinct (minimum 3:1 contrast against adjacent background colors, outline >= 2px).
  5. Verify that modal dialogs or dropdown menus constrain focus when active and restore focus to trigger upon dismissal.
  6. Confirm that the draft tray sign items can be focused and removed via keyboard.

### 3.2 Semantic HTML & Accessible Names
* **Criteria:** WCAG 1.3.1 (Info and Relationships), 4.1.2 (Name, Role, Value).
* **Test Procedure:**
  1. Inspect DOM structure with developer tools: check for valid `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` landmarks.
  2. Verify all buttons have text or `aria-label` / `aria-labelledby`.
  3. Verify sign cards have programmatic names stating the sign label, language, and meaning.
  4. Verify SVG icons use `aria-hidden="true"` when decorative, or appropriate accessible titles when conveying information.

### 3.3 Visual Contrast & Dynamic Customization Controls
* **Criteria:** WCAG 1.4.3 (Contrast Minimum - 4.5:1 for normal text, 3:1 for large text), 1.4.4 (Resize text - up to 200%), 1.4.11 (Non-text Contrast).
* **Test Procedure:**
  1. Test Default Theme: Measure text contrast on cards, headers, and buttons using color contrast analyzers.
  2. Test High Contrast Mode: Activate High Contrast toggle in the accessibility drawer; verify text contrast exceeds 7:1 (AAA) and borders are prominently defined.
  3. Test Font Sizing: Toggle Large Font (`+` / `A+`) mode; verify all text expands without overlapping, truncation, or breaking grid boundaries.
  4. Test Reduced Motion: Ensure all animations and transitions obey CSS `prefers-reduced-motion: reduce` or user toggle.

### 3.4 Citizen Sign Selection & Draft Tray Usability
* **Criteria:** WCAG 2.2.1 (Timing Adjustable), 2.5.3 (Label in Name), 3.2.2 (On Input).
* **Test Procedure:**
  1. Filter signs by search input and category pills.
  2. Add signs to the citizen draft tray.
  3. Verify live region announcement (`aria-live="polite"`) when an item is added or removed from the draft tray.
  4. Confirm that "Send Draft to Staff" button transfers the composed sequence into the active conversation log with immediate screen-reader feedback.

### 3.5 Session Timer Clarity & Non-Disruptive Warning
* **Criteria:** WCAG 2.2.1 (Timing Adjustable).
* **Test Procedure:**
  1. Verify the timer counts elapsed session time clearly in minutes and seconds (`MM:SS`).
  2. Verify pause, resume, and reset actions are keyboard accessible.
  3. Verify timer state does not force unexpected page refreshes or steal keyboard focus.

### 3.6 Form Controls, Error Prevention, and Recovery
* **Criteria:** WCAG 3.3.1 (Error Identification), 3.3.2 (Labels or Instructions), 3.3.3 (Error Suggestion).
* **Test Procedure:**
  1. Submit empty custom messages to ensure client-side validation prevents submission and presents an accessible error message.
  2. Confirm error text is programmatically associated with inputs via `aria-describedby` or `aria-errormessage`.
  3. Verify that resetting or clearing a draft requires confirmation or allows immediate safe recovery.

### 3.7 Permissions & Sensory Privacy Safeguards
* **Criteria:** Ethical Transparency & Privacy by Design.
* **Test Procedure:**
  1. Navigate to all tabs and interactive sections.
  2. Verify that no prompt for `navigator.mediaDevices.getUserMedia` or `webkitSpeechRecognition` is fired.
  3. Confirm that browser security headers enforce `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

---

## 4. Test Environment & Tooling Matrix

| Layer | Tool / Method | Scope | Status in v1.2 |
|---|---|---|---|
| **Syntax & Type Safety** | TypeScript (`tsc --noEmit`) | Prop types, event handlers, DOM bindings | **PASS (0 errors)** |
| **Lint & ARIA Checks** | ESLint (`eslint-plugin-jsx-a11y`) | Semantic tags, missing labels, role errors | **PASS (0 errors)** |
| **Automated Suite** | Vitest (`tests/*.test.ts`) | Message validation, state updates, policies | **PASS (76 tests)** |
| **Asset Consistency** | `audit-sign-assets.mjs` | Verified vs missing sign visuals | **PASS (0 broken refs)** |
| **Simulated Personas** | Structured Walkthroughs | 3 hypothetical personas (A, B, C) | **DOCUMENTED (Simulated)** |
| **Human Screen-Reader** | NVDA / JAWS / VoiceOver | Actual speech output & reading flow | **NOT RUN** (No screen reader in CI) |
| **Deaf/HoH User Testing** | Civic counter pilot sessions | Usability, gesture clarity, citizen comfort | **NOT RUN** (Post-submission roadmap) |

---

## 5. Reporting and Remediation Protocol

Any defect discovered during testing is logged into `docs/accessibility/ACCESSIBILITY_ISSUES.md` categorized by WCAG Severity (Blocker, High, Medium, Low) with exact reproduction steps, impact description, and assigned remediation.
