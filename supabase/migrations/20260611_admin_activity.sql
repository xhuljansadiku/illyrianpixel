-- ════════════════════════════════════════════════════════════════════════════
-- Historia e veprimeve — çdo ndryshim nga admini, klienti ose automatizimet
-- Ekzekutoje një herë në Supabase SQL Editor (i riekzekutueshëm pa gabime).
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists admin_activity (
  id         bigint generated always as identity primary key,
  entity     text not null,          -- blog | quote | recurring | project | task | faq |
                                     -- testimonial | portfolio | pricing | contact |
                                     -- newsletter | settings | auto | client
  action     text not null,          -- create | update | delete | send | accept | decline | ...
  label      text not null,          -- fjalia e plotë në shqip: 'U shtua artikulli "X"'
  created_at timestamptz not null default now()
);

create index if not exists admin_activity_created_idx on admin_activity (created_at desc);

alter table admin_activity enable row level security;

drop policy if exists "service role only" on admin_activity;
create policy "service role only"
  on admin_activity for all
  using (false)
  with check (false);

grant select, insert, delete on public.admin_activity to service_role;
grant usage, select on sequence admin_activity_id_seq to service_role;
