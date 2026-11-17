import type { CountryProviders } from "@/lib/data";
import { regionName } from "@/lib/regions";

export type CountryRow = CountryProviders & { name: string; mine: boolean };

// Accent and case insensitive, so "fra" finds France and "ame" finds Amazon.
export function fold(text: string): string {
  return text.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

/**
 * The viewer's country leads, even when it has nothing, so they can see we
 * checked. The rest are A to Z by name. Without a viewer country (public page)
 * it is one plain A to Z list.
 */
export function buildCountryRows(regions: CountryProviders[], mine: string | null): CountryRow[] {
  const home = mine?.toUpperCase() ?? null;
  const rows = regions.map((r) => ({ ...r, name: regionName(r.region), mine: r.region === home }));
  rows.sort((a, b) => a.name.localeCompare(b.name, "en"));
  if (home && !rows.some((r) => r.mine)) {
    rows.push({ region: home, providers: [], name: regionName(home), mine: true });
  }
  return rows.sort((a, b) => Number(b.mine) - Number(a.mine));
}

export type Match = { row: CountryRow; providerIds: Set<number> };

/** A provider match highlights its chips. A country match keeps every chip plain. */
export function filterCountries(rows: CountryRow[], query: string): Match[] {
  const q = fold(query);
  if (!q) return rows.map((row) => ({ row, providerIds: new Set<number>() }));
  return rows.flatMap((row) => {
    const hits = new Set(row.providers.filter((p) => fold(p.name).includes(q)).map((p) => p.id));
    const byName = fold(row.name).includes(q) || row.region.toLowerCase() === q;
    return byName || hits.size > 0 ? [{ row, providerIds: hits }] : [];
  });
}
