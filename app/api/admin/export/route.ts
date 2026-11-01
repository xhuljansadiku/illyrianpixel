import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { BACKUP_TABLES, fetchBackupTable } from "@/lib/backup";

// Pa këtë, Next.js e statikon këtë route (asnjë req/params i përdorur) dhe kthen
// përgjithmonë "foton" e parë të bazës së të dhënave në vend të backup-it aktual.
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const data: Record<string, unknown> = {
    exported_at: new Date().toISOString(),
  };

  try {
    for (const table of BACKUP_TABLES) {
      data[table] = await fetchBackupTable(supabase, table);
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }

  const filename = `illyrianpixel-backup-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
