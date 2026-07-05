import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env/env";
import * as schema from "@/db/schema";

const globalForDb = globalThis as typeof globalThis & {
  tvcaskSql?: ReturnType<typeof postgres>;
};

// Reuse the connection across hot reloads in dev.
const sql = globalForDb.tvcaskSql ?? postgres(env.DATABASE_URL, { prepare: false });
if (process.env.NODE_ENV !== "production") {
  globalForDb.tvcaskSql = sql;
}

export const db = drizzle(sql, { schema });
export const hasDatabase = true;
