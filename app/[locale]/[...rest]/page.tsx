import { notFound } from "next/navigation";

// Unknown URLs inside a locale (e.g. /sv/does-not-exist) render the localized
// not-found page within the site layout instead of the bare root 404.
export default function CatchAllPage() {
  notFound();
}
