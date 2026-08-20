-- Version i sesionit të adminit — lib/adminAuth.ts e përfshin te hash-i i token-it
-- të sesionit. Rritet me çdo "logout" real (shih bumpAdminSessionVersion), duke bërë
-- që çdo cookie e nxjerrë me versionin e vjetër të bëhet e pavlefshme menjëherë, pa
-- pasur nevojë të ndryshohet ADMIN_PASSWORD ose ADMIN_SESSION_SECRET.
-- Ekzekutoje një herë në Supabase SQL Editor (i riekzekutueshëm pa gabime).
insert into site_settings (key, value) values
  ('admin_session_version', '1')
on conflict (key) do nothing;
