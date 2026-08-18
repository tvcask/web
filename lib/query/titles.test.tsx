import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/query/client", () => ({ apiGet: vi.fn() }));

import { apiGet } from "@/lib/query/client";
import { useTitleCast } from "@/lib/query/titles";

const mockedApiGet = vi.mocked(apiGet);

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, wrapper };
}

describe("useTitleCast", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads the independent cast resource through the authenticated proxy", async () => {
    mockedApiGet.mockResolvedValue({
      status: "ready",
      items: [{ id: 125025, name: "Kim Soo-hyun", character: "Moon Gang-tae" }]
    });
    const { wrapper } = setup();

    const { result } = renderHook(() => useTitleCast("tmdb-tv-96462"), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedApiGet).toHaveBeenCalledWith("/api/v1/titles/tmdb-tv-96462/cast");
    expect(result.current.data?.items[0]?.name).toBe("Kim Soo-hyun");
  });
});
