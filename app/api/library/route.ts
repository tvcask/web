import { NextRequest, NextResponse } from "next/server";
import { getLibraryPage, type LibraryQuery } from "@/lib/data";

// Proxies paginated library reads for the infinite-scroll grid (keeps the token
// server-side).
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const typeParam = sp.get("type");
  const q: LibraryQuery = {
    type: typeParam === "show" || typeParam === "movie" ? typeParam : undefined,
    status: sp.get("status") || undefined,
    limit: Number(sp.get("limit")) || 40,
    offset: Number(sp.get("offset")) || 0
  };
  try {
    return NextResponse.json(await getLibraryPage(q));
  } catch {
    return NextResponse.json({ items: [], total: 0, limit: 0, offset: 0 });
  }
}
