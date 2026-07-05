# TV Cask

A modern watch tracker for people migrating from TV Time. Import your TV Time
export, keep every episode you tracked, and continue watching — shows, movies,
anime and K-dramas — with real metadata from TMDB.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript
- PostgreSQL · Drizzle ORM
- Better Auth
- Tailwind CSS v4 · Plus Jakarta Sans
- TMDB for catalog, seasons, episodes and images

## Getting started

Requires Node 20+, pnpm, and Docker (for Postgres).

```bash
pnpm install
cp .env.example .env          # then fill in the values below
docker compose up -d          # start Postgres
pnpm db:migrate               # apply the schema
pnpm dev                      # http://localhost:3000
```

### Environment

```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/tvcask
BETTER_AUTH_SECRET=<long random string>
BETTER_AUTH_URL=http://localhost:3000
TMDB_API_KEY=<your TMDB key>
```

`TMDB_API_KEY` is required for real search, discovery and episode data.

## Structure

```
app/
  (marketing)/      landing
  (auth)/           login · signup
  (app)/app/        shows · movies · explore · profile · settings · import
    @modal/         intercepting-route drawer for title detail
  api/              route handlers
components/         app-shell · titles · ui · marketing
lib/
  services/         tracking · metadata · import · stats · export · calendar · settings
  metadata/         TMDB client
  db/ · auth/ · env/
db/                 schema · migrations
```

Business logic lives in `lib/services`; route handlers and server actions stay thin.
