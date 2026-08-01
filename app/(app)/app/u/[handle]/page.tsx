import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProfileView } from "@/components/social/profile-view";
import { getUserProfile } from "@/lib/social";

type Params = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const profile = await getUserProfile(handle);
  if (!profile) {
    return { title: "Not found" };
  }
  return { title: `${profile.name || profile.username} (@${profile.username})` };
}

export default async function UserProfilePage({ params }: Params) {
  const { handle } = await params;
  const profile = await getUserProfile(handle);
  // Hidden, blocked and missing all arrive as null. They are meant to be
  // indistinguishable, so they all render the same 404.
  if (!profile) {
    notFound();
  }
  // Your own profile lives at /app/profile, where your library and stats are.
  // Without this, following your own handle lands on a stripped-down copy of
  // your page, and Back from your follower list goes there instead of home.
  if (profile.isSelf) {
    redirect("/app/profile");
  }

  return <ProfileView profile={profile} />;
}
