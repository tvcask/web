import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileHeader } from "@/components/social/profile-header";
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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <ProfileHeader profile={profile} />
    </div>
  );
}
