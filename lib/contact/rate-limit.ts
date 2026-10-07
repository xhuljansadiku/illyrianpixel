/**
 * Small in-memory sliding-window rate limiter for the contact endpoint.
 *
 * Note: on serverless hosting each instance has its own memory, so this is a
 * best-effort layer on top of the honeypot and timing checks. For stricter
 * limits, swap the store for a shared one (e.g. Upstash Redis / Vercel KV).
 */
type Options = { limit: number; windowMs: number };

const hits = new Map<string, number[]>();
const MAX_KEYS = 5000;

export function checkRateLimit(key: string, { limit, windowMs }: Options, now = Date.now()): boolean {
  const windowStart = now - windowMs;
  const recent = (hits.get(key) ?? []).filter((timestamp) => timestamp > windowStart);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > MAX_KEYS) prune(windowStart);
  return true;
}

function prune(windowStart: number) {
  for (const [key, timestamps] of hits) {
    if (timestamps.every((timestamp) => timestamp <= windowStart)) hits.delete(key);
  }
}

/** Test helper. */
export function resetRateLimit() {
  hits.clear();
}

/** Client IP as reported by the hosting proxy (Vercel sets x-forwarded-for). */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
