import type { SupabaseClient } from "@supabase/supabase-js";

// IP-ja e klientit — në Vercel, x-forwarded-for mbishkruhet nga proxy-ja, s'mund të falsifikohet
export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

// Kufizim shpejtësie i përbashkët (tabela rate_limits), i ndarë sipas "scope" që
// endpoint-e të ndryshme të mos ndajnë të njëjtin numërues IP.
// Kthen true nëse kërkesa lejohet.
export async function checkRateLimit(
  supabase: SupabaseClient,
  scope: string,
  ip: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowSeconds * 1000);

  const { count, error } = await supabase
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("scope", scope)
    .eq("ip", ip)
    .gte("created_at", windowStart.toISOString());

  if (error) return true; // fail open — nuk bllokojmë nëse DB ka problem

  if ((count ?? 0) >= limit) return false;

  await supabase.from("rate_limits").insert({ scope, ip, created_at: now.toISOString() });
  return true;
}
