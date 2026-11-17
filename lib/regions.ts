export type WatchRegion = { code: string; name: string; flag: string };

// Curated streaming markets shared with the mobile client. The API accepts any
// ISO alpha-2 code, but a focused picker is easier to scan and maintain.
export const WATCH_REGIONS: WatchRegion[] = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "IN", name: "India", flag: "🇮🇳" }
];

const REGION_CODES = new Set(WATCH_REGIONS.map((region) => region.code));

export function isWatchRegion(value: string): boolean {
  return REGION_CODES.has(value.toUpperCase());
}

// Regional indicator letters render as a flag. Anything that isn't a two letter
// code gets no flag rather than a broken glyph.
export function regionFlag(code: string): string {
  const upper = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) return "";
  return String.fromCodePoint(...[...upper].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

let displayNames: Intl.DisplayNames | null | undefined;

// The curated list wins so names match the settings picker. Other codes come
// from Intl, and the raw code is the last resort.
export function regionName(code: string): string {
  const upper = code.toUpperCase();
  const listed = WATCH_REGIONS.find((region) => region.code === upper);
  if (listed) return listed.name;
  if (displayNames === undefined) {
    try {
      displayNames = new Intl.DisplayNames(["en"], { type: "region" });
    } catch {
      displayNames = null;
    }
  }
  try {
    return displayNames?.of(upper) || upper;
  } catch {
    return upper;
  }
}
