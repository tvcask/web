import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DetailWorkspace } from "@/components/ui/detail-workspace";

const navigation = vi.hoisted(() => ({
  back: vi.fn(),
  replace: vi.fn(),
  pathname: "/app/titles/t1",
  query: "returnTo=%2Fapp%2Fexplore"
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ back: navigation.back, replace: navigation.replace }),
  useSearchParams: () => new URLSearchParams(navigation.query)
}));

describe("DetailWorkspace", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigation.back.mockReset();
    navigation.replace.mockReset();
    navigation.pathname = "/app/titles/t1";
    navigation.query = "returnTo=%2Fapp%2Fexplore";
  });

  afterEach(() => vi.useRealTimers());

  function openWorkspace() {
    act(() => vi.runOnlyPendingTimers());
  }

  it("keeps Back separate from Close for nested actor details", () => {
    navigation.pathname = "/app/people/p1";
    navigation.query += "&fromDetail=1";
    render(<DetailWorkspace><p>Biography</p></DetailWorkspace>);
    openWorkspace();

    expect(screen.getByRole("heading", { name: "Actor details" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(navigation.back).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Close details" })).toBeInTheDocument();
  });

  it("closes to the original app page", () => {
    render(<DetailWorkspace><p>Title</p></DetailWorkspace>);
    openWorkspace();

    expect(screen.queryByRole("button", { name: "Back" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close details" }));
    act(() => vi.advanceTimersByTime(140));
    expect(navigation.replace).toHaveBeenCalledWith("/app/explore");
  });

  it("labels episode routes and exposes one scrollable content area", () => {
    navigation.pathname = "/app/titles/t1/episodes/e1";
    render(<DetailWorkspace><p>Synopsis</p></DetailWorkspace>);
    openWorkspace();

    expect(screen.getByRole("heading", { name: "Episode details" })).toBeInTheDocument();
    expect(document.querySelectorAll("[data-detail-scroll]")).toHaveLength(1);
  });
});
