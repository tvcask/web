import { NextRequest, NextResponse } from "next/server";
import { API_URL, getToken } from "@/lib/api";

// Authenticated pass-through to the Go API for client components. The user's own
// token is attached server-side, so this can only do what the user can do.
async function forward(req: NextRequest, path: string[]) {
  const token = await getToken();
  const url = `${API_URL}/v1/${path.join("/")}${req.nextUrl.search}`;
  const hasBody = req.method !== "GET" && req.method !== "DELETE";

  const res = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: hasBody ? await req.text() : undefined,
    cache: "no-store"
  });

  const text = await res.text();
  return new NextResponse(text || null, {
    status: res.status,
    headers: { "Content-Type": "application/json" }
  });
}

type Ctx = { params: Promise<{ path: string[] }> };
const handler = async (req: NextRequest, ctx: Ctx) => forward(req, (await ctx.params).path);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;
