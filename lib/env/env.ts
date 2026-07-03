import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  BETTER_AUTH_SECRET: z.string().default("dev-only-secret-change-me"),
  BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  UPLOAD_DIR: z.string().default("./uploads"),
  TMDB_API_KEY: z.string().optional()
});

export const env = envSchema.parse(process.env);
