import { redirect } from "next/navigation";
import { api, getToken, ApiError } from "@/lib/api";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  // Ride along on /v1/me so the profile header does not need a second request
  // to the by-handle social endpoint just to render two numbers.
  followerCount?: number;
  followingCount?: number;
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = await getToken();
  if (!token) {
    return null;
  }
  // Only a rejected token means logged out. Treating a 5xx the same signs people out mid-outage.
  try {
    return await api<SessionUser>("/v1/me");
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      return null;
    }
    throw e;
  }
}

// Auth pages only bounce people who are already signed in. A broken session check
// must not block the way back in, so a failure here falls through to the form.
export async function hasActiveSession(): Promise<boolean> {
  try {
    return (await getCurrentUser()) !== null;
  } catch {
    return false;
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
