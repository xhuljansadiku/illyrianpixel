-- Tabela rate_limits për API contact
-- Zëvendëson in-memory Map që nuk funksiononte në serverless (Vercel)
create table if not exists rate_limits (
  id         bigint generated always as identity primary key,
  ip         text        not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_limits_ip_created_at_idx
  on rate_limits (ip, created_at);

-- Fshi automatikisht regjistrat më të vjetër se 2 orë (cleanup)
create or replace function delete_old_rate_limits() returns void
  language sql as $$
    delete from rate_limits where created_at < now() - interval '2 hours';
  $$;

-- Row Level Security — vetëm service role mund të shkruajë
alter table rate_limits enable row level security;

create policy "service role only"
  on rate_limits for all
  using (false)
  with check (false);
