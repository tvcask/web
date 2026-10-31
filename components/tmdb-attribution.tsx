// TMDB's terms require visible attribution wherever their data is shown.
export function TmdbAttribution({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-5 text-white/35 ${className}`}>
      This website uses{" "}
      <a
        href="https://www.themoviedb.org/"
        target="_blank"
        rel="noreferrer"
        className="underline transition hover:text-white/60"
      >
        TMDB
      </a>{" "}
      and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.
    </p>
  );
}
