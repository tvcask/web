import { beforeEach, describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("@/lib/mutate", () => ({ mutate: vi.fn() }));
vi.mock("@/lib/toast", () => ({ toast: vi.fn() }));

import { mutate } from "@/lib/mutate";
import { queryKeys } from "@/lib/query/keys";
import { useToggleListMembership, type TitleList } from "@/lib/query/lists";

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

const titleId = "t1";
const list: TitleList = { id: "l1", name: "Favorites", itemCount: 3, containsTitle: false };

describe("useToggleListMembership", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates the cache optimistically before the request resolves", async () => {
    const { client, wrapper } = setup();
    client.setQueryData(queryKeys.titleLists(titleId), [list]);

    let resolve!: () => void;
    mockedMutate.mockReturnValue(new Promise<void>((r) => (resolve = r)));

    const { result } = renderHook(() => useToggleListMembership(titleId), { wrapper });
    result.current.mutate({ list, nextContains: true });

    await waitFor(() => {
      const cached = client.getQueryData<TitleList[]>(queryKeys.titleLists(titleId));
      expect(cached?.[0].containsTitle).toBe(true);
      expect(cached?.[0].itemCount).toBe(4);
    });
    resolve();
  });

  it("rolls the cache back when the request fails", async () => {
    const { client, wrapper } = setup();
    client.setQueryData(queryKeys.titleLists(titleId), [list]);
    mockedMutate.mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useToggleListMembership(titleId), { wrapper });
    result.current.mutate({ list, nextContains: true });

    await waitFor(() => expect(result.current.isError).toBe(true));
    const cached = client.getQueryData<TitleList[]>(queryKeys.titleLists(titleId));
    expect(cached?.[0].containsTitle).toBe(false);
    expect(cached?.[0].itemCount).toBe(3);
  });
});
