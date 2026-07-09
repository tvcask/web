import { useCallback, useEffect, useRef, useState } from "react";

// One page of results the caller wants appended. `done` tells the hook to stop
// observing once this page is merged.
export type Page<T> = { items: T[]; done: boolean };

type Options<T> = {
  initial: T[];
  // Whether the initial data already exhausts the list (no scroll fetch needed).
  initialDone: boolean;
  // Fetch the next page. `loaded` is everything shown so far (use its length for
  // offset paging); `page` counts pages already loaded, so the next one is
  // `page + 1`. Dedup against `loaded` here if the API can repeat items.
  fetchPage: (ctx: { loaded: T[]; page: number }) => Promise<Page<T>>;
};

// Shared infinite-scroll plumbing: an IntersectionObserver on a sentinel, the
// loading/done flags, and a re-entrancy guard. Everything API-specific (URL,
// response shape, dedup) stays in the caller's `fetchPage`.
export function useInfiniteScroll<T>({ initial, initialDone, fetchPage }: Options<T>) {
  const [items, setItems] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(initialDone);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Read state through refs inside loadMore so the callback stays stable and the
  // observer isn't torn down and rebuilt on every items change.
  const page = useRef(1);
  const state = useRef({ loading, done, items });
  state.current = { loading, done, items };

  const loadMore = useCallback(async () => {
    if (state.current.loading || state.current.done) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetchPage({ loaded: state.current.items, page: page.current });
      page.current += 1;
      setItems((prev) => [...prev, ...res.items]);
      if (res.done) {
        setDone(true);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchPage]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) {
      return;
    }
    const io = new IntersectionObserver((entries) => entries[0].isIntersecting && loadMore(), {
      rootMargin: "700px"
    });
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore, done]);

  return { items, setItems, loading, done, sentinelRef };
}
