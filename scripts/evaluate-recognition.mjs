#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/evaluate-recognition.mjs <predictions.jsonl>");
  process.exit(2);
}
const rows = fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean).map((line, i) => {
  try { return JSON.parse(line); } catch { throw new Error(`Invalid JSON on line ${i + 1}`); }
});
if (!rows.length) throw new Error("No evaluation rows found.");
const labels = [...new Set(rows.flatMap(r => [r.expected, r.predicted]).filter(v => typeof v === "string"))].sort();
const matrix = Object.fromEntries(labels.map(a => [a, Object.fromEntries(labels.map(b => [b, 0]))]));
let correct = 0;
for (const r of rows) {
  if (typeof r.expected !== "string" || typeof r.predicted !== "string") throw new Error("Each row needs expected and predicted labels.");
  matrix[r.expected][r.predicted]++;
  if (r.expected === r.predicted) correct++;
}
const perClass = {};
for (const label of labels) {
  const tp = matrix[label][label];
  const actual = Object.values(matrix[label]).reduce((a,b)=>a+b,0);
  const predicted = labels.reduce((a,l)=>a+matrix[l][label],0);
  const precision = predicted ? tp/predicted : 0;
  const recall = actual ? tp/actual : 0;
  const f1 = precision+recall ? 2*precision*recall/(precision+recall) : 0;
  perClass[label] = {support: actual, precision, recall, f1};
}
const macro = key => labels.length ? labels.reduce((a,l)=>a+perClass[l][key],0)/labels.length : 0;
const signers = [...new Set(rows.map(r=>r.signer).filter(Boolean))];
const unseenSignerRows = signers.length > 1 ? rows : [];
const report = {
  samples: rows.length,
  classes: labels.length,
  accuracy: correct / rows.length,
  macroPrecision: macro("precision"),
  macroRecall: macro("recall"),
  macroF1: macro("f1"),
  signers: signers.length,
  confusionMatrix: matrix,
  perClass,
  protocolNotes: [
    "Do not treat dataset-split accuracy as real-world signer generalization.",
    "For SANKET release acceptance, report a held-out signer split separately.",
    "Evaluate each ISL/ASL vocabulary item actually exposed by the UI; unknown classes must be represented.",
    "Low-confidence and abstain/error cases must be counted, not silently discarded."
  ],
  heldOutSignerRowsAvailable: unseenSignerRows.length > 0
};
console.log(JSON.stringify(report, null, 2));
