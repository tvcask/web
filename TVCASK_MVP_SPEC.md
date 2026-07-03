# TV Cask MVP Specification

## 1. Product Overview

**Product name:** TV Cask  
**Product type:** Web-first watch tracking app for former TV Time / TVShowTime users  
**Initial platform:** Responsive web app  
**Future platform:** Mobile app / PWA / native wrapper if traction is validated

### Tagline Options

- Save your TV Time history. Keep tracking what you watch.
- Your shows, safely tracked.
- Import your TV Time history and keep watching.
- Preserve your watch history. Continue where you left off.

### Product Vision

TV Cask is a modern, simple, web-first replacement for users who are worried about losing years of TV Time data.

The first version should focus on one clear promise:

> Let users import their TV Time data, preserve their history, and continue tracking shows, movies, anime, and K-dramas.

The app should feel like a polished consumer product, not a SaaS dashboard, admin panel, or technical demo.

---

## 2. Main Opportunity

TV Time users are worried about losing 5–10+ years of watch history.

TV Cask should launch as a migration-first product:

1. Import TV Time export
2. Parse and preview imported data
3. Match imported titles to metadata providers
4. Save watch history safely
5. Let users continue tracking
6. Provide an export option so users trust the product

The first version does not need to copy every TV Time feature. It needs to replace the most important habit:

> “Where do I keep my watch history and track what I watch next?”

---

## 3. Core Positioning

Do not market TV Cask as a TV Time clone.

Use this positioning:

> A modern watch tracker built for people migrating from TV Time.

Avoid:

- “TV Time clone”
- “Copy of TV Time”
- Using TV Time branding, logo, icons, screenshots, or exact UI copy

Use:

- “Import from TV Time”
- “For former TV Time users”
- “Save your watch history”
- “Continue tracking your shows”

---

## 4. MVP Goals

### Primary Goal

Allow users to safely migrate their TV Time data and continue tracking.

### Secondary Goal

Create a better modern tracking experience with a clean UI.

### Later Differentiation

AI recommendations based on watch history, taste, genres, tropes, and natural language prompts.

---

## 5. Non-Goals for MVP

Do not build in the first version:

- Social feed
- Friends
- Comments
- Reviews
- Public profiles
- Messaging
- Achievements
- Badges
- Native mobile app
- Push notifications
- Complex AI recommendations
- Paid subscriptions
- Trakt sync
- Full TMDB ingestion worker
- Real-time community features

These can come later.

---

## 6. Tech Stack

Use a single clean Next.js application for the first production web MVP.

### Frontend + Backend

- Next.js App Router
- TypeScript
- React Server Components where useful
- Server Actions where appropriate
- Route Handlers for API endpoints where needed
- Tailwind CSS
- shadcn/ui
- Lucide icons
- Framer Motion for subtle UI transitions only

### Database

- PostgreSQL
- Drizzle ORM
- Drizzle Kit migrations

### Authentication

Use **Better Auth**.

Required auth features:

- Email/password authentication
- OAuth-ready structure for Google later
- Session handling
- Protected app routes
- User-owned data

### File Uploads

For MVP:

- Upload TV Time export file from the browser
- Accept `.zip`, `.json`, `.csv` where possible
- Store original import file metadata
- Parse server-side

Storage options:

- Local filesystem for development
- S3-compatible storage later

### Metadata Provider

MVP:

- Local seeded data first
- TMDB integration optional but architecture-ready

Future:

- TMDB for TV/movies metadata
- TVmaze for TV episode data/import matching
- AniList/Kitsu optional for anime metadata

---

## 7. Repository

Use one repository for the web MVP:

```txt
/tvcask
```

Suggested structure:

```txt
app/
  (marketing)/
    page.tsx
    import-tv-time/page.tsx
    pricing/page.tsx

  (auth)/
    login/page.tsx
    signup/page.tsx

  (app)/
    app/layout.tsx
    app/page.tsx
    app/my-list/page.tsx
    app/import/page.tsx
    app/import/[id]/page.tsx
    app/search/page.tsx
    app/titles/[id]/page.tsx
    app/calendar/page.tsx
    app/stats/page.tsx
    app/settings/page.tsx

  api/
    upload/tv-time/route.ts
    import/[id]/confirm/route.ts
    titles/search/route.ts

components/
  ui/
  app-shell/
  titles/
  import/
  stats/
  marketing/

lib/
  auth/
  db/
  env/
  metadata/
  importers/
  services/
  validators/
  utils/

db/
  schema.ts
  migrations/
  seed.ts

public/
  logo.svg
  barrel-icon.png
```

