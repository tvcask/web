import { describe, expect, it, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("@/lib/query/client", () => ({ apiGet: vi.fn(async () => ({ ids: ["a"] })) }));

import { useIsTracked, useSetTracked } from "@/lib/query/tracking";

function setup() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { wrapper };
}

describe("shared library-ids", () => {
  it("derives tracked from the loaded set (falling back to the prop first)", async () => {
    const { wrapper } = setup();
    const { result } = renderHook(() => useIsTracked("a", false), { wrapper });
    // Once the shared set loads, it wins over the initial prop.
    await waitFor(() => expect(result.current).toBe(true));
  });

  it("untracking flips every reader of that title", async () => {
    const { wrapper } = setup();
    const flag = renderHook(() => useIsTracked("a", false), { wrapper });
    const setter = renderHook(() => useSetTracked(), { wrapper });

    await waitFor(() => expect(flag.result.current).toBe(true));
    act(() => setter.result.current("a", false));
    await waitFor(() => expect(flag.result.current).toBe(false));
  });
});
