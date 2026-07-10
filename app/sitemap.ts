import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tvcask.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${baseUrl}/import-tv-time`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3
    },
    {
      url: `${baseUrl}/guidelines`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3
    }
  ];
}
