-- Shënime të lira dhe lista detyrash për adminin — jo të lidhura me kontakte
-- specifike (ato ekzistojnë tashmë te contact_notes), thjesht scratchpad personal.
create table if not exists admin_notes (
  id         bigint generated always as identity primary key,
  title      text,
  content    text        not null,
  pinned     boolean     not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_notes_pinned_idx on admin_notes (pinned desc, updated_at desc);

alter table admin_notes enable row level security;

drop policy if exists "service role only" on admin_notes;
create policy "service role only"
  on admin_notes for all
  using (false)
  with check (false);

grant select, insert, update, delete on public.admin_notes to service_role;
grant usage, select on sequence admin_notes_id_seq to service_role;

create table if not exists admin_todos (
  id         bigint generated always as identity primary key,
  text       text        not null,
  done       boolean     not null default false,
  due_at     date,
  created_at timestamptz not null default now()
);

create index if not exists admin_todos_done_idx on admin_todos (done, due_at);

alter table admin_todos enable row level security;

drop policy if exists "service role only" on admin_todos;
create policy "service role only"
  on admin_todos for all
  using (false)
  with check (false);

grant select, insert, update, delete on public.admin_todos to service_role;
grant usage, select on sequence admin_todos_id_seq to service_role;
