-- rate_limits shërbente vetëm formularin e kontaktit. Tani që /api/newsletter dhe
-- /api/track marrin edhe ata kufizim shpejtësie, u shtua "scope" që endpoint-e të
-- ndryshme të mos ndajnë të njëjtin numërues IP (përndryshe spam-i te njëri formular
-- do të bllokonte gabimisht një tjetër).
-- Ekzekutoje një herë në Supabase SQL Editor (i riekzekutueshëm pa gabime).
alter table rate_limits add column if not exists scope text not null default 'contact';

create index if not exists rate_limits_scope_ip_created_at_idx
  on rate_limits (scope, ip, created_at);
