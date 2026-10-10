# SANKET — AI Hand-Gesture Model Evaluation Report

**Evaluation Date:** October 4, 2026  
**Auditor:** Computer-Vision Integration & Accessibility Review Team  
**Subject:** Evaluation of MediaPipe Gesture Recognizer and candidate models for SANKET Public-Service Counter Terminal.

---

## 1. Executive Summary & Critical Distinction

> **Crucial Rule:** Generic hand gestures (e.g., thumbs up, open palm, victory sign) are **not equivalent** to sign-language communication.  
> Indian Sign Language (ISL) and American Sign Language (ASL) are rich, complete, natural human languages with sophisticated spatial grammar, two-handed coordination, rapid motion transitions, and essential non-manual facial/head markers.  
> Presenting a generic gesture recognizer as an "AI Sign Language Translator" is scientifically false, ethically misleading, and potentially hazardous in civic counter settings where legal, medical, or financial matters are decided.

For the current release, following the project owner's explicit decision, **all active camera-based recognition has been removed from the default user workflow**. This document records the technical evaluation of MediaPipe and establishes the future technical roadmap for authentic sign recognition.

---

## 2. Model Profile: Google MediaPipe Gesture Recognizer

- **Developer / Provider:** Google Edge AI / MediaPipe Solutions
- **Model Architecture:** Two-stage pipeline:
  1. Hand Palm Detection: BlazePalm single-shot detector finding bounding boxes.
  2. Hand Landmark Model: 21 3D hand keypoints localized from crop.
  3. Gesture Classifier: Lightweight neural network mapping landmark geometry to canned categories.
- **Model Bundle:** `gesture_recognizer.task` (~9.8 MB download).
- **Runtime Environment:** WebAssembly (WASM) + WebGL via `@mediapipe/tasks-vision`.
- **Licence:** Apache 2.0 (code and pre-trained weights).
- **Input Type:** Continuous video stream (`HTMLVideoElement`) or static RGB bitmap (`ImageData` / `ImageBitmap`).

### Supported Canned Gesture Labels (7 categories total):
1. `Closed_Fist` ("Closed fist")
2. `Open_Palm` ("Open palm")
3. `Pointing_Up` ("Pointing up")
4. `Thumb_Down` ("Thumb down")
5. `Thumb_Up` ("Thumb up")
6. `Victory` ("Victory / two fingers")
7. `ILoveYou` ("I-Love-You handshape")
8. `None` (Unrecognized hand configuration)

---

## 3. Evaluation Against SANKET Requirements

| Criterion | MediaPipe Gesture Recognizer | SANKET Counter Requirements | Fit Assessment |
| :--- | :--- | :--- | :--- |
| **ISL Civic Vocabulary Coverage** | 0 of 34 municipal signs | 34 signs (*Namaste*, *Tax*, *Bill*, *Water*, *Certificate*, etc.) | **FATAL MISMATCH (0% Coverage)** |
| **ASL Vocabulary Coverage** | 0 of 26 alphabet letters; 0 of 10 counter basics | 36 signs (A–Z fingerspelling + 10 basics) | **FATAL MISMATCH (0% Coverage)** |
| **Two-Handed Coordination** | Classifies hands independently; no dual-hand joint grammar | Civic signs (*Namaste*, *Form*, *Document*, *Certificate*, *Help*) require coordinated dual-hand tracking | **UNSUPPORTED** |
| **Facial & Non-Manual Markers** | Hand landmarks only (no facial expression or head-nod integration) | Affirmation/negation (*Yes*, *No*, *Sorry*, *Grievance*) rely heavily on non-manual markers | **UNSUPPORTED** |
| **Continuous Sign Recognition (CSLR)** | Isolated static pose snapshots only | Natural citizen signing is continuous with temporal co-articulation | **UNSUPPORTED** |
| **Client Resource Footprint** | ~10 MB model + ~15 MB WASM/JS binary downloaded over network | Terminal must operate reliably offline and on low-spec counter terminals | **HIGH OVERHEAD** |

---

## 4. Why Active Camera Recognition is Removed for Current Release

1. **Safety & Honesty in Public Service:** If a citizen signs *"I want to apply for a water connection certificate"*, a generic gesture model might falsely trigger *"Victory"* or *"Open Palm"*. Transmitting false translations to government counter staff could cause erroneous civic filings, citizen frustration, or discrimination.
2. **Zero False Promises:** Rather than maintaining a simulated or generic camera demo that creates the illusion of automated sign translation, the system truthfully relies on **verified manual sign selection** where the citizen explicitly chooses concepts from reviewed visual cards and confirms the draft before submission.
3. **Privacy by Default:** Civic counters handle private citizen matters (tax assessments, certificates, welfare schemes). Disabling camera streams completely eliminates citizen privacy concerns, accidental facial capture, and device permission prompts.

---

## 5. Recommended Future Architecture for Authentic ISL/ASL Recognition

When machine-learning sign recognition is reintroduced in future phases (see `docs/ROADMAP.md`), the recommended architecture comprises:

1. **Holistic Landmark Extraction:**
   - Extract multi-modal landmarks (MediaPipe Holistic: 33 pose landmarks, 468 face landmarks, 21x2 hand landmarks) without transmitting raw citizen video frames to servers.
2. **Temporal Sequence Classifier (Spatial-Temporal GCN / Transformer):**
   - A dedicated sequence model (e.g., ST-GCN, SignBERT+, or Pose-Transformer) trained on validated ISLRTC municipal corpora and continuous sign datasets (INCLUDE / ISL-CSLTR).
3. **Lexical Disambiguation & Confirmation:**
   - Model predictions must always be presented as **unconfirmed suggestions** requiring citizen tap confirmation before appearing on counter screens.
   - Predictions below a strict confidence threshold (e.g., 0.85) must be discarded.
