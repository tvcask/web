// Read helper for client queries. Writes go through lib/mutate. Both hit the
// authenticated proxy under /api, so the token stays server-side.
export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  if (!res.ok) {
    throw new Error(await res.text().catch(() => "error"));
  }
  return (await res.json()) as T;
}
