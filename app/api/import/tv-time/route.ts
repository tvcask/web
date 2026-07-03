import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth/session";
import { createTvTimeImport } from "@/lib/services/import-service";

export async function POST(request: Request) {
  const userId = await getUserId();
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Upload a TV Time export file." }, { status: 400 });
  }

  const record = await createTvTimeImport(userId, file);
  return NextResponse.json(record, { status: record.status === "failed" ? 400 : 201 });
}
