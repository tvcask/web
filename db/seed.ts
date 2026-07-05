// TV Cask has no seed data by design. The catalog is real: titles, seasons,
// episodes and air dates are ingested live from TMDB and TVmaze the moment a
// user searches, opens, or imports a title. A migrating TV Time user brings
// their own library through the import flow.
//
// This script exists only so `pnpm db:seed` stays valid; it writes nothing.
console.log("No seed data. TV Cask uses real metadata from TMDB/TVmaze and TV Time imports.");
