# Product and safety notes

## Product goal

Make a public-service counter interaction easier to navigate without requiring camera access or a successful AI prediction. The primary workflow is: choose a service → start an optional local session → show or speak a phrase → confirm understanding → use the office's approved human-support path when needed → optionally record local feedback → end session.

## Non-goals in this prototype

- Translating continuous ISL.
- Predicting a sign from a camera feed.
- Dispatching a real interpreter.
- Storing citizen identity or case records.
- Proving nationwide usability or effectiveness.

## Safety principles

1. Never block access to a service because an AI system cannot recognise a sign.
2. Make uncertainty visible; do not fabricate predictions.
3. For rights, consent, medical, legal, or sensitive topics, encourage an approved qualified interpreter when meaning is unclear.
4. A text board, icon, or speech synthesizer is not itself ISL.
5. Ask people how they prefer to communicate; do not assume a single mode fits everyone.
6. Avoid collecting names, case IDs, or message transcripts in this prototype.
7. Treat local feedback counts as a usability signal, not a scientific outcome.

## Current implementation status

| Capability | Status |
|---|---|
| Responsive counter interface | Implemented in code; manual device testing still required |
| Phrase board and category filters | Implemented |
| Custom text message | Implemented; local only |
| Browser speech synthesis | Implemented with capability fallback |
| Interpreter request status | Local draft only; no dispatch |
| Activity dashboard | Local counters only |
| Text-size and contrast preferences | Implemented |
| Service-worker cache | Basic app-shell cache; offline behavior needs deployment testing |
| Genuine ISL inference | Not included |
| Model accuracy evaluation | Not applicable; no model included |
| Human-participant usability study | Not performed |
| Production security/privacy review | Not performed |

## Suggested recognition evaluation plan for a future version

- Record model version, training data provenance and consent/rights.
- Split data by signer, not merely by clip, to reduce leakage.
- Keep test signers and recordings held out from model development.
- Report per-class precision/recall, macro-F1, confusion matrix, false-acceptance rate, rejection rate, latency and device conditions.
- Test varied lighting, camera angles, signing speeds and backgrounds.
- Include an explicit unknown/uncertain class and correction path.
- Publish the sample size and limitations; do not generalise a small demo to all ISL users.


## Current upgrade constraints

- The sign datasets are metadata entries, not expert-certified linguistic references. Qualified ISL/ASL review is required before deployment.
- There are currently 0 bundled sign images, GIFs, or videos across 70 entries.
- Camera preview is off by default. Only a user-consented still frame is sent to an administrator-configured recognition endpoint; a result is an unconfirmed suggestion, not an authoritative translation.
- Browser speech recognition may process audio through the browser vendor. Always provide typed-text fallback.
- An interpreter webhook acknowledgement is not a live interpreter connection. Staff must follow facility escalation procedures.
