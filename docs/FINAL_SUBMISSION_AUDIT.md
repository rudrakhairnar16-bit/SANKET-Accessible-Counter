# SANKET v1.2.2 — Final Submission Audit

## Decision

**SUBMISSION READY WITH DOCUMENTED LIMITATIONS**

The release is packaged as a clean, reviewable civic-tech prototype. The source has been hardened, refactored into modular components, and all runtime npm gates—`npm ci`, `npm run typecheck`, `npm run lint`, `npm test` (15 suites, 95/95 tests), and `npm run build`—have been executed and verified in this environment with exit code 0.

## Submission-critical facts

- 34 ISL metadata entries.
- 36 ASL metadata entries.
- 98 tracked manifest files in `BUILD_MANIFEST.json`.
- 15 test suites with 95 tests passing (vitest).
- No claim of expert sign-language validation (automated tooling cannot certify linguistic authenticity).
- No claim of SANKET-specific recognition accuracy.
- No claim of real Deaf/HoH user testing (intentionally skipped for this submission cycle).
- External reviewer feedback originates from an earlier hackathon and must not be attributed to current judges.
- Live camera/microphone capture disabled.
- Optional still-image recognition requires explicit consent.
- Recognition never auto-sends uncertain predictions.
- Production remote recognition endpoints require HTTPS.
- No secret environment files included.
- Final archive excludes dependency, build, and cache artifacts.

## Remaining human/evidence steps

- Perform any desired qualified linguistic review with certified ISL/ASL specialists.
- Perform model evaluation if a valid SANKET dataset/checkpoint is available.
- Submit the project through the competition's submission form after final human review.
