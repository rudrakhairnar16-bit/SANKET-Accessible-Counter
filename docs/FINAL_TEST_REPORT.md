# SANKET v1.2.2 — Final Test Report

**Date:** 2026-10-10  
**Environment:** Node v24.16.0, Next.js 15.5.27, Windows 11  

This report contains only current release-pass evidence executed and verified in this environment.

| Check | Result | Current evidence |
|---|:---:|---|
| `npm ci` | PASS | Exit code 0; 349 packages installed from lockfile in 16s |
| `npm run typecheck` | PASS | Exit code 0; `tsc --noEmit` passed with 0 errors |
| `npm run lint` | PASS | Exit code 0; `eslint .` passed with 0 errors and 0 warnings |
| `npm test` | PASS | Exit code 0; `vitest run` passed (**15 suites, 95 of 95 tests passed**) |
| `npm run build` | PASS | Exit code 0; `next build` compiled optimized production build |
| `npm run audit:accessibility` | PASS | Exit code 0; 8/8 static checks passed |
| `npm run audit:assets` | PASS | Exit code 0; 34 ISL + 36 ASL entries, zero duplicate IDs/broken local paths |
| `npm run audit:release` | PASS | Exit code 0; **98/98 release files accounted for, 0 unlisted files** |
| Browser smoke test | PASS | Verified interactive rendering, session timer, navigation, drafting, assistance slips |
| JavaScript syntax | PASS | All release `.mjs` files passed cleanly |
| Python syntax | PASS | Recognition service passed compilation check |
| JSON integrity | PASS | Release JSON files parsed successfully |
| Secret hygiene | PASS | No secret environment files included; only `.env.example` |
| Clean extraction | PASS | Release archive extracts and verifies successfully |

## Acceptance boundary

- All automated software quality gates pass with exit code 0.
- Sign language authenticity is explicitly documented as uncertified by automated tooling.
- Real Deaf/HoH participant testing is intentionally skipped for this release cycle.
- External reviewer feedback is from a previous hackathon and not from current judges.
