import { describe, expect, it } from "vitest";
import { normalizeDiscoverSections } from "./data";

describe("normalizeDiscoverSections", () => {
  it("turns null items into an empty array", () => {
    expect(normalizeDiscoverSections([{ title: "Trending", kind: "trending-tv", items: null }])).toEqual([
      { title: "Trending", kind: "trending-tv", items: [] }
    ]);
  });

  it("rejects malformed containers and sections", () => {
    expect(normalizeDiscoverSections(null)).toEqual([]);
    expect(normalizeDiscoverSections([null, { title: "Missing kind", items: [] }])).toEqual([]);
  });
});
