# SANKET — Manual QA Checklist

This is a manual verification checklist. It is not a claim that all manual checks have already been executed.

## Core flow

- [ ] Start a counter session.
- [ ] Select a service.
- [ ] Open communication board.
- [ ] Select a quick phrase.
- [ ] Create a custom text response.
- [ ] Open sign selector.
- [ ] Switch ISL/ASL.
- [ ] Search and filter signs.
- [ ] Add signs to draft.
- [ ] Review and confirm draft.
- [ ] Verify conversation stream.
- [ ] End session and verify local activity reset behavior.

## Accessibility

- [ ] Keyboard-only navigation.
- [ ] Visible focus on every interactive control.
- [ ] Skip link reaches main content.
- [ ] 200% and 400% zoom/reflow.
- [ ] Screen reader status announcements.
- [ ] Reduced-motion preference.
- [ ] Large-text mode.
- [ ] High-contrast mode.

## Recognition safety

- [ ] Upload non-JPEG and confirm rejection.
- [ ] Upload oversized JPEG and confirm rejection.
- [ ] Confirm consent is required.
- [ ] Confirm no camera/microphone permission prompt occurs.
- [ ] Confirm unconfigured endpoint shows a recoverable error.
- [ ] Confirm low-confidence results are not auto-sent.
- [ ] Confirm recognition results never enter the draft automatically.

## Evidence boundary

Real Deaf/HoH participant testing is intentionally skipped. Do not mark it complete without actual participant evidence.
