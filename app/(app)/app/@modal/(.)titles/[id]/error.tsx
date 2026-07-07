"use client";

export default function ModalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="px-6 py-16 text-center">
      <p className="text-white/70">Couldn&apos;t load this title.</p>
      <button
        onClick={reset}
        className="mt-4 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15"
      >
        Try again
      </button>
    </div>
  );
}
