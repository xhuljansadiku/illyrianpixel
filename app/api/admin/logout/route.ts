import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, bumpAdminSessionVersion } from "@/lib/adminAuth";

export async function POST() {
  // Rrit versionin e sesionit — kjo e bën token-un ekzistues (SHA256 i fjalëkalimit)
  // të pavlefshëm menjëherë, jo vetëm të fshirë nga cookie i këtij shfletuesi.
  await bumpAdminSessionVersion();

  const res = NextResponse.json({ success: true });
  res.cookies.delete(ADMIN_SESSION_COOKIE);
  return res;
}
