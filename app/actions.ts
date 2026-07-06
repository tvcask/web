"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { api, API_URL, getToken, TOKEN_COOKIE } from "@/lib/api";
import type { ImportRecord } from "@/lib/data";

type AuthResponse = { token: string; expiresAt: string };

async function setSession(res: AuthResponse) {
  const store = await cookies();
  store.set(TOKEN_COOKIE, res.token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(res.expiresAt)
  });
}

export async function signupAction(formData: FormData) {
  const body = {
    email: String(formData.get("email")),
    password: String(formData.get("password")),
    name: String(formData.get("name") ?? "")
  };
  try {
    const res = await api<AuthResponse>("/v1/auth/signup", { method: "POST", body, auth: false });
    await setSession(res);
  } catch {
    redirect("/signup?error=1");
  }
  redirect("/app/shows");
}

export async function loginAction(formData: FormData) {
  const body = { email: String(formData.get("email")), password: String(formData.get("password")) };
  try {
    const res = await api<AuthResponse>("/v1/auth/login", { method: "POST", body, auth: false });
    await setSession(res);
  } catch {
    redirect("/login?error=1");
  }
  redirect("/app/shows");
}

export async function endSession() {
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
  redirect("/");
}

function revalidateTracking(titleId?: string) {
  revalidatePath("/app/shows");
  revalidatePath("/app/movies");
  revalidatePath("/app/profile");
  if (titleId) {
    revalidatePath(`/app/titles/${titleId}`);
  }
}

function maybeReturn(formData: FormData) {
  const returnTo = formData.get("returnTo");
  if (typeof returnTo === "string" && returnTo.startsWith("/app/")) {
    redirect(returnTo);
  }
}

export async function addTitleAction(formData: FormData) {
  const payload = JSON.parse(String(formData.get("payload"))) as {
    title: { id: string };
    status?: string;
    favorite?: boolean;
  };
  await api("/v1/me/titles", {
    method: "POST",
    body: { titleId: payload.title.id, status: payload.status, favorite: payload.favorite }
  });
  revalidateTracking(payload.title.id);
  maybeReturn(formData);
}

export async function removeTitleAction(formData: FormData) {
  const titleId = String(formData.get("titleId"));
  await api(`/v1/me/titles/${titleId}`, { method: "DELETE" });
  revalidateTracking(titleId);
  maybeReturn(formData);
}

export async function markNextAction(formData: FormData) {
  const titleId = String(formData.get("titleId"));
  await api(`/v1/me/titles/${titleId}/next`, { method: "POST" });
  revalidateTracking(titleId);
  maybeReturn(formData);
}

export async function updateTitleStatusAction(formData: FormData) {
  const titleId = String(formData.get("titleId"));
  const status = String(formData.get("status"));
  await api(`/v1/me/titles/${titleId}`, { method: "PATCH", body: { status } });
  revalidateTracking(titleId);
  maybeReturn(formData);
}

export async function toggleFavoriteAction(formData: FormData) {
  const titleId = String(formData.get("titleId"));
  const favorite = String(formData.get("favorite")) !== "true";
  await api(`/v1/me/titles/${titleId}`, { method: "PATCH", body: { favorite } });
  revalidateTracking(titleId);
  maybeReturn(formData);
}

export async function toggleEpisodeWatchedAction(formData: FormData) {
  const titleId = String(formData.get("titleId"));
  await api(`/v1/me/titles/${titleId}/episodes`, {
    method: "POST",
    body: {
      season: Number(formData.get("seasonNumber")),
      episode: Number(formData.get("episodeNumber")),
      episodeId: formData.get("episodeId") ? String(formData.get("episodeId")) : undefined,
      watched: String(formData.get("watched")) !== "true"
    }
  });
  revalidateTracking(titleId);
}

export async function markSeasonAction(formData: FormData) {
  const titleId = String(formData.get("titleId"));
  const season = String(formData.get("seasonNumber"));
  await api(`/v1/me/titles/${titleId}/seasons/${season}`, {
    method: "POST",
    body: { watched: String(formData.get("watched")) !== "true" }
  });
  revalidateTracking(titleId);
}

export async function toggleSettingAction(formData: FormData) {
  const key = String(formData.get("key"));
  const current = await api<Record<string, boolean>>("/v1/me/settings");
  await api("/v1/me/settings", { method: "PATCH", body: { [key]: !current[key] } });
  revalidatePath("/app/settings");
}

export async function setThemeAction(formData: FormData) {
  await api("/v1/me/settings", { method: "PATCH", body: { theme: String(formData.get("theme")) } });
  revalidatePath("/app/settings");
}

export async function updateProfileAction(formData: FormData) {
  const body: { name?: string; avatarUrl?: string } = {};
  const name = formData.get("name");
  const avatarUrl = formData.get("avatarUrl");
  if (typeof name === "string" && name.trim()) body.name = name.trim();
  if (typeof avatarUrl === "string") body.avatarUrl = avatarUrl.trim();
  try {
    await api("/v1/me", { method: "PATCH", body });
  } catch {
    redirect("/app/settings?section=account&error=profile");
  }
  revalidatePath("/app/settings");
  revalidatePath("/app/profile");
  redirect("/app/settings?section=account&saved=profile");
}

export async function changePasswordAction(formData: FormData) {
  try {
    await api("/v1/me/password", {
      method: "POST",
      body: {
        currentPassword: String(formData.get("currentPassword")),
        newPassword: String(formData.get("newPassword"))
      }
    });
  } catch {
    redirect("/app/settings?section=account&error=password");
  }
  redirect("/app/settings?section=account&saved=password");
}

export async function deleteAccountAction() {
  await api("/v1/me", { method: "DELETE" });
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
  redirect("/");
}

// Forwards the uploaded TV Time export to the Go API as multipart form data.
export async function importTvTimeAction(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    redirect("/app/import?error=nofile");
  }
  const token = await getToken();
  const body = new FormData();
  body.append("file", file as File);

  const res = await fetch(`${API_URL}/v1/me/import/tv-time`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body,
    cache: "no-store"
  });
  if (!res.ok) {
    redirect("/app/import?error=upload");
  }
  const rec = (await res.json()) as ImportRecord;
  redirect(`/app/import?id=${rec.id}`);
}

export async function getImportStatus(id: string): Promise<ImportRecord> {
  return api<ImportRecord>(`/v1/me/import/${id}`);
}
