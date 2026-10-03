import RootDocument from "@/components/RootDocument";

// <html>/<body> për faqet jashtë [locale] — shih komentin te app/layout.tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="sq">{children}</RootDocument>;
}
