import { describe, expect, it } from "vitest";

import { isNavActive, navContextPath, navItems } from "@/components/app-shell/nav-items";

const activeLabel = (pathname: string, returnTo?: string) => {
  const contextPath = navContextPath(pathname, returnTo);
  return navItems.find((item) => isNavActive(contextPath, item))?.label;
};

describe("title detail navigation context", () => {
  it.each([
    ["/app/movies?tab=watchlist&view=grid", "Movies"],
    ["/app/shows?tab=watchlist&view=list", "Shows"],
    ["/app/explore?q=silo", "Explore"],
    ["/app/profile", "Profile"]
  ])("uses %s to highlight %s", (returnTo, label) => {
    expect(activeLabel("/app/titles/123", returnTo)).toBe(label);
  });

  it("keeps Shows as the fallback for a direct title link", () => {
    expect(activeLabel("/app/titles/123")).toBe("Shows");
  });

  it("ignores return paths outside the app", () => {
    expect(activeLabel("/app/titles/123", "https://example.com")).toBe("Shows");
  });

  it("does not let returnTo change regular page navigation", () => {
    expect(activeLabel("/app/movies", "/app/explore")).toBe("Movies");
  });
});
