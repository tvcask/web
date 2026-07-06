import { redirect } from "next/navigation";
import { api, getToken } from "@/lib/api";

export type SessionUser = { id: string; name: string; email: string; avatarUrl?: string; emailVerified?: boolean };

export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = await getToken();
  if (!token) {
    return null;
  }
  try {
    return await api<SessionUser>("/v1/me");
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
