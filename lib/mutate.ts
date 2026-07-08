// Client-side write to the Go API through the authenticated proxy. The user's
// token is attached server-side in /api/v1/[...path], so this can only do what
// the user can do. Throws on non-2xx so callers can roll back optimistic state.
export async function mutate(path: string, method: string, body?: unknown) {
  const res = await fetch(`/api/v1/${path}`, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    throw new Error(await res.text().catch(() => "error"));
  }
}
