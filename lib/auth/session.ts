import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";

const devUserId = "dev-user";

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
      return session.user;
    }
  } catch {
    // Local development can still exercise the app before Better Auth tables exist.
  }

  const cookieStore = await cookies();
  if (cookieStore.get("tvcask_dev_session")?.value) {
    return { id: devUserId, name: "TV Cask User", email: "dev@tvcask.local" };
  }

  return null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function getUserId() {
  const user = await requireUser();
  return user.id;
}
