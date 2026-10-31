import { Poster } from "@/components/titles/poster";

// From a real run on a real library, so keep it true if it's ever edited.
const SORTED = [
  { title: "Dali & Cocky Prince", list: "Falling Hard", poster: "https://image.tmdb.org/t/p/w342/r6X8JNFfgiq91MDtXBm3fzzmyGB.jpg" },
  { title: "Doctor Slump", list: "Cozy Hearts", poster: "https://image.tmdb.org/t/p/w342/iOWmbZEbhvrYyWm6O4W3oHf2S9B.jpg" },
  { title: "Oh My Ghost", list: "Love, Laughs & Chaos", poster: "https://image.tmdb.org/t/p/w342/fOcfOZn9jFQqUdBznfMDPkgXEik.jpg" },
  { title: "Taxi Driver", list: "No Mercy", poster: "https://image.tmdb.org/t/p/w342/lghfb8beej1aH9ML8QyeSixniom.jpg" }
];

export function AiConversation() {
  return (
    <figure className="min-w-0">
      <blockquote className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-[16px] bg-white/[0.06] px-4 py-3 text-[15px] leading-6 text-white/85">
        <span className="text-xs font-bold text-white/45">In ChatGPT</span>
        <span className="min-w-0">Look at my tvcask library and tell me which K-dramas belong in my custom lists.</span>
      </blockquote>
      <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-4">
        {SORTED.map((show) => (
          <li key={show.title} className="min-w-0 sm:even:translate-y-4">
            <Poster src={show.poster} title={show.title} alt={`${show.title} poster`} className="rounded-[12px] ring-1 ring-white/10" />
            <p className="mt-2.5 text-[13px] font-bold leading-snug" style={{ color: "var(--accent-text)" }}>{show.list}</p>
            <p className="mt-0.5 truncate text-xs text-white/45">{show.title}</p>
          </li>
        ))}
      </ul>
      <figcaption className="mt-5 text-center text-xs leading-5 text-white/35 sm:mt-10">
        What ChatGPT suggested in a real conversation, shortened. Other AI assistants that support MCP can connect too.
      </figcaption>
    </figure>
  );
}