---

## 8. Design Direction

### Brand Feel

TV Cask should feel:

- Warm
- Safe
- Modern
- Slightly playful
- Premium but not cold
- Built around preserving watch history

The barrel metaphor means:

> A safe place where your watch history is stored and preserved.

### Visual References

Use inspiration from:

- Queue
- Showly
- Letterboxd
- Spotify mobile
- Arc browser landing pages
- Linear-style polish, but not a SaaS dashboard

Do not copy any UI directly.

### UI Style

- Dark mode first
- Poster-first layout
- Large artwork
- Rounded cards
- Smooth spacing
- Subtle gradients
- Soft warm accent colors
- Modern minimal typography
- Consumer app feel

### Suggested Color Palette

```txt
Background: #0F0D0B
Surface:    #181410
Surface 2:  #211A14
Primary:    #D88945
Primary 2:  #F0A85A
Accent:     #8B5CF6
Text:       #F8F3EC
Muted:      #A79B8E
Border:     #33281F
Success:    #22C55E
Warning:    #F59E0B
Error:      #EF4444
```

### Typography

Use a clean modern sans-serif.

Recommended:

- Inter
- Geist
- Manrope

### Logo Direction

Use a simple barrel icon with a TV/play symbol.

Logo rules:

- No smiley face
- No childish mascot
- No complex 3D render in the app UI
- Use a simplified illustrated barrel mark
- Must work at favicon size
- Must work in dark mode

---

## 9. Product Navigation

### Public Marketing

- Landing page
- Import TV Time page
- Pricing placeholder
- Login
- Signup

### Authenticated App

Main navigation:

- My List
- Import
- Search
- Calendar
- Stats
- Settings

Default authenticated page:

```txt
/app/my-list
```

Do not create a generic dashboard as the main product screen.

For this product, **My List is the dashboard**.

---

## 10. Public Landing Page

URL:

```txt
/
```

Goal:

Convert worried TV Time users.

Hero copy:

```txt
Save your TV Time history before it disappears.

Import your TV Time export, preserve your watch history, and continue tracking your shows in a modern app.
```

Primary CTA:

```txt
Import my TV Time data
```

Secondary CTA:

```txt
Create account
```

Sections:

1. Hero
2. How it works
3. What gets imported
4. Why TV Cask
5. Product preview
6. FAQ

### How It Works

1. Export your data from TV Time
2. Upload it to TV Cask
3. Preview matched shows and episodes
4. Confirm import
5. Continue tracking

### Trust Messaging

Include:

- You can export your data anytime
- Your watch history stays yours
- Original import file can be deleted after processing
- No social features required

---

## 11. Authentication

Use Better Auth.

### Required Auth Flows

- Sign up with email/password
- Log in with email/password
- Log out
- Protected app routes
- Session persistence

### Later Auth Enhancements

- Google login
- Magic link
- Password reset

### User Model

Each user owns:

- Imported files
- Imported titles
- Tracking state
- Episode progress
- Favorites
- Stats

Never show one user another user's data.

---

## 12. Core User Flows

## 12.1 New User Migration Flow

1. User lands on homepage
2. User clicks “Import my TV Time data”
3. User creates account or logs in
4. User uploads TV Time export
5. App parses file
6. App shows import preview
7. User reviews matched/unmatched items
8. User confirms import
9. App saves tracking data
10. User lands on My List

---

## 12.2 Existing User Tracking Flow

1. User opens My List
2. User sees Continue Watching
3. User marks next episode watched
4. Progress updates instantly
5. Stats update

---

## 12.3 Search/Add Flow

1. User searches for a title
2. User opens title details
3. User adds it to Watchlist/Watching/Completed
4. User can favorite it
5. Title appears in My List

---

## 13. Import System

The import system is the most important MVP feature.

### Upload Page

URL:

```txt
/app/import
```

Accept:

- `.zip`
- `.json`
- `.csv`

User instructions:

