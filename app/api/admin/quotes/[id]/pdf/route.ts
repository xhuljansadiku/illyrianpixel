import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { renderQuotePdf } from "@/lib/quotePdf";
import type { QuoteRecord } from "@/lib/quotes";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { data: quote, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", params.id)
    .is("deleted_at", null)
    .single();

  if (error || !quote) {
    return NextResponse.json({ success: false, error: "Dokumenti nuk u gjet." }, { status: 404 });
  }

  const pdf = await renderQuotePdf(quote as QuoteRecord);

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${quote.number}.pdf"`,
    },
  });
}
