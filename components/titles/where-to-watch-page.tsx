import { WhereToWatchView } from "@/components/titles/where-to-watch-view";
import { WatchLoadError } from "@/components/titles/watch-load-error";
import { ApiError } from "@/lib/api";
import { getPublicTitleDetail, getSettings, getTitleDetail, getTitleWatchProviders } from "@/lib/data";

// Shared by the app page, the drawer and the public page. `signedIn` only decides
// whose country leads. The provider data is the same public response.
export async function WhereToWatchPage({ id, signedIn }: { id: string; signedIn: boolean }) {
  try {
    const [providers, region] = await Promise.all([
      getTitleWatchProviders(id),
      signedIn ? getSettings().then((s) => s.watchRegion || "US") : Promise.resolve(null)
    ]);
    const title = await (signedIn ? getTitleDetail(id, region ?? "US") : getPublicTitleDetail(id));
    if (!providers || !title) return <p className="p-10 text-white/60">Title not found.</p>;

    return (
      <div>
        <h1 className="display text-2xl text-white sm:text-3xl">Where to watch</h1>
        <p className="mt-1 line-clamp-2 break-words text-base font-semibold text-white/80">{title.title}</p>
        <p className="mb-4 mt-1 text-sm text-white/55">Streaming only. {providers.attribution}.</p>
        <WhereToWatchView regions={providers.regions} attribution={providers.attribution} myRegion={region} />
      </div>
    );
  } catch (error) {
    const unavailable = error instanceof ApiError && error.status >= 500;
    return <WatchLoadError unavailable={unavailable} />;
  }
}
