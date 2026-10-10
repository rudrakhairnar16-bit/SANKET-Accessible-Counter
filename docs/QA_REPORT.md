# SANKET v1.2.2 — Current QA Report

**Date:** 2026-10-10  
**QA Lead:** Antigravity Release Engineering Pass

## Important evidence rule

Earlier project reports contained historical claims from prior environments. This report records only checks actually executed against the current v1.2.2 source package during this release pass.

| Check | Current result | Evidence |
|---|:---:|---|
| Dependency installation | PASS | `npm ci --no-audit --no-fund` exit 0 (349 packages in 16s) |
| TypeScript typecheck | PASS | `npm run typecheck` (`tsc --noEmit`) exit 0 (0 errors) |
| ESLint | PASS | `npm run lint` (`eslint .`) exit 0 (0 warnings/errors) |
| Vitest automated tests | PASS | `npm test` (`vitest run`) exit 0 (**15 test files passed, 95 of 95 tests passed**) |
| Next.js production build | PASS | `npm run build` (`next build`) exit 0 (compiled in 2.5s) |
| Production HTTP server smoke test | PASS | `npx next start -p 3000` + `Invoke-WebRequest` returned HTTP 200 OK |
| Browser smoke test | PASS | Playwright/browser subagent verified UI navigation, sign drafting, assistance slip |
| Accessibility static audit | PASS | `npm run audit:accessibility` exit 0 (8/8 checks passed) |
| Sign asset audit | PASS | `npm run audit:assets` exit 0 (34 ISL + 36 ASL entries; 0 duplicates; 0 broken references) |
| Release audit | PASS | `npm run audit:release` exit 0 (**98/98 files accounted for; 0 unlisted**) |
| JavaScript syntax check | PASS | All release `.mjs` scripts executed cleanly with Node.js |
| Secret hygiene | PASS | Zero `.env` secret files in release source; only `.env.example` present |
| Real screen-reader / AT device testing | NOT TESTED | Code-level accessibility verified; physical AT devices not tested |
| Real Deaf/HoH participant testing | INTENTIONALLY SKIPPED | Explicit project decision; out of scope |

## Verified Bug Fixes in Current Pass

1. **`app/api/recognition/route.ts`:** Fixed `sameOrigin` resolution to safely handle `Request` objects where `request.nextUrl` is undefined, preventing unhandled `TypeError` exceptions.
2. **`tests/visual-assets.test.ts`:** Updated disk asset check to distinguish local disk assets from remote licensed reference URLs, and added explicit URL format validation for remote visual paths.
3. **`scripts/audit-accessibility.mjs`:** Fixed cross-platform root path calculation (`fileURLToPath`) to prevent invalid Windows drive paths in `fs.readdirSync`.
4. **`scripts/audit-release.mjs`:** Added `release-evidence` to directory ignore set to prevent evidence logs from failing the manifest check.
5. **Architectural Modularization:** Refactored monolithic 1,772-line `app/page.tsx` into 6 single-responsibility components and 3 modal dialogs.
6. **Unicode Fixes:** Eliminated all mojibake encoding corruption across UI strings and labels.
