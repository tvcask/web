"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { UserRow } from "@/components/social/user-row";
import { MIN_SEARCH_CHARS, usePeopleSearch } from "@/lib/query/social";

export function PeopleSearch() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");

  // Debounce so a fast typist spends one request instead of one per keystroke.
  // The API allows 60 searches a minute and that budget is easy to burn.
  useEffect(() => {
    const timer = setTimeout(() => setQuery(input), 250);
    return () => clearTimeout(timer);
  }, [input]);

  const { data, isFetching } = usePeopleSearch(query);
  const results = data?.items ?? [];
  const searched = query.trim().length >= MIN_SEARCH_CHARS;

  return (
    <div className="space-y-5">
      <div className="relative">
        <HugeiconsIcon
          icon={Search01Icon}
          className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-white/35"
        />
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Search by name or @username"
          aria-label="Search people"
          autoFocus
          className="pl-10"
        />
      </div>

      {searched && results.length > 0 ? (
        <div className="-mx-3">
          {results.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </div>
      ) : null}

      {searched && !isFetching && results.length === 0 ? (
        <p className="py-8 text-center text-sm text-white/45">
          Nobody found for &ldquo;{query.trim()}&rdquo;.
        </p>
      ) : null}

      {!searched ? (
        <p className="py-8 text-center text-sm text-white/45">
          Search for people by their name or username.
        </p>
      ) : null}
    </div>
  );
}
