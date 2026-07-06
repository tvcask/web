// TMDB's terms require visible attribution wherever their data is shown.
export function TmdbAttribution({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-5 text-white/35 ${className}`}>
      This product uses the{" "}
      <a
        href="https://www.themoviedb.org/"
        target="_blank"
        rel="noreferrer"
        className="underline transition hover:text-white/60"
      >
        TMDB
      </a>{" "}
      API but is not endorsed or certified by TMDB.
    </p>
  );
}
