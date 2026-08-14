import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/search/route";
import { api } from "@/lib/api";

vi.mock("@/lib/api", () => ({ api: vi.fn() }));

describe("combined catalog search", () => {
  beforeEach(() => vi.mocked(api).mockReset());

  it("does not call the API for a one-character query", async () => {
    const response = await GET(new NextRequest("http://localhost/api/search?q=a"));

    expect(await response.json()).toEqual({ titles: [], actors: [] });
    expect(api).not.toHaveBeenCalled();
  });

  it("keeps title results when actor search is unavailable", async () => {
    const title = { id: "title-1", title: "The Show", type: "tv", category: "tv_show", genres: [] };
    vi.mocked(api)
      .mockResolvedValueOnce({ results: [title] })
      .mockRejectedValueOnce(new Error("actor provider unavailable"));

    const response = await GET(new NextRequest("http://localhost/api/search?q=show"));

    expect(await response.json()).toEqual({ titles: [title], actors: [] });
  });
});
