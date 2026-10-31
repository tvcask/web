export const isDetailPath = (path: string) => path.startsWith("/app/titles/") || path.startsWith("/app/people/");

/**
 * The list a detail URL was opened from, if a full page load should put it back
 * behind the drawer. Detail paths don't count: they'd bounce straight back here.
 */
export function drawerBackdrop(returnTo?: string): string | null {
  return returnTo?.startsWith("/app/") && !isDetailPath(returnTo) ? returnTo : null;
}
