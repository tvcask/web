import { beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider, type InfiniteData } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("@/lib/mutate", () => ({ mutate: vi.fn() }));
vi.mock("@/lib/toast", () => ({ toast: vi.fn() }));

import { mutate } from "@/lib/mutate";
import { queryKeys } from "@/lib/query/keys";
import { useCompleteFromLibrary } from "@/lib/query/library";
import type { LibraryPage } from "@/lib/data";
import type { UserTitleWithTitle } from "@/lib/services/types";

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

const item = { id: "ut1", title: { id: "m1", title: "Dune" } } as unknown as UserTitleWithTitle;

function seed(client: QueryClient) {
  const page: LibraryPage = { items: [item], total: 1, limit: 40, offset: 0 };
  client.setQueryData<InfiniteData<LibraryPage>>(queryKeys.library("movie"), {
    pageParams: [0],
    pages: [page]
  });
}

function itemsInCache(client: QueryClient) {
  const data = client.getQueryData<InfiniteData<LibraryPage>>(queryKeys.library("movie"));
  return data?.pages.flatMap((p) => p.items) ?? [];
}

describe("useCompleteFromLibrary", () => {
  beforeEach(() => vi.clearAllMocks());

  it("removes the title from the list immediately", async () => {
    const { client, wrapper } = setup();
    seed(client);
    let resolve!: () => void;
    mockedMutate.mockReturnValue(new Promise<void>((r) => (resolve = r)));

    const { result } = renderHook(() => useCompleteFromLibrary("movie"), { wrapper });
    result.current.markComplete.mutate(item);

    await waitFor(() => expect(itemsInCache(client)).toHaveLength(0));
    resolve();
  });

  it("restores the title when the request fails", async () => {
    const { client, wrapper } = setup();
    seed(client);
    mockedMutate.mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useCompleteFromLibrary("movie"), { wrapper });
    result.current.markComplete.mutate(item);

    await waitFor(() => expect(result.current.markComplete.isError).toBe(true));
    expect(itemsInCache(client)).toHaveLength(1);
    expect(itemsInCache(client)[0].id).toBe("ut1");
  });
});
