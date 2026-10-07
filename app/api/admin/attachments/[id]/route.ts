import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const attachmentId = Number(id);
  if (!Number.isFinite(attachmentId)) {
    return NextResponse.json({ success: false, error: "ID e pavlefshme." }, { status: 400 });
  }

  const { data: attachment, error: fetchError } = await supabase
    .from("attachments")
    .select("path, name, owner_type")
    .eq("id", attachmentId)
    .single();

  if (fetchError || !attachment) {
    return NextResponse.json({ success: false, error: "Skedari nuk u gjet." }, { status: 404 });
  }

  await supabase.storage.from("attachments").remove([attachment.path]);

  const { error } = await supabase.from("attachments").delete().eq("id", attachmentId);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  await logActivity(attachment.owner_type === "contact" ? "contact" : "project", "delete", `U fshi skedari "${attachment.name}"`);
  return NextResponse.json({ success: true });
}
