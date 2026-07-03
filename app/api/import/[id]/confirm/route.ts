import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth/session";
import { confirmImport } from "@/lib/services/import-service";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  const { id } = await context.params;
  const record = confirmImport(userId, id);
  return NextResponse.json(record);
}
