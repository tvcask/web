import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth/session";
import { addTitleSchema } from "@/lib/validators/tracking";
import { addTitleToUser } from "@/lib/services/tracking-service";

export async function POST(request: Request) {
  const userId = await getUserId();
  const body = addTitleSchema.parse(await request.json());
  const result = await addTitleToUser(userId, body.title, body.status, body.favorite);
  return NextResponse.json({ result });
}
