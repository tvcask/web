import { describe, expect, it } from "vitest";

import { activityLabel } from "@/components/social/feed-card";
import type { FeedActor } from "@/lib/social";

const actor = (over: Partial<FeedActor>): FeedActor => ({
  id: "u1",
  username: "marie",
  name: "Marie",
  viewerFollows: true,
  status: "watching",
  favorite: false,
  updatedAt: "2026-08-02T00:00:00Z",
  ...over
});

describe("activityLabel", () => {
  it("prefers episode progress over the status word", () => {
    expect(activityLabel(actor({ status: "watching", season: 2, episode: 4 }))).toBe("is on S2E4");
  });

  it("falls back to the status when there is no progress", () => {
    expect(activityLabel(actor({ status: "watching" }))).toBe("is watching this");
    expect(activityLabel(actor({ status: "completed" }))).toBe("finished this");
    expect(activityLabel(actor({ status: "dropped" }))).toBe("dropped this");
  });

  // A movie has no episodes, and a partially tracked show can carry a season
  // with no episode. Neither should render "S2Eundefined".
  it("ignores half-filled progress", () => {
    expect(activityLabel(actor({ status: "watching", season: 2 }))).toBe("is watching this");
    expect(activityLabel(actor({ status: "completed", season: 1, episode: 3 }))).toBe("finished this");
  });
});
