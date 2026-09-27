import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Një bisedë reale ka disa dhjetëra mesazhe; pa kufi, kushdo mund të mbushë tabelën.
const RATE_LIMIT = 120;
const WINDOW_SECONDS = 60 * 60;

export async function POST(req: Request) {
  if (!(await checkRateLimit(supabase, "assistant", getClientIp(req), RATE_LIMIT, WINDOW_SECONDS))) {
    return NextResponse.json({ success: false }, { status: 429 });
  }

  let body: { sessionId?: unknown; role?: unknown; text?: unknown; matched?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid body" }, { status: 400 });
  }

  const { sessionId, role, text, matched } = body;

  if (
    typeof sessionId !== "string" ||
    !sessionId ||
    sessionId.length > 64 ||
    (role !== "you" && role !== "bot") ||
    typeof text !== "string" ||
    !text.trim()
  ) {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }

  const { error } = await supabase.from("assistant_messages").insert({
    session_id: sessionId,
    role,
    content: text.slice(0, 2000),
    matched: matched === false ? false : true,
  });

  if (error) {
    return NextResponse.json({ success: false, error: "Gabim i brendshëm." }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
