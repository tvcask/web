import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import type { TitleDetail } from "@/lib/data";
import { TitleDetailClient } from "./title-detail-client";
import { mutate } from "@/lib/mutate";
vi.mock("@/lib/mutate", () => ({
  mutate: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));
vi.mock("@/lib/query/tracking", () => ({ useSetTracked: () => vi.fn() }));
vi.mock("@/lib/query/titles", () => ({
  useTitleCast: () => ({ data: { status: "ready", items: [] } }),
}));
vi.mock("@/components/lists/title-list-membership", () => ({
  TitleListMembership: () => null,
}));
vi.mock("@/lib/celebrate", () => ({ celebrate: vi.fn() }));
const title: TitleDetail = {
  id: "show",
  title: "Running Man",
  type: "tv",
  category: "tv_show",
  genres: [],
  episodes: [],
  cast: [],
  watchRegion: "US",
  watchProviders: [],
  watchProviderAttribution: "",
};
const episodes = Array.from({ length: 800 }, (_, i) => ({
  id: `e${i + 1}`,
  titleId: "show",
  seasonNumber: 1,
  episodeNumber: i + 1,
  name: `Episode ${i + 1}`,
  airDate: "2020-01-01",
}));
const initial = {
  tracked: true,
  status: "watching",
  favorite: false,
  watched: [],
};
describe("large episode libraries", () => {
  it("bounds rendered episode controls", () => {
    render(
      <TitleDetailClient title={title} episodes={episodes} initial={initial} />,
    );
    expect(
      screen.getAllByRole("button", { name: /Toggle S01E/ }).length,
    ).toBeLessThanOrEqual(50);
  });
  it("asks before marking earlier episodes", () => {
    vi.mocked(mutate).mockClear();
    render(
      <TitleDetailClient
        title={title}
        episodes={episodes.slice(0, 3)}
        initial={initial}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Toggle S01E03 watched" }),
    );
    expect(mutate).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Only this episode" }));
    expect(mutate).toHaveBeenCalledWith(
      "me/titles/show/episodes",
      "POST",
      expect.objectContaining({ episode: 3, watched: true }),
    );
  });
  it("finds a late episode without rendering the preceding pages", () => {
    render(
      <TitleDetailClient title={title} episodes={episodes} initial={initial} />,
    );
    fireEvent.change(
      screen.getByRole("textbox", { name: "Find episode by number or name" }),
      { target: { value: "700" } },
    );
    expect(screen.getAllByRole("button", { name: /Toggle S01E/ })).toHaveLength(
      1,
    );
    expect(
      screen.getByRole("button", { name: "Toggle S01E700 watched" }),
    ).toBeInTheDocument();
  });
  it("filters exact sparse watches and retains gaps", () => {
    render(
      <TitleDetailClient
        title={title}
        episodes={episodes}
        initial={{ ...initial, watched: ["1-3", "1-700"] }}
      />,
    );
    fireEvent.change(
      screen.getByRole("combobox", { name: "Episode watch status" }),
      { target: { value: "watched" } },
    );
    expect(screen.getAllByRole("button", { name: /Toggle S01E/ })).toHaveLength(
      2,
    );
    expect(
      screen.getByRole("button", { name: "Toggle S01E700 watched" }),
    ).toBeInTheDocument();
    fireEvent.change(
      screen.getByRole("combobox", { name: "Episode watch status" }),
      { target: { value: "unwatched" } },
    );
    expect(
      screen.queryByRole("button", { name: "Toggle S01E03 watched" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Toggle S01E04 watched" }),
    ).toBeInTheDocument();
  });
  it("only marks earlier episodes after choosing the bulk action", () => {
    vi.mocked(mutate).mockClear();
    render(
      <TitleDetailClient
        title={title}
        episodes={episodes.slice(0, 3)}
        initial={initial}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Toggle S01E03 watched" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "This and all previous episodes" }),
    );
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate).toHaveBeenCalledWith(
      "me/titles/show/episodes/through",
      "POST",
      { season: 1, episode: 3 },
    );
  });
  it("cancels without changing history", () => {
    vi.mocked(mutate).mockClear();
    render(
      <TitleDetailClient
        title={title}
        episodes={episodes.slice(0, 3)}
        initial={initial}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Toggle S01E03 watched" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mutate).not.toHaveBeenCalled();
  });
  it("moves to the next bounded page", () => {
    render(
      <TitleDetailClient title={title} episodes={episodes} initial={initial} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(
      screen.queryByRole("button", { name: "Toggle S01E01 watched" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Toggle S01E51 watched" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Toggle S01E/ })).toHaveLength(
      50,
    );
  });
});
