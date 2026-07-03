# TV Cask Web

TV Cask is a Next.js App Router MVP for former TV Time users who want to preserve and continue tracking their watch history.

## Stack

- Next.js, TypeScript, React Server Components
- Tailwind CSS and small shadcn-style UI primitives
- Better Auth configuration with email/password enabled
- Drizzle schema for PostgreSQL
- TMDB-backed metadata search and import matching

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create `.env`:

```bash
cp .env.example .env
```

Set at least:

```txt
DATABASE_URL=postgres://postgres:postgres@localhost:5432/tvcask
BETTER_AUTH_SECRET=<32+ character random secret>
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
TMDB_API_KEY=<your tmdb key>
```

3. Start PostgreSQL:

```bash
docker compose up -d
```

4. Generate and run migrations:

```bash
pnpm db:generate
pnpm db:migrate
```

5. Start the app:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Real Metadata

This project intentionally does not ship fake catalog seed data. Search and import matching use TMDB when `TMDB_API_KEY` is configured. Imported TV Time titles that cannot be matched are still preserved in the user's library with their original import metadata.

## Current MVP Coverage

- Migration-first landing page
- Login/signup pages with Better Auth wiring and a local dev session fallback
- Protected app shell
- My List as the main product screen
- TV Time JSON/CSV upload, defensive parsing, preview, confirm import
- TMDB search and add-to-list flow
- Title detail, calendar, stats, settings, and JSON export screens
- Drizzle schema for profiles, titles, episodes, user titles, watched episodes, imports, import items, and exports

## Notes

ZIP uploads are accepted by the form but not parsed yet. Add a ZIP extraction dependency before enabling ZIP processing server-side.

The in-memory store keeps the MVP usable during local UI work before PostgreSQL migrations are connected to the service layer. The Drizzle schema and service boundaries are in place for replacing that store with database queries.
# tvcask
