import type { ComponentProps } from "react";
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware wrappers around Next.js navigation. `Link` and `getPathname`
// translate internal routes ("/services") to localized URLs ("/sv/tjanster").
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

/** Typed internal href: an internal route, or `{ pathname, params, hash }`. */
export type AppHref = ComponentProps<typeof Link>["href"];
