"use client";

import Image from "next/image";
import { useEffect, useState, type ChangeEvent } from "react";

type RecognitionResponse = {
  error?: string;
  label?: string;
  confidence?: number;
  language?: "ISL" | "ASL";
  note?: string;
};

const MAX_IMAGE_BYTES = 1_400_000;
const MIN_DISPLAY_CONFIDENCE = 0.70;

/**
 * Consent-based upload of a still JPEG to an administrator-configured model endpoint.
 * It deliberately does not open the camera or microphone. Results remain unconfirmed
 * suggestions and are never inserted into the citizen's message draft automatically.
 */
export function StaticImageRecognitionTool({ language }: { language: "ISL" | "ASL" }) {
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("No image selected. Recognition is optional and off until you upload and consent.");
  const [result, setResult] = useState<RecognitionResponse | null>(null);

  useEffect(() => () => {
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  function clearImage() {
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setImageDataUrl("");
    setPreviewUrl("");
    setConsent(false);
    setResult(null);
    setStatus("Image cleared. No recognition request was made.");
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setResult(null);
    setConsent(false);
    if (!file) return;
    if (file.type !== "image/jpeg") {
      clearImage();
      setStatus("Please choose a JPEG image. Other formats are not accepted by this prototype.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      clearImage();
      setStatus("Image is too large. Choose a JPEG under 1.4 MB.");
      return;
    }
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("Could not read this image file."));
        reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Could not read this image file."));
        reader.readAsDataURL(file);
      });
      if (!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(dataUrl)) throw new Error("The file did not produce a valid JPEG data URL.");
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
      setImageDataUrl(dataUrl);
      setPreviewUrl(URL.createObjectURL(file));
      setStatus("Image loaded locally. Check consent before sending this single image to the configured service.");
    } catch (error) {
      clearImage();
      setStatus(error instanceof Error ? error.message : "Could not read this image.");
    }
  }

  async function analyzeImage() {
    if (!imageDataUrl) {
      setStatus("Choose a JPEG image first.");
      return;
    }
    if (!consent) {
      setStatus("Please confirm consent before sending this image to the configured recognition service.");
      return;
    }
    setBusy(true);
    setResult(null);
    setStatus("Sending the selected still image to the configured service…");
    try {
      const response = await fetch("/api/recognition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageDataUrl, language }),
      });
      const payload = await response.json() as RecognitionResponse;
      if (!response.ok) throw new Error(payload.error || `Recognition service returned HTTP ${response.status}.`);
      if (typeof payload.label !== "string" || !payload.label.trim() || typeof payload.confidence !== "number" || !Number.isFinite(payload.confidence) || payload.confidence < 0 || payload.confidence > 1) {
        throw new Error("Recognition provider returned an invalid result. No suggestion was accepted.");
      }
      if (payload.language && payload.language !== language) throw new Error("Provider returned a different language profile. No suggestion was accepted.");
      setResult(payload);
      setStatus(payload.confidence < MIN_DISPLAY_CONFIDENCE
        ? "Low-confidence result received. Treat it as uncertain and use the manual selector unless the signer confirms it."
        : "Unconfirmed suggestion received. Verify meaning with the signer; this is not a certified translation.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Recognition failed. Use the manual sign selector instead.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="assistive-tool-card" aria-labelledby="static-recognition-title">
      <div className="assistive-tool-heading">
        <div><span className="eyebrow muted">OPTIONAL · STILL IMAGE ONLY</span><h3 id="static-recognition-title">AI sign suggestion (experimental)</h3></div>
        <span className="tool-status unavailable">Model endpoint required</span>
      </div>
      <p>Upload a JPEG still image for a configured {language} model to suggest a label. This does not use your camera or microphone. Images stay in this browser until you explicitly consent and select Analyze image.</p>
      <label className="field-label" htmlFor="recognition-image">SELECT JPEG IMAGE (MAX 1.4 MB)</label>
      <input id="recognition-image" type="file" accept="image/jpeg,.jpg,.jpeg" onChange={handleFileChange} disabled={busy} />
      {previewUrl && <div className="static-image-preview"><Image src={previewUrl} alt="Selected image preview for optional sign suggestion" width={320} height={240} unoptimized /></div>}
      <label className="consent-row"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} disabled={!imageDataUrl || busy} /> I consent to sending this one image to the administrator-configured recognition service for {language} analysis.</label>
      <div className="assistive-tool-controls">
        <button type="button" className="primary-button" onClick={analyzeImage} disabled={!imageDataUrl || !consent || busy}>{busy ? "Analyzing…" : "Analyze image"}</button>
        <button type="button" className="secondary-button" onClick={clearImage} disabled={!imageDataUrl || busy}>Clear image</button>
      </div>
      <p className="assistive-status" role="status" aria-live="polite">{status}</p>
      {result && <div className="recognition-result" role="region" aria-label="Unconfirmed AI sign suggestion">
        <strong>{result.confidence! < MIN_DISPLAY_CONFIDENCE ? "Low-confidence suggestion" : "Unconfirmed suggestion"}: {result.label}</strong>
        <span>Provider confidence: {(result.confidence! * 100).toFixed(1)}% · {language}</span>
        {result.note && <p>{result.note}</p>}
        <p>Do not rely on this result for legal, medical, financial, emergency, or other high-impact decisions. It is not added to the message draft.</p>
      </div>}
    </section>
  );
}
