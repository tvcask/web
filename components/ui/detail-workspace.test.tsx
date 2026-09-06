import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps, PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

vi.mock("@/components/ui/drawer", () => ({
  Drawer: ({ children, onAnimationEnd }: PropsWithChildren<{ onAnimationEnd?: (open: boolean) => void }>) => (
    <div>
      <button type="button" onClick={() => onAnimationEnd?.(false)}>Finish close</button>
      {children}
    </div>
  ),
  DrawerClose: (props: ComponentProps<"button">) => <button type="button" {...props} />,
  DrawerContent: ({ children, showHandle: _showHandle, ...props }: ComponentProps<"div"> & { showHandle?: boolean }) => (
    <div {...props}>{children}</div>
  ),
  DrawerTitle: (props: ComponentProps<"h2">) => <h2 {...props} />
}));

describe("DetailWorkspace", () => {
  beforeEach(() => {
    navigation.back.mockReset();
    navigation.replace.mockReset();
    navigation.pathname = "/app/titles/t1";
    navigation.query = "returnTo=%2Fapp%2Fexplore";
  });

  it("keeps Back separate from Close for nested actor details", () => {
    navigation.pathname = "/app/people/p1";
    navigation.query += "&fromDetail=1";
    render(<DetailWorkspace><p>Biography</p></DetailWorkspace>);

    expect(screen.getByRole("heading", { name: "Actor details" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(navigation.back).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Close details" })).toBeInTheDocument();
  });

  it("closes to the original app page", () => {
    render(<DetailWorkspace><p>Title</p></DetailWorkspace>);

    expect(screen.queryByRole("button", { name: "Back" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Finish close" }));
    expect(navigation.replace).toHaveBeenCalledWith("/app/explore");
  });

  it("labels episode routes and exposes one scrollable content area", () => {
    navigation.pathname = "/app/titles/t1/episodes/e1";
    const { container } = render(<DetailWorkspace><p>Synopsis</p></DetailWorkspace>);

    expect(screen.getByRole("heading", { name: "Episode details" })).toBeInTheDocument();
    expect(container.querySelectorAll("[data-detail-scroll]")).toHaveLength(1);
  });
});
