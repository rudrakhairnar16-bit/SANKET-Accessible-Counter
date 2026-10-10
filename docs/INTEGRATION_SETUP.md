# Optional Provider Integration Setup

SANKET works without external providers. These connectors fail clearly when unconfigured and never fabricate a prediction or interpreter connection.

## On-device generic hand-gesture model (new)

The camera tool now offers an on-device generic gesture demo backed by Google's pretrained MediaPipe Gesture Recognizer. It can label a limited built-in set such as `Open_Palm`, `Closed_Fist`, `Pointing_Up`, `Thumb_Up`, `Thumb_Down`, `Victory`, and `ILoveYou`. It is **not an ISL or ASL sign-language recognizer**, and these labels must never be treated as sign meanings or inserted into a citizen message.

The MediaPipe JavaScript runtime/WASM and `.task` model are loaded from their configured public CDN/model URLs at runtime, so an internet connection is needed to load them. Once running, camera frames for this mode are processed in the browser; SANKET does not upload those frames to its own server. The generic mode may still download code/model files from third-party hosts. For production or offline deployment, review the upstream licence and security, pin/host approved artifacts locally, verify integrity, and test offline behavior. No runtime model binary is bundled in this ZIP.

For real ISL/ASL recognition, continue to use the separate `ISL/ASL model endpoint` mode only with a model trained/evaluated for the selected language and the intended sign vocabulary. The existing `/api/recognition` endpoint remains a provider connector; the generic MediaPipe model is not a substitute for that model.

Official implementation references:
- MediaPipe Gesture Recognizer for Web: https://developers.google.com/edge/mediapipe/solutions/vision/gesture_recognizer/web_js
- Official MediaPipe model bundle: https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task

## Single-frame recognition endpoint

Set `SANKET_RECOGNITION_ENDPOINT` and optionally `SANKET_RECOGNITION_API_KEY` in `.env.local` on the server. Do not use `NEXT_PUBLIC_` for secrets. The endpoint receives a JSON POST with `image` (JPEG data URL), `task: single_frame_sign_suggestion`, and `language` (`ISL` or `ASL`). It must respond with `{ "label": "...", "confidence": 0.0, "language": "ISL", "note": "..." }`; confidence must be between 0 and 1.

The camera is off until the user grants permission. A still frame is sent only after the user checks the consent box and presses Analyze frame. Configure only a provider that has been reviewed for privacy, retention, security, location of processing, and model suitability. A single-frame suggestion is not dynamic sign recognition, continuous sign-language recognition, or sentence translation.

## Interpreter request dispatch endpoint

Set `SANKET_INTERPRETER_REQUEST_ENDPOINT` and optionally `SANKET_INTERPRETER_API_KEY`. The endpoint receives a JSON POST containing a generated request ID, timestamp, counter identifier, requested assistance type, priority, service context, and optional non-sensitive notes. It should return JSON with optional `requestId`, `status`, and `message`.

This webhook only dispatches a request. It does not connect a video call, guarantee interpreter availability, or replace provider-specific authentication, scheduling, consent, status polling, and connection UI. Complete those provider-specific steps before describing the feature as live interpretation.

## Visual sign assets

Place reviewed and licensed assets under `public/signs/isl/` or `public/signs/asl/`, then set each entry's `imagePath` or `animationPath` to a site-relative path such as `/signs/isl/example.mp4`. Use `.mp4`/`.webm` for video or image/GIF paths for still/animated images. Update coverage counts only after verifying the file exists, its language/meaning matches, usage rights are recorded, and a qualified ISL/ASL reviewer has approved the mapping.

## Verify before deployment

Run `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`; then test supported/unsupported browsers, denied permissions, provider timeouts, offline behavior, keyboard navigation, screen-reader flow, and the actual target device.


## Reference resources

- ISLRTC / Government of India Indian Sign Language Dictionary: https://divyangjan.depwd.gov.in/islrtc/
- Indian Sign Language Research and Training Centre: https://islrtc.nic.in/
- Gallaudet University ASL Connect topics: https://gallaudet.edu/asl-connect/topics/

These resources are for lookup and review, not proof of redistribution rights for specific media. ISLRTC's FAQ describes research/technology use conditions that include no profiteering and proper acknowledgement; verify the current terms for every asset before bundling it.
