const SESSION_VERSION_KEY = "admin_session_version";
const DEFAULT_SESSION_VERSION = "1";

// Lexon versionin aktual të sesionit nga site_settings përmes REST-it të Supabase
// (jo @supabase/supabase-js, që të mos rëndojmë middleware-in edge me një varësi
// shtesë — ky funksion thirret në çdo kërkesë /admin dhe /api/admin).
async function getSessionVersion(): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return DEFAULT_SESSION_VERSION;

  try {
    const res = await fetch(
      `${url}/rest/v1/site_settings?key=eq.${SESSION_VERSION_KEY}&select=value`,
      { headers: { apikey: key, authorization: `Bearer ${key}` }, cache: "no-store" }
    );
    if (!res.ok) return DEFAULT_SESSION_VERSION;
    const rows = (await res.json()) as { value: string }[];
    return rows[0]?.value ?? DEFAULT_SESSION_VERSION;
  } catch {
    // DB e paarritshme — bie mbrapa te versioni fillestar, kështu sesionet ekzistuese
    // (të krijuara kur asnjë "logout" real s'kishte ndodhur ende) vazhdojnë të vlejnë.
    return DEFAULT_SESSION_VERSION;
  }
}

// Rrit versionin e sesionit — çdo cookie e nxjerrë me versionin e vjetër bëhet
// menjëherë e pavlefshme, pa pasur nevojë të ndryshohet ADMIN_PASSWORD.
export async function bumpAdminSessionVersion(): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;

  const current = await getSessionVersion();
  const next = String((parseInt(current, 10) || 1) + 1);

  try {
    await fetch(`${url}/rest/v1/site_settings`, {
      method: "POST",
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
        prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({ key: SESSION_VERSION_KEY, value: next, updated_at: new Date().toISOString() }),
    });
  } catch {
    // best-effort — nëse dështon, sesioni i vjetër mbetet valid deri në tentativën tjetër
  }
}

export async function getAdminSessionToken(): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET || "";
  const password = process.env.ADMIN_PASSWORD || "";
  const version = await getSessionVersion();
  const data = new TextEncoder().encode(`${password}:${secret}:${version}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const ADMIN_SESSION_COOKIE = "admin_session";
