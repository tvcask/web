# Where to watch: your country and every other one

Ticket: TVC-12. Backend: TVC-11 (all-countries endpoint). Provider data: TVC-10.

People keep their own watch region but want to check anywhere else, like France while set to US. Today the block on a title never names the country and vanishes when it's empty, so "nothing here" and "we don't know" look the same. This spec fixes the block and adds one view that lists every country.

## Decisions for v1

- **Group by country.** The question people ask is "can I watch it in France?". The search box also matches service names, so "where is Viki" still works without a second mode.
- **Web: a page, not a dialog.** `/app/titles/[id]/watch` for signed-in users, `/titles/[id]/watch` for the public page. In the app it opens inside the title drawer, the same way episodes do (`@modal/(details)/(.)titles/[id]/watch` next to `episodes`), and loads as a full page on a direct link. The URL is shareable and the back button works.
- **iPhone: a sheet** from title detail, full height, with the search bar in the sheet header.
- **Streaming only**, same as today. No rent or buy split until the API sends it.
- **JustWatch data only.** No hand-made "also on" entries (founder call in #product).
- **Public page region stays US** for v1, since there's no viewer setting. It now says so out loud.

## 1. The block on title detail

Applies to `components/titles/title-detail-client.tsx:438`, `components/public-page/public-title.tsx:127` and iOS `app/(details)/titles/[id].tsx:544`.

The block always renders now, even with no rating and no providers. Keep the current layout: rating on the left, divider, providers on the right.

### With providers

```
WHERE TO WATCH IN UNITED STATES
[logo Netflix] [logo Hulu] [logo Max] →           (chips, as today)
Powered by JustWatch · See all countries ›
```

### Nothing in the user's country

```
WHERE TO WATCH IN UNITED STATES
Not streaming in United States right now.
Powered by JustWatch · See all countries ›
```

The empty line uses `text-sm text-white/55` (iOS: `meta` variant). No icon, no illustration. It's a fact, not an error.

### Copy

| Slot | Copy |
| --- | --- |
| Label | `Where to watch in {country}` (uppercase via the existing eyebrow style, not in the string) |
| Empty | `Not streaming in {country} right now.` |
| Link | `See all countries` |
| Attribution | `Powered by JustWatch` (keep using `watchProviderAttribution` when the API sends it) |

`{country}` is the name from `WATCH_REGIONS` in `lib/regions.ts`. No flag in the label, it reads badly to screen readers.

### Details

- The link sits on the attribution line, right aligned on `sm` and up, under it on mobile. Style: `text-xs font-bold text-[var(--accent-text)]`, a `›` chevron icon after it, and a hit area of at least 44px tall (pad it, don't grow the text).
- Accessible name: `See where to watch {title} in all countries`.
- Long country names ("United Kingdom") must wrap, not truncate. Allow the label two lines.
- iOS today shows no JustWatch credit at all. Add `Powered by JustWatch` under the chips, same as web. This is required, not polish.

## 2. The all-countries view

### Layout (web page and iOS sheet share it)

```
‹ Back                                    (drawer header or page back link)

Where to watch
{Title name}
Streaming only. Powered by JustWatch.

[ 🔍 Search countries or services       ]
12 countries

YOUR COUNTRY
🇺🇸 United States                  JustWatch ↗
[Netflix] [Hulu]

OTHER COUNTRIES
🇦🇺 Australia                       JustWatch ↗
[Netflix] [Stan]

🇫🇷 France                          JustWatch ↗
[Netflix] [Canal+] [Viki]
...
```

- **Your country first**, always, even when it has nothing. Then every other country that has at least one provider, A to Z by English name.
- Countries with nothing are left out of "Other countries". Listing 100 empty rows helps nobody.
- If the user's country has nothing, show it with `Not streaming here right now.` instead of chips, so they know we checked.
- Each provider is a chip, same chip as the block. Chips **wrap** here (`flex-wrap`), no sideways scroll, so nothing hides.
- The `JustWatch ↗` link on each country opens that country's JustWatch page in a new tab. Chips link to the same place, as today.
- Section headings (`Your country`, `Other countries`) use `.eyebrow`. Each country is a `<section>` with its name as an `h3`.
- Flags come from the country code (regional indicator letters). Names come from `WATCH_REGIONS` when listed there, else `Intl.DisplayNames(["en"], { type: "region" })`, else the raw code. Maya, check that `Intl.DisplayNames` works on Hermes for iOS. If not, ship a static name map.
- Public page: we don't know the viewer's country, so there are no group headings. It's one A to Z list.

### Finding a country fast

One search field, at the top, sticky on scroll (web: `sticky top-0` inside the drawer scroll area; iOS: in the sheet header).

- Matches country names and provider names, case and accent insensitive. "fra" finds France. "viki" finds every country with Viki.
- When the match is a provider, keep the full country row but give the matching chip the accent ring (`ring-1 ring-[var(--accent)]`) so the eye lands on it.
- The count line under the field updates live: `12 countries`, `1 country`. Mark it `aria-live="polite"`.
- "Your country" stays pinned first only if it matches the search.
- Esc clears the field on web. iOS uses the native clear button.

No A to Z jump rail in v1. With search and roughly 40 countries at most, it would be clutter. Revisit if people ask.

### Copy

| Slot | Copy |
| --- | --- |
| Page title (and `<title>`) | `Where to watch {title}` |
| Heading | `Where to watch` |
| Subline | `Streaming only. Powered by JustWatch.` |
| Search label (visually hidden on web, placeholder too) | `Search countries or services` |
| Count | `{n} countries` / `1 country` |
| Group headings | `Your country`, `Other countries` |
| Your country, empty | `Not streaming here right now.` |
| Country link | `JustWatch` + external icon. Accessible name: `Open {country} on JustWatch` |
| No search match | `No country or service matches "{query}".` + button `Clear search` |

The attribution sits in the subline, above the list, so it's on screen at every scroll position the list starts from. Also repeat `Powered by JustWatch` at the bottom of the list in `text-[11px] text-white/30`.

## 3. States

**Loading.** Use the `DrawerSkeleton` approach (`animate-pulse`, `bg-white/[0.04]` blocks). Show the real header and the search field right away (disabled), then three country rows: a 20px line for the name, then a row of three 36px chips. iOS: the same in the sheet. No spinner. Screen reader: `aria-busy="true"` on the list with label `Loading where to watch`.

**Nothing in any country.**

```
Where to watch
{Title name}

Not streaming anywhere we can see right now.
JustWatch doesn't list this title on any streaming service yet. That often changes after release.

Powered by JustWatch
```

No search field in this state, there's nothing to search. Keep it calm. No "Sorry".

**Error.** `Couldn't load where to watch. Check your connection and try again.` and a `Try again` button (`Button` from `components/ui/button.tsx`). A 5xx reads: `Where to watch is unavailable right now. Try again in a bit.`

**Long text.** Provider names like "Amazon Prime Video with Ads" truncate inside the chip at `max-w-[220px]` with the full name in `title` and the accessible name. Country names wrap. Titles in the header wrap to two lines then truncate.

**First use.** No special state. The block already explains itself by naming the country.

## 4. Accessibility and theme

- All chips and links: visible focus with the existing ring, 44px minimum hit area on touch.
- Text contrast: `text-white/55` is the floor for real copy. `text-white/30` is only for the attribution, matching today.
- Logos are decorative (`alt=""`), the chip text carries the name.
- Web is dark only today, so there's no light theme to check. iOS: use theme tokens from the existing styles, no hard-coded colors, and check both appearances.
- Small screens: check at 320px wide. Chips wrap, the search field is full width, the JustWatch link drops under the country name if it doesn't fit.

## What we need from the API (TVC-11)

Per country: the code, the JustWatch link for that country, and the providers. Countries with no providers can be left out, except we need to know the user's own country was checked. One attribution string for the whole response.
