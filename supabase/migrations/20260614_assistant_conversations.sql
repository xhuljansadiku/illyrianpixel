-- ════════════════════════════════════════════════════════════════════════════
-- Bisedat me Mbretin Genti — çdo mesazh (i vizitorit dhe i botit) ruhet këtu
-- që admini të shohë çfarë pyesin njerëzit dhe ku boti nuk gjeti përgjigje.
-- Ekzekutoje një herë në Supabase SQL Editor (i riekzekutueshëm pa gabime).
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists assistant_messages (
  id         bigint generated always as identity primary key,
  session_id text not null,
  role       text not null check (role in ('you', 'bot')),
  content    text not null,
  matched    boolean not null default true, -- false = boti nuk gjeti përgjigje të sigurt (fallback/off-topic/"a doje të thuash")
  created_at timestamptz not null default now()
);

create index if not exists assistant_messages_session_idx on assistant_messages (session_id, created_at);
create index if not exists assistant_messages_created_idx on assistant_messages (created_at desc);

alter table assistant_messages enable row level security;

drop policy if exists "service role only" on assistant_messages;
create policy "service role only"
  on assistant_messages for all
  using (false)
  with check (false);

grant select, insert, delete on public.assistant_messages to service_role;
grant usage, select on sequence assistant_messages_id_seq to service_role;
