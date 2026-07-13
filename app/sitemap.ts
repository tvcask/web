import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tvcask.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl
    },
    {
      url: `${baseUrl}/import-tv-time`,
      lastModified: new Date("2026-07-13")
    },
    {
      url: `${baseUrl}/about`
    },
    {
      url: `${baseUrl}/support`
    },
    {
      url: `${baseUrl}/privacy`
    },
    {
      url: `${baseUrl}/terms`
    },
    {
      url: `${baseUrl}/guidelines`
    }
  ];
}
