import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PersonDetail } from "@/components/people/person-detail";
import { getPerson, getPersonCredits } from "@/lib/data";

vi.mock("@/lib/data", () => ({
  getPerson: vi.fn(),
  getPersonCredits: vi.fn()
}));

const person = { id: "42", name: "Actor Name", biography: "A real biography." };
const credit = {
  id: "t1",
  title: "Another Show",
  type: "tv" as const,
  category: "tv_show" as const,
  genres: [],
  character: "Someone Else"
};

describe("PersonDetail", () => {
  beforeEach(() => {
    vi.mocked(getPerson).mockResolvedValue(person);
    vi.mocked(getPersonCredits).mockResolvedValue([credit]);
  });

  it("renders biography and URL-backed app filmography links", async () => {
    render(await PersonDetail({ id: "42", mode: "app", returnTo: "/app/explore" }));

    expect(screen.getByRole("heading", { name: "Actor Name" })).toBeInTheDocument();
    expect(screen.getByText("A real biography.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Another Show/ })).toHaveAttribute(
      "href",
      "/app/titles/t1?returnTo=%2Fapp%2Fexplore"
    );
  });

  it("uses public title links on shareable actor pages", async () => {
    render(await PersonDetail({ id: "42", mode: "public" }));

    expect(screen.getByRole("link", { name: /Another Show/ })).toHaveAttribute("href", "/titles/t1");
  });

  it("does not repeat the title used to open the actor", async () => {
    render(await PersonDetail({ id: "42", mode: "public", titleId: "t1" }));

    expect(screen.queryByText("Filmography")).not.toBeInTheDocument();
  });
});
