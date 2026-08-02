import type { Metadata } from "next";
import { FollowPage } from "@/components/social/follow-page";

type Params = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  return { title: `@${handle} followers` };
}

export default async function FollowersPage({ params }: Params) {
  const { handle } = await params;
  return <FollowPage handle={handle} side="followers" />;
}
