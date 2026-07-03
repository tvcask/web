import { z } from "zod";

export const addTitleSchema = z.object({
  title: z.object({
    id: z.string(),
    externalId: z.string().nullish(),
    externalSource: z.string().nullish(),
    title: z.string(),
    originalTitle: z.string().nullish(),
    type: z.enum(["movie", "tv", "anime"]),
    category: z.enum(["movie", "tv_show", "anime", "k_drama"]),
    overview: z.string().nullish(),
    posterUrl: z.string().nullish(),
    backdropUrl: z.string().nullish(),
    year: z.number().nullish(),
    genres: z.array(z.string())
  }),
  status: z.enum(["watching", "watchlist", "completed", "dropped"]).default("watchlist"),
  favorite: z.boolean().default(false)
});
