# SANKET — Future Architecture & Product Roadmap

**Document Version:** 1.0.0  
**Date:** October 4, 2026  
**Status:** Approved Future Development Plan  
**Scope:** Capabilities reserved for subsequent production pilot phases following the core prototype release.

---

## 1. Overview of Release Boundaries

For the v1.1.2 release, SANKET focuses on delivering a reliable, accessible, and honest **counter-first communication terminal**. To eliminate deceptive simulated states, unexpected device permission prompts, and unreliable generic AI translations, the following features are scheduled for future integration rather than active release:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CURRENT RELEASE (v1.1.2)                        │
│  ✓ Citizen Sign Selection (34 ISL / 36 ASL) with Transparent Placeholders │
│  ✓ Structured Communication Draft Tray & Explicit Confirmation         │
│  ✓ Staff Response Quick-Phrases & Custom Text Input                     │
│  ✓ Live Dual-Party Counter Conversation Display                        │
│  ✓ Active Counter Session Stopwatch & Local Duration Metrics           │
│  ✓ High-Contrast, Large-Text & Reduced-Motion Accessibility Modes       │
│  ✓ Complete Offline Shell via Service Worker                            │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ Future Phases
┌────────────────────────────────────────────────────────────────────────┐
│                        FUTURE ROADMAP PHASES                           │
│  Phase 1: Authentic Visual Asset Bundling with ISLRTC Partnership     │
│  Phase 2: Video Remote Interpreting (VRI) WebRTC Human Bridge          │
│  Phase 3: Machine-Learning Continuous Sign Language Recognition (CSLR) │
│  Phase 4: Multi-Lingual On-Premise Speech-to-Text (STT)               │
│  Phase 5: Multi-Dialect Regional ISL Civic Vocabulary Expansion        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Roadmap Milestone Details

### Milestone 1: Official ISLRTC Visual Asset Integration
- **Objective:** Replace placeholder cards with authentic, certified video demonstrations.
- **Action Items:**
  1. Formalize institutional partnership / MOU with the Indian Sign Language Research and Training Centre (ISLRTC), Department of Empowerment of Persons with Disabilities, Ministry of Social Justice and Empowerment, Government of India.
  2. Acquire redistribution rights for standardized dictionary clips covering the 34 municipal concepts.
  3. Encode video loops into lightweight WebM/MP4 formats with reduced-motion pause controls and offline caching.

---

### Milestone 2: Live Video Remote Interpreting (VRI) Bridge
- **Objective:** Connect citizen and municipal staff to certified on-demand human sign language interpreters when complex legal or technical discussions exceed pre-configured counter phrases.
- **Technical Architecture:**
  - Secure WebRTC signaling server with end-to-end encryption.
  - Enterprise SIP gateway integration with recognized sign language interpretation services.
  - Queue dispatch protocol with counter number, service type, and citizen-selected language (ISL/ASL).
  - Explicit connection state indicators: *Request Queued*, *Interpreter Assigned*, *Video Session Active*, *Session Terminated*. Zero false "connected" states.

---

### Milestone 3: Real-Time Continuous Sign Recognition (CSLR)
- **Objective:** Camera-based continuous translation of signed communication into candidate text suggestions.
- **Technical Architecture:**
  - Client-side holistic landmark extraction (hands, face, pose) using WebAssembly hardware acceleration to maintain privacy (zero raw video upload).
  - Spatial-Temporal Graph Convolutional Network (ST-GCN) or Transformer model trained on ISLRTC and civic domain datasets.
  - Integration of non-manual markers (facial expressions, head tilt, mouthing).
  - Strict human-in-the-loop review: suggestions remain unconfirmed until the citizen explicitly approves them into the draft tray.

---

### Milestone 4: Multi-Lingual Speech-to-Text (STT) for Civic Counters
- **Objective:** Acoustic speech recognition allowing counter staff to speak naturally in regional Indian languages (Hindi, Marathi, Gujarati, Tamil, etc.) with real-time text transcription on the citizen's display.
- **Technical Architecture:**
  - Evaluation of on-device Whisper (WASM/WebGPU) or on-premise civic server speech engines to guarantee voice data privacy without sending citizen conversations to third-party public cloud endpoints.
  - Acoustic noise suppression calibrated for noisy municipal office environments.
  - Transcription preview with staff correction before dispatch.

---

### Milestone 5: Field Pilots & Deaf Community Co-Design
- **Objective:** Validate usability, accessibility, and dignity of counter interactions directly with deaf citizens and municipal clerks.
- **Protocol:**
  - Establish participatory design sessions with local deaf associations.
  - Collect structured feedback on signing speed, clarity of visual aids, and counter transaction times.
  - Iterate based on real civic service encounters.
