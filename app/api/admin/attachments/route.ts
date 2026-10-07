import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logActivity } from "@/lib/activityLog";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const OWNER_TYPES = ["contact", "project"];
const SIGNED_URL_TTL = 3600; // 1 orë

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ownerType = searchParams.get("owner_type");
  const ownerId = searchParams.get("owner_id");

  if (!ownerType || !OWNER_TYPES.includes(ownerType) || !ownerId) {
    return NextResponse.json({ success: false, error: "Parametra të pavlefshëm." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("attachments")
    .select("*")
    .eq("owner_type", ownerType)
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const attachments = await Promise.all(
    (data ?? []).map(async (a) => {
      const { data: signed } = await supabase.storage
        .from("attachments")
        .createSignedUrl(a.path, SIGNED_URL_TTL);
      return { ...a, url: signed?.signedUrl ?? null };
    })
  );

  return NextResponse.json({ success: true, attachments });
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");
  const ownerType = formData.get("owner_type");
  const ownerId = formData.get("owner_id");

  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: "Asnjë skedar i ngarkuar." }, { status: 400 });
  }
  if (typeof ownerType !== "string" || !OWNER_TYPES.includes(ownerType) || typeof ownerId !== "string" || !ownerId) {
    return NextResponse.json({ success: false, error: "Parametra të pavlefshëm." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ success: false, error: "Skedari duhet të jetë nën 10MB." }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
  const path = `${ownerType}/${ownerId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage.from("attachments").upload(path, buffer, {
    contentType: file.type || "application/octet-stream",
  });
  if (uploadError) {
    return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("attachments")
    .insert({
      owner_type: ownerType,
      owner_id: ownerId,
      name: file.name,
      path,
      content_type: file.type || null,
      size: file.size,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  await logActivity(ownerType === "contact" ? "contact" : "project", "update", `U bashkëngjit skedari "${file.name}"`);

  const { data: signed } = await supabase.storage.from("attachments").createSignedUrl(path, SIGNED_URL_TTL);
  return NextResponse.json({ success: true, attachment: { ...data, url: signed?.signedUrl ?? null } });
}
