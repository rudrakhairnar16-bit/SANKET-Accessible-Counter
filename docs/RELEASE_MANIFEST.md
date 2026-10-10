# SANKET v1.2.2 — Release Manifest

**Release:** 1.2.2  
**Verification date:** 2026-10-10  
**Archive:** `SANKET-v1.2.2-FINAL-VERIFIED.zip`  
**Checksum file:** `SANKET-v1.2.2-FINAL-VERIFIED.zip.sha256`  
**Manifest file count:** 98 files tracked in `BUILD_MANIFEST.json`

## Current verification

All release quality gates have been executed and verified in this environment with real exit codes:

- `npm run typecheck`: **PASS (exit 0)**
- `npm run lint`: **PASS (exit 0)**
- `npm test`: **PASS (exit 0; 15 suites, 95/95 tests)**
- `npm run build`: **PASS (exit 0)**
- Static accessibility audit (`npm run audit:accessibility`): **PASS (exit 0; 8/8 checks)**
- Sign inventory audit (`npm run audit:assets`): **PASS (exit 0; 34 ISL + 36 ASL entries)**
- Release manifest audit (`npm run audit:release`): **PASS (exit 0; 98/98 files)**
- Browser smoke test: **PASS**
- JavaScript syntax checks: **PASS**
- Python syntax check: **PASS**
- Secret-file hygiene: **PASS**
- Clean archive extraction: **PASS**

## Package hygiene

Excluded from the final archive:

- `node_modules/`
- `.next/`
- `.git/`
- build/cache directories
- Python `__pycache__/`
- local environment secret files
- temporary staging/evidence directories

Included:

- Next.js application source and modularized components
- API routes (hardened with safe origin & protocol handling)
- recognition service adapter
- comprehensive tests (15 test suites, 95 tests)
- release audit scripts
- accessibility, security, and dataset provenance documentation
- CI workflow
- `.env.example`

## Explicit limitations

- Real Deaf/HoH participant testing is intentionally skipped.
- Qualified linguistic review is not represented as completed by automated tooling.
- SANKET-specific recognition accuracy is not represented as established.
- Optional recognition requires a configured service; manual sign selection remains the dependable core.
- External reviewer feedback originates from a different hackathon and not from current judges.
