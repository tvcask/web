import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api", () => ({ api: vi.fn(), ApiError: class extends Error {} }));

import { socialLinks } from "@/lib/public-page";

const owner = { username: "ana", name: "Ana" };

describe("socialLinks", () => {
  it("builds links from usernames and labels a website by its host", () => {
    expect(socialLinks({ ...owner, instagram: "ana.b", letterboxd: "ana_b", website: "https://www.ana.example/me" })).toEqual([
      { label: "Letterboxd", href: "https://letterboxd.com/ana_b/" },
      { label: "Instagram", href: "https://www.instagram.com/ana.b/" },
      { label: "ana.example", href: "https://www.ana.example/me" }
    ]);
  });

  it("drops anything that isn't an https website", () => {
    expect(socialLinks({ ...owner, website: "javascript:alert(1)" })).toEqual([]);
    expect(socialLinks({ ...owner, website: "http://ana.example" })).toEqual([]);
  });

  it("can't be steered off the platform by a crafted username", () => {
    expect(socialLinks({ ...owner, instagram: "../../evil.example" })[0].href).toBe(
      "https://www.instagram.com/..%2F..%2Fevil.example/"
    );
  });
});
