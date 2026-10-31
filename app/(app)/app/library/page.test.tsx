import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import LibraryPage from "./page";
import { getLibraryPage } from "@/lib/data";

vi.mock("@/lib/data", () => ({ getLibraryPage: vi.fn() }));
vi.mock("@/components/titles/infinite-library", () => ({
  InfiniteLibrary: ({ status, queue }: { status?: string; queue?: boolean }) => (
    <div data-testid="grid" data-status={status} data-queue={String(Boolean(queue))} />
  )
}));

const item = (status: string) => ({
  id: status,
  status,
  title: { id: `t-${status}`, title: `Show ${status}`, type: "tv", genres: [] }
});

describe("shows library", () => {
  beforeEach(() => {
    vi.mocked(getLibraryPage).mockImplementation(async ({ status } = {}) => ({
      items: status === "dropped" ? [] : [item(status ?? "all")],
      total: status === "dropped" ? 0 : 2,
      limit: 12,
      offset: 0
    }) as never);
  });

  it("groups shows by progress and skips empty groups", async () => {
    render(await LibraryPage({ searchParams: Promise.resolve({ type: "show" }) }));

    for (const heading of ["In progress", "Not started", "Finished"]) {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    }
    expect(screen.queryByRole("heading", { name: "Dropped" })).toBeNull();
    expect(screen.getByRole("link", { name: "All Not started" })).toHaveAttribute(
      "href",
      "/app/library?type=show&status=watchlist"
    );
    expect(screen.getByRole("heading", { name: "Shows" })).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("shows a group's whole list without the watch queue's filter", async () => {
    render(await LibraryPage({ searchParams: Promise.resolve({ type: "show", status: "completed" }) }));

    expect(screen.getByRole("heading", { name: "Finished" })).toBeInTheDocument();
    expect(screen.getByTestId("grid")).toHaveAttribute("data-status", "completed");
    expect(screen.getByTestId("grid")).toHaveAttribute("data-queue", "false");
    expect(screen.getByRole("link", { name: "Back to shows" })).toHaveAttribute("href", "/app/library?type=show");
  });

  it("keeps movies as a flat grid and ignores status", async () => {
    render(await LibraryPage({ searchParams: Promise.resolve({ type: "movie", status: "completed" }) }));

    expect(screen.getByRole("heading", { name: "All movies" })).toBeInTheDocument();
    expect(screen.getByTestId("grid")).not.toHaveAttribute("data-status");
  });
});
