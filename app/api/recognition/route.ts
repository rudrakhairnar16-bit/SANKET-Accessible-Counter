import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const allowedOrigins = (process.env.SANKET_ALLOWED_ORIGINS || "").split(",").map((v: string) => v.trim()).filter(Boolean);
  const requestUrl = request.nextUrl ?? (request.url ? new URL(request.url) : null);
  const sameOrigin = origin && requestUrl ? origin === `${requestUrl.protocol}//${requestUrl.host}` : false;
  if (origin && !allowedOrigins.includes(origin) && !sameOrigin) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }
  const endpoint = process.env.SANKET_RECOGNITION_ENDPOINT;
  if (!endpoint) {
    return NextResponse.json({ error: "No recognition model is configured. Set SANKET_RECOGNITION_ENDPOINT to an approved compatible model service; no prediction was made." }, { status: 503 });
  }
  let endpointUrl: URL;
  try {
    endpointUrl = new URL(endpoint);
    const isLocalDevelopmentEndpoint = process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1", "::1"].includes(endpointUrl.hostname);
    if ((endpointUrl.protocol !== "https:" && !isLocalDevelopmentEndpoint) || endpointUrl.username || endpointUrl.password) throw new Error("invalid endpoint");
  } catch {
    return NextResponse.json({ error: "Recognition endpoint configuration must be a valid HTTP(S) URL without embedded credentials." }, { status: 500 });
  }
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "Content-Type must be application/json." }, { status: 415 });
  }
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > 2_100_000) return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  let rawBody: string;
  try { rawBody = await request.text(); } catch { return NextResponse.json({ error: "Could not read request body." }, { status: 400 }); }
  if (new TextEncoder().encode(rawBody).byteLength > 2_100_000) return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  let body: { image?: unknown; language?: unknown };
  try { body = JSON.parse(rawBody) as { image?: unknown; language?: unknown }; } catch { return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 }); }
  if (typeof body.image !== "string" || !/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(body.image) || body.image.length > 2_000_000) {
    return NextResponse.json({ error: "A JPEG still frame under 1.5 MB is required." }, { status: 400 });
  }
  if (body.language !== "ISL" && body.language !== "ASL") return NextResponse.json({ error: "Language must be ISL or ASL." }, { status: 400 });
  try {
    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(process.env.SANKET_RECOGNITION_API_KEY ? { Authorization: `Bearer ${process.env.SANKET_RECOGNITION_API_KEY}` } : {}) },
      body: JSON.stringify({ image: body.image, task: "single_frame_sign_suggestion", language: body.language }),
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });
    if (!response.ok) return NextResponse.json({ error: `Recognition provider returned HTTP ${response.status}.` }, { status: 502 });
    const payload = await response.json() as { label?: unknown; confidence?: unknown; language?: unknown; note?: unknown };
    if (typeof payload.label !== "string" || !payload.label.trim() || typeof payload.confidence !== "number" || !Number.isFinite(payload.confidence) || payload.confidence < 0 || payload.confidence > 1) {
      return NextResponse.json({ error: "Provider response invalid. Expected a non-empty label and confidence between 0 and 1." }, { status: 502 });
    }
    if (payload.language !== undefined && payload.language !== body.language) {
      return NextResponse.json({ error: "Provider response language does not match the requested language profile." }, { status: 502 });
    }
    return NextResponse.json({ label: payload.label.trim().slice(0, 120), confidence: payload.confidence, language: body.language, note: typeof payload.note === "string" ? payload.note.slice(0, 300) : undefined }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Recognition endpoint could not be reached or timed out. No result was produced." }, { status: 502 });
  }
}
