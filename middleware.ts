import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/auth/constants";

export function middleware(request: NextRequest) {
  if (!request.cookies.has(TOKEN_COOKIE)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/app/shows", request.url));
}

export const config = {
  matcher: ["/"]
};
