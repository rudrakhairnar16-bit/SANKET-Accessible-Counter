# SANKET Counter Access — Security and Privacy Review

**Review Date:** October 4, 2026  
**Classification:** Prototype security/privacy design review; NOT a penetration test or legal compliance certification  
**Scope:** Client-Side Next.js Application, Browser Storage, Service Worker, Provider Adapters, Sign Datasets

---

## 1. Privacy Architecture & Principles

SANKET Counter Access is designed under a strict **Local-First, Privacy-Preserving** architecture:

1. **Local-first unless an optional provider is configured:**
   - The app does not include telemetry or advertising integration in this codebase.
   - The browser makes same-origin calls to the app's optional recognition and interpreter-dispatch API routes when those features are explicitly used. If a server-side endpoint is configured, those routes send the consented still frame or minimal dispatch request to that endpoint.
   - Browser speech recognition may be processed by the browser vendor. Do not claim all data always remains local.
2. **Zero Conversation Logging:**
   - Selected signs, phrases, and custom messages are strictly ephemeral.
   - When a counter session ends, the custom message, sign draft, and display board are cleared. No conversational transcripts or audio recordings are saved to disk or transmitted externally.
3. **Optional device permissions:**
   - Browsing and manual sign selection do not require camera or microphone access.
   - Speech-to-text requests microphone access only when started; camera preview requests video-only access only when started. Browser permission prompts and device/browser restrictions can affect availability.
4. **Explicit Consent & Review Before Display:**
   - Sign selections accumulate in a private draft tray. The application enforces explicit user confirmation via an accessible modal before any message is presented on the public counter screen.
5. **Non-Identifying Interaction Metrics:**
   - Only aggregate counters (`sessions`, `phrases`, `signSelections`, `interpreterRequests`, `feedback`, `understood`, `totalDurationSeconds`) are stored in `localStorage`.
   - No names, citizen IDs, IP addresses, or location data are gathered.
   - Users and administrators can reset all local activity records at any time using the "Reset local activity data" button.

---

## 2. Security Assessment Findings

| Security Area | Risk Assessment | Mitigations & Implemented Safeguards |
| :--- | :--- | :--- |
| **Secret Management** | **Not independently audited** | No API keys, credentials, private tokens, or connection strings are stored or committed in the repository. Safe `.env.example` template provided. |
| **Cross-Site Scripting (XSS)** | **Design mitigation; testing pending** | React JSX automatic escaping sanitizes user-entered custom messages and phrase titles before DOM insertion. No `dangerouslySetInnerHTML` is used. |
| **Client-Side Storage Tampering** | **Design mitigation; testing pending** | `localStorage` access is wrapped in `try/catch` blocks to prevent application crashes in sandboxed or restricted browsing modes. |
| **Content Security & Framing** | **Limited mitigation** | Next.js configuration sets `poweredByHeader: false` to avoid leaking framework version metadata. |
| **Service Worker Caching** | **Implementation present; test pending** | `sw.js` caches only static application code (`/`, `manifest.webmanifest`, `/_next/static/*`). Dynamic or sensitive personal records are never cached. |
| **Dependency Vulnerabilities** | **Medium (Dev Tooling)** | `npm audit` flagged dev-tool vulnerabilities in dev dependencies (`@vitest/mocker`, `braces`, `postcss`). These affect dev/build tools, not production runtime logic. |

---

## 3. Dependency Vulnerability Analysis & Production Recommendations

`npm audit` identified:
- `braces` / `micromatch` via `eslint-config-next`: Stack-exhaustion denial of service during dev linting.
- `@vitest/mocker` via `vitest`: Path traversal vulnerability in dev test mocking.
- `postcss` via `next`: CSS comment source map disclosure during build compilation.

**Recommendation:**  
Do not run `npm audit fix --force` blindly, as it would force breaking major version changes (e.g. downgrading to Next 14 or upgrading to unreleased Next 16) which break React 19 compatibility. In production deployment, maintain current build dependencies and update when official patch releases for Next 15.3+ / Vitest 3.2+ become available.

---

## 4. Operational Requirements for Future Backend Integration

If a future version introduces a cloud backend, citizen database, or live interpreter dispatch network:
1. **Authentication:** Implement multi-factor authentication (MFA) and Role-Based Access Control (RBAC) for counter operators and staff.
2. **Data in Transit:** Enforce strict HTTPS/TLS 1.3 with HSTS headers.
3. **Citizen Data Minimization:** Restrict collected fields to non-identifying operational tokens (e.g., ticket ID) rather than sensitive national IDs or medical details.
4. **Audit Logs:** Ensure tamper-evident, append-only logging for official government records.


## Optional integrations added in the current upgrade

- Speech-to-text is user-initiated and uses the browser speech-recognition API where available. Browser/vendor audio-processing behavior is outside SANKET's control; the interface discloses this and provides typing as fallback.
- Camera access is video-only and opt-in. Camera frames stay in the browser unless the user checks the consent box and explicitly selects **Analyze frame**. If configured, one JPEG still frame is sent to `SANKET_RECOGNITION_ENDPOINT`; administrators must assess that provider's retention, jurisdiction, security, and contract before enabling it.
- Interpreter dispatch sends only counter identifier, requested assistance, priority, service context, and optional non-sensitive notes to `SANKET_INTERPRETER_REQUEST_ENDPOINT`. Do not include names, case numbers, identity documents, or sensitive personal data.
- API keys are server-side environment variables and must never use a `NEXT_PUBLIC_` prefix.
- A provider acknowledgement does not guarantee a live interpreter or establish a video session. Follow facility procedures until a qualified interpreter is actually connected.


## 5. Follow-up security verification boundary (2026-10-04)

The API routes validate required fields and provider responses, apply request timeouts, and do not expose configured API keys in client code. Recognition requests send a JPEG frame only after the UI consent checkbox and Analyze action. Interpreter dispatch requires explicit provider acknowledgement before returning success.

These controls do not constitute a complete security audit. Before deployment, verify endpoint allow-listing/network egress, rate limiting, request size limits at the hosting layer, CSRF/origin protections appropriate to the deployment, secret handling, provider retention terms, dependency advisories, and actual browser network traffic. Only configure trusted endpoints; environment-provided URLs are privileged configuration. No real citizen personal data should be used in testing.
