import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ISL_MUNICIPAL_SIGNS } from "../lib/isl-signs";
import { ASL_SIGNS } from "../lib/asl-signs";

describe("Visual Assets and Placeholder Integrity", () => {
  const root = process.cwd();
  const allSigns = [...ISL_MUNICIPAL_SIGNS, ...ASL_SIGNS];

  it("verifies inventory includes exactly 70 total signs (34 ISL + 36 ASL)", () => {
    expect(ISL_MUNICIPAL_SIGNS.length).toBe(34);
    expect(ASL_SIGNS.length).toBe(36);
    expect(allSigns.length).toBe(70);
  });

  it("verifies all 70 sign IDs are globally unique across both languages", () => {
    const ids = new Set<string>();
    for (const sign of allSigns) {
      expect(ids.has(sign.id)).toBe(false);
      ids.add(sign.id);
    }
    expect(ids.size).toBe(70);
  });

  it("ensures zero broken asset references on disk for all configured visual paths", () => {
    let brokenCount = 0;
    const brokenList: string[] = [];

    for (const sign of allSigns) {
      for (const p of [sign.imagePath, sign.animationPath]) {
        if (!p || /^https?:\/\//i.test(p)) continue;
        const normalized = p.replace(/^\/+/, "");
        const diskPath = path.join(root, "public", normalized);
        if (!fs.existsSync(diskPath)) {
          brokenCount += 1;
          brokenList.push(`${sign.id}: ${p}`);
        }
      }
    }

    expect(brokenList).toEqual([]);
    expect(brokenCount).toBe(0);
  });

  it("ensures all configured remote visual references are well-formed HTTP(S) URLs", () => {
    for (const sign of allSigns) {
      for (const p of [sign.imagePath, sign.animationPath]) {
        if (!p || !/^https?:\/\//i.test(p)) continue;
        expect(() => new URL(p)).not.toThrow();
        const parsed = new URL(p);
        expect(["http:", "https:"]).toContain(parsed.protocol);
      }
    }
  });

  it("truthfully maintains placeholder status when authentic assets are pending", () => {
    for (const sign of ISL_MUNICIPAL_SIGNS) {
      if (sign.imagePath === null && sign.animationPath === null) {
        expect(sign.verificationStatus).toBe("metadata-review-pending-placeholder-active");
      }
    }
    for (const sign of ASL_SIGNS) {
      if (sign.imagePath === null && sign.animationPath === null) {
        expect(sign.verificationStatus).toBe("metadata-review-pending-placeholder-active");
      }
    }
  });

  it("never falsely labels unverified signs as expert-reviewed", () => {
    for (const sign of allSigns) {
      expect((sign as unknown as { expertReviewed?: boolean }).expertReviewed).toBeUndefined();
      expect(sign.verificationStatus).not.toBe("expert-reviewed");
      expect(sign.verificationStatus).not.toBe("verified");
    }
  });
});
