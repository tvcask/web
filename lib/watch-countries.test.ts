import { describe, expect, it } from "vitest";
import { normalizeWatchProviders } from "@/lib/data";
import { regionFlag, regionName } from "@/lib/regions";
import { buildCountryRows, filterCountries } from "@/lib/watch-countries";

const p = (id: number, name: string) => ({ id, name });
const regions = [
  { region: "FR", link: "https://jw/fr", providers: [p(1, "Canal+"), p(2, "Viki")] },
  { region: "AU", providers: [p(3, "Stan")] },
  { region: "US", providers: [p(4, "Disney+")] },
  { region: "CI", providers: [p(5, "Netflix")] }
];

describe("regions helpers", () => {
  it("names listed and unlisted codes", () => {
    expect(regionName("fr")).toBe("France");
    expect(regionName("CI")).toBe("Côte d’Ivoire");
    expect(regionName("ZZ")).toBeTruthy();
  });
  it("builds flags and skips bad codes", () => {
    expect(regionFlag("FR")).toBe("🇫🇷");
    expect(regionFlag("FRA")).toBe("");
  });
});

describe("buildCountryRows", () => {
  it("puts the viewer's country first, then A to Z", () => {
    const rows = buildCountryRows(regions, "US");
    expect(rows.map((r) => r.region)).toEqual(["US", "AU", "CI", "FR"]);
    expect(rows[0].mine).toBe(true);
  });
  it("keeps an empty home country so we show we checked", () => {
    const rows = buildCountryRows(regions, "BR");
    expect(rows[0]).toMatchObject({ region: "BR", providers: [], mine: true });
  });
  it("is a plain A to Z list with no viewer country", () => {
    const rows = buildCountryRows(regions, null);
    expect(rows.some((r) => r.mine)).toBe(false);
    expect(rows.map((r) => r.region)).toEqual(["AU", "CI", "FR", "US"]);
  });
});

describe("filterCountries", () => {
  const rows = buildCountryRows(regions, "US");
  it("matches country names ignoring accents and case", () => {
    expect(filterCountries(rows, "FRA").map((m) => m.row.region)).toEqual(["FR"]);
    expect(filterCountries(rows, "cote").map((m) => m.row.region)).toEqual(["CI"]);
  });
  it("matches provider names and marks the chip", () => {
    const [match] = filterCountries(rows, "viki");
    expect(match.row.region).toBe("FR");
    expect([...match.providerIds]).toEqual([2]);
  });
  it("drops the home country when it does not match", () => {
    expect(filterCountries(rows, "stan").map((m) => m.row.region)).toEqual(["AU"]);
  });
  it("returns everything for an empty query", () => {
    expect(filterCountries(rows, "  ")).toHaveLength(4);
  });
});

describe("normalizeWatchProviders", () => {
  it("copes with junk and a missing attribution", () => {
    expect(normalizeWatchProviders(null)).toEqual({ regions: [], attribution: "Powered by JustWatch" });
    const out = normalizeWatchProviders({ regions: [{ region: "fr", providers: [p(1, "A")] }, { region: "de", providers: [] }, 7] });
    expect(out.regions).toEqual([{ region: "FR", link: undefined, providers: [p(1, "A")] }]);
  });
});
