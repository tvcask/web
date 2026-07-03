import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env/env";

export const hasDatabase = Boolean(env.DATABASE_URL);

const client = env.DATABASE_URL ? postgres(env.DATABASE_URL, { prepare: false }) : null;

export const db = client ? drizzle(client) : null;
