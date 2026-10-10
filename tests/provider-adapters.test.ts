import { afterEach, describe, expect, it, vi } from "vitest";
import { POST as recognitionPost } from "../app/api/recognition/route";
import { POST as interpreterPost } from "../app/api/interpreter-request/route";

const request = (url: string, body: unknown) => new Request(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

afterEach(() => {
  delete process.env.SANKET_RECOGNITION_ENDPOINT;
  delete process.env.SANKET_RECOGNITION_API_KEY;
  delete process.env.SANKET_INTERPRETER_REQUEST_ENDPOINT;
  delete process.env.SANKET_INTERPRETER_API_KEY;
  vi.unstubAllGlobals();
});

describe("optional provider adapters", () => {
  it("does not fabricate recognition when no model endpoint is configured", async () => {
    const response = await recognitionPost(request("http://localhost/api/recognition", {}) as never);
    expect(response.status).toBe(503);
    expect((await response.json()).error).toContain("no prediction was made");
  });

  it("rejects a malformed recognition frame", async () => {
    process.env.SANKET_RECOGNITION_ENDPOINT = "https://model.example/predict";
    const response = await recognitionPost(request("http://localhost/api/recognition", { image: "not-an-image", language: "ISL" }) as never);
    expect(response.status).toBe(400);
  });

  it("rejects non-JSON recognition requests", async () => {
    process.env.SANKET_RECOGNITION_ENDPOINT = "https://model.example/predict";
    const response = await recognitionPost(new Request("http://localhost/api/recognition", { method: "POST", headers: { "Content-Type": "text/plain" }, body: "nope" }) as never);
    expect(response.status).toBe(415);
  });

  it("rejects malformed base64 image payloads before provider dispatch", async () => {
    process.env.SANKET_RECOGNITION_ENDPOINT = "https://model.example/predict";
    const response = await recognitionPost(request("http://localhost/api/recognition", { image: "data:image/jpeg;base64,not valid base64!", language: "ISL" }) as never);
    expect(response.status).toBe(400);
  });

  it("validates and returns a configured model suggestion", async () => {
    process.env.SANKET_RECOGNITION_ENDPOINT = "https://model.example/predict";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ label: "possible sign", confidence: 0.72, language: "ISL" }), { status: 200 })));
    const response = await recognitionPost(request("http://localhost/api/recognition", { image: "data:image/jpeg;base64,ZmFrZQ==", language: "ISL" }) as never);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ label: "possible sign", confidence: 0.72, language: "ISL" });
  });

  it("rejects a recognition provider response for the wrong language", async () => {
    process.env.SANKET_RECOGNITION_ENDPOINT = "https://model.example/predict";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ label: "possible sign", confidence: 0.72, language: "ASL" }), { status: 200 })));
    const response = await recognitionPost(request("http://localhost/api/recognition", { image: "data:image/jpeg;base64,ZmFrZQ==", language: "ISL" }) as never);
    expect(response.status).toBe(502);
    expect((await response.json()).error).toContain("does not match");
  });

  it("keeps interpreter dispatch local when no provider is configured", async () => {
    const response = await interpreterPost(request("http://localhost/api/interpreter-request", { counterNumber: "Counter 1", assistanceType: "ISL Interpreter", urgency: "Standard" }) as never);
    expect(response.status).toBe(503);
    expect((await response.json()).error).toContain("no request was sent");
  });

  it("validates required interpreter dispatch fields", async () => {
    process.env.SANKET_INTERPRETER_REQUEST_ENDPOINT = "https://provider.example/request";
    const response = await interpreterPost(request("http://localhost/api/interpreter-request", { counterNumber: "", assistanceType: "ISL Interpreter", urgency: "Standard" }) as never);
    expect(response.status).toBe(400);
  });

  it("rejects non-JSON interpreter requests", async () => {
    process.env.SANKET_INTERPRETER_REQUEST_ENDPOINT = "https://provider.example/request";
    const response = await interpreterPost(new Request("http://localhost/api/interpreter-request", { method: "POST", headers: { "Content-Type": "text/plain" }, body: "nope" }) as never);
    expect(response.status).toBe(415);
  });

  it("does not claim interpreter dispatch succeeded without explicit provider acknowledgement", async () => {
    process.env.SANKET_INTERPRETER_REQUEST_ENDPOINT = "https://provider.example/request";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: "received" }), { status: 200 })));
    const response = await interpreterPost(request("http://localhost/api/interpreter-request", { counterNumber: "Counter 1", assistanceType: "ISL Interpreter", urgency: "Standard" }) as never);
    expect(response.status).toBe(502);
    expect((await response.json()).error).toContain("did not explicitly acknowledge");
  });

  it("accepts an explicit interpreter provider acknowledgement without claiming connection", async () => {
    process.env.SANKET_INTERPRETER_REQUEST_ENDPOINT = "https://provider.example/request";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ accepted: true, requestId: "req-123", status: "queued" }), { status: 200 })));
    const response = await interpreterPost(request("http://localhost/api/interpreter-request", { counterNumber: "Counter 1", assistanceType: "ISL Interpreter", urgency: "Standard" }) as never);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ accepted: true, providerRequestId: "req-123", status: "queued" });
  });
});
