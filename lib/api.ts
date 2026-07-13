import { cookies } from "next/headers";
import { TOKEN_COOKIE } from "@/lib/auth/constants";

// Server-side client for the tvcask Go API. All app data flows through here.
export const API_URL = process.env.API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function getToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value ?? null;
}

type ApiOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  auth?: boolean; // set false for public endpoints
};

export async function api<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  const token = opts.token ?? (opts.auth === false ? null : await getToken());
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: opts.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      cache: "no-store",
      // Fail a hung request instead of freezing the page render forever.
      signal: AbortSignal.timeout(15000)
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === "TimeoutError") {
      throw new ApiError(504, "the server took too long to respond");
    }
    throw e;
  }

  if (!res.ok) {
    throw new ApiError(res.status, await res.text().catch(() => res.statusText));
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}
