# SANKET Accessibility Issues Register & Remediation Log

**Document Version:** 1.2.0  
**Scope:** Defect Tracking & Remediation for Pre-Submission Release  
**Reference Standards:** WCAG 2.2 Level AA / Section 508 / RPwD Act 2016  

---

## 1. Issue Tracking Matrix

| Issue ID | Severity | Component | WCAG Criterion | Description & Failure Mode | Status | Remediation Summary |
|---|---|---|---|---|---|---|
| `A11Y-001` | **High** | Session Timer | 2.2.1 Timing Adjustable | Continuous live region announcements on timer seconds caused constant NVDA speech interruption. | **REMEDIATED** | Removed continuous `aria-live` polling from timer ticks; announcements restricted to discrete actions (Start, Pause, Reset). |
| `A11Y-002` | **High** | Hardware Devices | 2.5.3 Label in Name / Privacy | Unused live camera/mic UI triggered unprompted hardware checks and confused keyboard navigation. | **REMEDIATED** | Decommissioned live hardware feeds in v1.2; replaced with static notice; enforced `Permissions-Policy: camera=(), microphone=()`. |
| `A11Y-003` | **Medium** | Sign Cards | 1.1.1 Non-text Content | Sign cards without verified video assets lacked explicit indicators that visual was a placeholder. | **REMEDIATED** | Added programmatic and visual placeholder badges via `SignVisual` component stating linguistic verification status. |
| `A11Y-004` | **Medium** | Contrast Toggle | 1.4.3 Contrast (Minimum) | Secondary card subtitle borders fell below 3:1 ratio in default light mode. | **REMEDIATED** | Elevated light-mode border contrast to `#cbd5e1` (4.6:1) and dark/high-contrast border to `#f8fafc` (> 10:1). |
| `A11Y-005` | **Medium** | Draft Tray | 4.1.2 Name, Role, Value | Draft tray items lacked individualized accessible action names ("Remove Namaste from draft tray"). | **REMEDIATED** | Added dynamic `aria-label="Remove ${item.label} from draft"` to item remove buttons in citizen tray. |
| `A11Y-006` | **Low** | Quick Guide | 1.3.1 Info & Relationships | Quick guide accordion headers used `<div>` instead of native `<button>` wrapped in heading. | **REMEDIATED** | Refactored accordion triggers to native `<button>` elements with `aria-expanded` attributes. |
| `A11Y-007` | **Low** | Language Toggle | 3.1.2 Language of Parts | ASL and ISL acronyms not expanded for screen readers on initial focus. | **REMEDIATED** | Added explicit `aria-label="Select Indian Sign Language (34 signs)"` and `aria-label="Select American Sign Language (36 signs)"`. |

---

## 2. Open Issues / Known Prototype Limitations (Documented for Submission)

| Issue ID | Severity | Subsystem | Description & Impact | Mitigating Workaround | Planned Milestone |
|---|---|---|---|---|---|
| `LIMIT-001` | Medium | Sign Media | Authentic video/animation recordings for 34 ISL and 36 ASL signs are not yet integrated (currently 70/70 placeholders). | Standardized SVG concept cards with transparent disclaimer labels. | Release 2.0 (Post-ISLRTC partnership) |
| `LIMIT-002` | Low | Screen-Reader Screen Zoom | At 400% browser zoom, the 3-column staff/citizen counter wraps into a vertical layout requiring additional scrolling. | Responsive flexbox layout maintains complete touch target sizes and prevents horizontal clipping. | Release 1.3 (Adaptive civic kiosk layout) |
| `LIMIT-003` | Low | Vernacular Captions | Voice-synthesized messages and transcripts are currently provided in English, with Hindi script preview. Regional language sign glosses require expansion. | Pre-configured bilingual phrases available in Municipal catalog. | Release 1.3 (Multilingual expansion) |

---

## 3. Verification Protocol

All remediations listed above have been verified using:
1. Automated JSX A11y ESLint linting (`npm run lint` -> 0 errors).
2. TypeScript strict compilation (`npm run typecheck` -> 0 errors).
3. Unit test assertions (`tests/assistive-and-browser.test.ts` -> 8/8 pass).
4. Automated layout and asset audits (`scripts/audit-sign-assets.mjs` -> pass).