```txt
Upload the export file you downloaded from TV Time.
We'll parse your shows, movies, episodes, and watch history before saving anything.
```

### Import States

Import status enum:

```txt
uploaded
parsing
parsed
needs_review
importing
completed
failed
```

### Import Preview Page

URL:

```txt
/app/import/[id]
```

Show:

- Total titles found
- Total episodes found
- Matched titles
- Unmatched titles
- Titles already imported
- Errors/warnings

Actions:

- Confirm import
- Cancel import
- Download parsed preview as JSON

### Matching Strategy

For MVP:

1. Match by exact normalized title
2. Match by title + year if available
3. Mark unmatched items for later review

Future:

- TMDB search
- TVmaze search
- Manual title mapping
- Confidence score

### Import Safety Rules

- Never overwrite existing user tracking without checking
- If a title already exists, merge progress carefully
- If imported progress is higher than existing progress, keep higher progress
- Preserve original import metadata
- Store unmatched entries for review

---

## 14. Imported Data Expectations

Because TV Time export format may vary, implement flexible parsing.

Create importer abstraction:

```ts
interface Importer {
  canParse(file: UploadedFile): Promise<boolean>;
  parse(file: UploadedFile): Promise<ParsedImport>;
}
```

Parsed data shape:

```ts
type ParsedImport = {
  source: "tv_time";
  titles: ParsedTitle[];
  episodes: ParsedEpisode[];
  ratings?: ParsedRating[];
  favorites?: ParsedFavorite[];
  rawMetadata: Record<string, unknown>;
};
```

Parsed title:

```ts
type ParsedTitle = {
  sourceId?: string;
  title: string;
  originalTitle?: string;
  type?: "tv" | "movie" | "anime" | "unknown";
  year?: number;
  status?: "watching" | "watchlist" | "completed" | "dropped" | "unknown";
  favorite?: boolean;
  rating?: number;
};
```

Parsed episode:

```ts
type ParsedEpisode = {
  title: string;
  seasonNumber?: number;
  episodeNumber?: number;
  watchedAt?: string;
};
```

Important:

- Do not assume export structure is perfect
- Build parser defensively
- Keep raw import data for debugging during MVP

---

## 15. App Screens

## 15.1 My List

URL:

```txt
/app/my-list
```

Purpose:

The main app screen.

Sections:

- Continue Watching
- Watchlist
- Completed
- Favorites

Filters:

- All
- Shows
- Movies
- Anime
- K-Dramas

Title card:

- Poster
- Title
- Year
- Type
- Status
- Progress
- Favorite button
- Mark next episode watched button

Empty state:

```txt
Your watch history is waiting.
Import your TV Time data or start adding shows manually.
```

CTAs:

- Import TV Time data
- Search titles

---

## 15.2 Search

URL:

```txt
/app/search
```

Purpose:

Find and add content.

Features:

- Search input
- Seeded popular titles
- Search results
- Empty state

Result card:

- Poster
- Title
- Year
- Type
- Genres
- Add button

Actions:

- Add to Watchlist
- Add to Watching
- Mark Completed
- Favorite

---

## 15.3 Title Details

URL:

```txt
/app/titles/[id]
```

Purpose:

Manage one title.

Content:

- Backdrop
- Poster
- Title
- Year
- Type
- Genres
- Overview
- User status
- Episode list if show/anime

Actions:

- Add to Watchlist
- Mark Watching
- Mark Completed
- Favorite
- Mark next episode watched

---

## 15.4 Calendar

URL:

```txt
/app/calendar
```

Purpose:

Show upcoming episodes from tracked shows.

Sections:

- Today
- This Week
- Upcoming

Episode card:

- Poster
- Show title
- Season/episode number
- Episode name
- Air date

MVP can use seeded upcoming episode dates.

---

## 15.5 Stats

URL:

```txt
/app/stats
```

Purpose:

Recreate the emotional value of years of watch history.

Stats:

- Titles imported
- Shows watched
- Movies watched
- Episodes watched
- Completed titles
- Favorites
- Estimated watch time
- Most watched genres

Important:

Stats should feel rewarding and reassuring.

Example copy:

```txt
Your watch history is safe.
You imported 842 titles and 6,214 watched episodes.
```

---

## 15.6 Settings

