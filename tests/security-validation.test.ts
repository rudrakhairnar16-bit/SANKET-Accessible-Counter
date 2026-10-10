import { afterEach, describe, expect, it, vi } from "vitest";
import { POST as recognitionPost } from "../app/api/recognition/route";
import { POST as interpreterPost } from "../app/api/interpreter-request/route";

afterEach(() => {
  delete process.env.SANKET_RECOGNITION_ENDPOINT;
  delete process.env.SANKET_RECOGNITION_API_KEY;
  delete process.env.SANKET_INTERPRETER_REQUEST_ENDPOINT;
  delete process.env.SANKET_INTERPRETER_API_KEY;
  vi.unstubAllGlobals();
});

describe("Security-Sensitive API Input Validation & Provider Failure Handling", () => {
  describe("Recognition Route (/api/recognition)", () => {
    it("rejects recognition endpoint with embedded credentials (URL injection protection)", async () => {
      process.env.SANKET_RECOGNITION_ENDPOINT = "https://user:pass@model.example/predict";
      const req = new Request("http://localhost/api/recognition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: "data:image/jpeg;base64,ZmFrZQ==", language: "ISL" }),
      });
      const res = await recognitionPost(req as never);
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.error).toContain("embedded credentials");
    });

    it("rejects payload exceeding declared Content-Length limit (> 2.1 MB)", async () => {
      process.env.SANKET_RECOGNITION_ENDPOINT = "https://model.example/predict";
      const req = new Request("http://localhost/api/recognition", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Content-Length": "2500000" },
        body: JSON.stringify({ image: "data:image/jpeg;base64,ZmFrZQ==", language: "ISL" }),
      });
      const res = await recognitionPost(req as never);
      expect(res.status).toBe(413);
      const data = await res.json();
      expect(data.error).toContain("too large");
    });

    it("rejects unsupported languages (only ISL or ASL allowed)", async () => {
      process.env.SANKET_RECOGNITION_ENDPOINT = "https://model.example/predict";
      const req = new Request("http://localhost/api/recognition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: "data:image/jpeg;base64,ZmFrZQ==", language: "BSL" }),
      });
      const res = await recognitionPost(req as never);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Language must be ISL or ASL");
    });

    it("returns 502 with clear error message when recognition provider times out or throws", async () => {
      process.env.SANKET_RECOGNITION_ENDPOINT = "https://model.example/predict";
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Timeout / Connection reset")));
      const req = new Request("http://localhost/api/recognition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: "data:image/jpeg;base64,ZmFrZQ==", language: "ISL" }),
      });
      const res = await recognitionPost(req as never);
      expect(res.status).toBe(502);
      const data = await res.json();
      expect(data.error).toContain("could not be reached or timed out");
    });

    it("returns 502 when recognition provider returns HTTP 500 error", async () => {
      process.env.SANKET_RECOGNITION_ENDPOINT = "https://model.example/predict";
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("Internal Server Error", { status: 500 })));
      const req = new Request("http://localhost/api/recognition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: "data:image/jpeg;base64,ZmFrZQ==", language: "ISL" }),
      });
      const res = await recognitionPost(req as never);
      expect(res.status).toBe(502);
      const data = await res.json();
      expect(data.error).toContain("HTTP 500");
    });

    it("returns 502 when recognition provider returns invalid payload structure", async () => {
      process.env.SANKET_RECOGNITION_ENDPOINT = "https://model.example/predict";
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ label: "", confidence: 1.5 }), { status: 200 })));
      const req = new Request("http://localhost/api/recognition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: "data:image/jpeg;base64,ZmFrZQ==", language: "ISL" }),
      });
      const res = await recognitionPost(req as never);
      expect(res.status).toBe(502);
      const data = await res.json();
      expect(data.error).toContain("Provider response invalid");
    });
  });

  describe("Interpreter Dispatch Route (/api/interpreter-request)", () => {
    it("rejects interpreter endpoint with embedded credentials (URL injection protection)", async () => {
      process.env.SANKET_INTERPRETER_REQUEST_ENDPOINT = "https://admin:secret@provider.example/dispatch";
      const req = new Request("http://localhost/api/interpreter-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ counterNumber: "Counter 1", assistanceType: "ISL", urgency: "Standard" }),
      });
      const res = await interpreterPost(req as never);
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data.error).toContain("embedded credentials");
    });

    it("rejects payload exceeding declared Content-Length limit (> 16 KB)", async () => {
      process.env.SANKET_INTERPRETER_REQUEST_ENDPOINT = "https://provider.example/dispatch";
      const req = new Request("http://localhost/api/interpreter-request", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Content-Length": "20000" },
        body: JSON.stringify({ counterNumber: "Counter 1", assistanceType: "ISL", urgency: "Standard" }),
      });
      const res = await interpreterPost(req as never);
      expect(res.status).toBe(413);
      const data = await res.json();
      expect(data.error).toContain("too large");
    });

    it("returns 502 with graceful fallback message when provider fails or times out", async () => {
      process.env.SANKET_INTERPRETER_REQUEST_ENDPOINT = "https://provider.example/dispatch";
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network timeout")));
      const req = new Request("http://localhost/api/interpreter-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ counterNumber: "Counter 1", assistanceType: "ISL Interpreter", urgency: "Standard" }),
      });
      const res = await interpreterPost(req as never);
      expect(res.status).toBe(502);
      const data = await res.json();
      expect(data.error).toContain("could not be reached or timed out");
    });
  });
});
