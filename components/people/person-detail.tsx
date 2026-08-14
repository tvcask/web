import Image from "next/image";
import Link from "next/link";

import { Poster } from "@/components/titles/poster";
import { DetailBack } from "@/components/ui/detail-back";
import { getPerson, getPersonCredits } from "@/lib/data";

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

function titleHref(id: string, mode: PersonDetailProps["mode"], returnTo?: string): string {
  if (mode === "public") return `/titles/${id}`;
  const params = new URLSearchParams();
  if (returnTo?.startsWith("/app/")) params.set("returnTo", returnTo);
  const query = params.toString();
  return `/app/titles/${id}${query ? `?${query}` : ""}`;
}

export async function PersonDetail({ id, mode, character, titleId, returnTo }: PersonDetailProps) {
  const [person, credits] = await Promise.all([getPerson(id), getPersonCredits(id)]);
  if (!person) {
    return <p className="p-8 text-white/55">Actor not found.</p>;
  }

  const elsewhere = credits.filter((credit) => credit.id !== titleId);
  const life = formatPersonDates(person.birthday, person.deathday);

  return (
    <article className="px-5 pb-10 pt-7 sm:px-8 sm:pt-9">
      {mode === "app" && titleId ? <DetailBack label="Back to title" /> : null}
      <div className="grid gap-7 sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-8">
        <aside className="sm:sticky sm:top-8 sm:self-start">
          <div className="flex gap-5 sm:block">
            <div className="relative h-36 w-28 shrink-0 overflow-hidden rounded-[20px] bg-white/[0.06] shadow-xl shadow-black/25 ring-1 ring-white/10 sm:aspect-[4/5] sm:h-auto sm:w-full">
              {person.profileUrl ? (
                <Image
                  src={person.profileUrl}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 190px, 112px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="grid h-full place-items-center text-3xl font-extrabold text-white/45">
                  {(person.name.trim()[0] ?? "?").toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0 pt-1 sm:pt-5">
              <p className="eyebrow">Actor</p>
              <h1 className="display mt-1 text-2xl leading-tight text-white sm:text-3xl">{person.name}</h1>
              {character ? <p className="mt-2 text-sm font-bold leading-5 text-[var(--accent-text)]">as {character}</p> : null}
              {person.knownFor ? <p className="mt-2 text-sm text-white/50">{person.knownFor}</p> : null}
            </div>
          </div>

          {life || person.placeOfBirth ? (
            <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-5 text-xs sm:grid-cols-1">
              {life ? <div><dt className="text-white/35">Life</dt><dd className="mt-1 leading-5 text-white/65">{life}</dd></div> : null}
              {person.placeOfBirth ? <div><dt className="text-white/35">From</dt><dd className="mt-1 leading-5 text-white/65">{person.placeOfBirth}</dd></div> : null}
            </dl>
          ) : null}
        </aside>

        <div className="min-w-0 sm:border-l sm:border-white/[0.07] sm:pl-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-7 bg-[var(--accent)]/70" aria-hidden />
            <p className="eyebrow">Biography</p>
          </div>
          <p className="max-w-[68ch] whitespace-pre-line text-[15px] leading-7 text-white/70 sm:text-base sm:leading-8">
            {person.biography?.trim() || "No biography is available yet."}
          </p>

          {elsewhere.length > 0 ? (
            <section className="mt-9 border-t border-white/[0.07] pt-7">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-7 bg-[var(--accent)]/70" aria-hidden />
                <h2 className="eyebrow">Filmography</h2>
              </div>
              <div className="nos flex gap-3 overflow-x-auto pb-2">
                {elsewhere.map((credit) => (
                  <Link key={credit.id} href={titleHref(credit.id, mode, returnTo)} className="lift w-[112px] shrink-0">
                    <Poster src={credit.posterUrl} title={credit.title} className="rounded-[12px]" />
                    <p className="mt-2 truncate text-xs font-bold text-white">{credit.title}</p>
                    {credit.character ? <p className="truncate text-[11px] text-white/40">{credit.character}</p> : null}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </article>
  );
}
