import { describe, expect, it } from "vitest";

import { drawerBackdrop } from "@/lib/detail-return";

describe("drawerBackdrop", () => {
  it("uses a list inside the app", () => {
    expect(drawerBackdrop("/app/shows?tab=watchlist")).toBe("/app/shows?tab=watchlist");
  });

  it.each([
    [undefined],
    ["https://example.com"],
    ["//example.com/app/"],
    ["/app/titles/1"],
    ["/app/people/1"]
  ])("ignores %s", (returnTo) => {
    expect(drawerBackdrop(returnTo)).toBeNull();
  });
});
