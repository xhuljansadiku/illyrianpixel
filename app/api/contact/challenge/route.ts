import { NextResponse } from "next/server";
import { createMathChallenge } from "@/lib/mathCheck";

export const dynamic = "force-dynamic";

// Pyetja me 2 numra për formularin e kontaktit — çdo herë e re, pa cache
export async function GET() {
  return NextResponse.json(createMathChallenge(), { headers: { "Cache-Control": "no-store" } });
}
