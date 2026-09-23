import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

const LOGIN_PAGE = "/login";
const AFTER_LOGIN = "/admin/blogs";

const AUTH_PAGES = ["/login", "/register"];

const PUBLIC_APIS = [
  "/api/admin/auth/me",
  "/api/admin/auth/login",
  "/api/admin/auth/logout",
  "/api/admin/auth/setup",
];

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (PUBLIC_APIS.includes(pathname)) return NextResponse.next();

  const session = await verifySessionToken(
    req.cookies.get(SESSION_COOKIE)?.value,
  );

  if (AUTH_PAGES.includes(pathname)) {
    return session
      ? NextResponse.redirect(new URL(AFTER_LOGIN, req.url))
      : NextResponse.next();
  }

  if (session) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Your session has ended. Sign in again." },
      { status: 401 },
    );
  }

  const login = new URL(LOGIN_PAGE, req.url);
  login.searchParams.set("next", pathname + search);
  const res = NextResponse.redirect(login);
  res.cookies.delete(SESSION_COOKIE);
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/login", "/register"],
};