URL:

```txt
/app/settings
```

Sections:

- Account
- Data export
- Import history
- Delete account placeholder

Actions:

- Export my TV Cask data
- View import history
- Log out

---

## 16. Database Schema

Use Drizzle ORM with PostgreSQL.

### users

Managed by Better Auth where possible.

Additional app profile table if needed:

```txt
profiles
- id
- user_id
- username
- avatar_url
- created_at
- updated_at
```

### titles

Global metadata.

```txt
titles
- id uuid pk
- external_id text nullable
- external_source text nullable
- title text not null
- original_title text nullable
- type text not null
- category text not null
- overview text nullable
- poster_url text nullable
- backdrop_url text nullable
- year integer nullable
- genres jsonb not null default []
- created_at timestamp
- updated_at timestamp
```

Type enum:

```txt
movie
tv
anime
```

Category enum:

```txt
movie
tv_show
anime
k_drama
```

### episodes

```txt
episodes
- id uuid pk
- title_id uuid references titles(id)
- season_number integer not null
- episode_number integer not null
- name text nullable
- overview text nullable
- air_date date nullable
- runtime_minutes integer nullable
- created_at timestamp
- updated_at timestamp
```

### user_titles

```txt
user_titles
- id uuid pk
- user_id text not null
- title_id uuid references titles(id)
- status text not null
- favorite boolean not null default false
- rating integer nullable
- current_season integer nullable
- current_episode integer nullable
- imported_from text nullable
- imported_external_id text nullable
- created_at timestamp
- updated_at timestamp
```

Status enum:

```txt
watching
watchlist
completed
dropped
```

### watched_episodes

```txt
watched_episodes
- id uuid pk
- user_id text not null
- title_id uuid references titles(id)
- episode_id uuid nullable references episodes(id)
- season_number integer not null
- episode_number integer not null
- watched_at timestamp nullable
- imported_from text nullable
- created_at timestamp
```

### imports

```txt
imports
- id uuid pk
- user_id text not null
- source text not null
- original_filename text not null
- status text not null
- total_titles integer default 0
- total_episodes integer default 0
- matched_titles integer default 0
- unmatched_titles integer default 0
- error_message text nullable
- raw_preview jsonb nullable
- created_at timestamp
- updated_at timestamp
```

### import_items

```txt
import_items
- id uuid pk
- import_id uuid references imports(id)
- user_id text not null
- raw_title text not null
- normalized_title text not null
- matched_title_id uuid nullable references titles(id)
- match_status text not null
- match_confidence integer nullable
- raw_data jsonb not null
- created_at timestamp
```

Match status enum:

```txt
matched
unmatched
ignored
already_exists
```

### user_exports

```txt
user_exports
- id uuid pk
- user_id text not null
- status text not null
- file_url text nullable
- created_at timestamp
- expires_at timestamp nullable
```

---

## 17. Services

Create clean service modules.

```txt
lib/services/import-service.ts
lib/services/title-service.ts
lib/services/tracking-service.ts
lib/services/stats-service.ts
lib/services/export-service.ts
lib/services/metadata-service.ts
```

### Import Service

Responsibilities:

- Create import record
- Parse uploaded file
- Normalize titles
- Match titles
- Store import preview
- Confirm import
- Merge tracking data

### Tracking Service

Responsibilities:

- Add title to user list
- Update status
- Favorite/unfavorite
- Mark next episode watched
- Compute progress

### Stats Service

Responsibilities:

- Count titles
- Count watched episodes
- Estimate watch time
- Count favorites
- Count completed titles

### Metadata Service

Responsibilities:

- Search seeded metadata
- Abstract future TMDB integration

---

## 18. Route Handlers / Server Actions

Use Server Actions for form actions where practical.

Use Route Handlers for:

- File upload
- Import confirmation
- Search API if needed
- Export generation

Suggested routes:

```txt
POST /api/import/tv-time
GET  /api/import/:id
POST /api/import/:id/confirm
GET  /api/titles/search?q=
POST /api/titles/:id/add
PATCH /api/user-titles/:id
POST /api/user-titles/:id/progress/next
POST /api/export
```

---

## 19. Data Export

Trust is critical.

Add export feature in MVP.

Users should be able to export:

