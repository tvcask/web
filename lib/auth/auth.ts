import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db/client";
import { env } from "@/lib/env/env";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true
  },
  ...(db
    ? {
        database: drizzleAdapter(db, {
          provider: "pg"
        })
      }
    : {})
});
