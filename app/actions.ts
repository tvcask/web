"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { addTitleSchema } from "@/lib/validators/tracking";
import {
  addTitleToUser,
  markNextEpisodeWatched,
  removeTitleFromUser,
  setEpisodeWatched,
  setSeasonWatched,
  updateUserTitleByTitleId
} from "@/lib/services/tracking-service";
import { confirmImport, createTvTimeImport } from "@/lib/services/import-service";
import { setTheme, toggleSetting } from "@/lib/services/settings-service";
import { getUserId } from "@/lib/auth/session";

export async function startDevSession() {
  const cookieStore = await cookies();
  cookieStore.set("tvcask_dev_session", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });
  redirect("/app/shows");
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
  await confirmImport(userId, importId);
  revalidatePath("/app/shows");
  redirect("/app/shows");
}

export async function addTitleAction(formData: FormData) {
  const userId = await getUserId();
  const payload = JSON.parse(String(formData.get("payload")));
  const body = addTitleSchema.parse(payload);
  await addTitleToUser(userId, body.title, body.status, body.favorite);
  revalidatePath("/app/shows");
  revalidatePath("/app/movies");
  revalidatePath("/app/explore");
  revalidatePath("/app/profile");
  revalidatePath(`/app/titles/${body.title.id}`);

  const returnTo = formData.get("returnTo");
  if (typeof returnTo === "string" && returnTo.startsWith("/app/")) {
    redirect(returnTo);
  }
}

export async function removeTitleAction(formData: FormData) {
  const userId = await getUserId();
  const titleId = String(formData.get("titleId"));
  await removeTitleFromUser(userId, titleId);
  revalidateTracking(titleId);
  const returnTo = formData.get("returnTo");
  if (typeof returnTo === "string" && returnTo.startsWith("/app/")) {
    redirect(returnTo);
  }
}

export async function markNextAction(formData: FormData) {
  const userId = await getUserId();
  await markNextEpisodeWatched(userId, String(formData.get("userTitleId")));
  revalidatePath("/app/shows");
  revalidatePath("/app/profile");
  const returnTo = formData.get("returnTo");
  if (typeof returnTo === "string" && returnTo.startsWith("/app/")) {
    redirect(returnTo);
  }
}

export async function updateTitleStatusAction(formData: FormData) {
  const userId = await getUserId();
  const titleId = String(formData.get("titleId"));
  const status = String(formData.get("status")) as "watching" | "watchlist" | "completed" | "dropped";
  await updateUserTitleByTitleId(userId, titleId, { status });
  revalidatePath("/app/shows");
  revalidatePath("/app/movies");
  revalidatePath("/app/profile");
  revalidatePath(`/app/titles/${titleId}`);
  const returnTo = formData.get("returnTo");
  if (typeof returnTo === "string" && returnTo.startsWith("/app/")) {
    redirect(returnTo);
  }
}

export async function toggleSettingAction(formData: FormData) {
  const userId = await getUserId();
  const key = String(formData.get("key")) as
    | "titlesInLanguage"
    | "privateProfile"
    | "newEpisodeAlerts"
    | "premiereReminders"
    | "weeklyDigest";
  await toggleSetting(userId, key);
  revalidatePath("/app/settings");
}

export async function setThemeAction(formData: FormData) {
  const userId = await getUserId();
  await setTheme(userId, String(formData.get("theme")));
  revalidatePath("/app/settings");
}

function revalidateTracking(titleId?: string) {
  revalidatePath("/app/shows");
  revalidatePath("/app/movies");
  revalidatePath("/app/profile");
  if (titleId) {
    revalidatePath(`/app/titles/${titleId}`);
  }
}

export async function toggleEpisodeWatchedAction(formData: FormData) {
  const userId = await getUserId();
  const titleId = String(formData.get("titleId"));
  const episodeId = formData.get("episodeId") ? String(formData.get("episodeId")) : null;
  const seasonNumber = Number(formData.get("seasonNumber"));
  const episodeNumber = Number(formData.get("episodeNumber"));
  const watched = String(formData.get("watched")) === "true";
  await setEpisodeWatched(userId, titleId, episodeId, seasonNumber, episodeNumber, !watched);
  revalidateTracking(titleId);
}

export async function markSeasonAction(formData: FormData) {
  const userId = await getUserId();
  const titleId = String(formData.get("titleId"));
  const seasonNumber = Number(formData.get("seasonNumber"));
  const watched = String(formData.get("watched")) === "true";
  await setSeasonWatched(userId, titleId, seasonNumber, !watched);
  revalidateTracking(titleId);
}

export async function toggleFavoriteAction(formData: FormData) {
  const userId = await getUserId();
  const titleId = String(formData.get("titleId"));
  const favorite = String(formData.get("favorite")) !== "true";
  await updateUserTitleByTitleId(userId, titleId, { favorite });
  revalidatePath("/app/shows");
  revalidatePath("/app/movies");
  revalidatePath("/app/profile");
  revalidatePath(`/app/titles/${titleId}`);
  const returnTo = formData.get("returnTo");
  if (typeof returnTo === "string" && returnTo.startsWith("/app/")) {
    redirect(returnTo);
  }
}
