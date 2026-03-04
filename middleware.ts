import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE } from "@/lib/constants";

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get(COOKIE.SESSION_NAME)?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard") && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname === "/login" && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
