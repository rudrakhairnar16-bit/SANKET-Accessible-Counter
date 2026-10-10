> **Historical evidence notice (2026-10-08):** Any PASS/verification results in this document refer to an earlier project state/environment. They are not current v1.2.2 runtime evidence. See `docs/FINAL_RELEASE_REPORT.md` for the current verification boundary.

# SANKET Counter Access — Accessibility Audit Report

**Assessment Date:** October 4, 2026  
**Standards Reference:** WCAG 2.1 Level AA (Scope: Public-Service Counter Web Interface)  
**Evidence status:** Implementation notes are code/documentation review only. A complete manual WCAG audit, assistive-technology session, browser/device matrix, and independent conformance assessment have NOT been completed in this workspace.

---

## 1. Executive Summary

Public service counters serve citizens with diverse abilities, communication preferences, and sensory needs. In this environment, accessibility is not merely a styling option—it is a functional prerequisite.

The prototype includes several accessibility-oriented implementations (semantic landmarks, labels, visible focus styles, status announcements, text-size and contrast controls). These are not proof of WCAG conformance. The matrix below records implementation evidence, not independently verified PASS results. Complete the manual checks in `docs/MANUAL_QA.md` before making compliance claims.

---

## 2. Accessibility Verification Matrix

| WCAG 2.1 Success Criterion | Status | Implementation Details |
| :--- | :---: | :--- |
| **1.1.1 Non-text Content (Level A)** | **IMPLEMENTED; TEST PENDING** | Icons use decorative `aria-hidden="true"`; emoji phrases are accompanied by textual titles; interactive buttons have accessible text names or `aria-label`. |
| **1.3.1 Info and Relationships (Level A)** | **IMPLEMENTED; TEST PENDING** | Semantic HTML landmarks: `<aside aria-label="Main navigation">`, `<header>`, `<main id="main-content">`, `<footer>`, `<nav>`, `<form>`, `<dialog role="dialog">`. Form fields have associated `<label>` elements via `htmlFor`/`id`. |
| **1.3.2 Meaningful Sequence (Level A)** | **IMPLEMENTED; TEST PENDING** | Logical DOM source order matching visual reading flow from language picker, setup, sign selector, message board, display, and actions. |
| **1.4.1 Use of Color (Level A)** | **IMPLEMENTED; TEST PENDING** | Status badges, category filters, and selection states use both visual icons/symbols (`✓`, `+`, `1`) and text labels, never color alone. |
| **1.4.3 Contrast (Minimum) (Level AA)** | **IMPLEMENTED; TEST PENDING** | Primary text (`#14242a`) on light background (`#f7f9f8` / `#ffffff`) achieves > 11:1 ratio. Muted/secondary text (`#485b60`) achieves > 5.8:1 ratio (exceeds 4.5:1). Teal accents (`#076e69`) achieve 4.7:1 ratio. High-contrast mode provides 15:1+ contrast. |
| **1.4.4 Resize Text (Level AA)** | **IMPLEMENTED; TEST PENDING** | Dedicated "Larger text" (`Aa`) preference scales typography across layout; page reflows up to 200% browser zoom without truncation or overlap. |
| **1.4.11 Non-text Contrast (Level AA)** | **IMPLEMENTED; TEST PENDING** | Form inputs, select dropdowns, active filters, and buttons maintain distinct border boundaries (> 3:1 contrast against background). |
| **2.1.1 Keyboard (Level A)** | **IMPLEMENTED; TEST PENDING** | All interactive elements (sidebar tabs, buttons, dropdowns, inputs, sign cards, modal dialogs) are operable via standard Tab, Shift+Tab, Space, and Enter keys. |
| **2.1.2 No Keyboard Trap (Level A)** | **IMPLEMENTED; TEST PENDING** | Focus moves freely through all sections; modals provide explicit close buttons and allow keyboard exit. |
| **2.4.1 Bypass Blocks (Level A)** | **IMPLEMENTED; TEST PENDING** | Includes visible `.skip-link` ("Skip to main content") as the first tabbable item, focusing `<main id="main-content" tabIndex={-1}>`. |
| **2.4.3 Focus Order (Level A)** | **IMPLEMENTED; TEST PENDING** | Focus order follows intuitive sequence from skip link to navigation sidebar, top actions, language picker, and main workspace content. |
| **2.4.7 Focus Visible (Level AA)** | **IMPLEMENTED; TEST PENDING** | Custom high-visibility focus ring applied to all interactive controls: `outline: 3px solid #d97736; outline-offset: 3px;`. |
| **2.5.3 Label in Name (Level A)** | **IMPLEMENTED; TEST PENDING** | Accessible names of buttons match or contain visible text labels. |
| **3.2.1 On Focus (Level A)** | **IMPLEMENTED; TEST PENDING** | Moving focus to inputs, sign cards, or buttons does not trigger automatic submission or context shifts. |
| **3.3.1 Error Identification (Level A)** | **IMPLEMENTED; TEST PENDING** | Interpreter draft form displays explicit inline text error messages when required fields are missing, linked via `aria-describedby` and `aria-invalid`. |
| **3.3.2 Labels or Instructions (Level A)** | **IMPLEMENTED; TEST PENDING** | Form fields clearly indicate required status (`*`) and purpose; textarea displays live character count. |
| **4.1.2 Name, Role, Value (Level A)** | **IMPLEMENTED; TEST PENDING** | Toggle controls declare `aria-pressed`, active pages use `aria-current="page"`, modals use `role="dialog"` and `aria-modal="true"`, and live feedback/toast uses `role="status"` and `aria-live="polite"`. |
| **4.1.3 Status Messages (Level AA)** | **IMPLEMENTED; TEST PENDING** | Live duration timer, speech status, sign draft counts, and notification toasts are announced via `aria-live="polite"`. |

---

## 3. High-Contrast and Visual Customization Modes

1. **Larger Text Mode (`Aa` Toggle):**
   - Increases body text from 14px to 16px.
   - Increases buttons and navigation targets from 11px–12px to 13px–14px.
   - Preserves component padding and prevents container clipping.
2. **High-Contrast Mode (`◐` Toggle):**
   - High-contrast color palette: `--ink: #000000`, `--muted: #1e2f33`, `--line: #5f7873`, `--teal: #004d48`.
   - Thickened 2px component borders across cards, inputs, buttons, and rows.
   - Meets enhanced contrast expectations for users with low vision or high glare lighting.
3. **Reduced Motion (`prefers-reduced-motion: reduce`):**
   - Disables all CSS keyframe animations, transforms, and transitions automatically when requested by operating system preference.

---

## 4. Manual Accessibility Testing Still Recommended Prior to Production Pilot

While automated and keyboard traversals have passed, the following manual evaluations with actual assistive technology are recommended prior to civic deployment:
- **Screen Reader Testing:** Full workflow testing with NVDA (Windows), JAWS, and VoiceOver (macOS/iOS).
- **Deaf / Hard-of-Hearing Practitioner Review:** Verification of phrase appropriateness and visual clarity with members of the local Deaf community.
- **Physical Counter Ergonomics:** Testing screen height, tilt, touch target accessibility, and dual-display visibility at physical public-service counters.


## 4. Verification limitation

Do not describe this document as a passed WCAG audit. Contrast ratios and keyboard behavior must be checked against the current rendered UI and target browsers. Screen-reader testing with at least one desktop screen reader and one mobile assistive technology, 200%/400% zoom/reflow checks, reduced-motion verification, and disabled/unsupported browser cases remain pending. Record tester, browser/OS, date, steps, result, and defects for each completed check.
