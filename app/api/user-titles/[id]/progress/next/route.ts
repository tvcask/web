import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth/session";
import { markNextEpisodeWatched } from "@/lib/services/tracking-service";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  const { id } = await context.params;
  const result = markNextEpisodeWatched(userId, id);
  return NextResponse.json({ result });
}
