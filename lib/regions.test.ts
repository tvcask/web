import { describe, expect, it } from "vitest";
import { isWatchRegion, WATCH_REGIONS } from "@/lib/regions";

describe("watch regions", () => {
  it("contains unique ISO alpha-2 codes", () => {
    const codes = WATCH_REGIONS.map((region) => region.code);
    expect(new Set(codes).size).toBe(codes.length);
    expect(codes.every((code) => /^[A-Z]{2}$/.test(code))).toBe(true);
  });

  it("validates curated regions case-insensitively", () => {
    expect(isWatchRegion("fr")).toBe(true);
    expect(isWatchRegion("US")).toBe(true);
    expect(isWatchRegion("ZZ")).toBe(false);
  });
});
