# SANKET — Accessible Counter

**Making public service counters more accessible, one conversation at a time.**

SANKET is an accessibility-first prototype for public-service counters serving Deaf and hard-of-hearing citizens. It supports manual sign-concept selection, clear text communication between citizens and staff, staff quick phrases, text-to-speech where supported, session tracking, and accessibility preferences.

> **Honest scope:** This is a prototype, not a certified public-service system. The 34 ISL-labelled and 36 ASL-labelled metadata entries have not been certified by qualified sign-language reviewers, and no authentic licensed sign visuals are bundled (0/70). The optional AI feature sends a user-selected JPEG only after explicit consent to an administrator-configured model endpoint. No recognition model ships with this repository. The app does not claim continuous sign recognition or full-sentence translation.

## What is implemented

- Separate ISL and ASL metadata profiles and language-specific search/filtering.
- Sign selector with transparent visual placeholders, details, draft tray, and explicit confirmation.
- Two-way text communication, staff quick phrases, browser text-to-speech where available, session timer, and local interaction metrics.
- Large-text and high-contrast controls, semantic landmarks, keyboard focus styling, reduced-motion support, and offline shell caching.
- Optional **still-image** recognition connector: choose a JPEG, preview it locally, consent, and explicitly submit it to a configured endpoint. It does not activate the camera or microphone and never auto-inserts model output into a message draft.
- Server-side recognition and interpreter-request adapters with input validation and explicit provider acknowledgement requirements.
- CI workflow to run typecheck, lint, tests, production build, sign-asset audit, and release-manifest audit on GitHub.

## Current limitations

| Area | Status |
|---|---|
| Manual communication prototype | Implemented; requires human accessibility review |
| Sign-language metadata | 34 ISL + 36 ASL entries; linguistic validation pending |
| Authentic sign visuals | 0/70 bundled; source/licence/reviewer register pending |
| AI recognition UI/connector | Implemented for consent-based still-image upload |
| AI recognition model | Not bundled; compatible approved ISL/ASL endpoint required |
| Continuous signing / sentence translation | Not implemented |
| Live video interpreter | Not connected; local request workflow only |
| Real Deaf/HoH user testing | Not completed |
| Current workspace build/test verification | See `docs/PHASE_1_TO_3_STATUS.md`; rerun locally or use GitHub Actions |

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

Before packaging or submitting, run the full quality gates:

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run audit:assets
npm run audit:release
```

## Optional recognition provider

Copy `.env.example` to `.env.local` and configure `SANKET_RECOGNITION_ENDPOINT` only for an approved model service that implements the documented contract. Keep any key server-side in `SANKET_RECOGNITION_API_KEY`; never use a `NEXT_PUBLIC_` prefix. With no endpoint configured, the API returns a clear `503` and does not fabricate a result.

The UI only sends a still image after a user explicitly checks the consent box and clicks **Analyze image**. Results are unconfirmed suggestions and are never added to the citizen's message draft automatically. Do not use them as the sole basis for legal, medical, financial, emergency, or other high-impact decisions.

## Accessibility and sign review

- Read `docs/ACCESSIBILITY_REPORT.md`, `docs/accessibility/ACCESSIBILITY_TEST_PLAN.md`, and `docs/accessibility/REAL_USER_VALIDATION_TEMPLATE.md`.
- Read `docs/ISL_VISUAL_ASSET_COVERAGE.md` and `docs/ASL_VISUAL_ASSET_COVERAGE.md`.
- Record source URL, licence, attribution, reviewer, review date, and approval status in `docs/SIGN_ASSET_REVIEW_REGISTER.csv` for every asset.
- Automated checks do not certify sign-language accuracy, accessibility conformance, or real-world usability.

## Security and privacy

Read `docs/SECURITY_AND_PRIVACY.md` and `docs/PRODUCT_AND_SAFETY.md`. The application disables camera, microphone, and geolocation permissions by policy. The still-image upload feature uses a user-selected file and an explicit per-request consent step.

## Roadmap

See `docs/ROADMAP.md` and the current implementation audit in `docs/PHASE_1_TO_3_STATUS.md`.

## Development and feedback disclosures

- `docs/AI_ASSISTED_DEVELOPMENT_DISCLOSURE.md` inventories the main code areas and explains how to describe AI-assisted/rapid prototyping without overstating code provenance or verification.
- `docs/EXTERNAL_REVIEW_FEEDBACK.md` records informal feedback reported from two reviewers in a separate earlier context. It is not attributed to the current hackathon and is not user-study evidence.
- `docs/ANTIGRAVITY_LAST_MILE_CHECKLIST.md` contains the remaining runtime, dataset, and submission checks.
