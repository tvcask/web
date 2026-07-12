# tvcask

> Your watch history, kept.

[tvcask](https://tvcask.com) is a watch tracker for shows, movies, anime, and K-dramas. It gives people leaving TV Time a reliable way to bring their history with them and keep tracking without starting over.

This repository contains the public web application. The native mobile app and Go API are maintained in private repositories within the [tvcask organization](https://github.com/tvcask).

![tvcask brand preview](public/og-brand.png)

## What tvcask does

- Imports TV Time history, including episodes, favorites, and custom lists
- Tracks shows episode by episode and keeps a movie watchlist
- Surfaces the next unwatched episode and upcoming releases
- Organizes favorites and custom lists
- Builds personal stats, progress, and achievement badges
- Works as an installable web app, with a native iOS app in development

The web app and upcoming mobile app share the same account and library through the tvcask API.

The shared voice, positioning, and launch messaging for both products live in [docs/positioning.md](docs/positioning.md).

## Product status

The web app is under active development. Core tracking and TV Time import are available today. Social features and the native iOS app are in progress.

Visit [tvcask.com](https://tvcask.com) to use the product.

## How the pieces fit together

| Project | Role | Availability |
| --- | --- | --- |
| `tvcask/web` | Next.js web app and public product site | Public, this repository |
| `tvcask/app` | Native mobile app | Private, coming to the App Store |
| `tvcask/api` | Go API for accounts, catalog data, imports, and tracking | Private |

This repository does not contain the database or business API. A running tvcask API is required for authenticated product features, so a clone of this repository cannot provide the complete local experience on its own.

## Technology

- Next.js 15 with the App Router
- React 19 and TypeScript
- Tailwind CSS 4
- TanStack Query for client state and optimistic updates
- Vitest and Testing Library
- TMDB for title, season, episode, and image metadata

## Local development

You need Node.js 20 or newer, pnpm, and access to a running tvcask API.

```bash
pnpm install
cp .env.example .env
pnpm dev
```

The app is available at [http://localhost:3000](http://localhost:3000).

Set the API address in `.env`:

```dotenv
API_URL=http://localhost:8080
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`API_URL` is read on the server. Requests from the browser pass through the Next.js API proxy so the upstream API address and authentication token stay out of client code.

## Useful commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the local development server |
| `pnpm build` | Create a production build |
| `pnpm typecheck` | Check TypeScript types |
| `pnpm test` | Run the test suite once |
| `pnpm test:watch` | Run tests in watch mode |

## Repository guide

```text
app/
  (marketing)/     Public product and legal pages
  (auth)/          Sign in, sign up, and account recovery
  (app)/app/       Library, explore, profile, stats, settings, and import
  api/v1/          Authenticated proxy to the Go API
components/
  app-shell/       Navigation and application layout
  marketing/       Public site components
  titles/          Catalog, library, and title detail UI
  ui/              Shared interface primitives
lib/
  api.ts           Server client for the tvcask API
  data.ts          Product data queries
  query/           Client cache and optimistic updates
public/            Brand assets, icons, and service worker
```

## Contributing

Bug reports and focused improvements to the web experience are welcome through [GitHub Issues](https://github.com/tvcask/web/issues). Before opening a pull request, run:

```bash
pnpm typecheck
pnpm test
pnpm build
```

Some changes depend on private API or mobile work. Open an issue first when a proposal changes shared behavior, authentication, imports, or the data model.

## Data and trademarks

This product uses the TMDB API but is not endorsed or certified by TMDB.

TV Time is a trademark of its respective owner. tvcask is an independent product and is not affiliated with TV Time.
