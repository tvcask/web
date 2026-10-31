// Where someone was on a title page when they followed a link out of it. The
// page unmounts while they're away and its cached props can be stale by the time
// they come back, so this is what makes Back land in the same place with the
// same ticks. Memory only: a reload starts fresh.
export type TitleView = {
  tab: "overview" | "episodes" | "cast";
  openSection: string | null;
  pages: Record<string, number>;
  filter: string;
  query: string;
  watched: string[];
};

const views = new Map<string, TitleView>();

export const saveTitleView = (titleId: string, view: TitleView) => views.set(titleId, view);
export const peekTitleView = (titleId: string) => views.get(titleId);
export const clearTitleView = (titleId: string) => views.delete(titleId);

export function patchSavedWatched(titleId: string, watched: string[]) {
  const view = views.get(titleId);
  if (view) view.watched = watched;
}
