import type { Metadata } from "next";
import { FollowPage } from "@/components/social/follow-page";

type Params = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  return { title: `@${handle} following` };
}

export default async function FollowingPage({ params }: Params) {
  const { handle } = await params;
  return <FollowPage handle={handle} side="following" />;
}
