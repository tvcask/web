"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { api, ApiError, TOKEN_COOKIE } from "@/lib/api";
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

export async function forgotPasswordAction(formData: FormData) {
  const email = String(formData.get("email"));
  try {
    await api("/v1/auth/forgot-password", { method: "POST", body: { email }, auth: false });
  } catch {
    // ignore — the endpoint always succeeds; never leak whether the email exists
  }
  redirect("/forgot-password?sent=1");
}

export async function resetPasswordAction(formData: FormData) {
  const token = String(formData.get("token"));
  const newPassword = String(formData.get("newPassword"));
  try {
    await api("/v1/auth/reset-password", { method: "POST", body: { token, newPassword }, auth: false });
  } catch {
    redirect(`/reset-password?token=${encodeURIComponent(token)}&error=1`);
  }
  redirect("/login?reset=1");
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


export async function updateProfileAction(formData: FormData) {
  const body: { name?: string; username?: string; avatarUrl?: string } = {};
  const name = formData.get("name");
  const username = formData.get("username");
  const avatarUrl = formData.get("avatarUrl");
  if (typeof name === "string" && name.trim()) body.name = name.trim();
  if (typeof username === "string" && username.trim()) body.username = username.trim();
  if (typeof avatarUrl === "string") body.avatarUrl = avatarUrl.trim();
  try {
    await api("/v1/me", { method: "PATCH", body });
  } catch (e) {
    const reason = e instanceof ApiError && e.status === 409 ? "username" : "profile";
    redirect(`/app/profile/edit?error=${reason}`);
  }
  revalidatePath("/app/profile");
  revalidatePath("/app/profile/edit");
  redirect("/app/profile/edit?saved=1");
}

export async function changePasswordAction(formData: FormData) {
  let res: AuthResponse;
  try {
    res = await api<AuthResponse>("/v1/me/password", {
      method: "POST",
      body: {
        currentPassword: String(formData.get("currentPassword")),
        newPassword: String(formData.get("newPassword"))
      }
    });
  } catch {
    redirect("/app/settings?section=account&error=password");
  }
  // The API bumps the token version (revoking other sessions), so refresh our cookie.
  await setSession(res);
  redirect("/app/settings?section=account&saved=password");
}

export async function deleteAccountAction() {
  await api("/v1/me", { method: "DELETE" });
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
  redirect("/");
}

export async function resendVerificationAction() {
  try {
    await api("/v1/me/resend-verification", { method: "POST" });
  } catch {
    // best effort
  }
  redirect("/app/settings?verify=sent");
}

export async function logoutEverywhereAction() {
  try {
    await api("/v1/me/logout-all", { method: "POST" });
  } catch {
    // best effort — clear the local cookie regardless
  }
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
  redirect("/login");
}

export async function getImportStatus(id: string): Promise<ImportRecord> {
  return api<ImportRecord>(`/v1/me/import/${id}`);
}
