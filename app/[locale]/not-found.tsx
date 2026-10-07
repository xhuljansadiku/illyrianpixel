import NotFoundScreen from "@/components/NotFoundScreen";

export const metadata = {
  title: "404 — Faqja nuk u gjet",
  description: "Faqja që kërkuat nuk ekziston.",
};

// notFound() nga faqet brenda [locale] (p.sh. blog/[slug] me slug të panjohur).
// Duhet të jetë brenda [locale]/layout, që mban <html>: pa këtë, notFound()
// shkon te app/not-found.tsx mbi <html> dhe Next kthen vetëm shell-in
// bosh të gabimit (<html id="__next_error__">) në vend të 404-ës së renderuar.
export default function NotFound() {
  return <NotFoundScreen />;
}
