import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProfileView } from "@/components/social/profile-view";
import { getUserProfile } from "@/lib/social";

type Params = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ preview?: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const profile = await getUserProfile(handle);
  if (!profile) {
    return { title: "Not found" };
  }
  return { title: `${profile.name || profile.username} (@${profile.username})` };
}

export default async function UserProfilePage({ params, searchParams }: Params) {
  const [{ handle }, { preview }] = await Promise.all([params, searchParams]);
  const profile = await getUserProfile(handle);
  // Hidden, blocked and missing all arrive as null. They are meant to be
  // indistinguishable, so they all render the same 404.
  if (!profile) {
    notFound();
  }
  // Your own profile lives at /app/profile, where your library and settings
  // are. Without this, your own handle resolves to a second, lesser copy of
  // your page and Back from your follower list lands there.
  //
  // ?preview=1 is the deliberate exception: it renders your profile the way a
  // visitor sees it, which is the only way to check what you are sharing.
  if (profile.isSelf && preview !== "1") {
    redirect("/app/profile");
  }

  return <ProfileView profile={profile} preview={profile.isSelf} />;
}
