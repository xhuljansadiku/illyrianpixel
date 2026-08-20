import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

const MAX_SIZE = 4 * 1024 * 1024; // 4MB

// Kontrollon "magic bytes" e vërteta të skedarit — Content-Type i formData është
// thjesht një fushë e dhënë nga klienti dhe mund të falsifikohet lehtë, kështu që
// mos u mbështet vetëm te file.type për të vendosur çfarë po ngarkohet realisht.
function detectImageType(buffer: Buffer): string | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 4, 8) === "ftyp" &&
    ["avif", "avis"].includes(buffer.toString("ascii", 8, 12))
  ) {
    return "image/avif";
  }
  return null;
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: "Asnjë skedar i ngarkuar." }, { status: 400 });
  }
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ success: false, error: "Lejohen vetëm JPG, PNG, WebP ose AVIF." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ success: false, error: "Imazhi duhet të jetë nën 4MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detectedType = detectImageType(buffer);
  if (!detectedType || detectedType !== file.type) {
    return NextResponse.json(
      { success: false, error: "Skedari nuk përputhet me llojin e deklaruar." },
      { status: 400 }
    );
  }

  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from("portfolio").upload(path, buffer, {
    contentType: file.type,
    cacheControl: "31536000",
  });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
  return NextResponse.json({ success: true, url: data.publicUrl });
}
