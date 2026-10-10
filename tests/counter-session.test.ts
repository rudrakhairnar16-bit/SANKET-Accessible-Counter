import { describe, expect, it } from "vitest";
import { formatDuration, formatDurationLong } from "../lib/phrases";

describe("Counter session & duration formatting", () => {
  it("formats zero duration correctly", () => {
    expect(formatDuration(0)).toBe("00:00");
    expect(formatDurationLong(0)).toBe("0s");
  });

  it("formats sub-minute duration correctly", () => {
    expect(formatDuration(45)).toBe("00:45");
    expect(formatDurationLong(45)).toBe("45s");
  });

  it("formats multi-minute durations accurately", () => {
    expect(formatDuration(65)).toBe("01:05");
    expect(formatDurationLong(65)).toBe("1m 5s");

    expect(formatDuration(600)).toBe("10:00");
    expect(formatDurationLong(600)).toBe("10m");

    expect(formatDuration(3675)).toBe("61:15");
    expect(formatDurationLong(3675)).toBe("61m 15s");
  });

  it("handles negative or invalid values safely", () => {
    expect(formatDuration(-10)).toBe("00:00");
    expect(formatDurationLong(-10)).toBe("0s");
    expect(formatDuration(0.8)).toBe("00:00");
  });

  it("accurately accumulates multiple session durations", () => {
    const session1 = 120; // 2 minutes
    const session2 = 185; // 3 minutes 5 seconds
    const total = session1 + session2;
    expect(formatDuration(total)).toBe("05:05");
    expect(formatDurationLong(total)).toBe("5m 5s");
  });
});
