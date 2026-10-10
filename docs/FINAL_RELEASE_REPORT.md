# SANKET v1.2.2 — Final Release Report

**Verification date:** 2026-10-10  
**Release target:** `SANKET-v1.2.2-FINAL-VERIFIED.zip`  
**Checksum file:** `SANKET-v1.2.2-FINAL-VERIFIED.zip.sha256` (recorded upon build)  
**Real Deaf/HoH participant testing:** Intentionally skipped by project direction  

## Executive status

**SUBMISSION READY WITH HONESTLY VERIFIED EVIDENCE & DOCUMENTED BOUNDARIES.**

The source package has been audited, refactored into cohesive modular components, and rigorously verified. All primary software quality and release gates—including dependency installation from lockfile, TypeScript strict typecheck, ESLint, Vitest automated unit/security/adapter/integration tests, Next.js optimized production build, static accessibility audits, sign inventory integrity, release manifest accounting, and browser smoke tests—have been executed and verified in this environment with real exit codes.

## Verified in this release pass

| Area | Status | Evidence |
|---|:---:|---|
| Dependency installation | PASS | `npm ci --no-audit --no-fund` exit 0 (349 packages installed from lockfile in 16s) |
| Source/package audit | PASS | Source tree inspected; package scripts, lockfile, modular component architecture verified |
| TypeScript Typecheck | PASS | `npm run typecheck` (`tsc --noEmit`) exit 0 (zero type errors) |
| ESLint | PASS | `npm run lint` (`eslint .`) exit 0 (zero lint errors) |
| Vitest automated tests | PASS | `npm test` (`vitest run`) exit 0 (**15 test files passed, 95 of 95 tests passed**) |
| Next.js production build | PASS | `npm run build` (`next build`) exit 0 (optimized production build generated in 2.5s) |
| HTTP production server | PASS | `npx next start -p 3000` launched and verified returning HTTP 200 OK |
| Browser Smoke Test | PASS | Verified home page, session timer, navigation, sign drafting, and 3-step assistance slip flow |
| Recognition API hardening | PASS | Safe protocol resolution, origin validation, HTTPS requirement in production, payload limits, timeouts |
| Recognition confidence guard | PASS | UI keeps model output as an unconfirmed suggestion and never auto-inserts it into the draft |
| Camera/microphone permissions | PASS | Live capture decommissioned; Permissions-Policy disables camera/microphone/geolocation |
| Accessibility static audit | PASS | `npm run audit:accessibility` exit 0 (8/8 checks passed) |
| Sign inventory audit | PASS | `npm run audit:assets` exit 0 (34 ISL + 36 ASL metadata entries; 0 duplicate IDs; 0 broken references) |
| Release manifest audit | PASS | `npm run audit:release` exit 0 (**98 manifest files accounted for; 0 unlisted files**) |
| Secret/environment-file scan | PASS | No `.env` secret files included; only `.env.example` |
| Real screen-reader/manual AT validation | NOT CLAIMED | Code-level WCAG 2.1 AA implemented; field testing with specialized AT devices not completed |
| Real Deaf/HoH participant testing | INTENTIONALLY SKIPPED | Explicit project decision; out of scope for this release pass |

## Sign-language evidence boundary

The project exposes 34 ISL-labelled and 36 ASL-labelled metadata entries. The current asset audit does **not** certify linguistic correctness or expert validation.

ASL entries contain traceable remote visual references from Wikimedia Commons (wpclipart Public Domain and CC BY-SA). ISL entries remain metadata/placeholder-only where an authorized redistributable visual has not been established. The UI explicitly discloses that authentic visuals and expert validation are pending.

## Recognition evidence boundary

The project contains a real optional still-image inference adapter, but SANKET-specific recognition accuracy is **not established**. Published external model-card metrics are not presented as SANKET metrics. Recognition is an unconfirmed suggestion workflow with explicit consent, size validation, and a confidence guard.

## External reviewer feedback boundary

Two external reviews documented in `docs/EXTERNAL_REVIEW_FEEDBACK.md` originate from a **different hackathon** and must be understood as previous external reviewer feedback. They are **not** judges of the current hackathon and must never be cited as current judging feedback or formal user study participants.

## Security boundary

The optional recognition endpoint is administrator-configured. Production endpoints must use HTTPS; local HTTP is permitted only for development hosts. Browser requests are restricted to the same origin or explicitly configured allowed origins. Uploaded data is validated as a JPEG data URL and bounded by request/image size limits.

## Final limitation

The only intentionally skipped validation activity is real Deaf/HoH participant testing. Additional expert linguistic validation and SANKET-specific model evaluation remain evidence activities rather than software-only tasks.
