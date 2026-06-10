-- Tabela contact_notes — shënime në formë komentesh për çdo kontakt,
-- secili me kohëvulë dhe mundësi për edit/delete individual
create table if not exists contact_notes (
  id         bigint generated always as identity primary key,
  contact_id uuid references contacts(id) on delete cascade,
  text       text        not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_notes_contact_id_idx
  on contact_notes (contact_id);

-- Row Level Security — vetëm service role mund të shkruajë/lexojë
alter table contact_notes enable row level security;

create policy "service role only"
  on contact_notes for all
  using (false)
  with check (false);
