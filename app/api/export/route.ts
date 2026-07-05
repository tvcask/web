import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth/session";
import { createUserExport } from "@/lib/services/export-service";

export async function POST() {
  const userId = await getUserId();
  return NextResponse.json(await createUserExport(userId), {
    headers: {
      "Content-Disposition": `attachment; filename="tvcask-export-${new Date().toISOString().slice(0, 10)}.json"`
    }
  });
}
