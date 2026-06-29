import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import QuotePublicView from "@/components/QuotePublicView";
import type { QuoteRecord } from "@/lib/quotes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Oferta juaj | Illyrian Pixel",
  robots: { index: false, follow: false },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function QuotePublicPage({ params }: { params: { token: string } }) {
  const { data: quote } = await supabase
    .from("quotes")
    .select("*")
    .eq("public_token", params.token)
    .is("deleted_at", null)
    .single();

  // Regjistro shikimin — admini sheh "Parë nga klienti" në panel
  if (quote) {
    await supabase
      .from("quotes")
      .update({ viewed_at: new Date().toISOString(), view_count: (quote.view_count ?? 0) + 1 })
      .eq("id", quote.id);
  }

  if (!quote) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 text-center">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent/60">Illyrian Pixel</p>
          <h1 className="font-display mt-4 text-3xl text-white">Kjo lidhje nuk është më e vlefshme.</h1>
          <p className="mt-3 text-sm text-white/50">
            Nëse mendoni se është gabim, na shkruani në{" "}
            <a href="mailto:info@illyrianpixel.com" className="text-accent underline-offset-4 hover:underline">
              info@illyrianpixel.com
            </a>
            .
          </p>
        </div>
      </main>
    );
  }

  return <QuotePublicView quote={quote as QuoteRecord} token={params.token} />;
}
