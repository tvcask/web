import type { Metadata } from "next";

import { PublicTitleRoute, titleMetadata } from "@/components/public-page/public-title";

type Params = { params: Promise<{ slug: string }> };

// Rendered on first visit, then cached. Nothing here depends on who's reading.
export const revalidate = 3600;
export const generateStaticParams = () => [];

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return titleMetadata("movies", (await params).slug);
}

export default async function Page({ params }: Params) {
  return <PublicTitleRoute kind="movies" slug={(await params).slug} />;
}
