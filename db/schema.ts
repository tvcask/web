import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
};

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  username: text("username"),
  avatarUrl: text("avatar_url"),
  ...timestamps
});

export const titles = pgTable("titles", {
  id: uuid("id").primaryKey().defaultRandom(),
  externalId: text("external_id"),
  externalSource: text("external_source"),
  title: text("title").notNull(),
  originalTitle: text("original_title"),
  type: text("type").notNull(),
  category: text("category").notNull(),
  overview: text("overview"),
  posterUrl: text("poster_url"),
  backdropUrl: text("backdrop_url"),
  year: integer("year"),
  genres: jsonb("genres").$type<string[]>().default([]).notNull(),
  ...timestamps
});

export const episodes = pgTable("episodes", {
  id: uuid("id").primaryKey().defaultRandom(),
  titleId: uuid("title_id").references(() => titles.id).notNull(),
  seasonNumber: integer("season_number").notNull(),
  episodeNumber: integer("episode_number").notNull(),
  name: text("name"),
  overview: text("overview"),
  airDate: date("air_date"),
  runtimeMinutes: integer("runtime_minutes"),
  ...timestamps
});

export const userTitles = pgTable("user_titles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  titleId: uuid("title_id").references(() => titles.id).notNull(),
  status: text("status").notNull(),
  favorite: boolean("favorite").default(false).notNull(),
  rating: integer("rating"),
  currentSeason: integer("current_season"),
  currentEpisode: integer("current_episode"),
  importedFrom: text("imported_from"),
  importedExternalId: text("imported_external_id"),
  ...timestamps
});

export const watchedEpisodes = pgTable("watched_episodes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  titleId: uuid("title_id").references(() => titles.id).notNull(),
  episodeId: uuid("episode_id").references(() => episodes.id),
  seasonNumber: integer("season_number").notNull(),
  episodeNumber: integer("episode_number").notNull(),
  watchedAt: timestamp("watched_at", { withTimezone: true }),
  importedFrom: text("imported_from"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const imports = pgTable("imports", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  source: text("source").notNull(),
  originalFilename: text("original_filename").notNull(),
  status: text("status").notNull(),
  totalTitles: integer("total_titles").default(0).notNull(),
  totalEpisodes: integer("total_episodes").default(0).notNull(),
  matchedTitles: integer("matched_titles").default(0).notNull(),
  unmatchedTitles: integer("unmatched_titles").default(0).notNull(),
  errorMessage: text("error_message"),
  rawPreview: jsonb("raw_preview"),
  ...timestamps
});

export const importItems = pgTable("import_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  importId: uuid("import_id").references(() => imports.id).notNull(),
  userId: text("user_id").notNull(),
  rawTitle: text("raw_title").notNull(),
  normalizedTitle: text("normalized_title").notNull(),
  matchedTitleId: uuid("matched_title_id").references(() => titles.id),
  matchStatus: text("match_status").notNull(),
  matchConfidence: integer("match_confidence"),
  rawData: jsonb("raw_data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const userExports = pgTable("user_exports", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  status: text("status").notNull(),
  fileUrl: text("file_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true })
});
