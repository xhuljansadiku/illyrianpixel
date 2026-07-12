-- Klientë të shtuar/redaktuar manualisht nga admini te tab-i "Klientët".
-- Plotësojnë (jo zëvendësojnë) listën e nxjerrë automatikisht nga
-- kontaktet e fituara, projektet, ofertat e paguara dhe rekurrenca.
create table if not exists clients (
  id            bigint generated always as identity primary key,
  contact_id    uuid references contacts(id) on delete set null,
  name          text        not null,
  business_name text,
  email         text,
  phone         text,
  service       text,
  since_date    date,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists clients_contact_id_idx on clients (contact_id);

alter table clients enable row level security;

drop policy if exists "service role only" on clients;
create policy "service role only"
  on clients for all
  using (false)
  with check (false);

grant select, insert, update, delete on public.clients to service_role;
grant usage, select on sequence clients_id_seq to service_role;
