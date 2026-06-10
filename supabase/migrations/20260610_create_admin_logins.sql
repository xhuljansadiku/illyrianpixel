-- Regjistri i tentativave të hyrjes në admin panel
create table if not exists admin_logins (
  id         bigint generated always as identity primary key,
  success    boolean     not null,
  ip         text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists admin_logins_created_at_idx on admin_logins (created_at desc);

alter table admin_logins enable row level security;

create policy "service role only"
  on admin_logins for all
  using (false)
  with check (false);

grant select, insert, update, delete on public.admin_logins to service_role;
grant usage, select on sequence admin_logins_id_seq to service_role;
