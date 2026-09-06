import Image from "next/image";

import { FilmographyGrid } from "@/components/people/filmography-grid";
import { DetailBack } from "@/components/ui/detail-back";
import { getPerson, getPersonCredits } from "@/lib/data";

type PersonDetailProps = {
  id: string;
  mode: "app" | "public";
  character?: string;
  titleId?: string;
  returnTo?: string;
  embedded?: boolean;
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
  params.set("fromDetail", "1");
  if (returnTo?.startsWith("/app/")) params.set("returnTo", returnTo);
  const query = params.toString();
  return `/app/titles/${id}${query ? `?${query}` : ""}`;
}

export async function PersonDetail({ id, mode, character, titleId, returnTo, embedded = false }: PersonDetailProps) {
  const [person, credits] = await Promise.all([getPerson(id), getPersonCredits(id)]);
  if (!person) {
    return <p className="p-8 text-white/55">Actor not found.</p>;
  }

  const elsewhere = credits.filter((credit) => credit.id !== titleId);
  const life = formatPersonDates(person.birthday, person.deathday);

  return (
    <article className="mx-auto max-w-[1040px] px-5 pb-10 pt-6 sm:px-8 sm:pt-8">
      {mode === "app" && titleId && !embedded ? <DetailBack label="Back to title" /> : null}
      <div className="grid gap-7 md:grid-cols-[230px_minmax(0,1fr)] md:gap-10">
        <aside className="md:sticky md:top-8 md:self-start">
          <div className="flex gap-5 sm:block">
            <div className="relative h-36 w-28 shrink-0 overflow-hidden rounded-[18px] bg-white/[0.06] shadow-xl shadow-black/25 ring-1 ring-white/10 sm:aspect-[4/5] sm:h-auto sm:w-[190px] md:w-full">
              {person.profileUrl ? (
                <Image
                  src={person.profileUrl}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 230px, (min-width: 640px) 190px, 112px"
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
              <h1 className="display mt-1 text-2xl leading-tight text-white md:text-[1.7rem]" style={{ wordBreak: "keep-all" }}>{person.name}</h1>
              {character ? <p className="mt-2 text-sm font-bold leading-5 text-[var(--accent-text)]">as {character}</p> : null}
              {person.knownFor ? <p className="mt-2 text-sm text-white/50">{person.knownFor}</p> : null}
            </div>
          </div>

          {life || person.placeOfBirth ? (
            <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-5 text-xs md:grid-cols-1">
              {life ? <div><dt className="text-white/35">Life</dt><dd className="mt-1 leading-5 text-white/65">{life}</dd></div> : null}
              {person.placeOfBirth ? <div><dt className="text-white/35">From</dt><dd className="mt-1 leading-5 text-white/65">{person.placeOfBirth}</dd></div> : null}
            </dl>
          ) : null}
        </aside>

        <div className="min-w-0 md:border-l md:border-white/[0.07] md:pl-10">
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
              <FilmographyGrid items={elsewhere.map((credit) => ({ ...credit, href: titleHref(credit.id, mode, returnTo) }))} />
            </section>
          ) : null}
        </div>
      </div>
    </article>
  );
}
