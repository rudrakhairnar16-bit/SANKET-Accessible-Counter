# SANKET v1.2.2 — Feature Status

## Implemented

- Counter-first public-service communication workflow
- Phrase cards and category filtering
- Typed staff/citizen messaging
- ISL/ASL metadata sign selector
- Draft tray and confirmation flow
- Session timer
- Local activity metrics
- Large-text and high-contrast controls
- Browser text-to-speech where supported
- Optional consent-based still-image recognition UI
- Recognition confidence guard
- Recognition API input/output validation
- Offline application shell

## Experimental / requires external service

- Still-image ISL/ASL recognition requires `SANKET_RECOGNITION_ENDPOINT`.
- The bundled Python adapter can load configurable Hugging Face image-classification models, but model suitability for SANKET's civic vocabulary is not certified.
- No automatic sentence-level sign-language translation is provided.

## Not included in this release

- Live camera sign recognition
- Live microphone capture
- Live remote interpreter video
- Certified translation

## Evidence limitations

- 34 ISL and 36 ASL entries are metadata-audited, not linguistically expert-certified.
- SANKET-specific recognition accuracy is not established.
- Real Deaf/HoH participant testing is intentionally skipped.
- Full npm runtime gates are blocked in the current environment because dependency installation timed out.