- Their titles
- Their statuses
- Their favorites
- Their watched episodes
- Their stats

Format:

```txt
JSON
```

Future:

```txt
CSV
```

Copy:

```txt
Your data belongs to you. Export your TV Cask history anytime.
```

---

## 20. Seed Data

Seed at least:

- 10 TV shows
- 10 movies
- 10 anime
- 10 K-dramas

Include:

- title
- type
- category
- year
- overview
- genres
- poster_url
- backdrop_url
- episodes for shows/anime/k-dramas

Use stable placeholder posters if real metadata is not configured yet.

---

## 21. Environment Variables

```txt
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
UPLOAD_DIR=./uploads
```

Future:

```txt
TMDB_API_KEY=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
OPENAI_API_KEY=
```

---

## 22. Local Development

Required commands:

```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Docker:

```bash
docker compose up -d
```

README must explain:

1. Install dependencies
2. Start PostgreSQL
3. Configure `.env`
4. Run migrations
5. Seed database
6. Start app

---

## 23. Acceptance Criteria

A user can:

- Sign up
- Log in
- Upload TV Time export file
- See import preview
- Confirm import
- See imported titles in My List
- Search seeded titles
- Add a title manually
- Mark a title as watching
- Mark a title as completed
- Favorite a title
- Mark next episode watched
- View calendar
- View stats
- Export their TV Cask data
- Log out

The app must:

- Use Next.js App Router
- Use PostgreSQL
- Use Drizzle
- Use Better Auth
- Use server-side protected routes
- Use dark modern UI
- Be responsive on mobile
- Avoid dashboard/admin feel
- Include empty/loading/error states
- Include seed data
- Include README
- Include clean folder structure

---

## 24. Quality Bar

Build it like a serious product.

Avoid:

- Giant files
- Random utility functions everywhere
- Fake buttons that do nothing
- UI-only demo behavior
- Hardcoded user data
- Unprotected app routes
- Messy schema names
- Overcomplicated abstractions
- Premature microservices
- Generic SaaS dashboard layout

Prefer:

- Clear services
- Small reusable components
- Typed forms
- Zod validation
- Simple Drizzle queries
- Clean loading states
- Clear empty states
- Predictable URLs
- User-owned data
- Good README

---

## 25. Suggested Implementation Order

1. Create Next.js app
2. Add Tailwind and shadcn/ui
3. Add Drizzle and PostgreSQL
4. Add Better Auth
5. Create schema and migrations
6. Seed titles and episodes
7. Build marketing landing page
8. Build auth pages
9. Build protected app shell
10. Build My List
11. Build Search
12. Build Title Details
13. Build Import upload
14. Build Import preview
15. Build Confirm import
16. Build Stats
17. Build Calendar
18. Build Data export
19. Polish UI
20. Write README

---

## 26. Future Roadmap

### V2

- Real TV Time export parser improvements
- Manual unmatched title resolution
- TMDB integration
- Better calendar
- Google login
- Password reset

### V3

- AI recommendations
- Taste profile
- “What should I watch tonight?”
- Streaming availability
- PWA install support

### V4

- Native mobile app
- Push notifications
- Trakt sync
- Public profiles
- Shared watchlists

---

## Backend Strategy

TV Cask starts as a single Next.js fullstack application.

The app should be built cleanly so the backend can be extracted later if needed.

For V1:

- Next.js handles the web app

- Route Handlers expose API endpoints

- Server services contain business logic

- Drizzle talks to PostgreSQL

- PostgreSQL is the source of truth

Do not create a separate backend service for V1.

If TV Cask gets traction, the backend can later be extracted into a separate API service, for example:

- `tvcask-web`

- `tvcask-api`

- `tvcask-mobile`

To make that future migration easier:

- Keep business logic out of React components

- Keep route handlers thin

- Put use cases in service files

- Keep database schema clean

- Use stable API-style route contracts where useful

- Do not depend on server actions for everything

V1 priority is shipping a working migration product quickly.

## 27. Codex Instruction

When implementing this project, do not simplify it into a static HTML demo.

Build the real application using:

- Next.js
- TypeScript
- PostgreSQL
- Drizzle
- Better Auth
- Tailwind
- shadcn/ui

The result should be a working web app that users can actually use to migrate from TV Time to TV Cask.
