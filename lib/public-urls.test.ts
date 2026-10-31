import { describe, expect, it } from "vitest";
import { personIdFromSlug, publicPersonPath, publicTitlePath, slugify, titleIdFromSlug } from "@/lib/public-urls";

describe("public urls", () => {
  it("makes readable, ascii slugs", () => {
    expect(slugify("Agent Kim Reactivated")).toBe("agent-kim-reactivated");
    expect(slugify("  Dali & Cocky Prince! ")).toBe("dali-cocky-prince");
    expect(slugify("Amélie")).toBe("amelie");
    expect(slugify("소지섭")).toBe("");
  });

  it("separates shows from movies, whose ids overlap", () => {
    expect(publicTitlePath({ id: "tmdb-tv-296206", title: "Agent Kim Reactivated" })).toBe("/shows/agent-kim-reactivated-296206");
    expect(publicTitlePath({ id: "tmdb-movie-296206", title: "Heat" })).toBe("/movies/heat-296206");
    expect(titleIdFromSlug("shows", "agent-kim-reactivated-296206")).toBe("tmdb-tv-296206");
    expect(titleIdFromSlug("movies", "heat-296206")).toBe("tmdb-movie-296206");
  });

  it("keeps titles with no ascii name and numbers in their name", () => {
    expect(publicTitlePath({ id: "tmdb-tv-5", title: "소지섭" })).toBe("/shows/5");
    expect(titleIdFromSlug("shows", "5")).toBe("tmdb-tv-5");
    expect(titleIdFromSlug("shows", "reply-1988-64010")).toBe("tmdb-tv-64010");
  });

  it("refuses slugs with no id", () => {
    expect(titleIdFromSlug("shows", "k-drama")).toBeNull();
    expect(personIdFromSlug("so-ji-sub")).toBeNull();
  });

  it("falls back for ids it doesn't recognise", () => {
    expect(publicTitlePath({ id: "t1", title: "Another Show" })).toBe("/titles/t1");
  });

  it("builds and reads people", () => {
    expect(publicPersonPath({ id: "932821", name: "So Ji-sub" })).toBe("/people/so-ji-sub-932821");
    expect(personIdFromSlug("so-ji-sub-932821")).toBe("932821");
    expect(personIdFromSlug("932821")).toBe("932821");
  });
});
