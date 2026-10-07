// Krahasim string-esh në kohë konstante — `===` ndalon te karakteri i parë i ndryshëm,
// gjë që teorikisht lejon hamendësimin e sekretit nga koha e përgjigjes.
// JS i pastër (pa "crypto" të Node) që të punojë edhe në middleware-in edge.
export function secureCompare(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

// Cron-et e Vercel dërgojnë "Authorization: Bearer <CRON_SECRET>". Nëse sekreti mungon,
// refuzo gjithçka — përndryshe "Bearer undefined" do të kalonte kontrollin.
export function isAuthorizedCron(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return secureCompare(req.headers.get("authorization") ?? "", `Bearer ${secret}`);
}
