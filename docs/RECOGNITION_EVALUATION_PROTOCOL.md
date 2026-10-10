# Recognition Evaluation Protocol

SANKET must not publish model accuracy borrowed from a model card as if it were SANKET performance. External model claims are references only. For example, public ISL models report their own datasets, classes and validation results, but they are not necessarily aligned with SANKET's 34-sign municipal inventory. citeturn1view1turn5search5

## Required evaluation set
- Separate ISL and ASL runs.
- Every exposed SANKET vocabulary item represented.
- Multiple signers.
- Held-out signer split (no signer overlap between train/reference and test).
- Lighting/background/handedness variation.
- Unknown/out-of-vocabulary samples for abstention testing.

## Metrics
- Accuracy
- Macro precision / recall / F1
- Per-class support and confusion matrix
- Abstention / low-confidence rate
- Held-out-signer accuracy
- Inference latency and memory

## Harness
`node scripts/evaluate-recognition.mjs path/to/predictions.jsonl`

Each JSONL row must contain `expected`, `predicted`, and may contain `signer`, `confidence`, `sampleId`.

## Acceptance rule
No recognition result is automatically committed to a citizen message. Low-confidence predictions remain suggestions and the manual sign selector remains available.
