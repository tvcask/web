// Central place for brand + product constants. Import from here rather than
// hardcoding strings across the app.
export const site = {
  name: "tvcask",
  displayName: "tvcask",
  tagline: "Your watch history, kept.",
  description: "Track shows and movies, see what airs next, and pick up where you left off. On the web and on iPhone.",
  logo: "/logo-horizontal.png",
  icon: "/logo-vertical.png",
  instagram: "https://www.instagram.com/tvcask/",
  // No country code: Apple routes this to the viewer's own storefront.
  appStore: "https://apps.apple.com/app/id6789895702",
  appStoreId: "6789895702",
  tmdb: "https://www.themoviedb.org/",
  tvdb: "https://thetvdb.com/",
  justwatch: "https://www.justwatch.com/",
  feedback: "https://tvcask.userjot.com/"
} as const;
