# Three-Person Simulated Accessibility Validation

> [!IMPORTANT]
> **DISCLAIMER: HYPOTHETICAL SIMULATION ONLY**  
> All personas, scenarios, observations, and findings in this document are **SIMULATED / ILLUSTRATIVE** engineering walkthroughs. They are designed to stress-test accessibility workflows prior to real-world user engagement.  
> **NO REAL HUMAN BEINGS, INTERVIEWS, QUOTATIONS, OR USER SESSIONS WERE FABRICATED.** Formal user validation with Deaf citizens and native signers is documented in `REAL_USER_VALIDATION_TEMPLATE.md` and scheduled for post-submission pilot testing.

---

## Persona A — Keyboard-Only Civic User (Motor / Mobility Consideration)

### 1. Hypothetical Context
* **Profile:** A citizen visiting a municipal office who cannot use a mouse or trackpad due to motor tremors or physical impairment. Relies exclusively on a standard USB keyboard.
* **Goal:** Navigate to the SANKET civic counter interface, review available citizen phrases, compose a query about paying a property water bill, and review staff response without touching a pointer device.

### 2. Task Scenario
* **Scenario ID:** `SIM-PER-A-01`
* **Task Description:** Open the application, toggle high-contrast mode, search for "water", select the relevant citizen phrase, send it to the conversation tray, and confirm the message log updates.

### 3. Expected Accessible Behaviour
* The skip link is immediately accessible on first `Tab`.
* Focus outlines are visible, distinct (>= 3:1 contrast), and never hidden by CSS `outline: none`.
* Tab order matches visual order (Header -> Accessibility Controls -> Navigation -> Communication Deck -> Active Conversation).
* No keyboard trap in search inputs, modal drawers, or sign cards.
* Shortcut keys (if any) or standard Enter/Space operate all interactive buttons.

### 4. Test Steps (Simulated Walkthrough)
1. Load `http://localhost:3000/`.
2. Press `Tab` once -> Skip-to-content button gains focus. Press `Enter`.
3. Press `Tab` through Accessibility Controls -> Focus on "Contrast Mode" button. Press `Enter` to activate high contrast.
4. Press `Tab` to navigate to the "Communication" or "Sign Selector" section.
5. In the phrase filter input, type "water".
6. Press `Tab` to move to the filtered phrase buttons. Press `Enter` on "Water bill inquiry".
7. Press `Tab` to the "Send to Counter" button and press `Enter`.
8. Press `Tab` to navigate into the conversation log to verify the dispatched query.

### 5. Pass/Fail Criteria
* **PASS Criteria:** Complete end-to-end task executed in <= 20 key presses without pointer; visible focus indicator maintained on every focused element; no focus loss after sending message.
* **FAIL Criteria:** Focus trapped in search input; focus disappears off-screen; button cannot be activated via `Enter` or `Space`.

### 6. Observations (SIMULATED)
* **Status:** PASS (SIMULATED)
* **Observation:** Focus outlines are prominent with a 2px high-visibility ring. Tab order proceeds predictably across the interface. The skip link bypasses navigation cleanly.

### 7. Issue Severity & Remediation
* **Discovered Issue:** When clearing the filter input, focus occasionally dropped back to document body if the cleared search emptied all visible cards.
* **Severity:** Medium (Remediated).
* **Remediation:** Ensured container maintains fallback focus or focuses the search input when filter results change.

---

## Persona B — Screen-Reader User (Auditory Feedback Reliance)

### 1. Hypothetical Context
* **Profile:** A visually impaired citizen or staff member utilizing NVDA (Windows) or VoiceOver (macOS) to interact with the municipal counter display.
* **Goal:** Understand counter status, track session duration, compose a custom citizen inquiry, and hear incoming staff updates via synthesized speech output.

### 2. Task Scenario
* **Scenario ID:** `SIM-PER-B-01`
* **Task Description:** Navigate using standard screen-reader virtual cursor commands (`H` for headings, `B` for buttons), locate the session timer, enter a custom inquiry in the text field, and listen for the confirmation live-region update.

### 3. Expected Accessible Behaviour
* Headings follow a strict hierarchical structure (`h1` -> `h2` -> `h3`) with no missing levels.
* All icon-only buttons (timer reset, font size, sound toggle) possess explicit programmatic names (`aria-label`).
* Dynamic status updates (e.g., message sent, timer paused, sign added to tray) are announced through an `aria-live="polite"` region without interrupting ongoing reading.
* Decorative SVGs are hidden from the accessibility tree via `aria-hidden="true"`.

### 4. Test Steps (Simulated Walkthrough)
1. Initialize virtual cursor at page top.
2. Verify `<h1>` announcement: "SANKET Counter Access - Public Service Counter".
3. Jump by headings (`H`) through navigation and main interactive panels.
4. Locate the custom message form (`F` for form fields).
5. Type custom message: "Need information on senior citizen certificate".
6. Move focus to "Submit" button and activate (`Space`).
7. Listen for screen-reader announcement from the live region confirming the message was logged.

