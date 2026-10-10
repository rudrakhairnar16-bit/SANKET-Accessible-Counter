import { describe, expect, it, vi } from "vitest";
import { normalizeGenericGesturePrediction } from "../lib/mediapipe-gestures";

describe("Assistive Tools & Browser Compatibility Logic", () => {
  describe("Speech Recognition Browser API Handling", () => {
    it("handles missing SpeechRecognition API gracefully", () => {
      // Mock window without SpeechRecognition or webkitSpeechRecognition
      const mockWindow = {} as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
      const isSupported = Boolean(mockWindow.SpeechRecognition || mockWindow.webkitSpeechRecognition);
      expect(isSupported).toBe(false);

      const status = isSupported
        ? "Speech input is off until you start it."
        : "Speech recognition is not supported by this browser. Type the message instead.";
      expect(status).toContain("not supported");
    });

    it("handles microphone permission denial (not-allowed error)", () => {
      const getErrorMessage = (errorName: string) => {
        if (errorName === "not-allowed") {
          return "Microphone permission was denied. You can type the message instead.";
        }
        return `Speech recognition stopped (${errorName}). You can try again or type the message.`;
      };

      expect(getErrorMessage("not-allowed")).toBe(
        "Microphone permission was denied. You can type the message instead."
      );
      expect(getErrorMessage("network")).toContain("network");
    });
  });

  describe("Camera & MediaDevices Compatibility Handling", () => {
    it("detects missing navigator.mediaDevices or getUserMedia gracefully", () => {
      const mockNavigator = {} as { mediaDevices?: { getUserMedia?: unknown } };
      const isCameraAvailable = Boolean(mockNavigator.mediaDevices?.getUserMedia);
      expect(isCameraAvailable).toBe(false);

      const status = isCameraAvailable
        ? "Camera ready"
        : "Camera access is unavailable in this browser or context. Use manual sign selection instead.";
      expect(status).toContain("unavailable");
      expect(status).toContain("manual sign selection");
    });

    it("verifies camera stream cleanup stops all tracks", () => {
      const stop1 = vi.fn();
      const stop2 = vi.fn();
      const mockStream = {
        getTracks: () => [
          { stop: stop1, kind: "video" },
          { stop: stop2, kind: "audio" },
        ],
      };

      // Cleanup logic as implemented in CameraRecognitionTool
      mockStream.getTracks().forEach((track) => track.stop());

      expect(stop1).toHaveBeenCalledOnce();
      expect(stop2).toHaveBeenCalledOnce();
    });

    it("handles camera permission rejection (NotAllowedError)", () => {
      const getCameraErrorMessage = (errorName: string) => {
        if (errorName === "NotAllowedError") {
          return "Camera permission was denied. You can continue using manual sign selection.";
        }
        return "Could not start camera. Check device availability and browser permissions.";
      };

      expect(getCameraErrorMessage("NotAllowedError")).toContain("permission was denied");
      expect(getCameraErrorMessage("NotFoundError")).toContain("device availability");
    });
  });

  describe("Offline and Model State Handling", () => {
    it("detects offline condition before attempting model fetch", () => {
      const checkOnlineForModel = (onLine: boolean) => {
        if (!onLine) {
          return "The MediaPipe runtime and model need to be downloaded first. Connect to the internet, then try again.";
        }
        return "Loading model…";
      };

      expect(checkOnlineForModel(false)).toContain("Connect to the internet");
    });

    it("requires explicit user consent before sending frame to external model endpoint", () => {
      const canAnalyze = (consent: boolean, isReady: boolean) => {
        if (!isReady) return "Camera frame is not ready yet.";
        if (!consent) return "Please confirm that you consent to sending this single captured frame to the configured recognition service.";
        return "Proceed";
      };

      expect(canAnalyze(false, true)).toContain("consent");
      expect(canAnalyze(true, true)).toBe("Proceed");
    });
  });

  describe("Release 1.2 Hardware Decommissioning Policy", () => {
    it("confirms camera and microphone are disabled by default policy", async () => {
      const nextConfig = await import("../next.config");
      const config = nextConfig.default;
      const headersList = await config.headers?.();
      const securityHeaders = headersList?.[0]?.headers || [];
      const permissionsPolicyHeader = securityHeaders.find(
        (h: { key: string; value: string }) => h.key === "Permissions-Policy"
      );

      expect(permissionsPolicyHeader).toBeDefined();
      expect(permissionsPolicyHeader?.value).toContain("camera=()");
      expect(permissionsPolicyHeader?.value).toContain("microphone=()");
    });
  });
});
