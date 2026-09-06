import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FilmographyGrid } from "@/components/people/filmography-grid";

const items = Array.from({ length: 12 }, (_, index) => ({
  id: `title-${index}`,
  title: `Title ${index}`,
  type: "tv" as const,
  category: "tv_show" as const,
  genres: [],
  href: `/app/titles/title-${index}`
}));

describe("FilmographyGrid", () => {
  it("renders a small initial set and expands on demand", () => {
    render(<FilmographyGrid items={items} />);

    expect(screen.getAllByRole("link")).toHaveLength(10);
    fireEvent.click(screen.getByRole("button", { name: "Show 2 more" }));
    expect(screen.getAllByRole("link")).toHaveLength(12);
    expect(screen.queryByRole("button", { name: /Show/ })).not.toBeInTheDocument();
  });
});
