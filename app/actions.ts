"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { api, ApiError, TOKEN_COOKIE } from "@/lib/api";
import type { ImportRecord } from "@/lib/data";
import { isWatchRegion } from "@/lib/regions";

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

function safeReturnTo(formData: FormData) {
  const returnTo = formData.get("returnTo");
  if (typeof returnTo === "string" && returnTo.startsWith("/app/")) {
    return returnTo;
  }
  return "/app/shows";
}

export async function signupAction(formData: FormData) {
  const returnTo = safeReturnTo(formData);
  const body = {
    email: String(formData.get("email")),
    password: String(formData.get("password")),
    name: String(formData.get("name") ?? "")
  };
  try {
    const res = await api<AuthResponse>("/v1/auth/signup", { method: "POST", body, auth: false });
    await setSession(res);
  } catch {
    redirect(`/signup?error=1&returnTo=${encodeURIComponent(returnTo)}`);
  }
  redirect(returnTo);
}

export async function loginAction(formData: FormData) {
  const returnTo = safeReturnTo(formData);
  const body = { email: String(formData.get("email")), password: String(formData.get("password")) };
  try {
    const res = await api<AuthResponse>("/v1/auth/login", { method: "POST", body, auth: false });
    await setSession(res);
  } catch {
    redirect(`/login?error=1&returnTo=${encodeURIComponent(returnTo)}`);
  }
  redirect(returnTo);
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

export async function updateWatchRegionAction(formData: FormData) {
  const watchRegion = String(formData.get("watchRegion") ?? "").toUpperCase();
  if (!isWatchRegion(watchRegion)) {
    redirect("/app/settings?error=region");
  }
  try {
    await api("/v1/me/settings", { method: "PATCH", body: { watchRegion } });
  } catch {
    redirect("/app/settings?error=region");
  }
  revalidatePath("/app/settings");
  revalidatePath("/app/titles/[id]", "page");
  redirect("/app/settings?saved=region");
}

export async function getImportStatus(id: string): Promise<ImportRecord> {
  return api<ImportRecord>(`/v1/me/import/${id}`);
}

export async function createListAction(formData: FormData) {
  const list = await api<{ id: string }>("/v1/me/lists", {
    method: "POST",
    body: {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      isPublic: formData.get("isPublic") === "on"
    }
  });
  revalidatePath("/app/profile");
  redirect(`/app/lists/${list.id}`);
}

export async function updateListAction(formData: FormData) {
  const id = String(formData.get("listId"));
  await api(`/v1/me/lists/${id}`, {
    method: "PATCH",
    body: {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      isPublic: formData.get("isPublic") === "on"
    }
  });
  revalidatePath("/app/profile");
  revalidatePath(`/app/lists/${id}`);
  redirect(`/app/lists/${id}?saved=1`);
}

export async function deleteListAction(formData: FormData) {
  const id = String(formData.get("listId"));
  await api(`/v1/me/lists/${id}`, { method: "DELETE" });
  revalidatePath("/app/profile");
  redirect("/app/profile");
}

export async function removeListItemAction(formData: FormData) {
  const listId = String(formData.get("listId"));
  const titleId = String(formData.get("titleId"));
  await api(`/v1/me/lists/${listId}/items/${titleId}`, { method: "DELETE" });
  revalidatePath("/app/profile");
  revalidatePath(`/app/lists/${listId}`);
}
