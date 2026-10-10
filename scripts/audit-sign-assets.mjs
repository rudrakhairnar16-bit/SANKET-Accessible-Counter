import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const profiles = [
  { language: "ISL", file: "lib/isl-signs.ts", expected: 34 },
  { language: "ASL", file: "lib/asl-signs.ts", expected: 36 },
];

function blocksFrom(source) {
  const start = source.indexOf("= [");
  if (start < 0) throw new Error("Could not locate dataset array");
  const arraySource = source.slice(start);
  const matches = [...arraySource.matchAll(/\{\s*id:\s*"([^"]+)"[\s\S]*?\n\s*\},?/g)];
  return matches.map((match) => ({ id: match[1], source: match[0] }));
}

let failed = false;
const report = [];
for (const profile of profiles) {
  const sourcePath = path.join(root, profile.file);
  if (!fs.existsSync(sourcePath)) throw new Error(`Missing dataset: ${profile.file}`);
  const source = fs.readFileSync(sourcePath, "utf8");
  const entries = blocksFrom(source);
  const seen = new Set();
  let visuals = 0;
  let brokenPaths = 0;
  let expertReviewed = 0;
  const missingVisuals = [];
  const brokenAssets = [];
  for (const entry of entries) {
    if (seen.has(entry.id)) {
      failed = true;
      console.error(`[FAIL] ${profile.language}: duplicate id ${entry.id}`);
    }
    seen.add(entry.id);
    const pathValues = [...entry.source.matchAll(/(?:imagePath|animationPath):\s*(null|"([^"]+)")/g)];
    let hasVisual = false;
    for (const m of pathValues) {
      const asset = m[2];
      if (!asset) continue;
      hasVisual = true;
      const normalized = asset.replace(/^\/+/, "");
      if (/^https?:\/\//i.test(asset)) {
        // Remote licensed reference: existence is verified by its source/provenance record, not local disk.
        continue;
      }
      if (!fs.existsSync(path.join(root, "public", normalized))) {
        brokenPaths += 1;
        brokenAssets.push({ id: entry.id, path: asset });
      }
    }
    if (hasVisual) visuals += 1;
    else missingVisuals.push(entry.id);
    if (/expert-reviewed|reviewed-by-qualified/i.test(entry.source)) expertReviewed += 1;
  }
  if (entries.length !== profile.expected) {
    failed = true;
    console.error(`[FAIL] ${profile.language}: expected ${profile.expected} entries, found ${entries.length}`);
  }
  const result = {
    language: profile.language,
    expectedEntries: profile.expected,
    discoveredEntries: entries.length,
    uniqueIds: seen.size,
    entriesWithAtLeastOneConfiguredVisual: visuals,
    entriesMissingVisuals: missingVisuals.length,
    missingVisualIds: missingVisuals,
    brokenAssetReferences: brokenPaths,
    brokenAssets,
    explicitExpertReviewMarkers: expertReviewed,
    linguisticAuthenticity: "NOT VERIFIED BY THIS SCRIPT",
  };
  report.push(result);
  console.log(`\n${profile.language}: ${entries.length}/${profile.expected} entries; visuals configured for ${visuals}; missing visuals ${missingVisuals.length}; broken references ${brokenPaths}; expert-review markers ${expertReviewed}.`);
}
console.log("\nCoverage audit JSON:");
console.log(JSON.stringify(report, null, 2));
console.log("\nThis script checks metadata and local asset paths. Remote references are not fetched here. It cannot verify sign correctness, licensing, or visual authenticity.");
if (failed || report.some((r) => r.brokenAssetReferences > 0)) process.exitCode = 1;
