export async function getAdminSessionToken(): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET || "";
  const password = process.env.ADMIN_PASSWORD || "";
  const data = new TextEncoder().encode(`${password}:${secret}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const ADMIN_SESSION_COOKIE = "admin_session";
