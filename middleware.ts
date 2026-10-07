import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Redirects "/" to "/sv", maps localized URLs (/sv/tjanster) to the internal
// routes in app/[locale] (/sv/services) and redirects internal URLs to their
// localized form. Sets no cookies (see i18n/routing.ts).
export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next.js internals and files with an extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
