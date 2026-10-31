import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { UpNextCard } from "@/components/titles/up-next-card";
import { celebrate } from "@/lib/celebrate";
import { toast } from "@/lib/toast";
import type { UserTitleWithTitle } from "@/lib/services/types";

vi.mock("@/lib/celebrate", () => ({ celebrate: vi.fn() }));
vi.mock("@/lib/toast", () => ({ toast: vi.fn() }));

const item = {
  id: "ut1",
  nextSeason: 1,
  nextEpisode: 4,
  remaining: 3,
  title: { id: "t1", title: "Severance" }
} as unknown as UserTitleWithTitle;

function renderCard(onComplete = vi.fn()) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <UpNextCard item={item} onComplete={onComplete} />
    </QueryClientProvider>
  );
  return { onComplete, button: screen.getByRole("button", { name: /Mark S01E04 of Severance watched/ }) };
}

describe("UpNextCard", () => {
  beforeEach(() => {
    vi.mocked(celebrate).mockClear();
    vi.mocked(toast).mockClear();
  });
  afterEach(() => vi.unstubAllGlobals());

  it("advances to the next episode", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ nextSeason: 1, nextEpisode: 5, remaining: 2 })));
    const { onComplete, button } = renderCard();

    fireEvent.click(button);

    await screen.findByRole("button", { name: /Mark S01E05 of Severance watched/ });
    expect(celebrate).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("celebrates and removes the card when the show is finished", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ completed: true })));
    const { onComplete, button } = renderCard();

    fireEvent.click(button);

    await waitFor(() => expect(onComplete).toHaveBeenCalledWith("ut1"));
    expect(celebrate).toHaveBeenCalledWith("Severance");
  });

  it("keeps the card and reports the error when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new TypeError("Failed to fetch"); }));
    const { onComplete, button } = renderCard();

    fireEvent.click(button);

    await waitFor(() => expect(toast).toHaveBeenCalled());
    expect(celebrate).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("keeps the card and reports the error when the API rejects the write", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ error: "internal error" }, { status: 500 })));
    const { onComplete, button } = renderCard();

    fireEvent.click(button);

    await waitFor(() => expect(toast).toHaveBeenCalled());
    expect(celebrate).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
  });
});
