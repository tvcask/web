"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { addTitleSchema } from "@/lib/validators/tracking";
import { addTitleToUser, markNextEpisodeWatched } from "@/lib/services/tracking-service";
import { confirmImport, createTvTimeImport } from "@/lib/services/import-service";
import { getUserId } from "@/lib/auth/session";

export async function startDevSession() {
  const cookieStore = await cookies();
  cookieStore.set("tvcask_dev_session", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });
  redirect("/app/my-list");
}

export async function endSession() {
  const cookieStore = await cookies();
  cookieStore.delete("tvcask_dev_session");
  redirect("/");
}

export async function uploadTvTimeExport(formData: FormData) {
  const userId = await getUserId();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("Upload a TV Time export file.");
  }
  const record = await createTvTimeImport(userId, file);
  redirect(`/app/import/${record.id}`);
}

export async function confirmImportAction(formData: FormData) {
  const userId = await getUserId();
  const importId = String(formData.get("importId"));
  confirmImport(userId, importId);
  revalidatePath("/app/my-list");
  redirect("/app/my-list");
}

export async function addTitleAction(formData: FormData) {
  const userId = await getUserId();
  const payload = JSON.parse(String(formData.get("payload")));
  const body = addTitleSchema.parse(payload);
  addTitleToUser(userId, body.title, body.status, body.favorite);
  revalidatePath("/app/my-list");
  redirect("/app/my-list");
}

export async function markNextAction(formData: FormData) {
  const userId = await getUserId();
  markNextEpisodeWatched(userId, String(formData.get("userTitleId")));
  revalidatePath("/app/my-list");
}