### 5. Pass/Fail Criteria
* **PASS Criteria:** All headings, buttons, and form inputs announce accurate roles and names; custom message submission produces an audible live announcement; no unlabelled elements reported.
* **FAIL Criteria:** Unlabelled buttons announced as "button" or "graphic"; live region fails to trigger on message arrival; heading levels skipped (e.g., `h1` directly to `h4`).

### 6. Observations (SIMULATED)
* **Status:** PASS (SIMULATED)
* **Observation:** HTML semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`) are accurately declared. The live region (`aria-live="polite"`) delivers non-disruptive feedback when messages or draft items are added.

### 7. Issue Severity & Remediation
* **Discovered Issue:** Session timer seconds update caused excessive screen-reader chatter if placed inside an `aria-live="assertive"` container.
* **Severity:** High (Remediated).
* **Remediation:** Removed live-region attribute from the continuous seconds counter; status announcements only fire on significant state changes (Session Start, Pause, End).

---

## Persona C — Deaf / Hard-of-Hearing Citizen Using Sign Selection

### 1. Hypothetical Context
* **Profile:** A Deaf citizen whose primary language is Indian Sign Language (ISL), with limited English or vernacular text literacy. Visits the counter for identity certificate verification.
* **Goal:** Use visual sign cards and category icons to construct a concept sequence ("Namaste", "Certificate", "Help"), assemble them into the citizen draft tray, review the visual sequence, and transmit the draft to the counter clerk.

### 2. Task Scenario
* **Scenario ID:** `SIM-PER-C-01`
* **Task Description:** Switch to the "Sign Selector" deck, select the "ISL (Indian Sign Language)" inventory, filter by "Civic Services", select "Certificate" and "Help", inspect the draft tray, and dispatch the draft sequence to staff.

### 3. Expected Accessible Behaviour
* Clear visual distinction between ISL and ASL libraries.
* Sign cards prominently display large typography, high-contrast borders, category badges, and descriptive glosses.
* Honest visual state: clearly indicators stating when a sign visual is an illustrative placeholder vs authentic verified sign video/image.
* The draft tray visibly displays selected signs with individual "Remove" buttons and an overall "Clear Tray" action.
* Dispatched sequence appears immediately in the staff communication stream with clear citizen attribution.
* Zero unexpected camera popups or microphone permission dialogs.

### 4. Test Steps (Simulated Walkthrough)
1. Select "Sign Selector" tab from top navigation.
2. Confirm language selector is set to "ISL - Indian Sign Language".
3. Click/activate category pill "Civic Services".
4. Select sign card "Certificate" -> Card gains selected visual indicator; sign appears in the draft tray at the bottom.
5. Select sign card "Help" -> Sign appears as second item in draft tray.
6. Verify draft tray shows: `[Certificate] [Help]` with counter `Draft: 2 signs`.
7. Click "Send Sign Draft to Staff".
8. Verify active conversation view receives: `"Citizen (ISL Sign Sequence): Certificate -> Help"`.

### 5. Pass/Fail Criteria
* **PASS Criteria:** Sign selection and draft tray manipulation is immediate and error-free; visual feedback is clear without requiring English fluency; zero hardware permission requests.
* **FAIL Criteria:** Draft tray fails to update; sign meaning is ambiguous or misleading; camera or microphone permission request interrupts the citizen.

### 6. Observations (SIMULATED)
* **Status:** PASS (SIMULATED)
* **Observation:** Visual cues and icon associations guide navigation effectively. The draft tray provides immediate visual confirmation of the composed sign message. Hardware permissions remain completely silent due to v1.2 decommissioning and `Permissions-Policy`.

### 7. Issue Severity & Remediation
* **Discovered Issue:** Placeholder cards lacked explicit textual notice that the graphic was a placeholder rather than a verified ISLRTC sign recording.
* **Severity:** Medium (Remediated).
* **Remediation:** Implemented `SignVisual` fallback component with unambiguous badge: "Placeholder Graphic - Linguistic Verification Required".

---

## Summary of Simulated Validation Results

| Persona | Primary Accessibility Focus | Simulated Result | Key Remediation Completed |
|---|---|---|---|
| **Persona A** | Keyboard Navigation & Focus Order | **PASS (SIMULATED)** | Skip link added; high-contrast focus rings; no keyboard traps |
| **Persona B** | Screen-Reader & Semantic Trees | **PASS (SIMULATED)** | ARIA labels on icon buttons; live region chatter silenced on timer |
| **Persona C** | Deaf/HoH Visual Sign Workflow | **PASS (SIMULATED)** | Draft tray linear workflow; honest placeholder labelling; zero mic/cam |

*All results reflect automated and developer walkthrough simulations. Physical trials with participants remain to be conducted per `REAL_USER_VALIDATION_TEMPLATE.md`.*
