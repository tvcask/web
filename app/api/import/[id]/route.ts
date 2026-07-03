import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth/session";
import { getImport } from "@/lib/services/import-service";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  const { id } = await context.params;
  const record = getImport(userId, id);
  if (!record) {
    return NextResponse.json({ error: "Import not found." }, { status: 404 });
  }
  return NextResponse.json(record);
}
