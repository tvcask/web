import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/api";
import type { Title } from "@/lib/services/types";
import type { Person } from "@/lib/data";

// Thin proxy so the client can search without ever seeing the auth token.
export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 2) {
    return NextResponse.json({ titles: [], actors: [] });
  }
  try {
    const [titleResult, actorResult] = await Promise.allSettled([
      api<{ results: Title[] }>(`/v1/titles/search?q=${encodeURIComponent(q)}`, { signal: req.signal }),
      api<{ items: Person[] }>(`/v1/people/search?q=${encodeURIComponent(q)}`, { signal: req.signal })
    ]);
    return NextResponse.json({
      titles: titleResult.status === "fulfilled" ? titleResult.value.results ?? [] : [],
      actors: actorResult.status === "fulfilled" ? actorResult.value.items ?? [] : []
    });
  } catch {
    return NextResponse.json({ titles: [], actors: [] });
  }
}
