import Image from "next/image";

import { Biography } from "@/components/people/biography";
import { CreditGrid } from "@/components/people/credit-grid";
import { DetailBack } from "@/components/ui/detail-back";
import { DetailDrawerSpacer, DetailDrawerTitle } from "@/components/ui/detail-drawer";
import { getPerson, getPersonCredits } from "@/lib/data";
import { publicTitlePath } from "@/lib/public-urls";

type PersonDetailProps = {
  id: string;
  mode: "app" | "public";
  character?: string;
  titleId?: string;
  returnTo?: string;
};

function formatPersonDates(birthday?: string, deathday?: string): string {
  if (!birthday) return "";
  const format = (value: string) =>
    new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeZone: "UTC" }).format(
      new Date(`${value}T00:00:00Z`)
    );
  return deathday ? `${format(birthday)} – ${format(deathday)}` : `Born ${format(birthday)}`;
}

function titleHref(id: string, title: string, mode: PersonDetailProps["mode"], returnTo?: string): string {
  if (mode === "public") return publicTitlePath({ id, title });
  const params = new URLSearchParams({ fromDetail: "1" });
  if (returnTo?.startsWith("/app/")) params.set("returnTo", returnTo);
  const query = params.toString();
  return `/app/titles/${id}${query ? `?${query}` : ""}`;
}

export async function PersonDetail({ id, mode, character, titleId, returnTo }: PersonDetailProps) {
  const [person, credits] = await Promise.all([getPerson(id), getPersonCredits(id)]);
  if (!person) {
    return <p className="p-8 text-white/55">Actor not found.</p>;
  }

  const cards = credits
    .filter((credit) => credit.id !== titleId)
    .map((credit) => ({
      id: credit.id,
      type: credit.type,
      href: titleHref(credit.id, credit.title, mode, returnTo),
      title: credit.title,
      posterUrl: credit.posterUrl,
      character: credit.character
    }));
  const life = formatPersonDates(person.birthday, person.deathday);

  return (
    <article className="px-5 pb-10 pt-7 sm:px-8 sm:pt-9">
      <DetailDrawerTitle>{person.name}</DetailDrawerTitle>
      <DetailDrawerSpacer />
      {mode === "app" && titleId ? <DetailBack label="Back to title" /> : null}
      <div className="flex gap-5 sm:gap-6">
        <div className="relative h-36 w-28 shrink-0 overflow-hidden rounded-[18px] bg-white/[0.06] shadow-xl shadow-black/25 ring-1 ring-white/10 sm:h-[176px] sm:w-[132px]">
          {person.profileUrl ? (
            <Image src={person.profileUrl} alt={person.name} fill sizes="(min-width: 640px) 132px, 112px" className="object-cover" priority />
          ) : (
            <div className="grid h-full place-items-center text-3xl font-extrabold text-white/45">
              {(person.name.trim()[0] ?? "?").toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0 pt-1">
          <p className="eyebrow">Actor</p>
          <h1 className="display mt-1 text-2xl leading-tight text-white sm:text-3xl">{person.name}</h1>
          {character ? <p className="mt-2 text-sm font-bold leading-5 text-[var(--accent-text)]">as {character}</p> : null}
          {life || person.placeOfBirth ? (
            <dl className="mt-4 grid gap-x-6 gap-y-2 text-xs sm:grid-cols-2">
              {life ? <div><dt className="text-white/35">Life</dt><dd className="mt-0.5 leading-5 text-white/65">{life}</dd></div> : null}
              {person.placeOfBirth ? <div><dt className="text-white/35">From</dt><dd className="mt-0.5 leading-5 text-white/65">{person.placeOfBirth}</dd></div> : null}
            </dl>
          ) : null}
        </div>
      </div>

      <section className="mt-7">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-7 bg-[var(--accent)]/70" aria-hidden />
          <h2 className="eyebrow">Biography</h2>
        </div>
        <Biography text={person.biography?.trim() || "No biography is available yet."} />
      </section>

      <CreditGrid label="Series" credits={cards.filter((credit) => credit.type !== "movie")} />
      <CreditGrid label="Movies" credits={cards.filter((credit) => credit.type === "movie")} />
    </article>
  );
}
