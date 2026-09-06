import { describe, expect, it } from "vitest";
import { formatListAsText } from "@/lib/list-text";

describe("formatListAsText", () => {
  it("includes the list context and keeps title order", () => {
    expect(
      formatListAsText({
        name: "My K-Dramas",
        description: "Favorites to recommend",
        items: [
          { title: { title: "Moving", year: 2023 } },
          { title: { title: "Reply 1988" } },
        ],
      }),
    ).toBe("My K-Dramas (2 titles)\n\nFavorites to recommend\n\n- Moving (2023)\n- Reply 1988");
  });

  it("uses the singular label and drops blank descriptions", () => {
    expect(
      formatListAsText({
        name: "Next up",
        description: "   ",
        items: [{ title: { title: "Monster", year: null } }],
      }),
    ).toBe("Next up (1 title)\n\n- Monster");
  });
});
