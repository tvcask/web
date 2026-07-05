import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
};

/* -------------------------------------------------------------------------- */
/* Better Auth                                                                 */
/* -------------------------------------------------------------------------- */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  ...timestamps
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  ...timestamps
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  ...timestamps
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ...timestamps
});

/* -------------------------------------------------------------------------- */
/* App profile                                                                 */
/* -------------------------------------------------------------------------- */

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().unique(),
  username: text("username"),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  coverUrl: text("cover_url"),
  ...timestamps
});

/* -------------------------------------------------------------------------- */
/* Global metadata catalog                                                     */
/* -------------------------------------------------------------------------- */

// Titles use text ids (e.g. "tmdb-tv-1396") so metadata ids stay stable and
// URL-addressable without a translation layer.
export const titles = pgTable(
  "titles",
  {
    id: text("id").primaryKey(),
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
  },
  (table) => ({
    externalIdx: uniqueIndex("titles_external_idx").on(table.externalSource, table.externalId)
  })
);

export const episodes = pgTable(
  "episodes",
  {
    id: text("id").primaryKey(),
    titleId: text("title_id")
      .notNull()
      .references(() => titles.id, { onDelete: "cascade" }),
    seasonNumber: integer("season_number").notNull(),
    episodeNumber: integer("episode_number").notNull(),
    name: text("name"),
    overview: text("overview"),
    airDate: date("air_date"),
    network: text("network"),
    runtimeMinutes: integer("runtime_minutes"),
    ...timestamps
  },
  (table) => ({
    naturalKey: uniqueIndex("episodes_title_season_episode_idx").on(
      table.titleId,
      table.seasonNumber,
      table.episodeNumber
    )
  })
);

/* -------------------------------------------------------------------------- */
/* User tracking                                                               */
/* -------------------------------------------------------------------------- */

export const userTitles = pgTable(
  "user_titles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    titleId: text("title_id")
      .notNull()
      .references(() => titles.id, { onDelete: "cascade" }),
    status: text("status").notNull(),
    favorite: boolean("favorite").default(false).notNull(),
    rating: integer("rating"),
    currentSeason: integer("current_season"),
    currentEpisode: integer("current_episode"),
    importedFrom: text("imported_from"),
    importedExternalId: text("imported_external_id"),
    ...timestamps
  },
  (table) => ({
    userTitleIdx: uniqueIndex("user_titles_user_title_idx").on(table.userId, table.titleId)
  })
);

export const watchedEpisodes = pgTable(
  "watched_episodes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    titleId: text("title_id")
      .notNull()
      .references(() => titles.id, { onDelete: "cascade" }),
    episodeId: text("episode_id").references(() => episodes.id, { onDelete: "set null" }),
    seasonNumber: integer("season_number").notNull(),
    episodeNumber: integer("episode_number").notNull(),
    watchedAt: timestamp("watched_at", { withTimezone: true }),
    importedFrom: text("imported_from"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    watchedIdx: uniqueIndex("watched_episodes_unique_idx").on(
      table.userId,
      table.titleId,
      table.seasonNumber,
      table.episodeNumber
    )
  })
);

/* -------------------------------------------------------------------------- */
/* Custom lists                                                                */
/* -------------------------------------------------------------------------- */

export const userSettings = pgTable("user_settings", {
  userId: text("user_id").primaryKey(),
  theme: text("theme").default("dark").notNull(),
  titlesInLanguage: boolean("titles_in_language").default(false).notNull(),
  privateProfile: boolean("private_profile").default(false).notNull(),
  newEpisodeAlerts: boolean("new_episode_alerts").default(true).notNull(),
  premiereReminders: boolean("premiere_reminders").default(true).notNull(),
  weeklyDigest: boolean("weekly_digest").default(false).notNull(),
  ...timestamps
});

export const userLists = pgTable("user_lists", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  importedFrom: text("imported_from"),
  ...timestamps
});

export const userListItems = pgTable(
  "user_list_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    listId: uuid("list_id")
      .notNull()
      .references(() => userLists.id, { onDelete: "cascade" }),
    titleId: text("title_id")
      .notNull()
      .references(() => titles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    listItemIdx: uniqueIndex("user_list_items_unique_idx").on(table.listId, table.titleId)
  })
);

/* -------------------------------------------------------------------------- */
/* Import / export                                                             */
/* -------------------------------------------------------------------------- */

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
  importId: uuid("import_id")
    .notNull()
    .references(() => imports.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  rawTitle: text("raw_title").notNull(),
  normalizedTitle: text("normalized_title").notNull(),
  matchedTitleId: text("matched_title_id").references(() => titles.id, { onDelete: "set null" }),
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
