> **Historical evidence notice (2026-10-08):** Any PASS/verification results in this document refer to an earlier project state/environment. They are not current v1.2.2 runtime evidence. See `docs/FINAL_RELEASE_REPORT.md` for the current verification boundary.

# SANKET Counter Access — Initial Project Audit Report

**Date of Audit:** October 3, 2026  
**Auditor:** SANKET Engineering & QA Team  
**Workspace:** `d:/Desktop/SANKET-Counter-Access-Checked/SANKET-Counter-Access`  
**Reference Repository:** `https://github.com/rudrakhairnar16-bit/sanket`

---

## 1. Project Identity and Repository Relationship

### 1.1 Upstream Relationship
The original repository `rudrakhairnar16-bit/sanket` represents a broad prototype exploring sign language recognition experiments (MediaPipe Hands, kNN classifier prototypes, raw dataset manifest pointers to INCLUDE, OpenHands, and ISLRTC). 

In that repository:
- `src/data/signs/municipal-signs.ts` specified **34 municipal signs** specifically scoped for civic and government service counter interactions.
- `src/data/signs/sign-assets.ts` pointed to `/signs/*` SVGs with `reviewStatus: "placeholder"` and documented that raw video archives from external datasets were not bundled in the client repository.
- `datasets/manifest.json` documented metadata for academic datasets (INCLUDE, OpenHands, RealSign, ISLRTC) but explicitly noted that heavy binary archives (>10 GB) were stored externally.

The current project, **SANKET Counter Access**, continues and focuses the original work specifically into an accessible, deterministic, reliable, and privacy-first counter terminal for public-service desks. Rather than replacing the codebase or fabricating recognition claims, SANKET Counter Access:
1. Directly integrates the authentic 34 ISL municipal signs defined in `municipal-signs.ts`.
2. Integrates an isolated 36-sign American Sign Language (ASL) profile (26 single-handed fingerspelling letters A-Z + 10 counter basics).
3. Provides a prominent "Choose Sign Language" selector and interactive Visual Sign Language Selector.
4. Provides two-way counter communication (Citizen sign draft + Citizen text + Staff reply + Text-to-Speech + confirmation before display).
5. Truthfully isolates and discloses camera recognition and live interpreter boundaries.

---

## 2. Inventory and Asset Audit

### 2.1 Indian Sign Language (ISL) Inventory
- **Discovered Count:** Exactly **34 ISL-labelled municipal entries**; expert validation is pending.
- **Source:** `rudrakhairnar16-bit/sanket/src/data/signs/municipal-signs.ts`
- **Domain Categories (6):**
  1. **Greetings (4 signs):** `isl-namaste`, `isl-thank-you`, `isl-sorry`, `isl-please`
  2. **Basic (7 signs):** `isl-yes`, `isl-no`, `isl-wait`, `isl-help`, `isl-understand`, `isl-dont-understand`, `isl-toilet`
  3. **Services (5 signs):** `isl-water`, `isl-tax`, `isl-bill`, `isl-payment`, `isl-bank`
  4. **Documents (5 signs):** `isl-certificate`, `isl-form`, `isl-document`, `isl-name`, `isl-address`
  5. **Civic (10 signs):** `isl-phone`, `isl-number`, `isl-date`, `isl-time`, `isl-office`, `isl-complaint`, `isl-hospital`, `isl-police`, `isl-school`, `isl-emergency`
  6. **Daily Life (3 signs):** `isl-drink`, `isl-eat`, `isl-sick`
- **Visual Assets State:** No raw video or GIF archives were bundled in the repository. Instead of generating fake or unverified hand photos, all 34 signs are rendered with detailed hand configurations, multilingual labels (Hindi, Marathi, Gujarati), and explicit `"Visual demonstration unavailable · Metadata verified"` honest placeholders.

### 2.2 American Sign Language (ASL) Inventory
- **Discovered Count:** **36 ASL signs**.
- **Structure:**
  1. **Fingerspelling Manual Alphabet (26 signs):** Letters `A` through `Z`. All 26 verified as single-handed.
  2. **Counter Basics (10 signs):** `asl-hello`, `asl-yes`, `asl-no`, `asl-please`, `asl-thank-you`, `asl-sorry`, `asl-understand`, `asl-water`, `asl-toilet`, `asl-help`.
  3. **Single-Hand Classification:** 35 signs are single-handed; `asl-help` is explicitly verified as two-handed (dominant fist with thumb upright lifted on flat open palm).
- **Separation:** Kept in a strictly separate dataset (`lib/asl-signs.ts`). ISL and ASL are never merged or cross-substituted.

---

## 3. Recognition System Audit

Sign language recognition systems exist across several distinct technical levels:
1. **Level A: Manual Visual Sign Selection:** Fully implemented, verified, and operational. Users browse authentic signs and select them into a verified draft.
2. **Level B: Static-Sign Camera Classification:** Tested in research prototypes using isolated landmarks. Not connected to a real production model in this counter application.
3. **Level C: Dynamic-Sign Recognition:** Signs requiring movement over time. Not connected in this build.
4. **Level D: Continuous Sign-Language Recognition (CSLR):** Unsegmented sign stream recognition. Not available in current web models.
5. **Level E: Full Sentence-Level Translation:** End-to-end gloss-to-text grammar translation. Not available.

**Operational Status:** SANKET Counter Access transparently marks camera recognition as **NOT INCLUDED / BLOCKED**. No recognition accuracy or model confidence is fabricated or simulated.

---

## 4. Live Human Interpreter Audit

- **Audit Findings:** No live external tele-interpreter service credentials, WebRTC SIP endpoints, or dispatch webhooks are configured in the repository.
- **Implementation Boundary:** SANKET provides an honest, local-only assistance draft slip generator. When a citizen or clerk needs human support, the terminal drafts a local ticket with counter ID, service, assistance type, and priority. The terminal clearly states: `"This record is stored in this browser only. No external transmission occurred."`
- **Status:** **LOCAL DRAFT ONLY / EXTERNAL SERVICE NOT CONFIGURED**.

---

## 5. Security, Privacy, and Offline Capabilities

1. **Local-First Architecture:** All messages, sign drafts, and preferences reside strictly within local browser memory / localStorage. No private conversation transcripts are transmitted to any cloud server.
2. **No Secret Leaks:** No API keys, passwords, or personal credentials exist in the codebase.
3. **Offline Operation:** The entire application shell, phrases, sign datasets, search indexing, and draft workflows operate 100% offline via Service Worker (`public/sw.js`). Only browser TTS voice synthesis may optionally use system-installed voices.

---

## 6. Baseline Verification & Test Suite

| Test Suite | Tests Run | Result | Duration |
| :--- | :--- | :--- | :--- |
| `tests/isl-signs.test.ts` | 5 | PASSED | 42ms |
| `tests/asl-signs.test.ts` | 4 | PASSED | 25ms |
| `tests/sign-language.test.ts` | 4 | PASSED | 22ms |
| `tests/phrases.test.ts` | 7 | PASSED | 14ms |
| `tests/counter-session.test.ts` | 5 | PASSED | 11ms |
| `tests/custom-message.test.ts` | 5 | PASSED | 11ms |
| `tests/interpreter-request.test.ts` | 4 | PASSED | 9ms |
| `tests/metrics-feedback.test.ts` | 4 | PASSED | 11ms |
| **Total** | **38** | **ALL PASSED** | **1.51s** |
