// Separate from public-page.ts, which imports the server-only API client, so client
// components can build these links too.
export const publicPagePath = (username: string) => `/u/${username}`;
export const publicListPath = (id: string) => `/lists/${id}`;

/** For text that leaves the app, where a relative link is no use. */
export const publicUrl = (path: string) => `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://tvcask.com"}${path}`;
