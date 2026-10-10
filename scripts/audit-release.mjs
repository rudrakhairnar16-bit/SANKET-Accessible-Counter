import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "BUILD_MANIFEST.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const listed = new Set((manifest.files_included || []).map((entry) => entry.replaceAll("\\", "/")));
const ignoredDirs = new Set(["node_modules", ".next", ".git", "out", "coverage", "dist", "submission-evidence", "release-evidence"]);
const actual = new Set();
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirs.has(entry.name)) continue;
    const absolute = path.join(dir, entry.name);
    const relative = path.relative(root, absolute).replaceAll("\\", "/");
    if (entry.isDirectory()) walk(absolute);
    else if (relative !== "tsconfig.tsbuildinfo") actual.add(relative);
  }
}
walk(root);
const missingFromDisk = [...listed].filter((file) => !actual.has(file));
const unlisted = [...actual].filter((file) => !listed.has(file));
const required = [
  "README.md",
  "BUILD_MANIFEST.json",
  "docs/PRE_SUBMISSION_BASELINE.md",
  "docs/ROADMAP.md",
  "docs/AI_GESTURE_MODEL_EVALUATION.md",
  "docs/SECURITY_RELEASE_AUDIT.md",
  "docs/FINAL_TEST_REPORT.md",
  "docs/RELEASE_MANIFEST.md",
  "docs/SUBMISSION_SUMMARY.md",
  "docs/datasets/ISL_DATASET_AUDIT.md",
  "docs/datasets/ASL_DATASET_AUDIT.md",
  "docs/accessibility/ACCESSIBILITY_TEST_PLAN.md",
  "docs/accessibility/THREE_PERSON_SIMULATED_VALIDATION.md",
  "docs/accessibility/REAL_USER_VALIDATION_TEMPLATE.md",
  "docs/accessibility/ACCESSIBILITY_ISSUES.md",
  "public/data-manifests/isl-assets.json",
  "public/data-manifests/asl-assets.json",
  "docs/REQUIREMENT_TRACEABILITY.md",
  "docs/SECURITY_AND_PRIVACY.md",
  "docs/ISL_VISUAL_ASSET_COVERAGE.md",
  "docs/ASL_VISUAL_ASSET_COVERAGE.md",
  "docs/SIGN_ASSET_REVIEW_REGISTER.csv",
  "scripts/audit-sign-assets.mjs",
  "scripts/audit-release.mjs",
];
const missingRequired = required.filter((file) => !actual.has(file));
const unsafeEnvFiles = [...actual].filter((file) => /^\.env(?:\.|$)/i.test(file) && file !== ".env.example");
const failures = [];
if (missingFromDisk.length) failures.push(`Manifest files missing on disk: ${missingFromDisk.join(", ")}`);
if (unlisted.length) failures.push(`Files not listed in BUILD_MANIFEST.json: ${unlisted.join(", ")}`);
if (missingRequired.length) failures.push(`Required release files missing: ${missingRequired.join(", ")}`);
if (unsafeEnvFiles.length) failures.push(`Potential environment/secret files included: ${unsafeEnvFiles.join(", ")}`);
console.log(`Manifest entries: ${listed.size}`);
console.log(`Files discovered (excluding build/dependency directories): ${actual.size}`);
console.log(`Missing from disk: ${missingFromDisk.length}`);
console.log(`Unlisted files: ${unlisted.length}`);
console.log(`Required release files missing: ${missingRequired.length}`);
console.log(`Potential secret environment files: ${unsafeEnvFiles.length}`);
if (failures.length) {
  for (const failure of failures) console.error(`FAIL: ${failure}`);
  process.exitCode = 1;
} else {
  console.log("PASS: release manifest and required-file checks are consistent.");
}
