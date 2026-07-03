import { endSession } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser, getUserId } from "@/lib/auth/session";
import { getImports } from "@/lib/services/import-service";
import { getStats } from "@/lib/services/stats-service";
import { getUserList } from "@/lib/services/tracking-service";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const userId = await getUserId();
  const imports = getImports(userId);
  const stats = getStats(userId);
  const list = getUserList(userId);
  const heroImage = list.find((item) => item.title.backdropUrl)?.title.backdropUrl ?? list.find((item) => item.title.posterUrl)?.title.posterUrl;

  return (
    <div className="space-y-8">
      <section className="relative -mx-5 -mt-6 overflow-hidden border-b border-[#242424] bg-[#090909] px-5 py-10 sm:-mx-8 sm:px-8">
        {heroImage ? <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25 blur-sm" /> : null}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/78 to-black/45" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-end gap-4">
            <div className="grid size-20 place-items-center rounded-full border-2 border-white bg-[#181818] text-3xl font-black text-[#D88945]">
              {(user?.email ?? "T").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-black">Profile</h1>
              <p className="mt-2 text-[#D2C6BB]">{user?.email}</p>
            </div>
          </div>
          <form action={endSession}>
            <Button variant="secondary">Log out</Button>
          </form>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-4">
        {[
          ["Titles", list.length],
          ["Episodes", stats.episodesWatched],
          ["Completed", stats.completedTitles],
          ["Favorites", stats.favorites]
        ].map(([label, value]) => (
          <Card key={label} className="p-4">
            <p className="text-sm font-bold text-[#A79B8E]">{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card className="p-5">
          <h2 className="text-xl font-black">Data export</h2>
          <p className="mt-2 text-sm leading-6 text-[#A79B8E]">Your data belongs to you. Export your TV Cask history anytime.</p>
          <form action="/api/export" method="post" className="mt-5">
            <Button>Export my TV Cask data</Button>
          </form>
        </Card>

        <Card className="p-5">
          <h2 className="text-xl font-black">Import history</h2>
          {imports.length === 0 ? (
            <p className="mt-3 text-sm text-[#A79B8E]">No imports yet.</p>
          ) : (
            <div className="mt-4 space-y-2">
              {imports.map((item) => (
                <div key={item.id} className="flex justify-between border-b border-[#272727] py-2 text-sm">
                  <span>{item.originalFilename}</span>
                  <span className="text-[#A79B8E]">{item.status}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
