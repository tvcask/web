import { describe, expect, it } from "vitest";

import { visibleFollowRows } from "@/components/social/follow-list";
import type { UserCard } from "@/lib/social";

const rows: UserCard[] = [
  { id: "a", username: "kept", name: "Kept", viewerFollows: true },
  { id: "b", username: "dropped", name: "Dropped", viewerFollows: false }
];

describe("visibleFollowRows", () => {
  it("drops people you just unfollowed from your own following list", () => {
    expect(visibleFollowRows(rows, "following", true).map((row) => row.id)).toEqual(["a"]);
  });

  // Everywhere else the row is not defined by the edge, so it stays and only
  // the button flips. That is what makes an accidental click undoable.
  it("keeps every row on someone else's list and on any followers list", () => {
    expect(visibleFollowRows(rows, "following", false)).toHaveLength(2);
    expect(visibleFollowRows(rows, "followers", true)).toHaveLength(2);
  });
});
