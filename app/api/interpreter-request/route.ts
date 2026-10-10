import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const endpoint = process.env.SANKET_INTERPRETER_REQUEST_ENDPOINT;
  if (!endpoint) return NextResponse.json({ error: "No interpreter dispatch provider is configured. The local request draft remains available; no request was sent." }, { status: 503 });
  let endpointUrl: URL;
  try {
    endpointUrl = new URL(endpoint);
    if (!["https:", "http:"].includes(endpointUrl.protocol) || endpointUrl.username || endpointUrl.password) throw new Error("invalid endpoint");
  } catch {
    return NextResponse.json({ error: "Interpreter endpoint configuration must be a valid HTTP(S) URL without embedded credentials." }, { status: 500 });
  }
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "Content-Type must be application/json." }, { status: 415 });
  }
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > 16_384) return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  let rawBody: string;
  try { rawBody = await request.text(); } catch { return NextResponse.json({ error: "Could not read request body." }, { status: 400 }); }
  if (new TextEncoder().encode(rawBody).byteLength > 16_384) return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  let body: { counterNumber?: unknown; assistanceType?: unknown; urgency?: unknown; service?: unknown; notes?: unknown };
  try { body = JSON.parse(rawBody) as typeof body; } catch { return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 }); }
  const counterNumber = typeof body.counterNumber === "string" ? body.counterNumber.trim().slice(0, 80) : "";
  const assistanceType = typeof body.assistanceType === "string" ? body.assistanceType.trim().slice(0, 100) : "";
  const urgency = body.urgency === "High Priority (Citizen waiting)" ? "high" : body.urgency === "Standard" ? "standard" : "";
  if (!counterNumber || !assistanceType || !urgency) return NextResponse.json({ error: "Counter, assistance type and priority are required." }, { status: 400 });
  const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 150) : "";
  const service = typeof body.service === "string" ? body.service.trim().slice(0, 80) : "";
  try {
    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(process.env.SANKET_INTERPRETER_API_KEY ? { Authorization: `Bearer ${process.env.SANKET_INTERPRETER_API_KEY}` } : {}) },
      body: JSON.stringify({ requestId: crypto.randomUUID(), createdAt: new Date().toISOString(), counterNumber, assistanceType, urgency, service, notes, requestedCapability: "human_interpreter_dispatch", source: "SANKET Counter Access" }),
      signal: AbortSignal.timeout(12_000),
      cache: "no-store",
    });
    if (!response.ok) return NextResponse.json({ error: `Interpreter dispatch provider returned HTTP ${response.status}.` }, { status: 502 });
    const payload = await response.json().catch(() => null) as { requestId?: unknown; status?: unknown; message?: unknown; accepted?: unknown } | null;
    const providerStatus = typeof payload?.status === "string" ? payload.status.trim().toLowerCase() : "";
    const acknowledged = payload?.accepted === true || ["accepted", "queued", "received"].includes(providerStatus);
    if (!payload || !acknowledged) {
      return NextResponse.json({ error: "Provider returned HTTP success but did not explicitly acknowledge the request. Do not assume dispatch succeeded." }, { status: 502 });
    }
    return NextResponse.json({ accepted: true, providerRequestId: typeof payload.requestId === "string" ? payload.requestId.slice(0, 120) : undefined, status: providerStatus || "accepted", message: typeof payload.message === "string" ? payload.message.slice(0, 200) : "Provider acknowledged the dispatch request. This does not guarantee an interpreter is connected." }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Interpreter provider could not be reached or timed out. Keep using the local draft and facility procedures." }, { status: 502 });
  }
}
