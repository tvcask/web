// Separate from public-page.ts, which imports the server-only API client, so client
// components can build these links too.
export const publicPagePath = (username: string) => `/u/${username}`;
export const publicListPath = (id: string) => `/lists/${id}`;
