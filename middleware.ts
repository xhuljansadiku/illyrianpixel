import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { ADMIN_SESSION_COOKIE, getAdminSessionToken } from "@/lib/adminAuth";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/((?!api|admin|oferta|klienti|feedback|_next|_vercel|.*\\..*).*)",
  ],
};

async function adminAuthMiddleware(req: NextRequest, pathname: string) {
  if (pathname.startsWith("/admin/login") || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const expected = await getAdminSessionToken();

  if (!token || token !== expected) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin auth — unchanged behavior, never locale-prefixed.
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    return adminAuthMiddleware(req, pathname);
  }

  // API + token/portal routes — no locale concept at all.
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/oferta") ||
    pathname.startsWith("/klienti") ||
    pathname.startsWith("/feedback")
  ) {
    return NextResponse.next();
  }

  // Everything else is marketing content — locale routing applies.
  return intlMiddleware(req);
}
