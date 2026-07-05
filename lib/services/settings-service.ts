import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { userSettings } from "@/db/schema";

export type UserSettings = {
  theme: string;
  titlesInLanguage: boolean;
  privateProfile: boolean;
  newEpisodeAlerts: boolean;
  premiereReminders: boolean;
  weeklyDigest: boolean;
};

const defaults: UserSettings = {
  theme: "dark",
  titlesInLanguage: false,
  privateProfile: false,
  newEpisodeAlerts: true,
  premiereReminders: true,
  weeklyDigest: false
};

export async function getSettings(userId: string): Promise<UserSettings> {
  const [row] = await db.select().from(userSettings).where(eq(userSettings.userId, userId)).limit(1);
  if (!row) {
    return defaults;
  }
  return {
    theme: row.theme,
    titlesInLanguage: row.titlesInLanguage,
    privateProfile: row.privateProfile,
    newEpisodeAlerts: row.newEpisodeAlerts,
    premiereReminders: row.premiereReminders,
    weeklyDigest: row.weeklyDigest
  };
}

type ToggleKey = Exclude<keyof UserSettings, "theme">;

export async function toggleSetting(userId: string, key: ToggleKey) {
  const current = await getSettings(userId);
  await db
    .insert(userSettings)
    .values({ userId, ...current, [key]: !current[key] })
    .onConflictDoUpdate({ target: userSettings.userId, set: { [key]: sql`not ${userSettings[key]}`, updatedAt: new Date() } });
}

export async function setTheme(userId: string, theme: string) {
  const current = await getSettings(userId);
  await db
    .insert(userSettings)
    .values({ userId, ...current, theme })
    .onConflictDoUpdate({ target: userSettings.userId, set: { theme, updatedAt: new Date() } });
}
