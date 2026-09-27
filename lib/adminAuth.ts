import { secureCompare } from "@/lib/secureCompare";

const SESSION_VERSION_KEY = "admin_session_version";
const DEFAULT_SESSION_VERSION = "1";

// Cache i shkurtër brenda instancës — pa të, middleware-i bën një thirrje në DB për çdo
// kërkesë /admin. Kosto: pas logout-it, instancat e tjera e pranojnë cookie-n e vjetër
// edhe për maksimumi VERSION_CACHE_MS.
const VERSION_CACHE_MS = 30_000;
let versionCache: { value: string; at: number } | null = null;

// Lexon versionin aktual të sesionit nga site_settings përmes REST-it të Supabase
// (jo @supabase/supabase-js, që të mos rëndojmë middleware-in edge me një varësi
// shtesë — ky funksion thirret në çdo kërkesë /admin dhe /api/admin).
// Kthen null kur DB-ja s'arrihet — thirrësi duhet ta trajtojë si "i paautorizuar",
// jo të bjerë te versioni fillestar (që do të ringjallte cookie-t e revokuara).
async function getSessionVersion(opts: { fresh?: boolean } = {}): Promise<string | null> {
  if (!opts.fresh && versionCache && Date.now() - versionCache.at < VERSION_CACHE_MS) {
    return versionCache.value;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  try {
    const res = await fetch(
      `${url}/rest/v1/site_settings?key=eq.${SESSION_VERSION_KEY}&select=value`,
      { headers: { apikey: key, authorization: `Bearer ${key}` }, cache: "no-store" }
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as { value: string }[];
    // Asnjë rresht = asnjë logout s'ka ndodhur ende → versioni fillestar
    const value = rows[0]?.value ?? DEFAULT_SESSION_VERSION;
    versionCache = { value, at: Date.now() };
    return value;
  } catch {
    return null;
  }
}

// Rrit versionin e sesionit — çdo cookie e nxjerrë me versionin e vjetër bëhet
// menjëherë e pavlefshme, pa pasur nevojë të ndryshohet ADMIN_PASSWORD.
export async function bumpAdminSessionVersion(): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;

  const current = await getSessionVersion({ fresh: true });
  const next = String((parseInt(current ?? DEFAULT_SESSION_VERSION, 10) || 1) + 1);
  versionCache = null;

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

// null kur mungon konfigurimi ose DB-ja — atëherë asnjë cookie s'është e vlefshme.
// (Pa këtë kontroll, me ADMIN_PASSWORD bosh token-i do ishte sha256("::1"), i llogaritshëm nga kushdo.)
export async function getAdminSessionToken(opts: { fresh?: boolean } = {}): Promise<string | null> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const password = process.env.ADMIN_PASSWORD;
  if (!secret || !password) return null;
  const version = await getSessionVersion(opts);
  if (version === null) return null;
  const data = new TextEncoder().encode(`${password}:${secret}:${version}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const ADMIN_SESSION_COOKIE = "admin_session";

export async function isValidAdminSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const expected = await getAdminSessionToken();
  return expected !== null && secureCompare(token, expected);
}
