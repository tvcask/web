import { beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("@/lib/mutate", () => ({ mutate: vi.fn() }));
vi.mock("@/lib/toast", () => ({ toast: vi.fn() }));

import { mutate } from "@/lib/mutate";
import { queryKeys } from "@/lib/query/keys";
import { useToggleFollow } from "@/lib/query/social";
import type { UserCard, UserProfile } from "@/lib/social";

const mockedMutate = vi.mocked(mutate);

function setup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, wrapper };
}

const target: UserCard = { id: "u2", username: "ana", name: "Ana", viewerFollows: false };

const targetProfile: UserProfile = {
  ...target,
  createdAt: "2026-01-01T00:00:00Z",
  followerCount: 10,
  followingCount: 4,
  viewerBlocked: false,
  isSelf: false,
  stats: {
    shows: 0,
    movies: 0,
    episodesWatched: 0,
    completedTitles: 0,
    tvTimeMinutes: 0,
    movieTimeMinutes: 0
  },
  level: 1,
  badgesEarned: 0,
  favoriteShows: [],
  favoriteMovies: [],
  lists: []
};

describe("useToggleFollow", () => {
  beforeEach(() => vi.clearAllMocks());

  it("moves the follower count and the button state before the request resolves", async () => {
    const { client, wrapper } = setup();
    client.setQueryData(queryKeys.userProfile("ana"), targetProfile);

    let resolve!: () => void;
    mockedMutate.mockReturnValue(new Promise<void>((r) => (resolve = r)));

    const { result } = renderHook(() => useToggleFollow(), { wrapper });
    result.current.mutate({ user: target, following: true });

    await waitFor(() => {
      const cached = client.getQueryData<UserProfile>(queryKeys.userProfile("ana"));
      expect(cached?.viewerFollows).toBe(true);
      expect(cached?.followerCount).toBe(11);
    });
    resolve();
  });

  it("patches the same person inside a search result list", async () => {
    const { client, wrapper } = setup();
    client.setQueryData(queryKeys.peopleSearch("an"), { items: [target] });

    let resolve!: () => void;
    mockedMutate.mockReturnValue(new Promise<void>((r) => (resolve = r)));

    const { result } = renderHook(() => useToggleFollow(), { wrapper });
    result.current.mutate({ user: target, following: true });

    await waitFor(() => {
      const cached = client.getQueryData<{ items: UserCard[] }>(queryKeys.peopleSearch("an"));
      expect(cached?.items[0].viewerFollows).toBe(true);
    });
    resolve();
  });

  it("rolls every patched cache back when the request fails", async () => {
    const { client, wrapper } = setup();
    client.setQueryData(queryKeys.userProfile("ana"), targetProfile);
    client.setQueryData(queryKeys.peopleSearch("an"), { items: [target] });
    mockedMutate.mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useToggleFollow(), { wrapper });
    result.current.mutate({ user: target, following: true });

    await waitFor(() => expect(result.current.isError).toBe(true));

    const profile = client.getQueryData<UserProfile>(queryKeys.userProfile("ana"));
    expect(profile?.viewerFollows).toBe(false);
    expect(profile?.followerCount).toBe(10);

    const search = client.getQueryData<{ items: UserCard[] }>(queryKeys.peopleSearch("an"));
    expect(search?.items[0].viewerFollows).toBe(false);
  });

  it("never drives a count below zero when unfollowing a stale card", async () => {
    const { client, wrapper } = setup();
    client.setQueryData(queryKeys.userProfile("ana"), { ...targetProfile, followerCount: 0, viewerFollows: true });

    let resolve!: () => void;
    mockedMutate.mockReturnValue(new Promise<void>((r) => (resolve = r)));

    const { result } = renderHook(() => useToggleFollow(), { wrapper });
    result.current.mutate({ user: { ...target, viewerFollows: true }, following: false });

    await waitFor(() => {
      expect(client.getQueryData<UserProfile>(queryKeys.userProfile("ana"))?.followerCount).toBe(0);
    });
    resolve();
  });
});
