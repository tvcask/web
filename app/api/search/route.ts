import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/api";
import type { Title } from "@/lib/services/types";

// Thin proxy so the client can search without ever seeing the auth token.
export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }
  try {
    const data = await api<{ results: Title[] }>(`/v1/titles/search?q=${encodeURIComponent(q)}`);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ results: [] });
  }
}
