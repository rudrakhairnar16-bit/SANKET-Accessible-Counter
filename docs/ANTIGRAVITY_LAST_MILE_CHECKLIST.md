# Antigravity Last-Mile Verification — SANKET v1.2.2

**Purpose:** Finish verification before submission. Do not invent passing results, sign-language assets, dataset licences, or user-study evidence.

## A. Run the actual app gates first

Run from the repository root in a network-enabled environment with Node.js/npm installed. Save the complete terminal output to `submission-evidence/` (create that folder if needed) and record the date, Node version, npm version, and OS.

### Windows PowerShell

```powershell
node --version
npm --version
npm ci --no-audit --no-fund
if ($LASTEXITCODE -ne 0) { throw "npm ci failed; stop and diagnose the actual error." }
npm run typecheck
if ($LASTEXITCODE -ne 0) { throw "typecheck failed; fix the code and rerun." }
npm run lint
if ($LASTEXITCODE -ne 0) { throw "lint failed; fix the code and rerun." }
npm test
if ($LASTEXITCODE -ne 0) { throw "tests failed; fix the code and rerun." }
npm run build
if ($LASTEXITCODE -ne 0) { throw "build failed; fix the code and rerun." }
npm run audit:release
if ($LASTEXITCODE -ne 0) { throw "release audit failed." }
npm run audit:accessibility
if ($LASTEXITCODE -ne 0) { throw "accessibility audit failed." }
npm run audit:assets
if ($LASTEXITCODE -ne 0) { throw "asset audit failed." }
```

If `npm ci` times out, retry once on a stable network and inspect the real npm log/cache error. Do not substitute a partial `node_modules` directory or mark dependent checks PASS. If install remains blocked, preserve the logs and report the four runtime gates as **BLOCKED / NOT RUN**, not failed and not passed.

After a successful build, start the app with `npm run start` and smoke-test desktop, tablet, and mobile layouts. Verify sign selection, draft add/remove/clear, staff reply, stop voice, large text, high contrast, session timer, optional still-image consent, rejection of unapproved origins, and no camera/microphone capture. Do not claim manual checks that were not performed.

## B. Sign-language visual assets: source review before download or integration

The current SANKET inventory is **34 ISL municipal concepts and 36 ASL entries**. Do not map alphabet-only handshapes to whole-word civic concepts such as tax, certificate, complaint, or payment. Do not invent visuals or describe generated generic hand icons as authentic signs.

Candidate sources to investigate:

1. **ISL alphabet image dataset (Apache-2.0 reported in its repository):** https://github.com/ayesha-hannure/Indian-Sign-Language-dataset
   - Reported scope: 12,700 images of A–Z only. This may help only if SANKET adds a clearly labelled fingerspelling/alphabet learning feature; it is not a direct asset fix for the 34 municipal concepts.
   - Before download, read the repository's current `LICENSE`, README, provenance and any third-party terms. Record commit/release, download URL, checksum, licence, attribution, and any restrictions. Do not infer that all files are covered by the code licence without checking.

2. **Official ISLRTC / Government of India dictionary resources:** https://divyangjan.depwd.gov.in/islrtc/ and https://islrtc.nic.in/
   - Prefer these for identifying the standardized sign, but do not scrape or redistribute media unless explicit reuse/redistribution permission is confirmed. If permission is unclear, link to the official source rather than bundling the media.

3. **ISL iSign research dataset:** https://huggingface.co/datasets/Exploration-Lab/iSign
   - Dataset card reports CC BY-NC-SA 4.0 and research-only/non-commercial terms. Do not bundle or use for a commercial deployment. Confirm whether the hackathon submission and intended downstream use comply before any use; if uncertain, skip it.

4. **ASL Alphabet on Kaggle:** https://www.kaggle.com/grassknoted/asl-alphabet/data
   - Reported GPL-2.0, alphabet-only. Do not bundle into this release without a compatibility and redistribution review. It is ASL, not ISL, and must never be presented as ISL.

5. **Google Isolated Sign Language Recognition on Kaggle:** https://www.kaggle.com/competitions/asl-signs/data
   - Large landmark/sequence dataset for ASL, subject to competition rules; it is not a drop-in source of sign-card images and is not ISL. Do not download for this deadline unless there is a specific approved technical need.

### Required asset workflow

- Start with metadata/README/licence inspection and estimate download size; do not download huge datasets blindly.
- For any candidate visual, verify the label and language against the exact sign ID. Keep uncertain items out of the production UI.
- Never convert an alphabet class into a word-level municipal sign by assumption.
- Keep source URL, creator, licence, attribution text, checksum, and review status beside every imported asset.
- Add only assets whose reuse rights are clear. If an asset needs expert review, leave it marked `review pending` and do not claim it is verified.
- Run `npm run audit:assets` after any changes and update the asset coverage report honestly.
- Do not claim a model accuracy figure for SANKET unless a reproducible evaluation was actually run on a suitable held-out set and its limitations are documented.

## C. User review and accessibility evidence

- Include a positive review only if it is real and you have permission to quote it. Identify the reviewer category only when known and verified. Feedback from a separate event must not be attributed to the current hackathon or its judges; preserve the original meaning.
- Do not relabel external reviewer feedback as current-hackathon judge feedback or Deaf/Hard-of-Hearing participant testing.
- Real Deaf/HoH participant testing remains **not conducted / intentionally skipped** unless it actually takes place. Do not create simulated participants, quotes, satisfaction scores, or usability findings.
- Clearly separate automated checks, developer smoke tests, external reviewer feedback, and real participant studies.

## D. Submission decision

Submit after all feasible checks are completed and the demo is smoke-tested. If runtime gates remain blocked, disclose that limitation in the submission notes. Do not describe the release as fully tested or certified. Keep the final ZIP and checksum unchanged unless the source changes; after any source change, regenerate the manifest, rerun audits, rebuild the ZIP and checksum, and verify a clean extraction.
